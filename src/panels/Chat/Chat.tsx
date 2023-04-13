import React, { useMemo } from "react";

import { Panel } from "@vkontakte/vkui";

import { Messenger } from "../../components/Messenger";
import { lessonsController } from "../../entity/lessons";
import { ChatGpt } from "../../entity/GPT/ChatGpt";

interface IProps {
  id: string;
  goBack: () => void;
}

const Chat = ({ id, goBack }: IProps) => {
  const currentLesson = lessonsController.currentLesson?.get();

  const chatGpt = useMemo(() => new ChatGpt(), []);

  return (
    <Panel id={id}>
      <Messenger
        chatGpt={chatGpt}
        goBack={goBack}
        lesson={currentLesson}
      />
    </Panel>
  );
};

export default Chat;
