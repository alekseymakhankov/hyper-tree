import { TreeNode } from './helpers/node'

export type ClassesType = {
  childrenClassName?: string;
  collapsedChildrenClassName?: string;
  levelClassName?: string;
  nodeWrapperClassName?: string;
  parentChildrenClassName?: string;
  selectedNodeWrapperClassName?: string;
  treeWrapperClassName?: string;
}

export interface HyperTreeViewMainProps {
  classes?: ClassesType;
  data: TreeNode[];
  depth?: number;
  depthGap?: number;
  disableHorizontalLines?: boolean;
  disableLines?: boolean;
  disableVerticalLines?: boolean;
  displayedName?: string | ((node: any) => string);
  gapMode?: 'margin' | 'padding';
  horizontalLineStyles?: React.CSSProperties;
  renderNode?: (props: DefaultNodeProps) => React.ReactNode;
  setOpen?: (node: any) => void;
  setSelected?: (node: any, selected?: boolean) => void;
  staticNodeHeight?: number;
  verticalLineOffset?: number;
  verticalLineStyles?: React.CSSProperties;
}

export interface HyperTreeViewCommonProps {
  classes?: ClassesType;
  depth: number;
  depthGap?: number;
  disableHorizontalLines?: boolean;
  disableLines?: boolean;
  disableVerticalLines?: boolean;
  displayedName?: string | ((node: any) => string);
  gapMode?: 'margin' | 'padding';
  horizontalLineStyles?: React.CSSProperties;
  nodeHeight: number;
  ref?: React.Ref<HTMLDivElement>;
  renderNode?: (props: DefaultNodeProps) => React.ReactNode;
  setOpen?: (node: any) => void;
  setSelected?: (node: any, selected?: boolean) => void;
  staticNodeHeight?: number;
  verticalLineOffset?: number;
  verticalLineStyles?: React.CSSProperties;
}

export interface HyperTreeViewProps extends HyperTreeViewCommonProps {
  data: TreeNode[];
}

export interface HyperTreeNodeProps extends HyperTreeViewCommonProps {
  node: TreeNode;
}

export type DefaultNodeProps = {
  depth?: number;
  depthGap?: number;
  displayedName?: string | ((node: any) => string);
  node: TreeNode;
  nodeRef?: React.Ref<HTMLDivElement>;
  offsetProp?: string;
  onSelect: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
  onToggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
