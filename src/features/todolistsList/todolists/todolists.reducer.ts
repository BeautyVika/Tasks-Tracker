import {RequestStatusType} from "app/app.reducer"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {createAppAsyncThunk, handleServerAppError, thunkTryCatch} from "common/utils"
import {RESULT_CODE} from "common/enums/enums"
import {todolistsApi, TodolistType, UpdateTodolistTitleArgType} from "features/todolistsList/todolists/todolistsApi"

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[]}, void>('todo/fetchTodo',
    async (_, thunkAPI) => {
        return thunkTryCatch(thunkAPI, async() => {
            const res = await todolistsApi.getTodolist()
            const todolists = res.data
            return {todolists}
        })
    })
const addTodolist = createAppAsyncThunk<{todolist: TodolistType}, string>('todo/addTodolist',
    async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistsApi.createTodolist(title)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                const todolist = res.data.data.item
                return {todolist}
            } else {
                handleServerAppError(res.data, dispatch, false)
                return rejectWithValue(res.data)
            }
        })
    })
const deleteTodolist = createAppAsyncThunk<{id: string}, string> ('todo/deleteTodolist',
    async (id,thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            dispatch(todolistsActions.changeTodolistEntityStatus({id, entityStatus: "loading"}))
            const res = await todolistsApi.deleteTodolist(id)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                return {id}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        })
})
const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>('todo/changeTodolistTitle',
    async (arg, thunkAPI ) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistsApi.updateTodolist(arg)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                return arg
            }else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        })
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
export const todolistsActions = slice.actions
export const todosThunks = {fetchTodos, addTodolist, deleteTodolist, changeTodolistTitle}
