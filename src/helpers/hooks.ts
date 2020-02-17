import { useMemo, useCallback, useState } from 'react'
import { TreeView, IFilter, ISort, TreeNode, InsertChildType, IData } from './node'
import { treeHandlers } from './treeHandlers'
import { isFunction } from './typeCheckers'

export interface IUseTreeState {
  id: string;
  data: any;
  filter?: IFilter;
  sort?: ISort;
  defaultOpened?: boolean | number[];
  multipleSelect?: boolean;
}

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

export const useTreeState = ({ id, data, filter, sort, defaultOpened, multipleSelect }: IUseTreeState) => {
  const forceUpdate = useForceUpdate()

  const treeView = useMemo(() => new TreeView(
    id,
    Array.isArray(data) ? data : [data],
    {
      defaultOpened,
      enhance: true,
      filter: filter || defaultOptions.filter,
      sort: sort || defaultOptions.sort,
    },
  ), [data, defaultOpened, filter, id, sort])

  const setLoading = useCallback((node: TreeNode, loading?: boolean) => {
    node.setLoading(loading)
    forceUpdate()
  }, [forceUpdate])

  const setSelected = useCallback((node: TreeNode, selected?: boolean) => {
    if (!multipleSelect && selected) {
      treeView.unselectAll()
    }
    node.setSelected(selected)
    forceUpdate()
  }, [forceUpdate, treeView, multipleSelect])

  const setChildren = useCallback((parent: TreeNode, children: TreeNode[], type?: InsertChildType, reset?: boolean) => {
    parent.setNodeChildren(children, type, reset)
    treeView.enhanceNodes()
    forceUpdate()
  }, [treeView, forceUpdate])

  const setRawChildren = useCallback((parent: TreeNode, children: IData[], type?: InsertChildType, reset?: boolean) => {
    setChildren(parent, treeView.staticEnhance(children, parent), type, reset)
  }, [setChildren, treeView])

  const setOpen = useCallback((node: TreeNode) => {
    if (!node) {
      return
    }
    if (node.data.getChildren && isFunction(node.data.getChildren) && !node.isOpened()) {
      setLoading(node, true)
      const result = node.data.getChildren({ node })
      if (result.then) {
        result.then((asyncData: IData[]) => {
          setLoading(node, false)
          node.setOpened(true)
          setRawChildren(node, asyncData, 'last', true)
        })
      }
    } else {
      node.setOpened(!node.isOpened())
      treeView.enhanceNodes()
    }
    forceUpdate(() => {
      treeView.enhanceNodes()
    })
  }, [forceUpdate, treeView, setLoading, setRawChildren])


  treeHandlers
    .safeUpdate(id, treeView)
    .safeUpdateHandler(id, 'rerender', forceUpdate)
    .safeUpdateHandler(id, 'setOpen', setOpen)
    .safeUpdateHandler(id, 'setLoading', setLoading)
    .safeUpdateHandler(id, 'setSelected', setSelected)
    .safeUpdateHandler(id, 'setRawChildren', setRawChildren)
    .safeUpdateHandler(id, 'setChildren', setChildren)

  const handlers = useMemo(() => ({
    setOpen,
    setLoading,
    setSelected,
    setChildren,
    setRawChildren,
  }), [setOpen, setLoading, setSelected, setChildren, setRawChildren])

  return {
    instance: treeView,
    handlers,
    required: {
      data: treeView.enhancedData,
    },
  }
}
