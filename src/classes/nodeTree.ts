export default interface INodeTree {
  value: string;
  isWord: boolean;
  children: Array<INodeTree>;
  parrent: INodeTree | null;
  isWordBelowNode: boolean;
  sizeChildren: () => number;
  addChild: (index: number, node: INodeTree) => void;
}

export class NodeTree implements INodeTree {
  public isWordBelowNode: boolean = false;

  constructor(
    public value: string,
    public isWord: boolean,
    public children: Array<INodeTree>,
    public parrent: INodeTree | null
  ) {}

  addChild = (index: number, node: INodeTree): void => {
    this.children[index] = node;
  };

  public sizeChildren(): number {
    const size = this.children.filter((x) => x != null).length;
    return size;
  }
}
