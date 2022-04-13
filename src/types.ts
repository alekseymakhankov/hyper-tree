import { TreeNode } from './helpers/node'

export type ClassesType = {
    children?: string
    collapsedChildren?: string
    level?: string
    nodeWrapper?: string
    parentChildren?: string
    selectedNodeWrapper?: string
    treeWrapper?: string
}

export type DefaultNodeProps = {
    depth?: number
    depthGap?: number
    displayedName?: string | ((node: any) => string)
    node: TreeNode
    nodeRef?: React.Ref<HTMLDivElement>
    offsetProp?: string
    onSelect: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    onToggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export type DragZoneProps = {
    depth: number
    depthGap: number
    isDragging?: boolean
    node: TreeNode
    onDragEnterAfter: (e: React.DragEvent) => void
    onDragEnterBefore: (e: React.DragEvent) => void
    onDragEnterChildren: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
}

export interface HyperTreeViewMainProps {
    classes?: ClassesType
    data: TreeNode[]
    depth?: number
    depthGap?: number
    disableHorizontalLines?: boolean
    disableLines?: boolean
    disableVerticalLines?: boolean
    disableTransitions?: boolean
    displayedName?: string | ((node: any) => string)
    draggable?: boolean
    draggableHandlers: any
    gapMode?: 'margin' | 'padding'
    horizontalLineStyles?: React.CSSProperties
    renderDragZone?: (props: DragZoneProps) => React.ReactNode | string | null
    renderNode?: (props: DefaultNodeProps) => React.ReactNode | string | null
    setOpen?: (node: any) => void
    setSelected?: (node: any, selected?: boolean) => void
    staticNodeHeight?: number
    verticalLineOffset?: number
    verticalLineStyles?: React.CSSProperties
    verticalLineTopOffset?: number
}

export interface HyperTreeViewPrivateProps extends HyperTreeViewMainProps {
    depth: number
    isDragging?: boolean
    nodeHeight: number
    ref?: React.Ref<HTMLDivElement>
}

export interface HyperTreeViewProps extends HyperTreeViewPrivateProps {
    data: TreeNode[]
}

export interface HyperTreeNodeProps extends Omit<HyperTreeViewPrivateProps, 'data'> {
    node: TreeNode
}
