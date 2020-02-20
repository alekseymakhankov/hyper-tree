import * as React from 'react'
import { getDepthPx } from './helpers/getDepthPx'
import { HorizontalLine, VerticalLine, DefaultNode } from './components'
import { classnames } from './helpers/classnames'
import { defaultProps } from './helpers/defaultProps'
import { HyperTreeNodeProps, HyperTreeViewProps, HyperTreeViewMainProps } from './types'
import styles from './style.scss'

const HyperTreeNode: React.RefForwardingComponent<HTMLDivElement, HyperTreeNodeProps> = React.forwardRef(({
  classes = defaultProps.classes,
  depth,
  depthGap = defaultProps.depthGap,
  displayedName = defaultProps.displayedName,
  gapMode = defaultProps.gapMode,
  horizontalLineStyles,
  node,
  setOpen,
  setSelected,
  staticNodeHeight,
  verticalLineOffset = defaultProps.verticalLineOffset,
  renderNode,
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

  return (
    <div
      className={classnames({
        [styles.hyperNodeWrapper]: true,
        [styles.selected]: node.isSelected(),
        [classes.nodeWrapperClassName || '']: !!classes.nodeWrapperClassName,
        [classes.selectedNodeWrapperClassName || '']: !!(classes.selectedNodeWrapperClassName && node.isSelected()),
      })}
      style={{ [offsetProp]: getDepthPx(depth, depthGap), ...additionStyles }}
      ref={ref as React.Ref<HTMLDivElement>}
    >
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
        })
        : (
          <DefaultNode
            displayedName={displayedName}
            node={node}
            onSelect={handleSelected}
            onToggle={handleClick}
          />
        )}
      {!node.options.root && (
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
  node,
  nodeHeight,
  verticalLineOffset,
  verticalLineStyles,
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
          [classes.childrenClassName || '']: !!classes.childrenClassName,
          [classes.collapsedChildrenClassName || '']: !!(classes.collapsedChildrenClassName && !node.isOpened()),
        })
      }
    >
      <HyperTreeView
        classes={classes}
        data={node.getChildren()}
        depth={depth + 1}
        depthGap={depthGap}
        nodeHeight={nodeHeight}
        verticalLineOffset={verticalLineOffset}
        verticalLineStyles={verticalLineStyles}
        {...props}
      />
      <VerticalLine
        count={node.options.currentChilrenCount}
        depth={depth}
        depthGap={depthGap}
        nodeHeight={nodeHeight}
        verticalLineOffset={verticalLineOffset}
        verticalLineStyles={verticalLineStyles}
      />
    </div>
  )
}

const HyperTreeView: React.RefForwardingComponent<HTMLDivElement, HyperTreeViewProps> = React.forwardRef(
  ({ classes = defaultProps.classes, data, depth = 0, ...props }, ref) => (
    <div className={classnames(styles.hyperTreeView, classes.levelClassName)}>
      {data.map((currentNode: any) => (
        <div
          key={currentNode.id}
          className={classnames(styles.hyperTreeNodeWrapper, classes.parentChildrenClassName)}
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
    <div className={classes.treeWrapperClassName}>
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
