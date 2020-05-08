import { ClassesType } from '../types'
import { TreeNode } from './node'

export const defaultProps = {
  childrenKey: 'children',
  classes: {} as ClassesType,
  depthGap: 20,
  displayedName: (node: TreeNode) => node.data.name,
  filter: () => true,
  gapMode: 'margin' as const,
  horizontalLineStyles: { stroke: 'black', strokeWidth: 1, strokeDasharray: '1 1' },
  idKey: 'id',
  opened: [],
  verticalLineOffset: 5,
  verticalLineStyles: { stroke: 'black', strokeWidth: 1, strokeDasharray: '1 1' },
  verticalLineTopOffset: 0,
}
