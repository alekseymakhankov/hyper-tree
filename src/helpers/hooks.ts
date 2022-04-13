import { useMemo, useCallback, useState, useEffect } from 'react'
import hash from 'hash-sum'
import { TreeView, IFilter, ISort, TreeNode, InsertChildType, InsertSiblingType, IData } from './node'
import { treeHandlers } from './treeHandlers'
import { isFunction } from './typeCheckers'
import { defaultProps } from './defaultProps'

export interface IUseTreeState {
    id: string
    data: any
    filter?: IFilter
    sort?: ISort
    defaultOpened?: boolean | (number | string)[]
    multipleSelect?: boolean
    refreshAsyncNodes?: boolean
    idKey?: string
    childrenKey?: string
}

export type IDropType = 'before' | 'children' | 'after'

const defaultOptions = {
    sort: () => 0 as const
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
        [dispatch]
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
    refreshAsyncNodes,
    idKey = defaultProps.idKey,
    childrenKey = defaultProps.childrenKey
}: IUseTreeState) => {
    const forceUpdate = useForceUpdate()
    const [dropNodeId, setDropNodeId] = useState<string | number | null>(null)
    const [isDragging, setDragging] = useState(false)
    const [dropType, setDropType] = useState<string | boolean>(false)
    const [localData, setLocalData] = useState<any>([])
    const [isDefaultOpened, setDefaultOpened] = useState(false)

    useEffect(() => {
        const formattedData = Array.isArray(data) ? data : [data]

        const hashFormattedData = hash(formattedData)
        const hashLocalData = hash(localData)

        if (hashFormattedData !== hashLocalData) {
            setLocalData(formattedData)
        }
    }, [data, localData])

    const treeView = useMemo(
        () =>
            new TreeView(id, localData, {
                idKey,
                childrenKey,
                defaultOpened: false,
                filter,
                enhance: true,
                sort: sort || defaultOptions.sort
            }),
        [id, localData, idKey, childrenKey, filter, sort]
    )

    const getNode = useCallback(
        (node: TreeNode | string | number): TreeNode | null => {
            if (node instanceof TreeNode) {
                return node
            }
            const foundNode = treeView.getNodeById(node)
            return foundNode || null
        },
        [treeView]
    )

    const setLoading = useCallback(
        (node: TreeNode | string | number, loading?: boolean) => {
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
        },
        [forceUpdate, treeView]
    )

    const setSelected = useCallback(
        (node: TreeNode | string | number, selected?: boolean) => {
            if (!multipleSelect && selected) {
                treeView.unselectAll()
            }

            const currentNode = getNode(node)
            if (!currentNode) {
                return
            }
            currentNode.setSelected(selected)
            forceUpdate()
        },
        [forceUpdate, treeView, multipleSelect, getNode]
    )

    const setDragContainer = useCallback(
        (node: TreeNode | string | number, dragContainer?: string | boolean) => {
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
        },
        [forceUpdate, treeView]
    )

    const setChildren = useCallback(
        (parent: TreeNode | string | number, children: TreeNode[], type?: InsertChildType, reset?: boolean) => {
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
        },
        [treeView, forceUpdate]
    )

    const setSiblings = useCallback(
        (node: TreeNode | string | number, siblings: TreeNode[], type: InsertSiblingType) => {
            const targetNode: TreeNode | null = getNode(node)

            if (targetNode && targetNode.options.parent) {
                const parentChildren = [...targetNode.options.parent.getChildren()]
                const nodeIndex = parentChildren.findIndex(
                    (child: TreeNode) => targetNode && child.id === targetNode.id
                )
                if (nodeIndex !== -1) {
                    const startIndex = type === 'before' ? nodeIndex : nodeIndex + 1
                    parentChildren.splice(startIndex, 0, ...siblings)
                    targetNode.options.parent.setNodeChildren(parentChildren, 'first', true)
                    treeView.enhanceNodes(true)
                    forceUpdate()
                }
            }
            if (targetNode && targetNode.options.root) {
                const nodeIndex = treeView.enhancedData.findIndex(
                    (child: TreeNode) => targetNode && targetNode.id === child.id
                )
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
        },
        [treeView, forceUpdate, getNode]
    )

    const setRawChildren = useCallback(
        (parent: TreeNode | string | number, children: IData[], type?: InsertChildType, reset?: boolean) => {
            setChildren(parent, treeView.staticEnhance(children, parent), type, reset)
        },
        [setChildren, treeView]
    )

    const setNodeData = useCallback(
        (node: TreeNode | string | number, dataToSet: IData) => {
            const currentNode: TreeNode | null = getNode(node)

            if (!currentNode) {
                return
            }

            currentNode.setData(dataToSet)
            forceUpdate(() => {
                treeView.enhanceNodes()
            })
        },
        [forceUpdate, treeView, getNode]
    )

    const getNodeData = useCallback(
        (node: TreeNode | string | number) => {
            const currentNode: TreeNode | null = getNode(node)
            if (!currentNode) {
                return undefined
            }

            return currentNode.getData()
        },
        [getNode]
    )

    const setOpen = useCallback(
        async (node: TreeNode | string | number, toggle = true) => {
            const currentNode: TreeNode | null = getNode(node)

            if (!currentNode) {
                return
            }

            if (
                currentNode.data.getChildren &&
                isFunction(currentNode.data.getChildren) &&
                !currentNode.isOpened() &&
                !currentNode.isAsyncDataLoaded()
            ) {
                setLoading(currentNode, true)
                try {
                    const asyncData: IData[] = await currentNode.data.getChildren({ node })
                    setLoading(node, false)
                    currentNode.setOpened(true)
                    if (!refreshAsyncNodes) {
                        currentNode.setAsyncDataLoaded(true)
                    }
                    setRawChildren(node, asyncData, 'last', true)
                } catch (e) {
                    console.error('react-hyper-tree: Error on getChildren', e)
                }
            } else {
                currentNode.setOpened(toggle ? !currentNode.isOpened() : true)
                treeView.enhanceNodes()
            }
            forceUpdate(() => {
                treeView.enhanceNodes()
            })
        },
        [getNode, forceUpdate, setLoading, refreshAsyncNodes, setRawChildren, treeView]
    )

    const setOpenByPath = useCallback(
        async (path: string) => {
            await path.split('/').reduce(async (previousPromise, currentPath) => {
                await previousPromise
                await setOpen(currentPath)
            }, Promise.resolve())
        },
        [setOpen]
    )

    const setSelectedByPath = useCallback(
        async (path: string, all = false, toggle = false) => {
            const parts = path.split('/')
            for (let i = 0; i < parts.length; i += 1) {
                const currentPath = parts[i]
                if (!currentPath) {
                    continue
                }
                const node = getNode(currentPath)
                if (!node) {
                    continue
                }
                if (!node.isOpened()) {
                    await setOpen(node)
                }
                if (all || i === parts.length - 1) {
                    setSelected(node, toggle ? !node.isSelected() : true)
                }
            }
            treeView.enhanceNodes()
            forceUpdate()
        },
        [forceUpdate, getNode, setOpen, setSelected, treeView]
    )

    const selectAll = useCallback(() => {
        if (multipleSelect) {
            treeView.selectAll()
            treeView.enhanceNodes()
            forceUpdate()
        }
    }, [treeView, forceUpdate, multipleSelect])

    const unselectAll = useCallback(() => {
        treeView.unselectAll()
        treeView.enhanceNodes()
        forceUpdate()
    }, [treeView, forceUpdate])

    useEffect(() => {
        const openedHandler = async () => {
            setDefaultOpened(true)
            let isAsyncExist = false
            let nodes = treeView.flat()
            if (nodes.length === 0) {
                return
            }
            for (let i = 0; i < nodes.length; i += 1) {
                const node = nodes[i]
                if (typeof defaultOpened === 'boolean') {
                    await setOpen(node.id, false)
                } else if (defaultOpened?.includes(node.id)) {
                    await setOpen(node.id, false)
                }
                if (node.data.getChildren) {
                    isAsyncExist = true
                }
            }
            if (isAsyncExist) {
                nodes = treeView.flat()
                for (let i = 0; i < nodes.length; i += 1) {
                    const node = nodes[i]
                    if (typeof defaultOpened === 'boolean') {
                        await setOpen(node.id, false)
                    } else if (defaultOpened?.includes(node.id)) {
                        await setOpen(node.id, false)
                    }
                }
            }
        }

        if (isDefaultOpened || typeof defaultOpened === 'undefined' || treeView.flat().length === 0) {
            return
        }
        const isBool = typeof defaultOpened === 'boolean'
        if (isBool && defaultOpened) {
            openedHandler()
        }

        if (!isBool && defaultOpened.length !== 0) {
            openedHandler()
        }
    }, [defaultOpened, isDefaultOpened, setOpen, treeView])

    const handleDragStart = useCallback((e: React.DragEvent) => {
        e.stopPropagation()
        setDragging(true)
    }, [])

    const handleDragEnter = useCallback(
        (node: TreeNode, type: string | boolean) => (e: React.DragEvent) => {
            e.stopPropagation()
            e.preventDefault()
            setDragContainer(node, type)
            setDropNodeId(node.id)
            setDropType(type)
        },
        [setDragContainer]
    )

    const handleDragLeave = useCallback(
        (node: TreeNode) => (e: React.DragEvent) => {
            e.stopPropagation()
            e.preventDefault()
            if (node.id !== dropNodeId) {
                setDragContainer(node, false)
            }
        },
        [setDragContainer, dropNodeId]
    )

    const handleDrop = useCallback(
        (sourceNode: TreeNode) => (e: React.DragEvent) => {
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
                        treeView.enhancedData = treeView.enhancedData.filter(
                            (child: TreeNode) => child.id !== sourceNode.id
                        )
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
        },
        [dropNodeId, forceUpdate, treeView, setDragContainer, setSiblings, dropType]
    )

    treeHandlers
        .safeUpdate(id, treeView)
        .safeUpdateHandler(id, 'rerender', forceUpdate)
        .safeUpdateHandler(id, 'setOpen', setOpen)
        .safeUpdateHandler(id, 'setOpenByPath', setOpenByPath)
        .safeUpdateHandler(id, 'setLoading', setLoading)
        .safeUpdateHandler(id, 'setSelected', setSelected)
        .safeUpdateHandler(id, 'setSelectedByPath', setSelectedByPath)
        .safeUpdateHandler(id, 'setRawChildren', setRawChildren)
        .safeUpdateHandler(id, 'setChildren', setChildren)
        .safeUpdateHandler(id, 'setSiblings', setSiblings)
        .safeUpdateHandler(id, 'getNode', getNode)
        .safeUpdateHandler(id, 'setNodeData', setNodeData)
        .safeUpdateHandler(id, 'getNodeData', getNodeData)
        .safeUpdateHandler(id, 'selectAll', selectAll)
        .safeUpdateHandler(id, 'unselectAll', unselectAll)

    const handlers = useMemo(
        () => ({
            setChildren,
            setLoading,
            setOpen,
            setRawChildren,
            setSelected,
            setSiblings,
            setNodeData,
            getNode,
            getNodeData,
            selectAll,
            unselectAll,
            draggableHandlers: {
                handleDragStart,
                handleDragEnter,
                handleDragLeave,
                handleDrop
            }
        }),
        [
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
            setNodeData,
            getNode,
            getNodeData,
            selectAll,
            unselectAll
        ]
    )

    return {
        instance: treeView,
        handlers,
        required: {
            isDragging,
            data: treeView.enhancedData
        }
    }
}
