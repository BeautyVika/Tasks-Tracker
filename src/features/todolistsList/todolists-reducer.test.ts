import {
    FilterValuesType,
    TodolistDomainType, todolistsActions,
    todolistsReducer, todosThunks
} from './todolists-reducer'
import { v1 } from 'uuid'

let startState: Array<TodolistDomainType>
let todolistId1: string
let todolistId2: string

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, todosThunks.deleteTodolist.fulfilled({id: todolistId1}, 'requestId', todolistId1))


    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})
test('correct todolist should be added', () => {

    let todolistId3 = v1()
    let newTodolist = {id: todolistId3, title: 'New Todolist', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'}

    const action = todosThunks.addTodolist.fulfilled({todolist: newTodolist}, 'requestId', 'New Todolist' )

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe('New Todolist')
    expect(endState[2].title).toBe('What to buy')
})
test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist'
    const args = {todoId: todolistId2, title: newTodolistTitle}

    const endState = todolistsReducer(startState, todosThunks.changeTodolistTitle.fulfilled(args, 'requestId', args))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})
test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'completed'

    const endState = todolistsReducer(startState, todolistsActions.changeTodolistFilter({id: todolistId2, filter: newFilter}))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})
test('all todolists should be received', () => {
    const args = {todolists: startState}
    const action = todosThunks.fetchTodos.fulfilled(args, 'requestId')

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(2)
})
