import {RESULT_CODE, todolistAPI, TodolistType, UpdateTodolistTitleArgType} from "common/api/todolist-api"
import {RequestStatusType, setStatus} from "app/app-reducer"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[]}, void>('todo/fetchTodo',
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(setStatus({status: "loading"}))
            const res = await todolistAPI.getTodolist()
            dispatch(setStatus({status: "succeeded"}))
            const todolists = res.data
            return {todolists}
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
const addTodolist = createAppAsyncThunk<{todolist: TodolistType}, string>('todo/addTodolist',
    async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try{
            dispatch(setStatus({status: "loading"}))
            const res = await todolistAPI.createTodolist(title)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                dispatch(setStatus({status: "succeeded"}))
                const todolist = res.data.data.item
                return {todolist}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
const deleteTodolist = createAppAsyncThunk<{id: string}, string> ('todo/deleteTodolist',
    async (id,thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try{
            dispatch(setStatus({status: "loading"}))
            dispatch(changeTodolistEntityStatus({id, entityStatus: "loading"}))
            const res = await todolistAPI.deleteTodolist(id)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                dispatch(setStatus({status: "succeeded"}))
                return {id}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
})
const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>('todo/changeTodolistTitle',
    async (arg, thunkAPI ) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try{
            dispatch(setStatus({status: "loading"}))
            const res = await todolistAPI.updateTodolist(arg)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                dispatch(setStatus({status: "succeeded"}))
                return arg
            }else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
})
const slice = createSlice({
    name: 'todo',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{id: string, filter: FilterValuesType}>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].filter= action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{id: string, entityStatus: RequestStatusType}>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].entityStatus= action.payload.entityStatus
        },
        clearTodosData: (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
            return action.payload.todolists = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
            })
            .addCase(deleteTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todoId)
                state[index].title = action.payload.title
            })
    }
})

export const todolistsReducer = slice.reducer
export const {changeTodolistFilter, changeTodolistEntityStatus, clearTodosData} = slice.actions
export const todosThunks = {fetchTodos, addTodolist, deleteTodolist, changeTodolistTitle}
