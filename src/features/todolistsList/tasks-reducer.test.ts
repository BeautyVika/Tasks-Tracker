import {
    addTask,
    removeTask, setTask,
    tasksReducer, TaskStateType,
    UpdateDomainTaskModelType, updateTask,
} from './tasks-reducer'
import {TaskPriorities, TaskStatuses} from "api/todolist-api"

let startState: TaskStateType
let model: UpdateDomainTaskModelType

beforeEach(() => {
     startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},

            {id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},

            {id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId1',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatuses.New, todoListId: 'todolistId2',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},

            {id: '2', title: 'milk', status: TaskStatuses.Completed, todoListId: 'todolistId2',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},

            {id: '3', title: 'tea', status: TaskStatuses.New, todoListId: 'todolistId2',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTask({taskId: '2', todoId: 'todolistId2'})

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},

            {id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},

            {id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId1',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatuses.New, todoListId: 'todolistId2',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},

            {id: '3', title: 'tea', status: TaskStatuses.New, todoListId: 'todolistId2',
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
        ]
    })
})
test('correct task should be added to correct array', () => {

    let newTask = {id: '1', title: 'juce', status: TaskStatuses.New, todoListId: 'todolistId2',
        description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}

    const action = addTask({task: newTask})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('', () =>{
    const action = updateTask({taskId: '1', domainModel: {title: 'Redux', status:TaskStatuses.Completed}, todoId: 'todolistId1'})

    const endState  = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId1'][0].status).toBe(TaskStatuses.Completed)
    expect(endState['todolistId1'][0].title).toBe('Redux')
})
test('task should be added for todolist', () => {
    const action = setTask({tasks: startState['todolistId1'], todoId: 'todolistId1'})
    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': []
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})

