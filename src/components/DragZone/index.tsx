import * as React from 'react'
import { classnames } from '../../helpers/classnames'
import { getDepthPx } from '../../helpers/getDepthPx'
import { DragZoneProps } from '../../types'
import styles from './style.scss'

export const DragZone: React.FC<DragZoneProps> = ({
  depth,
  depthGap,
  isDragging,
  node,
  onDragEnterAfter,
  onDragEnterBefore,
  onDragEnterChildren,
  onDragLeave,
}) => (
  <div
    className={classnames({
      [styles.dragZone]: true,
      [styles.dragZoneVisible]: !!isDragging,
    })}
    style={{ marginLeft: getDepthPx(depth, depthGap) }}
    onDragLeave={onDragLeave}
  >
    <div
      className={classnames({
        [styles.dragZoneItem]: true,
        [styles.dragZoneItemSelected]: node.getNodeDropContainer() === 'before',
      })}
      onDragEnter={onDragEnterBefore}
    />
    <div
      className={classnames({
        [styles.dragZoneItem]: true,
        [styles.dragZoneItemSelected]: node.getNodeDropContainer() === 'children',
      })}
      onDragEnter={onDragEnterChildren}
    />
    <div
      className={classnames({
        [styles.dragZoneItem]: true,
        [styles.dragZoneItemSelected]: node.getNodeDropContainer() === 'after',
      })}
      onDragEnter={onDragEnterAfter}
    />
  </div>
)
