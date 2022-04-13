/* eslint-disable no-use-before-define */
import { TreeView, TreeNode } from './node'

interface ITreeItem {
    loadedData?: TreeNode[]
    instance: TreeView
    handlers: IHandlers
}

interface ITrees {
    [key: string]: ITreeItem
}

type Handler = (...args: any[]) => any

interface IHandlers {
    [key: string]: Handler
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
        if (this.trees[id]) {
            this.trees[id].instance = tree
            this.trees[id].handlers = {}
        } else {
            this.trees[id] = {
                instance: tree,
                handlers: {}
            }
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

    updateLoadedData(id: string, data: TreeNode[]) {
        if (this.trees[id]) {
            this.trees[id].loadedData = data
        }
    }
}

export const treeHandlers = new TreeHandlers()
