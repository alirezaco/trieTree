import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

export type AnswerType = {
  command: string;
  value?: string;
  option?: string
};

export enum Colors {
  white = "\x1b[37m",
  red = "\x1b[31m",
  green = "\x1b[32m",
  yellow = "\x1b[33m"
}

export class CommandLine {
  private readonly rl: readline.Interface = readline.createInterface({
    input,
    output,
  });

  public getCommand = async (message: string): Promise<AnswerType> => {
    return new Promise((resolve, reject) => {
      this.rl.question(message + ":\t", (answer) => {
        const answerArray = answer.trim().split(" ");
        const command = answerArray[0];
        const value = answerArray[1];
        const option = answerArray[2];

        if (!command) throw new Error("bad input.");

        resolve({
          command,
          value,
          option
        });
      });
    });
  };

  public show = (text: string, color: Colors) => {
    console.log(color + text + "\x1b[0m");
  }

  public exit = () => {
    this.rl.close()
  }
}
