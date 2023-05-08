import { batch, memo, sig } from "dignals";

import {
  getChatCompletions,
  sendChatCompletions,
  setCacheCompletions,
} from "$/api/completions";
import ReactivePromise from "$/services/ReactivePromise";

import { GPTRoles } from "./types";
import { GptMessage } from "./GptMessage";
import { Timer } from "$/entity/GPT/Timer";

const errorContent = `
\`\`\`javascript
Сеть ChatGPT пегружена. Попробуйте через минуту
   _______  GPT
  |.-----.|       Err 
  ||x . x||  GPT Error  
  ||_.-._||         GPT
  \`--)-(--\`  GPT Er
 __[=== o]___       Error
|:::::::::::|\\   ror GPT
\`-=========-\`() 
`;

const MAX_CONTEXT_WORDS = 2000;
const REPEAT_WORDS = ["eщe", "повтори", "повторий", "повтор", "repeat"];

//todo рефакторинг, разнести этот класс на несколько сущностей
export class ChatGpt {
  initialSystemContent =
    "Ты программист с опытом веб разработки в 10 лет, отвечаешь на вопросы джуниора, который хочет научиться программированию, добавляй правильную подсветку кода, указывай язык для блоков кода";
  systemMessage = new GptMessage(this.initialSystemContent, GPTRoles.system);

  timer = new Timer(15, 0, "decrement");

  messages$ = sig<GptMessage[]>([]);

  sendCompletions$ = ReactivePromise.create(() => this.sendCompletion());

  selectedMessages$ = memo(() =>
    this.messages$.get().filter((message) => message.isSelected$.get())
  );

  getRunOutOfContextMessages$ = memo(() =>
    this.messages$.get().filter((message) => message.isRunOutOfContext.get())
  );

  getIsNotRunOutOfContextMessages$ = memo(() =>
    this.messages$.get().filter((message) => !message.isRunOutOfContext.get())
  );

  hasSelectedMessages$ = memo(() => this.selectedMessages$.get().length !== 0);

  abortController = new AbortController();

  constructor() {}

  clearMessages = () => {
    this.abortSend();
    this.messages$.set([]);
  };

  clearSystemMessage = () => {
    this.systemMessage?.content$.set(this.initialSystemContent);
  };

  abortSend = () => {
    this.abortController.abort();
  };

  send = async (content: string) => {
    this.addMessage(new GptMessage(content, GPTRoles.user));
    await this.sendCompletions$.run();
    this.timer.run();
  };

  private async sendCompletion() {
    const message = new GptMessage("", GPTRoles.assistant);

    this.abortController = new AbortController();

    if (this.lastMessageIsRepeat()) {
      await this.sendChatCompletions(message);
      return;
    }

    const hasCompletionInCache = await getChatCompletions({
      conversationName: String(this.getLastUserMessage()?.content$.get()),
      onMessage: this.onMessage(message),
      abortController: this.abortController,
    });

    if (hasCompletionInCache) {
      this.checkOnRunOutOfMessages();
      return;
    }

    const isHasError = await this.sendChatCompletions(message);

    if (isHasError) return;
    if (this.abortController.signal.aborted) return;

    await setCacheCompletions({
      message: String(this.getLastAssistantMessage()?.content$.get()),
      name: String(this.getLastUserMessage()?.content$.get()),
    });
  }

  async sendChatCompletions(message: GptMessage) {
    const result = await sendChatCompletions(
      { model: "gpt-3.5-turbo-0301", messages: this.getMessages() },
      this.onMessage(message),
      () => {
        this.addMessage(new GptMessage(errorContent, GPTRoles.assistant, true));
        this.sendCompletions$.reset();
      },
      this.abortController
    );

    this.checkOnRunOutOfMessages();

    return result;
  }

  checkOnRunOutOfMessages() {
    [...this.messages$.get()].reverse().reduce((acc, message) => {
      if (acc > MAX_CONTEXT_WORDS) {
        message.toggleRunOutOff();
        return acc;
      }
      return acc + message.content$.get().split(" ").length;
    }, 0);
  }

  onMessage = (message: GptMessage) => (value: string, isFirst: boolean) => {
    if (isFirst) {
      message.onSetMessageContent(value);
      this.addMessage(message);
      return;
    }
    message.onSetMessageContent(value);
  };

  getMessages() {
    if (!this.systemMessage) {
      return this.filterInMemoryMessages(
        this.getIsNotRunOutOfContextMessages$.get()
      ).map(this.toApiMessage);
    }

    return this.filterInMemoryMessages([
      this.systemMessage,
      ...this.getIsNotRunOutOfContextMessages$.get(),
    ]).map(this.toApiMessage);
  }

  clearSelectedMessages = () => {
    batch(() => {
      this.selectedMessages$
        .get()
        .forEach((message) => message.toggleSelected());
    });
  };

  addMessage(message: GptMessage) {
    const messages = [...this.messages$.get(), message];
    this.messages$.set(messages);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toApiMessage = (message: GptMessage) => ({
    content: message.content$.get(),
    role: message.role,
  });

  filterInMemoryMessages(messages: GptMessage[]) {
    return messages.filter((message) => !message.inLocal);
  }

  getLastUserMessage() {
    return [...this.messages$.get()]
      .reverse()
      .find((message) => message.role === GPTRoles.user);
  }

  getLastAssistantMessage() {
    return [...this.messages$.get()]
      .reverse()
      .find((message) => message.role === GPTRoles.assistant);
  }

  lastMessageIsRepeat() {
    const messageContent = this.getLastUserMessage()?.content$.get();
    if (!messageContent || messageContent.length > 10) return false;
    console.log(messageContent);
    return REPEAT_WORDS.find((word) => messageContent.search(word));
  }
}

export const chatGpt = new ChatGpt();
