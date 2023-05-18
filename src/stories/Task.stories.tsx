import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Task from 'features/todolistsList/tasks/task/Task'
import { ReduxStoreProviderDecorator } from 'app/ReduxStoreProviderDecorator'
import { TaskPriorities, TaskStatuses } from 'common/enums/enums'

export default {
    title: 'TODOLIST/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator],
    args: {
        todolistId: 'fdsgnddfsf',
        task: {
            id: 'afghj',
            title: 'JS',
            status: TaskStatuses.Completed,
            todoListId: 'todolistId1',
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
        },
    },
} as ComponentMeta<typeof Task>

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />

export const TaskIsDoneExample = Template.bind({})

export const TaskNotDoneExample = Template.bind({})
TaskNotDoneExample.args = {
    task: {
        id: 'afghj',
        title: 'JS',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
    },
}
