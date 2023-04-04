import {RESULT_CODE, todolistAPI, TodolistType} from "api/todolist-api"
import {Dispatch} from "redux"
import {RequestStatusType, setStatus} from "app/app-reducer"
import {AxiosError} from "axios"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getTaskTC} from "features/todolistsList/tasks-reducer";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const slice = createSlice({
    name: 'todo',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{id: string}>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{todolist: TodolistType}>) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        changeTodolistTitle: (state, action: PayloadAction<{id: string, title: string}>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{id: string, filter: FilterValuesType}>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].filter= action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{id: string, entityStatus: RequestStatusType}>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].entityStatus= action.payload.entityStatus
        },
        setTodolists: (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        clearTodosData: (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
            return action.payload.todolists = []
        }
    }
})

export const todolistsReducer = slice.reducer
export const {removeTodolist, addTodolist, changeTodolistTitle,
    changeTodolistFilter, changeTodolistEntityStatus, setTodolists, clearTodosData} = slice.actions

// thunks
export const getTodoTC = () => (dispatch: any) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolists({todolists: res.data}))
            dispatch(setStatus({status: "succeeded"}))
            return res.data
        })
        .then((todos )=> {
            todos.forEach((tl) => {
                dispatch(getTaskTC(tl.id))
            })
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
                dispatch(addTodolist({todolist: res.data.data.item}))
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
    dispatch(changeTodolistEntityStatus({id: todoId, entityStatus: "loading"}))
    todolistAPI.deleteTodolist(todoId)
        .then((res) => {
            dispatch(removeTodolist({id: todoId}))
            dispatch(setStatus({status: "succeeded"}))
        })
        .catch((e: AxiosError<{message: string}>) => {
            dispatch(changeTodolistEntityStatus({id: todoId, entityStatus: "idle"}))
            handleServerNetworkError(e, dispatch)
        })
}
export const changeTodolistTitleTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.updateTodolist(todoId, title)
        .then((res) => {
            dispatch(changeTodolistTitle({id: todoId, title}))
            dispatch(setStatus({status: "succeeded"}))
        })
        .catch((e: AxiosError<{message: string}>) => {
            handleServerNetworkError(e, dispatch)
        })
}
