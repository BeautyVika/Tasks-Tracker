import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Task from "../Task";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";

export default {
  title: 'TODOLIST/Task',
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
  args: {
    todolistId: 'fdsgnddfsf',
    task: {id: 'afghj', title: 'JS', isDone: true}
  }
} as ComponentMeta<typeof Task>;


const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />

export const TaskIsDoneExample = Template.bind({})

export const TaskNotDoneExample = Template.bind({})
TaskNotDoneExample.args = {
  task: {id: 'afghj', title: 'JS', isDone: false}
}
