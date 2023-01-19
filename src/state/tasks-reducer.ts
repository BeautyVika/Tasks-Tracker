import {TaskStateType} from "../App";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string,
    taskId: string
}
type AddTaskActionType = {
    type: 'ADD-TASK'
    task: TaskType
}
type SetTaskActionType = {
    type: 'SET-TASKS'
    tasks: TaskType[]
    todolistId: string
}
type UpdateTaskActionType = {
    type: 'UPDATE-TASK'
    taskId: string
    todolistId: string
    model: UpdateDomainTaskModelType
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

const initialState: TaskStateType = {}
export type TasksActionType = RemoveTaskActionType | AddTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTaskActionType
    | UpdateTaskActionType

export const tasksReducer = (state = initialState, action: TasksActionType): TaskStateType => {
    switch(action.type){
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
                    ? {...t, ...action.model} : t)
            }
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
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
            return {...state, [action.todolistId] : action.tasks}
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return { type: 'ADD-TASK', task} as const
}
export const setTaskAC = (tasks: TaskType[], todolistId: string): SetTaskActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}as const
}
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string): UpdateTaskActionType => {
    return { type: 'UPDATE-TASK', taskId, model, todolistId} as const
}


export const getTaskTC = (todoId: string) => (dispatch: Dispatch) => {
    todolistAPI.getTasks(todoId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTaskAC(tasks,todoId))
        })
}
export const addTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTask(todoId, title)
        .then((res) => {
            const task = res.data.data.item
            dispatch(addTaskAC(task))
        })
}
export const removeTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(todoId, taskId)
        .then((res)=> {
            dispatch(removeTaskAC(taskId,todoId))
        })
}
export const updateTaskTC = (todoId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {

    const tasks = getState().tasks
    const task = tasks[todoId].find(t => t.id === taskId)

    if(task) {
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
                dispatch(updateTaskAC(taskId, domainModel, todoId))
            })
    }
}
