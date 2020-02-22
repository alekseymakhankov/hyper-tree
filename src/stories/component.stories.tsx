import * as React from 'react'
import { storiesOf } from '@storybook/react'
import TreeView from '../index'
import { useTreeState } from '../helpers/hooks'
import { treeHandlers } from '../helpers/treeHandlers'
import { smallData } from './data'
import styles from './style.scss'

storiesOf('TreeView', module)
  .add('Base', () => {
    const filter = React.useCallback(() => true, [])
    const sort = React.useCallback((node: any, siblingNode: any) => {
      if (node.name > siblingNode.name) {
        return 1
      }
      if (node.name < siblingNode.name) {
        return -1
      }
      return 0
    }, [])
    const { required, handlers } = useTreeState(
      { data: smallData, filter, sort, id: 'storyTree', defaultOpened: true, multipleSelect: false },
    )
    const handleClick = React.useCallback(() => {
      const node = treeHandlers.trees.storyTree.instance.getNodeById(7)
      if (node) {
        treeHandlers.trees.storyTree.handlers.setLoading(node, !node.isLoading())
      }
    }, [])

    return (
      <>
        <button type="button" onClick={handleClick}>click</button>
        <TreeView
          {...required}
          {...handlers}
          depthGap={20}
          horizontalLineStyles={{
            stroke: 'black',
            strokeWidth: 1,
            strokeDasharray: '1 4',
          }}
          verticalLineStyles={{
            stroke: 'black',
            strokeWidth: 1,
            strokeDasharray: '1 4',
          }}
          gapMode="padding"
          classes={{
            nodeWrapperClassName: styles.nodeWrapper,
            selectedNodeWrapperClassName: styles.selectedNodeWrapper,
          }}
        />
      </>
    )
  })
