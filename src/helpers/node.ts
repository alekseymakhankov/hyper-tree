import { uuid } from './uuid'
import {} from './typeCheckers'

export interface IDataOptions {
  opened: boolean;
  selected: boolean;
  root: boolean;
  leaf: boolean;
  hasChildren: boolean;
  async: boolean;
  childrenCount: number;
  currentChilrenCount: number;
  parent?: TreeNode;
  loading: boolean;
  idKey: string;
  childrenKey: string;
}

export interface IData {
  [key: string]: any;
}

export interface ITreeNode {
  readonly id: number | string;
  data: IData;
  options: IDataOptions;
  children?: TreeNode[];
}

export type IFilter = (node: TreeNode) => boolean;
export type ISort = (node: TreeNode, siblingNode: TreeNode) => -1 | 0 | 1

export interface Options {
  filter: IFilter;
  sort: ISort;
  defaultOpened?: boolean | number[];
  enhance?: boolean;
  idKey: string;
  childrenKey: string;
}

export type InsertChildType = 'first' | 'last'
export type InsertSiblingType = 'before' | 'after'
export type RemoveType = 'start' | 'end'

export class TreeNode implements ITreeNode {
  public readonly id: number | string
  data: IData;
  options: IDataOptions;
  children?: TreeNode[];

  constructor(data: IData, options: IDataOptions, children?: TreeNode[]) {
    this.data = data
    this.id = data[options.idKey] || uuid()
    this.options = options
    this.children = children
  }

  getData() {
    return this.data
  }

  setData(data: IData) {
    this.data = data
  }

  getChildren() {
    return this.children || []
  }

  setNodeChildren(children: TreeNode[], type?: InsertChildType, reset?: boolean): TreeNode[] {
    if (!this.hasChildren() || reset) {
      this.children = children
      return this.children
    }
    if (type === 'first') {
      this.children = [...children, ...(this.children || [])]
      return this.children
    }
    this.children = [...(this.children || []), ...children]
    return this.children
  }

  setChildren(children: TreeNode[]) {
    this.children = children
  }

  hasChildren() {
    return this.children && this.children.length !== 0
  }

  setParent(parent?: TreeNode) {
    this.options.parent = parent
  }

  setChildrenCount(count: number) {
    this.options.childrenCount = count
  }

  getFirstChild() {
    return this.getChildren()[0] || null
  }

  getLastChild() {
    return this.children && this.children.length !== 0 ? this.children[this.children.length - 1] : null
  }

  setOpened(opened?: boolean) {
    this.options.opened = opened || false
  }

  isOpened() {
    return this.options.opened
  }

  setLoading(loading?: boolean) {
    this.options.loading = loading || false
  }

  isLoading() {
    return this.options.loading
  }

  setSelected(selected?: boolean) {
    this.options.selected = selected || false
  }

  isSelected() {
    return this.options.selected
  }
}

export class TreeView {
  hash: string;
  id: string;
  data: any[];
  options: Options;
  enhancedData: TreeNode[];
  flatData: Array<TreeNode | any>;
  ids: number[];

  static instance: TreeView

  constructor(id: string, data: any, options: Options) {
    this.id = id
    this.data = data
    this.options = options
    this.enhancedData = []
    this.hash = uuid()
    this.ids = []
    if (options.enhance) {
      this.enhance()
    }
  }

  on(callback: () => void) {
    callback()
  }

  sort(tree: any[]): any[] {
    tree.sort(this.options.sort)
    return tree
  }

  staticEnhance(data: any[], node?: TreeNode): TreeNode[] {
    return this._staticEnhance(data, node)
  }

  enhance(data?: any[]): TreeNode[] {
    this.enhancedData = this._enhance(data || this.data, this.options)
    return this.enhancedData
  }

  enhanceNodes() {
    this.traverse((node) => {
      this._calculateChildrenCount(node)
    }, false)
  }

