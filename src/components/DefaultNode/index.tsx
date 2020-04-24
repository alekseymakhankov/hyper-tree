import * as React from 'react'
import { isFunction } from '../../helpers/typeCheckers'
import { defaultProps } from '../../helpers/defaultProps'
import { Arrow } from '../Arrow'
import { Loader } from '../Loader'
import { DefaultNodeProps } from '../../types'
import styles from './style.scss'

export const DefaultNode: React.FC<DefaultNodeProps> = ({
  displayedName = defaultProps.displayedName,
  node,
  onSelect,
  onToggle,
}) => (
  <div
    className={styles.hyperNode}
    onClick={onSelect}
  >
    {(node.hasChildren() || node.options.async)
      && !node.isLoading()
      && (<Arrow onClick={onToggle} opened={node.isOpened() && !!node.hasChildren()} />)}
    {node.isLoading() && (<Loader />)}

    <div>{isFunction(displayedName) ? (displayedName as any)(node) : node.data[displayedName as any]}</div>
  </div>
)
