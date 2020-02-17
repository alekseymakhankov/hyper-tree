import * as React from 'react'
import { defaultProps } from '../../helpers/defaultProps'
import { getDepthPx } from '../../helpers/getDepthPx'
import styles from './style.scss'

interface RenderVerticalLine {
  depth: number;
  depthGap: number;
  count: number;
  nodeHeight: number;
  verticalLineOffset?: number;
  verticalLineStyles?: React.CSSProperties;
}

export const VerticalLine = ({
  depth,
  depthGap,
  count,
  nodeHeight,
  verticalLineOffset = defaultProps.verticalLineOffset,
  verticalLineStyles = defaultProps.verticalLineStyles,
}: RenderVerticalLine) => (
  <div
    className={styles.verticalLine}
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
        className={styles.verticalSvgLine}
        style={verticalLineStyles}
      />
    </svg>
  </div>
)
