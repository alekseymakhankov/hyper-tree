import React from 'react'
import TreeView from '../index'
import { useTreeState } from '../helpers/hooks'
import { treeHandlers } from '../helpers/treeHandlers'
import { smallData } from './data'

export const Tree = () => {
    const [value, setValue] = React.useState('')
    const onChange = React.useCallback(e => {
        setValue(e.target.value)
    }, [])
    const filter = React.useCallback(
        data => {
            if (!value) {
                return true
            }
            return data.data.name.toLowerCase().includes(value.toLowerCase())
        },
        [value]
    )
    const sort = React.useCallback((node: any, siblingNode: any) => {
        if (node.name > siblingNode.name) {
            return 1
        }
        if (node.name < siblingNode.name) {
            return -1
        }
        return 0
    }, [])
    const { required, handlers } = useTreeState({
        data: smallData,
        filter: value ? filter : undefined,
        sort,
        id: 'storyTree',
        defaultOpened: true,
        multipleSelect: true,
        refreshAsyncNodes: true
    })
    const handleClick = React.useCallback(() => {
        treeHandlers.trees.storyTree.handlers.setOpenByPath('/1/2/5', true, true)
    }, [])
    const handleClickSelect = React.useCallback(() => {
        treeHandlers.trees.storyTree.handlers.selectAll()
    }, [])
    const handleClickUnselect = React.useCallback(() => {
        treeHandlers.trees.storyTree.handlers.unselectAll()
    }, [])

    return (
        <>
            <input type="text" value={value} onChange={onChange} />
            <button type="button" onClick={handleClick}>
                click
            </button>
            <button type="button" onClick={handleClickSelect}>
                select all
            </button>
            <button type="button" onClick={handleClickUnselect}>
                unselect
            </button>
            <TreeView {...required} {...handlers} gapMode="padding" depthGap={20} />
        </>
    )
}
