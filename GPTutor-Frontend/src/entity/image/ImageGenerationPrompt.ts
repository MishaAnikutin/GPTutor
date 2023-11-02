import { sig } from "dignals";

export class ImageGenerationPrompt {
  selectedPrompt$ = sig("");
  selectedStyles$ = sig<string[]>([]);

  $selectPrompt(prompt: string) {
    if (this.selectedPrompt$.get() === prompt) {
      this.selectedPrompt$.set("");
      return;
    }
    this.selectedPrompt$.set(prompt);
  }

  $selectStyles(style: string) {
    if (this.isSelectedStyle(style)) {
      return this.selectedStyles$.set(
        this.selectedStyles$.get().filter((item) => item !== style)
      );
    }

    this.selectedStyles$.set([style, ...this.selectedStyles$.get()]);
  }

  isSelectedPrompt(prompt: string) {
    return prompt === this.selectedPrompt$.get();
  }

  isSelectedStyle(style: string) {
    return this.selectedStyles$.get().includes(style);
  }

  getPrompt() {
    return this.selectedPrompt$.get();
  }
}
