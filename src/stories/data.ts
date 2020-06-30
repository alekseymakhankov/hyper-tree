const asyncChildren = [
  {
    id: 5,
    name: 'Child 1__1',
    children: [
      {
        id: 15,
        name: 'Child 1__1__0',
      },
      {
        id: 8,
        name: 'Child 1__1__1',
        children: [
          {
            id: 9,
            name: 'Child 1__1__1__1',
          },
          {
            id: 10,
            name: 'Child 1__1__1__2',
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Child 1__2',
  },
  {
    id: 7,
    name: 'Child 1__3',
  },
]

const getChildren = () => new Promise((resolve) => setTimeout(() => resolve(asyncChildren), 1000))

const getChildren1 = () => [
  {
    id: 4,
    name: 'Child 2__1',
  },
]


export const smallData = {
  id: 1,
  name: 'Parent 1',
  children: [
    {
      id: 2,
      name: 'Child 1',
      getChildren,
    },
    {
      id: 3,
      name: 'Child 2',
      getChildren: getChildren1,
    },
  ],
}
