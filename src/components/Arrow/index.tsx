import * as React from 'react'
import { classnames } from '../../helpers/classnames'
import styles from './style.scss'

type ArrowProps = {
  onClick?: (e: React.MouseEvent<HTMLOrSVGElement>) => void;
  opened?: boolean;
}

export const Arrow: React.FC<ArrowProps> = ({ onClick, opened }) => (
  <svg
    className={classnames({ [styles.hyperNodeArrowIcon]: true, [styles.opened]: !!opened })}
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 24 24"
    onClick={onClick}
  >
    <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
  </svg>
)
