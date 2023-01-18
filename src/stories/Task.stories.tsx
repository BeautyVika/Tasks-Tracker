import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Task from "../Task";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

export default {
  title: 'TODOLIST/Task',
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
  args: {
    todolistId: 'fdsgnddfsf',
    task: {id: 'afghj', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1',
      description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
  }
} as ComponentMeta<typeof Task>;


const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />

export const TaskIsDoneExample = Template.bind({})

export const TaskNotDoneExample = Template.bind({})
TaskNotDoneExample.args = {
  task: {id: 'afghj', title: 'JS', status: TaskStatuses.New, todoListId: 'todolistId1',
    description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
}