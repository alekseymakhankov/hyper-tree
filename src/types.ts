import { TreeNode } from './helpers/node'

export type ClassesType = {
  treeWrapperClassName?: string;
  nodeWrapperClassName?: string;
  selectedNodeWrapperClassName?: string;
  levelClassName?: string;
  parentChildrenClassName?: string;
  childrenClassName?: string;
  collapsedChildrenClassName?: string;
}

export interface HyperTreeViewMainProps {
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
  classes?: ClassesType;
}

export interface HyperTreeViewCommonProps {
  classes?: ClassesType;
  depth: number;
  depthGap?: number;
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
  offsetProp?: string;
  displayedName?: string | ((node: any) => string);
  node: TreeNode;
  onSelect: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
  onToggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  nodeRef?: React.Ref<HTMLDivElement>;
  depth?: number;
  depthGap?: number;
}
