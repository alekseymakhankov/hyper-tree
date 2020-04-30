import * as React from 'react'
import { getDepthPx } from './helpers/getDepthPx'
import { DefaultNode } from './components/DefaultNode'
import { VerticalLine } from './components/VerticalLine'
import { HorizontalLine } from './components/HorizontalLine'
import { DragZone } from './components/DragZone'
import { classnames } from './helpers/classnames'
import { defaultProps } from './helpers/defaultProps'
import { HyperTreeNodeProps, HyperTreeViewProps, HyperTreeViewMainProps } from './types'
import styles from './style.scss'

const HyperTreeNode = React.forwardRef<HTMLDivElement, HyperTreeNodeProps>(({
  classes = defaultProps.classes,
  depth,
  depthGap = defaultProps.depthGap,
  disableHorizontalLines,
  disableLines,
  displayedName = defaultProps.displayedName,
  draggable,
  draggableHandlers,
  gapMode = defaultProps.gapMode,
  horizontalLineStyles,
  isDragging,
  node,
  renderDragZone,
  renderNode,
  setOpen,
  setSelected,
  staticNodeHeight,
  verticalLineOffset = defaultProps.verticalLineOffset,
}, ref) => {
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (setOpen) {
      setOpen(node)
    }
  }, [node, setOpen])

  const handleSelected = React.useCallback(() => {
    if (setSelected) {
      setSelected(node, !node.isSelected())
    }
  }, [node, setSelected])

  const additionStyles: any = {}
  if (staticNodeHeight) {
    additionStyles.height = `${staticNodeHeight}px`
  }

  const offsetProp = gapMode === 'padding' ? 'paddingLeft' : 'marginLeft'

  const handleDragEnter = React.useCallback(
    (type: any) => draggableHandlers.handleDragEnter(node, type),
    [draggableHandlers, node],
  )

  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? draggableHandlers.handleDragStart : undefined}
      onDragEnd={draggable ? draggableHandlers.handleDrop(node, node.getNodeDropContainer()) : undefined}
      className={classnames({
        [styles.hyperNodeWrapper]: true,
        [styles.selected]: node.isSelected(),
        [styles.dropContainer]: !!node.getNodeDropContainer(),
        [classes.nodeWrapper || '']: !!classes.nodeWrapper,
        [classes.selectedNodeWrapper || '']: !!(classes.selectedNodeWrapper && node.isSelected()),
      })}
      style={{ [offsetProp]: getDepthPx(depth, depthGap), ...additionStyles }}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {draggable && renderDragZone
        ? renderDragZone({
          depth,
          depthGap,
          isDragging,
          node,
          onDragEnterAfter: handleDragEnter('after'),
          onDragEnterBefore: handleDragEnter('before'),
          onDragEnterChildren: handleDragEnter('children'),
          onDragLeave: draggableHandlers.handleDragLeave(node),
        }) : draggable && (
          <DragZone
            depth={depth}
            depthGap={depthGap}
            isDragging={isDragging}
            node={node}
            onDragEnterAfter={handleDragEnter('after')}
            onDragEnterBefore={handleDragEnter('before')}
            onDragEnterChildren={handleDragEnter('children')}
            onDragLeave={draggableHandlers.handleDragLeave(node)}
          />
        )}
      {renderNode
        ? renderNode({
          depth,
          depthGap,
          displayedName,
          node,
          nodeRef: ref,
          offsetProp,
          onSelect: handleSelected,
          onToggle: handleClick,
        }) : (
          <DefaultNode
            displayedName={displayedName}
            node={node}
            onSelect={handleSelected}
            onToggle={handleClick}
          />
        )}
      {!node.options.root && !(disableLines || disableHorizontalLines) && (
        <HorizontalLine
          depth={depth}
          depthGap={depthGap}
          gapMode={gapMode}
          horizontalLineStyles={horizontalLineStyles}
          verticalLineOffset={verticalLineOffset}
        />
      )}
    </div>
  )
})

const HyperTreeViewChildren: React.FC<HyperTreeNodeProps> = ({
  classes = defaultProps.classes,
  depth,
  depthGap = defaultProps.depthGap,
  disableLines,
  disableVerticalLines,
  node,
  nodeHeight,
  verticalLineOffset,
  verticalLineStyles,
  verticalLineTopOffset,
  ...props
}) => {
  if (!node.hasChildren()) {
    return null
  }
  return (
    <div
      className={
        classnames({
          [styles.child]: true,
          [styles.collapsed]: !node.isOpened(),
          [classes.children || '']: !!classes.children,
          [classes.collapsedChildren || '']: !!(classes.collapsedChildren && !node.isOpened()),
        })
      }
    >
      <HyperTreeView
        classes={classes}
        data={node.getChildren()}
        depth={depth + 1}
        depthGap={depthGap}
        disableLines={disableLines}
        disableVerticalLines={disableVerticalLines}
        nodeHeight={nodeHeight}
        verticalLineOffset={verticalLineOffset}
        verticalLineStyles={verticalLineStyles}
        verticalLineTopOffset={verticalLineTopOffset}
        {...props}
      />
      {!(disableLines || disableVerticalLines) && (
        <VerticalLine
          count={node.options.currentChilrenCount}
          depth={depth}
          depthGap={depthGap}
          nodeHeight={nodeHeight}
          verticalLineOffset={verticalLineOffset}
          verticalLineStyles={verticalLineStyles}
          verticalLineTopOffset={verticalLineTopOffset}
        />
      )}
    </div>
  )
}

const HyperTreeView = React.forwardRef<HTMLDivElement, HyperTreeViewProps>(
  ({ classes = defaultProps.classes, data, depth = 0, ...props }, ref) => (
    <div className={classnames(styles.hyperTreeView, classes.level)}>
      {data.map((currentNode: any) => (
        <div
          key={currentNode.id}
          className={classnames(styles.hyperTreeNodeWrapper, classes.parentChildren)}
        >
          <HyperTreeNode classes={classes} depth={depth} node={currentNode} ref={ref} {...props} />
          <HyperTreeViewChildren classes={classes} depth={depth} node={currentNode} {...props} />
        </div>
      ))}
    </div>
  ),
)

const Tree: React.FC<HyperTreeViewMainProps> = ({
  classes = defaultProps.classes,
  staticNodeHeight,
  ...props
}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number>(staticNodeHeight || 0)

  React.useEffect(() => {
    if (nodeRef.current && !height && !staticNodeHeight) {
      setHeight(nodeRef.current.clientHeight)
    }
  }, [height, staticNodeHeight])

  return (
    <div className={classes.treeWrapper}>
      <HyperTreeView
        classes={classes}
        depth={0}
        nodeHeight={height}
        ref={nodeRef}
        staticNodeHeight={staticNodeHeight}
        {...props}
      />
    </div>
  )
}

export default Tree
