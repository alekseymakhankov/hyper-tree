import { TreeNode } from './node'

export const defaultProps = {
  filter: () => true,
  opened: [],
  displayedName: (node: TreeNode) => node.data.name,
  depthGap: 20,
  verticalLineOffset: 5,
  verticalLineStyles: { stroke: 'black', strokeWidth: 1, strokeDasharray: '1 1' },
  horizontalLineStyles: { stroke: 'black', strokeWidth: 1, strokeDasharray: '1 1' },
  gapMode: 'margin' as const,
}
