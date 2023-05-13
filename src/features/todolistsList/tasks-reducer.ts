import {
    AddTaskArgType, RemoveTaskArgType,
    RESULT_CODE,
    TaskType,
    todolistAPI, UpdateTaskArgType,
    UpdateTaskModelType
} from "common/api/todolist-api"
import {setError, setStatus} from "app/app-reducer";
import {createSlice} from "@reduxjs/toolkit";
import {
    clearTodosData,
    todosThunks
} from "features/todolistsList/todolists-reducer";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleServerAppError, handleServerNetworkError} from "common/utils";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

const fetchTasks = createAppAsyncThunk<{tasks:TaskType[], todoId: string}, string>('tasks/getTasks',
    async (todoId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try{
            dispatch(setStatus({status: "loading"}))
            const res = await todolistAPI.getTasks(todoId)
            const tasks = res.data.items
            dispatch(setStatus({status: "succeeded"}))
            return {tasks, todoId}
        }catch(e: any) {
            handleServerNetworkError(e, dispatch)
           return rejectWithValue(null)
        }
    })

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>('tasks/addTask',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try{
            dispatch(setStatus({status: "loading"}))
            const res = await todolistAPI.createTask(arg)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                const task = res.data.data.item
                dispatch(setStatus({status: "succeeded"}))
                return {task}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }catch(e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
})
const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/updateTask',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI
        try {
            dispatch(setStatus({status: "loading"}))
            const tasks = getState().tasks
            const task = tasks[arg.todoId].find(t => t.id === arg.taskId)
            if(!task){
                dispatch(setError({error: 'Task not found'}))
                return rejectWithValue(null)
            }
            const apiModel: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...arg.domainModel
            }
            const res = await todolistAPI.updateTask(arg.todoId, arg.taskId, apiModel)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                dispatch(setStatus({status: "succeeded"}))
                return arg
            }else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        }catch(e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
})
const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>('tasks/removeTask',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try{
            dispatch(setStatus({status: "loading"}))
            const res = await todolistAPI.deleteTask(arg.todoId, arg.taskId)
            dispatch(setStatus({status: "succeeded"}))
            return arg
        }catch(e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled,(state, action) => {
                state[action.payload.todoId] = action.payload.tasks
            } )
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoId]
                const index = tasks.findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoId]
                const index = tasks.findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(todosThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todosThunks.deleteTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTodosData, (state, action) => {
                action.payload.todolists.forEach((tl: any) => {
                    state[tl.id] = []
                })
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksThunks = {fetchTasks, addTask, updateTask, removeTask}


