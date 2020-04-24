import { useMemo, useCallback, useState } from 'react'
import { TreeView, IFilter, ISort, TreeNode, InsertChildType, InsertSiblingType, IData } from './node'
import { treeHandlers } from './treeHandlers'
import { isFunction } from './typeCheckers'
import { defaultProps } from './defaultProps'

export interface IUseTreeState {
  id: string;
  data: any;
  filter?: IFilter;
  sort?: ISort;
  defaultOpened?: boolean | number[];
  multipleSelect?: boolean;
  idKey?: string;
  childrenKey?: string;
}

export type IDropType = 'before' | 'children' | 'after'

const defaultOptions = {
  filter: () => true,
  sort: () => 0 as const,
}

const useForceUpdate = () => {
  const [, dispatch] = useState<{}>(Object.create(null))

  const memoizedDispatch = useCallback(
    (callback?: () => void): void => {
      if (callback) {
        callback()
      }
      dispatch(Object.create(null))
    },
    [dispatch],
  )
  return memoizedDispatch
}

export const useTreeState = ({
  id,
  data,
  filter,
  sort,
  defaultOpened,
  multipleSelect,
  idKey = defaultProps.idKey,
  childrenKey = defaultProps.childrenKey,
}: IUseTreeState) => {
  const forceUpdate = useForceUpdate()
  const [dropNodeId, setDropNodeId] = useState<string | number | null>(null)
  const [isDragging, setDragging] = useState(false)
  const [dropType, setDropType] = useState<string | boolean>(false)

  const treeView = useMemo(() => new TreeView(
    id,
    Array.isArray(data) ? data : [data],
    {
      idKey,
      childrenKey,
      defaultOpened,
      enhance: true,
      filter: filter || defaultOptions.filter,
      sort: sort || defaultOptions.sort,
    },
  ), [data, defaultOpened, filter, id, sort, idKey, childrenKey])

  const setLoading = useCallback((node: TreeNode | string | number, loading?: boolean) => {
    if (node instanceof TreeNode) {
      node.setLoading(loading)
      forceUpdate()
    } else {
      const foundNode = treeView.getNodeById(node)
      if (foundNode) {
        foundNode.setLoading(loading)
        forceUpdate()
      }
    }
  }, [forceUpdate, treeView])

  const setSelected = useCallback((node: TreeNode | string | number, selected?: boolean) => {
    if (!multipleSelect && selected) {
      treeView.unselectAll()
    }
    if (node instanceof TreeNode) {
      node.setSelected(selected)
      forceUpdate()
    } else {
      const foundNode = treeView.getNodeById(node)
      if (foundNode) {
        foundNode.setSelected(selected)
        forceUpdate()
      }
    }
  }, [forceUpdate, treeView, multipleSelect])

  const setDragContainer = useCallback((node: TreeNode | string | number, dragContainer?: string | boolean) => {
    if (node instanceof TreeNode) {
      node.setNodeDropContainer(dragContainer)
      forceUpdate()
    } else {
      const foundNode = treeView.getNodeById(node)
      if (foundNode) {
        foundNode.setNodeDropContainer(dragContainer)
        forceUpdate()
      }
    }
  }, [forceUpdate, treeView])

  const setChildren = useCallback((
    parent: TreeNode | string | number,
    children: TreeNode[],
    type?: InsertChildType,
    reset?: boolean,
  ) => {
    if (parent instanceof TreeNode) {
      parent.setNodeChildren(children, type, reset)
      treeView.enhanceNodes()
      forceUpdate()
    } else {
      const foundParent = treeView.getNodeById(parent)
      if (foundParent) {
        foundParent.setNodeChildren(children, type, reset)
        treeView.enhanceNodes()
        forceUpdate()
      }
    }
  }, [treeView, forceUpdate])

  const setSiblings = useCallback((
    node: TreeNode | string | number,
    siblings: TreeNode[],
    type: InsertSiblingType,
  ) => {
    let targetNode: TreeNode | null = null
    if (node instanceof TreeNode) {
      targetNode = node
    } else {
      targetNode = treeView.getNodeById(node)
    }
    if (targetNode && targetNode.options.parent) {
      const parentChildren = [...targetNode.options.parent.getChildren()]
      const nodeIndex = parentChildren.findIndex((child: TreeNode) => targetNode && child.id === targetNode.id)
      if (nodeIndex !== -1) {
        const startIndex = type === 'before' ? nodeIndex : nodeIndex + 1
        parentChildren.splice(startIndex, 0, ...siblings)
        targetNode.options.parent.setNodeChildren(parentChildren, 'first', true)
        treeView.enhanceNodes(true)
        forceUpdate()
      }
    }
    if (targetNode && targetNode.options.root) {
      const nodeIndex = treeView.enhancedData.findIndex((child: TreeNode) => targetNode && targetNode.id === child.id)
      if (nodeIndex !== -1) {
        const startIndex = type === 'before' ? nodeIndex : nodeIndex + 1
        const mappedSiblings = siblings.map((sibling: TreeNode) => {
          sibling.options.parent = undefined
          sibling.options.root = true
          sibling.options.leaf = false
          return sibling
        })

        treeView.enhancedData.splice(startIndex, 0, ...mappedSiblings)
        treeView.enhanceNodes(true)
        forceUpdate()
      }
    }
  }, [treeView, forceUpdate])

  const setRawChildren = useCallback((
    parent: TreeNode | string | number,
    children: IData[],
    type?: InsertChildType,
    reset?: boolean,
  ) => {
    setChildren(parent, treeView.staticEnhance(children, parent), type, reset)
  }, [setChildren, treeView])

  const setOpen = useCallback((node: TreeNode | string | number) => {
    let currentNode: TreeNode

    if (node instanceof TreeNode) {
      currentNode = node
    } else {
      currentNode = treeView.getNodeById(node)
    }

    if (!currentNode) {
      return
    }

    if (currentNode.data.getChildren && isFunction(currentNode.data.getChildren) && !currentNode.isOpened()) {
      setLoading(currentNode, true)
      const result = currentNode.data.getChildren({ node })
      if (result.then) {
        result.then((asyncData: IData[]) => {
          setLoading(node, false)
          currentNode.setOpened(true)
          setRawChildren(node, asyncData, 'last', true)
        })
      }
    } else {
      currentNode.setOpened(!currentNode.isOpened())
      treeView.enhanceNodes()
    }
    forceUpdate(() => {
      treeView.enhanceNodes()
    })
  }, [forceUpdate, treeView, setLoading, setRawChildren])


  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.stopPropagation()
    setDragging(true)
  }, [])

  const handleDragEnter = useCallback((node: TreeNode, type: string | boolean) => (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDragContainer(node, type)
    setDropNodeId(node.id)
    setDropType(type)
  }, [setDragContainer])

  const handleDragLeave = useCallback((node: TreeNode) => (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (node.id !== dropNodeId) {
      setDragContainer(node, false)
    }
  }, [setDragContainer, dropNodeId])

  const handleDrop = useCallback((sourceNode: TreeNode) => (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDragging(false)
    if (dropNodeId) {
      setDragContainer(dropNodeId, false)
    }
    if (dropNodeId && dropNodeId !== sourceNode.id) {
      const targetNode = treeView.getNodeById(dropNodeId)
      if (sourceNode) {
        if (sourceNode.options.parent) {
          sourceNode.options.parent.removeChild(sourceNode)
        } else {
          treeView.enhancedData = treeView.enhancedData.filter((child: TreeNode) => child.id !== sourceNode.id)
        }
        if (dropType === 'children') {
          sourceNode.options.parent = targetNode
          sourceNode.options.root = false
          sourceNode.options.leaf = true
          targetNode.setNodeChildren([sourceNode], 'last')
          treeView.enhanceNodes(true)
          forceUpdate()
        } else if (dropType === 'after' || dropType === 'before') {
          setSiblings(targetNode, [sourceNode], dropType)
        }
        setDropNodeId(null)
      }
    }
  }, [dropNodeId, forceUpdate, treeView, setDragContainer, setSiblings, dropType])


  treeHandlers
    .safeUpdate(id, treeView)
    .safeUpdateHandler(id, 'rerender', forceUpdate)
    .safeUpdateHandler(id, 'setOpen', setOpen)
    .safeUpdateHandler(id, 'setLoading', setLoading)
    .safeUpdateHandler(id, 'setSelected', setSelected)
    .safeUpdateHandler(id, 'setRawChildren', setRawChildren)
    .safeUpdateHandler(id, 'setChildren', setChildren)
    .safeUpdateHandler(id, 'setSiblings', setSiblings)

  const handlers = useMemo(() => ({
    setChildren,
    setLoading,
    setOpen,
    setRawChildren,
    setSelected,
    setSiblings,
    draggableHandlers: {
      handleDragStart,
      handleDragEnter,
      handleDragLeave,
      handleDrop,
    },
  }), [
    handleDragEnter,
    handleDragLeave,
    handleDragStart,
    handleDrop,
    setChildren,
    setLoading,
    setOpen,
    setRawChildren,
    setSelected,
    setSiblings,
  ])

  return {
    instance: treeView,
    handlers,
    required: {
      isDragging,
      data: treeView.enhancedData,
    },
  }
}
