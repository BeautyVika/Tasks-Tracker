import {setError} from "app/app.reducer"
import {createSlice} from "@reduxjs/toolkit"
import {todolistsActions, todosThunks} from "features/todolistsList/todolists/todolists.reducer"
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk"
import {
    AddTaskArgType, RemoveTaskArgType,
    tasksApi,
    TaskType,
    UpdateTaskArgType,
    UpdateTaskModelType
} from "features/todolistsList/tasks/tasksApi"
import {RESULT_CODE} from "common/enums/enums"

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

const fetchTasks = createAppAsyncThunk<{tasks:TaskType[], todoId: string}, string>('tasks/getTasks',
    async (todoId) => {
            const res = await tasksApi.getTasks(todoId)
            const tasks = res.data.items
            return {tasks, todoId}
    })

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>('tasks/addTask',
    async (arg, {rejectWithValue}) => {
            const res = await tasksApi.createTask(arg)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                const task = res.data.data.item
                return {task}
            } else {
                return rejectWithValue({data: res.data, showGlobalError: false})
            }
})
const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/updateTask',
    async (arg, {dispatch, rejectWithValue, getState}) => {

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
            const res = await tasksApi.updateTask(arg.todoId, arg.taskId, apiModel)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                return arg
            }else {
                return rejectWithValue({data: res.data, showGlobalError: true})
            }
})
const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>('tasks/removeTask',
    async (arg, {rejectWithValue}) => {
            const res = await tasksApi.deleteTask(arg.todoId, arg.taskId)
            if(res.data.resultCode === RESULT_CODE.SUCCESS){
                return arg
            }else {
                return rejectWithValue({data: res.data, showGlobalError: true})
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
            .addCase(todolistsActions.clearTodosData, (state, action) => {
                action.payload.todolists.forEach((tl: any) => {
                    state[tl.id] = []
                })
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksThunks = {fetchTasks, addTask, updateTask, removeTask}


