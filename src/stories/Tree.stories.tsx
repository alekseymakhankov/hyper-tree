import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Tree } from './Tree'

export default {
    title: 'Tree',
    component: Tree
} as ComponentMeta<typeof Tree>

const Template: ComponentStory<typeof Tree> = () => <Tree />

export const Primary = Template.bind({})
