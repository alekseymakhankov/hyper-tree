import * as React from 'react'
import { storiesOf } from '@storybook/react'
import TreeView from '../index'
import { useTreeState } from '../helpers/hooks'
import { treeHandlers } from '../helpers/treeHandlers'
import { smallData } from './data'
import styles from './style.scss'

storiesOf('TreeView', module)
  .add('Base', () => {
    const [value, setValue] = React.useState('')
    const onChange = React.useCallback((e) => {
      setValue(e.target.value)
    }, [])
    const filter = React.useCallback((data) => {
      if (!value) {
        return true
      }
      return data.data.name.toLowerCase().includes(value.toLowerCase())
    }, [value])
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
      {
        data: smallData,
        filter: value ? filter : undefined,
        sort,
        id: 'storyTree',
        defaultOpened: false,
        multipleSelect: false,
      },
    )
    const handleClick = React.useCallback(() => {
      treeHandlers.trees.storyTree.handlers.setSelectedByPath('/1/2/7')
    }, [])

    return (
      <>
        <input type="text" value={value} onChange={onChange} />
        <button type="button" onClick={handleClick}>click</button>
        <TreeView
          {...required}
          {...handlers}
          verticalLineOffset={9}
          verticalLineTopOffset={-9}
          disableTransitions
          horizontalLineStyles={{
            stroke: 'black',
            strokeWidth: 1,
            strokeDasharray: '1 1',
          }}
          verticalLineStyles={{
            stroke: 'black',
            strokeWidth: 1,
            strokeDasharray: '1 1',
          }}
          gapMode="padding"
          depthGap={20}
          classes={{
            nodeWrapper: styles.nodeWrapper,
            selectedNodeWrapper: styles.selectedNodeWrapper,
          }}
        />
      </>
    )
  })
