import {todolistAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    todolist: TodolistType
}
type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}
export type SetTodolistsActionType = {     //ReturnType <typeof setTodolistsAC>
    type: 'SET-TODOLISTS'
    todolists: TodolistType[]
}
export type FilterValuesType = 'all' | 'active' | 'completed'

const initialState: Array<TodolistDomainType> = []

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export type TodolistsActionType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType

export const todolistsReducer = (state = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch(action.type){
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all'}, ...state]
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

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitleAC = (todolistId: string, title: string): ChangeTodolistTitleActionType =>{
    return {type: 'CHANGE-TODOLIST-TITLE', id: todolistId, title: title}as const
}
export const changeTodolistFilterAC =(todolistId: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: todolistId, filter: filter}as const
}
export const setTodolistsAC = (todolists: TodolistType[]): SetTodolistsActionType => {
    return {type: 'SET-TODOLISTS', todolists }as const
}
export const getTodoTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}
export const deleteTodolistTC = (todoId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTodolist(todoId)
        .then((res) => {
            dispatch(removeTodolistAC(todoId))
        })
}
export const changeTodolistTitleTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.updateTodolist(todoId, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todoId,title))
        })
}