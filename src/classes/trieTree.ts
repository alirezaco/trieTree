import INodeTree, { NodeTree } from "./nodeTree";

export default interface ITrieTree {
  depth: number;
  addWord: (word: string) => void;
  findWord: (word: string) => boolean;
  deleteWord: (word: string) => boolean;
  startWith: (pattern: string) => Array<string>;
}

export class TrieTree implements ITrieTree {
  public depth: number = 0;
  private firstNodes: Array<INodeTree> = [];

  private addLetter = (
    letter: string,
    isWord: boolean,
    parrent: INodeTree | null
  ): INodeTree => {
    const index = letter.toUpperCase().charCodeAt(0) - 65;

    if (!parrent) {
      if (this.firstNodes[index]) {
        this.firstNodes[index].isWord = isWord || this.firstNodes[index].isWord;
        return this.firstNodes[index];
      }

      this.firstNodes[index] = new NodeTree(letter, isWord, [], parrent);
      return this.firstNodes[index];
    }
    
    if (!parrent.children[index]) {
      const node = new NodeTree(letter, isWord, [], parrent);
      parrent.addChild(index, node);
      parrent.isWordBelowNode = true;
      return node;
    } else {
      parrent.isWordBelowNode = true;
      return parrent.children[index]
    }
  };

  public addWord = (word: string): void => {
    let parrent: INodeTree = this.addLetter(word[0], false, null);
    for (let index = 1; index < word.length - 1; index++) {
      parrent = this.addLetter(word[index], false, parrent);
    }
    this.addLetter(word[word.length - 1], true, parrent);
  };

  private find(word: string): INodeTree | null {
    let index: number = word.toUpperCase().charCodeAt(0) - 65;
    let temp: INodeTree = this.firstNodes[index];
    for (let i = 1; i < word.length; i++) {
      if (!temp || !temp.isWordBelowNode) return null;

      index = word.toUpperCase().charCodeAt(i) - 65;
      temp = temp.children[index];
    }

    if (temp.isWord) return temp;

    return null;
  }

  public findWord = (word: string): boolean => {
    const res = this.find(word);

    if (res) return true;
    return false;
  };

  public deleteWord = (word: string): boolean => {
    let temp = this.find(word);

    if (!temp) return false;

    while (temp) {
      let index = temp.value.toUpperCase().charCodeAt(0) - 65;
      temp = temp.parrent;
      delete temp?.children[index];
    }
    return true;
  };

  private findWordBelowNode = (
    node: INodeTree,
    pattern: string
  ): Array<string> => {
    const result = [];

    if (node.isWord) result.push(pattern);

    for (const child of node.children) {
      if (child) {
        const res = this.findWordBelowNode(child, pattern + child.value);
        result.push(...res);
      }
    }

    return result;
  };

  public startWith = (pattern: string): Array<string> => {
    let index: number = pattern.toUpperCase().charCodeAt(0) - 65;
    let temp: INodeTree = this.firstNodes[index];
    for (let i = 1; i < pattern.length; i++) {
      if (!temp || !temp.isWordBelowNode) return [];

      index = pattern.toUpperCase().charCodeAt(i) - 65;
      temp = temp.children[index];
    }

    if (!temp.isWordBelowNode) return [];

    return this.findWordBelowNode(temp, pattern);
  };
}
