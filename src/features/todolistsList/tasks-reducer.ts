import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType,
} from "./todolists-reducer";
import {
    RESULT_CODE,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistAPI,
    UpdateTaskModelType
} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {SetErrorActionType, setStatusAC, SetStatusActionType} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
                    ? {...t, ...action.model} : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach((el) => {
                copyState[el.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

//actions
export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const setTaskAC = (tasks: TaskType[], todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', taskId, model, todolistId} as const)

//thunks
export const getTaskTC = (todoId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.getTasks(todoId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTaskAC(tasks, todoId))
            dispatch(setStatusAC('succeeded'))
        })
}
export const addTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.createTask(todoId, title)
        .then((res) => {
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                const task = res.data.data.item
                dispatch(addTaskAC(task))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError<{ item: TaskType }>(res.data, dispatch)
            }
        }).catch((e: AxiosError<{message: string}>) => {
        const error = e.response ? e.response.data.message : e.message
        handleServerNetworkError(error, dispatch)
    })
}
export const removeTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.deleteTask(todoId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todoId))
            dispatch(setStatusAC('succeeded'))
        })
}
export const updateTaskTC = (todoId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {

        dispatch(setStatusAC('loading'))

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
                        dispatch(updateTaskAC(taskId, domainModel, todoId))
                        dispatch(setStatusAC('succeeded'))
                    } else {
                        handleServerAppError<{ item: TaskType }>(res.data, dispatch)
                    }

                }).catch((e: AxiosError<{ message: string }>) => {
                const error = e.response ? e.response.data.message : e.message
                handleServerNetworkError(error, dispatch)
            })
        }
    }

//types
export type TasksActionType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTaskAC>
    | ReturnType<typeof updateTaskAC>
    | SetStatusActionType
    | SetErrorActionType

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

