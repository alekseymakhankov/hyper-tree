import * as React from 'react'
import { defaultProps } from '../../helpers/defaultProps'
import styles from './style.scss'

interface RenderHorizontalLine {
  depth: number;
  depthGap: number;
  verticalLineOffset?: number;
  horizontalLineStyles?: React.CSSProperties;
  gapMode?: 'margin' | 'padding';
}

export const HorizontalLine = ({
  depth,
  depthGap,
  verticalLineOffset = defaultProps.verticalLineOffset,
  horizontalLineStyles = defaultProps.horizontalLineStyles,
  gapMode,
}: RenderHorizontalLine) => (
  <div
    className={styles.horizontalLine}
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
