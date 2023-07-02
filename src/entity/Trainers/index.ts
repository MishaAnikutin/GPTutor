/* eslint-disable */

import { TrainerItem } from "$/entity/Trainers/TrainerItem";
import { ModeType } from "$/entity/lessons";

const initialValueJS = 'console.log("Hello world!")';

const initialValuePython = 'print("Hello world!")';

const initialValueGo = `package main

import "fmt"

func main() {
\tfmt.Println("Hello World!")
}
`;

const JSPrompt =
  "I want you to act as a javascript console. I will type commands and you will reply with what the javascript console should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. when I need to tell you something in russian, I will do so by putting text inside curly brackets {like this}. You should use markdown in your output. Mark output as javascript";
const PYTHONPrompt =
  "I want you to act as a python console. I will type commands and you will reply with what the python console should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. when I need to tell you something in russian, I will do so by putting text inside curly brackets {like this}. You should use markdown in your output. Mark output as python";
const GoPrompt =
  "I want you to act as a golang console. I will type commands and you will reply with what the python console should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. when I need to tell you something in russian, I will do so by putting text inside curly brackets {like this}. You should use markdown in your output. Mark output as go";

export enum Languages {
  Javascript = "javascript",
  Python = "python",

  Go = "go",
}

class Trainers {
  currentTrainers: TrainerItem | undefined;
  constructor(public items: TrainerItem[]) {}

  setCurrentTrainer(type: ModeType) {
    this.currentTrainers = this.items.find((item) => item.type === type);
  }

  setCurrentTrainerByLanguage(language: string) {
    this.currentTrainers = this.items.find(
      (item) => item.language === language
    );
  }

  getCurrentTrainer() {
    return this.currentTrainers;
  }
}

export const trainers = new Trainers([
  new TrainerItem(
    ModeType.JS_TRAINING,
    Languages.Javascript,
    JSPrompt,
    initialValueJS
  ),
  new TrainerItem(
    ModeType.PYTHON_TRAINING,
    Languages.Python,
    PYTHONPrompt,
    initialValuePython
  ),
  new TrainerItem(ModeType.GO_TRAINING, Languages.Go, GoPrompt, initialValueGo),
]);
