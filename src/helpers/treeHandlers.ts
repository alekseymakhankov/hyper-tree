import { TreeView } from './node'

interface ITreeItem {
  instance: TreeView;
  handlers: IHandlers;
}

interface ITrees {
  [key: string]: ITreeItem;
}

type Handler = (...args: any[]) => any

interface IHandlers {
  [key: string]: Handler;
}

export class TreeHandlers {
  trees: ITrees

  constructor() {
    this.trees = {}
  }

  getIds(): string[] {
    return Object.keys(this.trees)
  }

  safeUpdate(id: string, tree: TreeView): TreeHandlers {
    this.trees[id] = {
      instance: tree,
      handlers: {},
    }
    return this
  }
  remove(id: string): TreeHandlers {
    const { [id]: _, ...trees } = this.trees
    this.trees = trees
    return this
  }

  safeUpdateHandler(treeId: string, handlerName: string, handler: Handler): TreeHandlers {
    if (this.trees[treeId]) {
      this.trees[treeId].handlers = { ...this.trees[treeId].handlers, [handlerName]: handler }
    }
    return this
  }
  removeHandler(treeId: string, handlerName: string): TreeHandlers {
    if (this.trees[treeId]) {
      const { [handlerName]: _, ...handlers } = this.trees[treeId].handlers
      this.trees[treeId].handlers = handlers
    }
    return this
  }
}


export const treeHandlers = new TreeHandlers()
