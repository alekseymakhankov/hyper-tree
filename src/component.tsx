import * as React from 'react'
import { isFunction } from './helpers/typeCheckers'
import { classnames } from './helpers/classnames'
import { defaultProps } from './helpers/defaultProps'
import { TreeNode } from './helpers/node'

import './style.scss'

interface HyperTextTreeViewCommonProps {
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
}

interface HyperTextTreeViewProps extends HyperTextTreeViewCommonProps {
  data: TreeNode[];
}

interface HyperTreeNode extends HyperTextTreeViewCommonProps {
  node: TreeNode;
}

interface RenderVerticalLine {
  depth: number;
  depthGap: number;
  count: number;
  nodeHeight: number;
  verticalLineOffset?: number;
  verticalLineStyles?: React.CSSProperties;
}

interface RenderHorizontalLine {
  depth: number;
  depthGap: number;
  verticalLineOffset?: number;
  horizontalLineStyles?: React.CSSProperties;
  gapMode?: 'margin' | 'padding';
}

const getDepthPx = (depth: number, depthGap: number) => `${depth * depthGap}px`


const renderVerticalLine = ({
  depth,
  depthGap,
  count,
  nodeHeight,
  verticalLineOffset = defaultProps.verticalLineOffset,
  verticalLineStyles = defaultProps.verticalLineStyles,
}: RenderVerticalLine) => (
  <div
    className="vertical-line"
    style={{ marginLeft: getDepthPx(depth, depthGap), left: `${verticalLineOffset}px` }}
  >
    <svg
      style={
        {
          height: `${Math.floor(count * nodeHeight - (nodeHeight ? nodeHeight / 2 : 0))}px`,
          width: `${verticalLineStyles.strokeWidth}px`,
          position: 'absolute',
          transition: 'all 0.2s cubic-bezier(0, 1, 0, 1)',
        }
      }
    >
      <line
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
        className="vertical-svg-line"
        style={verticalLineStyles}
      />
    </svg>
  </div>
)

const renderHorizontalLine = ({
  depth,
  depthGap,
  verticalLineOffset = defaultProps.verticalLineOffset,
  horizontalLineStyles = defaultProps.horizontalLineStyles,
  gapMode,
}: RenderHorizontalLine) => (
  <div
    className="horizontal-line"
    style={{
      width: `${depthGap - verticalLineOffset}px`,
      left: gapMode === 'padding'
        ? `${verticalLineOffset - depthGap + depth * depthGap}px`
        : `${verticalLineOffset - depthGap}px`,
    }}
  >
    <svg
      style={{
        height: `${horizontalLineStyles.strokeWidth}px`,
        width: '100%',
      }}
    >
      <line
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
        style={horizontalLineStyles}
      />
    </svg>
  </div>
)

const renderLoader = () => (
  <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 48 48">
    <g fill="none">
      <path
        id="track"
        fill="#C6CCD2"
        d="M24,48 C10.745166,48 0,37.254834 0,24 C0,10.745166 10.745166,0 24,0
        C37.254834,0 48,10.745166 48,24 C48,37.254834 37.254834,48 24,48 Z M24,44
        C35.045695,44 44,35.045695 44,24 C44,12.954305 35.045695,4 24,4
        C12.954305,4 4,12.954305 4,24 C4,35.045695 12.954305,44 24,44 Z"
      />
      <path
        id="section"
        fill="#3F4850"
        d="M24,0 C37.254834,0 48,10.745166 48,24 L44,24 C44,12.954305 35.045695,4 24,4 L24,0 Z"
      />
    </g>
  </svg>
)

const renderArrow = (onClick: (e: React.MouseEvent<HTMLOrSVGElement>) => void) => (
  <svg
    className="hyper-node-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 24 24"
    onClick={onClick}
  >
    <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
  </svg>
)

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
      className={
        classnames({
          'hyper-node': true,
          opened: node.options.opened && !!node.hasChildren(),
          selected: node.isSelected(),
        })
      }
      style={{ [offsetProp]: getDepthPx(depth, depthGap), ...additionStyles }}
      ref={ref as React.Ref<HTMLDivElement>}
      onClick={handleSelected}
    >
      {(node.hasChildren() || node.options.async) && !node.isLoading() && renderArrow(handleClick)}
      {node.isLoading() && renderLoader()}
      <div>{isFunction(displayedName) ? (displayedName as any)(node) : node.data[displayedName as any]}</div>
      {!node.options.root && renderHorizontalLine({
        horizontalLineStyles,
        depthGap,
        verticalLineOffset,
        gapMode,
        depth,
      })}
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
      className={classnames({ child: true, collapsed: !node.options.opened })}
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
      {renderVerticalLine({
        depth,
        depthGap,
        nodeHeight,
        verticalLineOffset,
        verticalLineStyles,
        count: node.options.currentChilrenCount,
      })}
    </div>
  )
}

const HyperTreeView = React.forwardRef(
  ({ data, depth = 0, ...props }: HyperTextTreeViewProps, ref: React.Ref<HTMLDivElement>) => (
    <div className="hyper-tree-view">
      {data.map((currentNode: any) => (
        <div className="hyper-tree-node-wrapper" key={currentNode.id}>
          <HyperTreeNode node={currentNode} depth={depth} ref={ref} {...props} />
          <HyperTreeViewChild node={currentNode} depth={depth} {...props} />
        </div>
      ))}
    </div>
  ),
)

const Tree = ({ staticNodeHeight, ...props }: any) => {
  const nodeRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number>(staticNodeHeight || 0)

  React.useEffect(() => {
    if (nodeRef.current && !height && !staticNodeHeight) {
      setHeight(nodeRef.current.clientHeight)
    }
  }, [height, staticNodeHeight])

  return (
    <div>
      <HyperTreeView ref={nodeRef} staticNodeHeight={staticNodeHeight} nodeHeight={height} {...props} />
    </div>
  )
}

export default Tree
