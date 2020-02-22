# React hyper tree
#### Fully customizable tree view react component

Welcome to the react hyper tree component 😄
I want to introduce you to an awesome react component for displaying tree data structure

![dependecies](https://img.shields.io/badge/dependecies-no%20dependencies-green.svg)
![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)
![min](https://img.shields.io/bundlephobia/min/react-hyper-tree)
![minzip](https://img.shields.io/bundlephobia/minzip/react-hyper-tree)

- [Installation](#installation)
- [Usage](#usage)
- [Properties](#properties)
- [API](#use-tree-state)
  - [useTreeState API](#use-tree-state)
  - [Node API](#node-api)
  - [Global State Manager (GSM)](#global-state-manager)
  - [Async children](#async-children)
  - [Default properties](#default-props)
- [Road map](#road-map)
- [Contributing](#contributing)
- [License](#license)

## Live demo (under development)

### Check also [react-hyper-modal](https://www.npmjs.com/package/react-hyper-modal) library

## <a id="installation"></a>Installation

###### You can use [![npm](https://api.iconify.design/logos:npm.svg?height=14)](https://www.npmjs.com/get-npm) or [![yarn](https://api.iconify.design/logos:yarn.svg?height=14)](https://yarnpkg.com/lang/en/docs/install) package managers

```console
$ npm i --save react-hyper-tree
```
__or__
```console
$ yarn add react-hyper-tree
```

## <a id="usage"></a>Usage

### Simple Usage

```javascript
import React from 'react'
import Tree, { useTreeState } from 'react-hyper-tree'

const data = {
  id: 1,
  name: 'Parent 1',
  children: [
    {
      id: 2,
      name: 'Child 1',
      children: [
        {
          id: 5,
          name: 'Child 1__1',
        },
        {
          id: 6,
          name: 'Child 1__2',
        },
        {
          id: 7,
          name: 'Child 1__3',
        },
      ],
    },
  ],
}

...

const MyTreeComponent = () => {
  const { required, handlers } = useTreeState({
    data,
    id: 'your_tree_id',
  })

  return (
    <Tree
      {...required}
      {...handlers}
    />
  )
}
```

## <a id="properties"></a>Properties

Props | Description
------------ | -------------
classes?| object with elements class names
data | nodes data, provided by *required* prop
depthGap? | children indentation related to parent
disableHorizontalLines? | disable horizontal lines
disableLines? | disable all lines
disableVerticalLines? | disable vertical lines
displayedName? | format node content, if you use default node renderer
gapMode? | indentation mode
horizontalLineStyles? | horizontal line styles, [SVG](https://www.w3schools.com/html/html5_svg.asp) properties
renderNode? | function to render your custom node
setOpen? | open node children, provided by *handlers* prop
setSelected? | select node, provided by *handlers* prop
staticNodeHeight? | set static height of node, otherwise dynamic height will be used
verticalLineOffset? | vertical line offset related to parent
verticalLineStyles? | vertical line styles, [SVG](https://www.w3schools.com/html/html5_svg.asp) properties

## <a id="use-tree-state"></a>useTreeState API

useTreeState React hook includes the state management functionality. It prepares and transforms the data to use all functionality of the Node API.

### useTreeState input

Property | Description
---|---
childrenKey? | set the children key, e.g. 'children'
data | tree-like data
defaultOpened? | if true, all parent will be opened
filter? | function to filter tree nodes
id | tree id, required
idKey? | set the data id key, e.g. 'id'
multipleSelect? | if true, a several nodes can be selected
sort? | function to sort tree nodes

### useTreeState output

Property | Description
---|---
handlers | handlers to manipulate node state. *setOpen*, *setLoading*, *setSelected*, *setChildren*, *setRawChildren*
instance | tree view instance including all tree methods
required | includes enhanced tree structure

Actually TreeView component is a renderer. It hasn't any functionality to manipulate of tree state.

## <a id="node-api"></a>Node API

Method | Description | Typings
---|---|---
getChildren | returns node children or empty array | () => TreeNode[]
getData | returns raw node data | () => any
getFirstChild | returns the first child | () => TreeNode `|` null
getLastChild | returns the last child | () => TreeNode `|` null
hasChildren | returns true if node has atleast one child | () => boolean
isLoading | returns true if node is loading | () => boolean
isOpened | returns true if node is opened | () => boolean
isSelected | returns true if node is selected | () => boolean
setChildren | a simple equivalent of setNodeChildren | (children: TreeNode[]) => void
setData | sets node data | (data?: any) => void
setLoading | set node loading | (loading?: boolean) => void
setNodeChildren | insert node children | (children: TreeNode[], type?: InsertChildType, reset?: boolean) => TreeNode[]
setOpened | set node opened | (opened?: boolean) => void
setParent | set node parent | (parent?: TreeNode) => void
setSelected | set node selected | (selected?: boolean) => void

## <a id="global-state-manager"></a>Global state manager

The main goal to implement the tree view library was a simple usage and global tree manager.

Actually, global state manager (GSM) is represented as *treeHandlers* object. It has all instances of trees in the project.

Every time you use useTreeState hook. It will create a new TreeView instance and add the instance to *treeHandlers* object.

### The GSM structure

The GSM object has the one property *trees*.

```typescript
type Handler = (...args: any[]) => any

interface IHandlers {
  [key: string]: Handler;
}

interface ITreeItem {
  instance: TreeView;
  handlers: IHandlers;
}

interface ITrees {
  [key: string]: ITreeItem;
}

trees: ITrees
```

When you use useTreeState with the tree id, it will add tree instance to GSM. To access to tree instance you should do the next:

```javascript
import { treeHandlers } from 'react-hyper-tree'

treeHandlers.trees[your-tree-id].instance
```

You can use the full tree instance functionality from the GSM.
Also the GSM has the *handlers* property for every tree instance.

Every tree has a default set of methods to manipulate the data

Method | Descriptipn | Typings
---|---|---
rerender | rerender the tree component | (callback? () => void) => void
setLoading | set loading property | (node: TreeNode, loading?: boolean) => void
setOpen | set opened property | (node: TreeNode) => void
setRawChildren | set node children, use it if you have a raw children data | (parent: TreeNode, children: IData[], type?: InsertChildType, reset?: boolean) => void
setRawChildren | set node children, use it if you have an enhanced children data | (parent: TreeNode, children: TreeNode[], type?: InsertChildType, reset?: boolean) => void
setSelected | set selected property | (node: TreeNode, selected?: boolean) => void

To call any method you should do the next:
```javascript
import { treeHandlers } from 'react-hyper-tree'

treeHandlers.trees[your-tree-id].handlers.setOpen(...)
```

### treeHandlers API
Method | Description | Typings
---|---|---
getIds | get trees ids | () => string[]
remove | remove tree from the GSM | (id: string): TreeHandlers
removeHandler | remove handler from the tree | removeHandler(treeId: string, handlerName: string): TreeHandlers
safeUpdate | add or update tree in the GSM | safeUpdate(id: string, tree: TreeView) => TreeHandlers
safeUpdateHandler | add or update tree handler | safeUpdateHandler(treeId: string, handlerName: string, handler: Handler): TreeHandlers

You can also use *treeHandlers* like call chain
```javascript
treeHandlers
  .safeUpdateHandler(id, 'setLoading', setLoading)
  .safeUpdateHandler(id, 'setSelected', setSelected)
  .safeUpdateHandler(id, 'setRawChildren', setRawChildren)
  .safeUpdateHandler(id, 'setChildren', setChildren)
```

## <a id="async-children"></a>Async children
You also can use loadable children. To enable the feature you should provide *getChildren* function to node data

```javascript
const getChildren = ({ node }) => {
  return getChildrenByParentId(node.id)
}

const data = {
    id: 1,
  name: 'Parent 1',
  getChildren,
}
```

*getChildren* function can return Promise and resolve the children data in format like this:
```javascript
const getChildren = () => new Promise((resolve) => setTimeout(() => resolve([
  {
    id: 2,
    name: 'Child',
  },
]), 1000))
```

You can also fire any events like redux-actions in the getChildren function. In this case you can set the children by the *GSM*


## <a id="default-props"></a>Default properties

```typescript
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
}
```

## <a id="road-map"></a> Road map
- Coverage by tests
- Inner improvements and extending functionality
- Documentation improvements

## <a id="contributing"></a>Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## <a id="license"></a>License
[MIT](https://choosealicense.com/licenses/mit/)
