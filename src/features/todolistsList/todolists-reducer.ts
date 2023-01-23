import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {setStatusAC, SetStatusActionType} from "../../app/app-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch(action.type){
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [ ...state, {...action.todolist, filter: 'all'}]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        case 'SET-TODOLISTS':
            return action.todolists.map(t => ({...t, filter: 'all'}))
        default:
            return state
    }
}

//actions
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id: todolistId, title: title} as const)
export const changeTodolistFilterAC =(todolistId: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id: todolistId, filter: filter} as const)
export const setTodolistsAC = (todolists: TodolistType[]) => ({type: 'SET-TODOLISTS', todolists} as const)

// thunks
export const getTodoTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setStatusAC('loading'))
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setStatusAC('succeeded'))
        })
}
export const deleteTodolistTC = (todoId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.deleteTodolist(todoId)
        .then((res) => {
            dispatch(removeTodolistAC(todoId))
            dispatch(setStatusAC('succeeded'))
        })
}
export const changeTodolistTitleTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.updateTodolist(todoId, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todoId, title))
            dispatch(setStatusAC('succeeded'))
        })
}

//types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType <typeof setTodolistsAC>

export type TodolistsActionType = RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | SetStatusActionType
