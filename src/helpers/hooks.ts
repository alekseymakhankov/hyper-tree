import { useMemo, useCallback, useState } from 'react'
import { TreeView, IFilter, ISort, TreeNode, InsertChildType } from './node'
import { treeHandlers } from './treeHandlers'

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

  const setOpen = useCallback((node: TreeNode) => {
    if (!node) {
      return
    }
    if (node.data.getChildren && !node.isOpened()) {
      setLoading(node, true)
      node.data.getChildren().then((asyncData: any) => {
        setLoading(node, false)
        node.setOpened(true)
        setChildren(node, treeView.staticEnhance(asyncData, node), 'last', true)
      })
    } else {
      node.setOpened(!node.isOpened())
      treeView.enhanceNodes()
    }
    forceUpdate(() => {
      treeView.enhanceNodes()
    })
  }, [forceUpdate, treeView, setLoading, setChildren])


  treeHandlers
    .safeUpdate(id, treeView)
    .safeUpdateHandler(id, 'rerender', forceUpdate)
    .safeUpdateHandler(id, 'setOpen', setOpen)
    .safeUpdateHandler(id, 'setLoading', setLoading)
    .safeUpdateHandler(id, 'setSelected', setSelected)
    .safeUpdateHandler(id, 'setChildren', setChildren)

  const handlers = useMemo(() => ({
    setOpen,
    setLoading,
    setSelected,
    setChildren,
  }), [setOpen, setLoading, setSelected, setChildren])

  return {
    instance: treeView,
    handlers,
    required: {
      data: treeView.enhancedData,
    },
  }
}