  flat(raw?: boolean): TreeNode[] {
    const tree = raw ? this.data : this.enhancedData
    this.flatData = this._flat(tree)
    this.ids = this.flatData.map((item: TreeNode | any) => item.id)
    return this.flatData
  }

  unselectAll() {
    this.traverse((node: TreeNode) => {
      node.setSelected(false)
    })
  }

  addChildren(parentId: number | string, data: IData[], insertType: InsertChildType = 'first') {
    this._addChildren(this.data, parentId, data, insertType)
  }

  addSibling(nodeId: number | string, data: IData, insertType: InsertSiblingType = 'after') {
    this._addSibling(this.data, nodeId, data, insertType)
  }

  remove(nodeId: number | string, leaveChildren?: RemoveType) {
    this._remove(this.data, null, nodeId, leaveChildren)
  }

  traverseRaw(callback: (node: any, childIndex: number, depth: number) => void, deep = true) {
    if (deep) {
      this._traverseDeep(this.data, callback)
    } else {
      this._traverseBreadth(this.data, callback)
    }
  }

  traverse(callback: (node: TreeNode, childIndex: number, depth: number) => void, deep = true) {
    if (deep) {
      this._traverseDeep(this.enhancedData, callback)
    } else {
      this._traverseBreadth(this.enhancedData, callback)
    }
  }

  getNodeById(id: number | string) {
    return this._getNodeById(id, this.enhancedData)
  }

