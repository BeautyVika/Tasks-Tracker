import {RESULT_CODE, todolistAPI, TodolistType} from "api/todolist-api"
import {Dispatch} from "redux"
import {RequestStatusType, setStatus} from "app/app-reducer"
import {AxiosError} from "axios"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch(action.type){
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [ ...state, {...action.todolist, filter: 'all', entityStatus: 'idle'}]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        case 'SET-TODOLISTS':
            return action.todolists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus} : tl)
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
export const changeTodolistEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', todolistId, entityStatus}as const)

// thunks
export const getTodoTC = () => (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setStatus({status: "succeeded"}))
        })
        .catch((e: AxiosError<{message: string}>) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setStatus({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e: AxiosError<{ message: string }>) => {
        handleServerNetworkError(e, dispatch)
    })
}
export const deleteTodolistTC = (todoId: string) => (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC(todoId, 'loading'))
    todolistAPI.deleteTodolist(todoId)
        .then((res) => {
            dispatch(removeTodolistAC(todoId))
            dispatch(setStatus({status: "succeeded"}))
        })
        .catch((e: AxiosError<{message: string}>) => {
            dispatch(changeTodolistEntityStatusAC(todoId, 'idle'))
            handleServerNetworkError(e, dispatch)
        })
}
export const changeTodolistTitleTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.updateTodolist(todoId, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todoId, title))
            dispatch(setStatus({status: "succeeded"}))
        })
        .catch((e: AxiosError<{message: string}>) => {
            handleServerNetworkError(e, dispatch)
        })
}

//types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType <typeof setTodolistsAC>

export type TodolistsActionType = RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>

