import { TrieTree } from "classes/trieTree";
import { AnswerType, Colors, CommandLine } from "./commandLine";
import { extname, join } from "path";
import { readFileSync } from "fs";

export default class CreateCliApp {
  private commandLine = new CommandLine();
  private trieTree = new TrieTree();

  public find = (answer: AnswerType) => {
    if (!answer.value) throw new Error("bad input.");

    const res = this.trieTree.findWord(answer.value);

    this.commandLine.show(`${res}`, res ? Colors.green : Colors.red);
  };

  public add = (answer: AnswerType) => {
    if (!answer.value) throw new Error("bad input.");

    this.trieTree.addWord(answer.value);
  };

  public delete = (answer: AnswerType) => {
    if (!answer.value) throw new Error("bad input.");

    const res = this.trieTree.deleteWord(answer.value);

    this.commandLine.show(`${res}`, res ? Colors.green : Colors.red);
  };

  public exit = () => {
    this.commandLine.exit();
  };

  public load = (answer: AnswerType) => {
    if (!answer.value) throw new Error("bad input.");

    const suffixFile = extname(answer.value);

    if (suffixFile !== ".txt") throw new Error("bad input.");

    let words: string | Array<string> = readFileSync(
      join(answer.value),
      "utf-8"
    );

    words = words.split(/\n\r?/gm);

    words.map((item) => {
      if (item.includes(" ")) throw new Error("bad input.");
      this.trieTree.addWord(item);
    });
  };

  private sortWordsByLen(words: Array<string>): Array<string> {
    words = words.sort((a: string, b: string) => {
      if (a.length > b.length) return 1;
      else if (a.length == b.length) {
        return a > b ? 1 : -1;
      } else return -1;
    });

    return words
  }

  private sortWords(words: Array<string>, mode: string): Array<string> {
    if (mode == "a") {
      return words;
    } else if (mode == "1") {
      return this.sortWordsByLen(words);
    } else {
      throw new Error("bad input.");
    }
  }

  public startWith = (answer: AnswerType) => {
    if (!answer.value) throw new Error("bad input.");

    let res = this.trieTree.startWith(answer.value);

    res = this.sortWords(res, answer.option || "a");

    this.commandLine.show(res.join(", "), Colors.yellow);
  };

  public switchCommand = (answer: AnswerType) => {
    switch (answer.command) {
      case "add":
        this.add(answer);
        break;

      case "find":
        this.find(answer);
        break;

      case "delete":
        this.delete(answer);
        break;

      case "load":
        this.load(answer);
        break;

      case "exit":
        this.exit();
        break;

      case "startWith":
        this.startWith(answer);
        break;

      default:
        throw new Error("wrong input.");
    }
  };

  public createClieApp = async () => {
    while (true) {
      try {
        const answer = await this.commandLine.getCommand("input command");
        this.switchCommand(answer);
        if (answer.command == "exit") return;
      } catch (error: any) {
        this.commandLine.show(error.message, Colors.red);
      }
    }
  };
}