  private _addChildren(data: any[], parentId: number | string, node: IData[], insertType: InsertChildType) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i][this.options.idKey] === parentId) {
        switch (insertType) {
          case 'first': {
            data[i][this.options.childrenKey] = [...node, ...(data[i][this.options.childrenKey] || [])]
            return
          }
          case 'last': {
            data[i][this.options.childrenKey] = [...(data[i][this.options.childrenKey] || []), ...node]
            return
          }
          default: return
        }
      } else if (data[i][this.options.childrenKey] && data[i][this.options.childrenKey].length !== 0) {
        this._addChildren(data[i][this.options.childrenKey], parentId, node, insertType)
        return
      }
      return
    }
  }

  private _addSibling(data: any[], nodeId: number | string, node: IData, insertType: InsertSiblingType) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i][this.options.childrenKey] && data[i][this.options.childrenKey].length !== 0) {
        const index = data[i][this.options.childrenKey].findIndex((child: any) => child[this.options.idKey] === nodeId)
        if (index > -1) {
          data[i][this.options.childrenKey].splice(insertType === 'before' ? index : index + 1, 0, node)
          return
        }
        this._addSibling(data[i][this.options.childrenKey], nodeId, node, insertType)
      }
      return
    }
  }

  private _flat(tree: Array<TreeNode | any>): TreeNode[] | any[] {
    const result: TreeNode[] | any[] = []
    tree.forEach((child: TreeNode | any) => {
      const { children, ...childData } = child
      result.push(childData)
      if (children && children.length !== 0) {
        result.push(...this._flat(children))
      }
    })
    return result
  }

  private _enhance(tree: any[], options: Options, parentNode?: TreeNode): TreeNode[] {
    const result: TreeNode[] = []
    this.sort(tree).filter(this.options.filter).forEach((child: IData) => {
      const filteredChildren: TreeNode[] = child[this.options.childrenKey]
        && child[this.options.childrenKey].length !== 0
        ? child[this.options.childrenKey].filter(this.options.filter)
        : []
      const newChild: TreeNode = new TreeNode(
        child,
        {
          opened: !!options.defaultOpened && !child.getChildren,
          selected: false,
          root: !parentNode,
          leaf: !filteredChildren,
          hasChildren: filteredChildren.length !== 0,
          async: !!child.getChildren,
          parent: parentNode,
          childrenCount: 0,
          currentChilrenCount: 0,
          loading: false,
          idKey: this.options.idKey,
          childrenKey: this.options.childrenKey,
        },
      )

      let children: TreeNode[] = []
      if (filteredChildren.length !== 0) {
        children = this._enhance(this.sort(filteredChildren), options, newChild)
      }
      newChild.setChildren(children)
      this._calculateChildrenCount(newChild)
      result.push(newChild)
    })

    return result
  }

  private _staticEnhance(tree: any[], parentNode?: TreeNode): TreeNode[] {
    const result: TreeNode[] = []
    tree.forEach((child: IData) => {
      const curentChildren = child[this.options.childrenKey] || []
      const newChild: TreeNode = new TreeNode(
        child,
        {
          opened: false,
          selected: false,
          root: !parentNode,
          leaf: curentChildren.length === 0,
          hasChildren: curentChildren.length !== 0,
          async: !!child.getChildren,
          parent: parentNode,
          childrenCount: 0,
          currentChilrenCount: 0,
          loading: false,
          idKey: this.options.idKey,
          childrenKey: this.options.childrenKey,
        },
      )

      let children: TreeNode[] = []
      if (curentChildren.length !== 0) {
        children = this._staticEnhance(curentChildren, newChild)
      }
      newChild.setChildren(children)
      this._calculateChildrenCount(newChild)
      result.push(newChild)
    })
    return result
  }

  private _calculateChildrenCount(child: TreeNode) {
    const childrenCount = child.getChildren().reduce((acc: number, c: TreeNode) => {
      if (c.isOpened()) {
        acc += c.options.childrenCount
        return acc
      }
      return acc
    }, 0)

    if (child.isOpened()) {
      child.options.childrenCount = child.getChildren().length + childrenCount
    } else {
      child.options.childrenCount = child.getChildren().length
    }
    const lastChild = child.getLastChild()

    if (lastChild && lastChild.isOpened()) {
      const globalCount = child.options.childrenCount
      child.options.currentChilrenCount = globalCount - lastChild.options.childrenCount
    } else {
      child.options.currentChilrenCount = child.options.childrenCount
    }
  }

  private _remove(data: any[], parentNode: any, nodeId: number | string, leaveChildren?: RemoveType) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i][this.options.idKey] === nodeId) {
        const nodeToRemove = data[i]
        data.splice(i, 1)
        if (parentNode
          && nodeToRemove[this.options.childrenKey]
          && nodeToRemove[this.options.childrenKey].length !== 0
          && leaveChildren) {
          parentNode[this.options.childrenKey] = leaveChildren === 'start'
            ? [...nodeToRemove[this.options.childrenKey], ...(parentNode[this.options.childrenKey] || [])]
            : [...(parentNode[this.options.childrenKey] || []), ...nodeToRemove[this.options.childrenKey]]
        }
        return
      }
      if (data[i][this.options.childrenKey] && data[i][this.options.childrenKey].length !== 0) {
        this._remove(data[i][this.options.childrenKey], data[i], nodeId, leaveChildren)
      }
    }
  }

  private _getNodeById(id: string | number, tree: any[]): any {
    for (let i = 0; i < tree.length; i += 1) {
      if (tree[i][this.options.idKey] === id) {
        return tree[i]
      }
      if (tree[i][this.options.childrenKey] && tree[i][this.options.childrenKey].length !== 0) {
        return this._getNodeById(id, tree[i][this.options.childrenKey])
      }
    }
    return null
  }

  private _traverseDeep(tree: any[], callback: (node: any, childIndex: number, depth: number) => void, depth = 0) {
    tree.forEach((node: any, index: number) => {
      callback(node, index, depth)
      if (node.children && node.children.length !== 0) {
        this._traverseDeep(node.children, callback, depth + 1)
      }
    })
  }

  private _traverseBreadth(tree: any[], callback: (node: any, childIndex: number, depth: number) => void, depth = 0) {
    tree.forEach((node: any, index: number) => {
      if (node.children && node.children.length !== 0) {
        this._traverseDeep(node.children, callback, depth + 1)
      }
      callback(node, index, depth)
    })
  }
}
