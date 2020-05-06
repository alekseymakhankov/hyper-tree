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
  verticalLineTopOffset?: number;
}

export const VerticalLine = ({
  depth,
  depthGap,
  count,
  nodeHeight,
  verticalLineOffset = defaultProps.verticalLineOffset,
  verticalLineStyles = defaultProps.verticalLineStyles,
  verticalLineTopOffset = defaultProps.verticalLineTopOffset,
}: RenderVerticalLine) => (
  <div
    className={styles.verticalLine}
    style={
      {
        left: `${verticalLineOffset}px`,
        marginLeft: getDepthPx(depth, depthGap),
        top: `${verticalLineTopOffset}px`,
      }
    }
  >
    <svg
      style={
        {
          height: `${Math.floor(count * nodeHeight - (nodeHeight ? nodeHeight / 2 : 0)) - verticalLineTopOffset}px`,
          width: `${verticalLineStyles.strokeWidth}px`,
          position: 'absolute',
          transition: 'all 0.2s ease',
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
