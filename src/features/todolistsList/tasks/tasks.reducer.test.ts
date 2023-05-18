import {
    tasksReducer,
    TasksStateType,
    tasksThunks,
} from 'features/todolistsList/tasks/tasks.reducer'
import { TaskStatuses, TaskPriorities } from 'common/enums/enums'
import { UpdateDomainTaskModelType } from 'features/todolistsList/tasks/tasksApi'

let startState: TasksStateType = {}
let model: UpdateDomainTaskModelType

beforeEach(() => {
    startState = {
        todolistId1: [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },

            {
                id: '2',
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

            {
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
        ],
        todolistId2: [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },

            {
                id: '2',
                title: 'milk',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },

            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
        ],
    }
})

test('correct tasks should be deleted from correct array', () => {
    const args = { taskId: '2', todoId: 'todolistId2' }
    const action = tasksThunks.removeTask.fulfilled(args, 'requestId', args)

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        todolistId1: [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },

            {
                id: '2',
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

            {
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
        ],
        todolistId2: [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },

            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
        ],
    })
})
test('correct tasks should be added to correct array', () => {
    let newTask = {
        id: '1',
        title: 'juce',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
    }

    const action = tasksThunks.addTask.fulfilled(
        { task: newTask },
        'requestId',
        {
            title: 'juce',
            todolistId: 'todolistId2',
        }
    )

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('', () => {
    const args = {
        taskId: '1',
        domainModel: { title: 'Redux', status: TaskStatuses.Completed },
        todoId: 'todolistId1',
    }
    const action = tasksThunks.updateTask.fulfilled(args, 'requestId', args)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId1'][0].status).toBe(TaskStatuses.Completed)
    expect(endState['todolistId1'][0].title).toBe('Redux')
})
test('tasks should be added for todolists', () => {
    const action = tasksThunks.fetchTasks.fulfilled(
        {
            tasks: startState['todolistId1'],
            todoId: 'todolistId1',
        },
        'requestId',
        'todoListId1'
    )
    const endState = tasksReducer(
        {
            todolistId2: [],
            todolistId1: [],
        },
        action
    )

    expect(endState['todolistId1'].length).toBe(0)
    expect(endState['todolistId2'].length).toBe(0)
})
