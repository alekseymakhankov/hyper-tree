import * as React from 'react'
import { classnames } from './helpers/classnames'
import { defaultProps } from './helpers/defaultProps'

import { getDepthPx } from './helpers/getDepthPx'
import { TreeNode } from './helpers/node'
import { HorizontalLine, VerticalLine, DefaultNode, DefaultNodeProps } from './components'
import styles from './style.scss'

interface HyperTreeViewMainProps {
  setOpen?: (node: any) => void;
  setSelected?: (node: any, selected?: boolean) => void;
  displayedName?: string | ((node: any) => string);
  staticNodeHeight?: number;
  data: TreeNode[];
  depth?: number;
  depthGap?: number;
  renderNode?: (props: DefaultNodeProps) => React.ReactNode;
  verticalLineOffset?: number;
  verticalLineStyles?: React.CSSProperties;
  horizontalLineStyles?: React.CSSProperties;
  gapMode?: 'margin' | 'padding';
}

interface HyperTreeViewCommonProps {
  setOpen?: (node: any) => void;
  setSelected?: (node: any, selected?: boolean) => void;
  displayedName?: string | ((node: any) => string);
  depth: number;
  nodeHeight: number;
  depthGap?: number;
  gapMode?: 'margin' | 'padding';
  staticNodeHeight?: number;
  verticalLineOffset?: number;
  verticalLineStyles?: React.CSSProperties;
  horizontalLineStyles?: React.CSSProperties;
  renderNode?: (props: DefaultNodeProps) => React.ReactNode;
}

interface HyperTreeViewProps extends HyperTreeViewCommonProps {
  data: TreeNode[];
}

interface HyperTreeNode extends HyperTreeViewCommonProps {
  node: TreeNode;
}

const HyperTreeNode = React.forwardRef(({
  node,
  depth,
  depthGap = defaultProps.depthGap,
  displayedName = defaultProps.displayedName,
  staticNodeHeight,
  verticalLineOffset = defaultProps.verticalLineOffset,
  horizontalLineStyles,
  setOpen,
  setSelected,
  gapMode = defaultProps.gapMode,
  renderNode,
}: HyperTreeNode, ref: React.Ref<HTMLDivElement>) => {
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
      })}
      style={{ [offsetProp]: getDepthPx(depth, depthGap), ...additionStyles }}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {renderNode
        ? renderNode({
          offsetProp,
          displayedName,
          node,
          onSelect: handleSelected,
          onToggle: handleClick,
          nodeRef: ref,
          depth,
          depthGap,
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
          horizontalLineStyles={horizontalLineStyles}
          verticalLineOffset={verticalLineOffset}
          gapMode={gapMode}
          depthGap={depthGap}
          depth={depth}
        />
      )}
    </div>
  )
})

const HyperTreeViewChild = ({
  node,
  depth,
  depthGap = defaultProps.depthGap,
  verticalLineOffset,
  verticalLineStyles,
  nodeHeight,
  ...props
}: HyperTreeNode) => {
  if (!node.hasChildren()) {
    return null
  }
  return (
    <div
      className={classnames({ [styles.child]: true, [styles.collapsed]: !node.options.opened })}
    >
      <HyperTreeView
        data={node.getChildren()}
        depth={depth + 1}
        depthGap={depthGap}
        verticalLineOffset={verticalLineOffset}
        verticalLineStyles={verticalLineStyles}
        nodeHeight={nodeHeight}
        {...props}
      />
      <VerticalLine
        depth={depth}
        depthGap={depthGap}
        nodeHeight={nodeHeight}
        verticalLineOffset={verticalLineOffset}
        verticalLineStyles={verticalLineStyles}
        count={node.options.currentChilrenCount}
      />
    </div>
  )
}

const HyperTreeView = React.forwardRef(
  ({ data, depth = 0, ...props }: HyperTreeViewProps, ref: React.Ref<HTMLDivElement>) => (
    <div className={styles.hyperTreeView}>
      {data.map((currentNode: any) => (
        <div className={styles.hyperTreeNodeWrapper} key={currentNode.id}>
          <HyperTreeNode node={currentNode} depth={depth} ref={ref} {...props} />
          <HyperTreeViewChild node={currentNode} depth={depth} {...props} />
        </div>
      ))}
    </div>
  ),
)

const Tree: React.FC<HyperTreeViewMainProps> = ({ staticNodeHeight, ...props }) => {
  const nodeRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number>(staticNodeHeight || 0)

  React.useEffect(() => {
    if (nodeRef.current && !height && !staticNodeHeight) {
      setHeight(nodeRef.current.clientHeight)
    }
  }, [height, staticNodeHeight])

  return (
    <div>
      <HyperTreeView
        depth={0}
        ref={nodeRef}
        staticNodeHeight={staticNodeHeight}
        nodeHeight={height}
        {...props}
      />
    </div>
  )
}

export default Tree
