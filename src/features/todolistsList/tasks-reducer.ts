import {
    RESULT_CODE,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistAPI,
    UpdateTaskModelType
} from "api/todolist-api"
import {Dispatch} from "redux"
import {AppRootStateType} from "app/store"
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import {setStatus} from "app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolist, clearTodosData, removeTodolist, setTodolists} from "features/todolistsList/todolists-reducer";

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TaskStateType,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string, todoId: string }>) => {
            const tasks = state[action.payload.todoId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTask: (state, action: PayloadAction<{ taskId: string, domainModel: UpdateDomainTaskModelType, todoId: string }>) => {
            const tasks = state[action.payload.todoId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
            }
        },
        setTask: (state, action: PayloadAction<{ tasks: TaskType[], todoId: string }>) => {
            state[action.payload.todoId] = action.payload.tasks
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl: any) => {
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

export const {removeTask, addTask, updateTask, setTask} = slice.actions

//thunks
export const getTaskTC = (todoId: string) => (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.getTasks(todoId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTask({tasks, todoId}))
            dispatch(setStatus({status: "succeeded"}))
        })
}
export const addTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.createTask(todoId, title)
        .then((res) => {
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                const task = res.data.data.item
                dispatch(addTask({task}))
                dispatch(setStatus({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((e: AxiosError<{message: string}>) => {
        handleServerNetworkError(e, dispatch)
    })
}
export const removeTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    todolistAPI.deleteTask(todoId, taskId)
        .then((res) => {
            dispatch(removeTask({taskId, todoId}))
            dispatch(setStatus({status: "succeeded"}))
        })
}
export const updateTaskTC = (todoId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {

        dispatch(setStatus({status: "loading"}))

        const tasks = getState().tasks
        const task = tasks[todoId].find(t => t.id === taskId)

        if (task) {
            const apiModel: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...domainModel
            }
            todolistAPI.updateTask(todoId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                        dispatch(updateTask({taskId, domainModel, todoId}))
                        dispatch(setStatus({status: "succeeded"}))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }

                }).catch((e: AxiosError<{ message: string }>) => {
                handleServerNetworkError(e, dispatch)
            })
        }
    }

