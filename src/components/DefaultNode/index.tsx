import * as React from 'react'
import { TreeNode } from '../../helpers/node'
import { isFunction } from '../../helpers/typeCheckers'
import { defaultProps } from '../../helpers/defaultProps'
import { Loader, Arrow } from '..'
import styles from './style.scss'

export type DefaultNodeProps = {
  offsetProp?: string;
  displayedName?: string | ((node: any) => string);
  node: TreeNode;
  onSelect: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
  onToggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  nodeRef?: React.Ref<HTMLDivElement>;
  depth?: number;
  depthGap?: number;
}

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
