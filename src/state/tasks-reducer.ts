import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string,
    taskId: string
}
type AddTaskActionType = {
    type: 'ADD-TASK'
    newTitle: string
    todolistId: string
}
type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    newStatus: boolean
    todolistId: string
}
type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    updateTitle: string
    taskId: string
    todolistId: string
}

const initialState: TaskStateType = {}
export type TasksActionType = RemoveTaskActionType | AddTaskActionType
                  | ChangeTaskStatusActionType | ChangeTaskTitleActionType
                  | AddTodolistActionType | RemoveTodolistActionType

export const tasksReducer = (state = initialState, action: TasksActionType): TaskStateType => {
    switch(action.type){
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.todolistId]: [{id: v1(), title: action.newTitle, isDone: false}, ...state[action.todolistId]]}
        case 'CHANGE-TASK-STATUS':
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
                    ? {...t, isDone: action.newStatus} : t)}
        case 'CHANGE-TASK-TITLE':
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
                    ? {...t, title: action.updateTitle} : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.todolistId]: []}
        case 'REMOVE-TODOLIST':
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
export const addTaskAC = (newTitle: string, todolistId: string): AddTaskActionType => {
    return { type: 'ADD-TASK', newTitle, todolistId} as const
}
export const changeTaskStatusAC = (taskId: string, newStatus: boolean, todolistId: string): ChangeTaskStatusActionType => {
    return { type: 'CHANGE-TASK-STATUS', taskId, newStatus, todolistId} as const
}
export const changeTaskTitleAC = (updateTitle: string, taskId: string, todolistId: string): ChangeTaskTitleActionType => {
    return { type: 'CHANGE-TASK-TITLE', updateTitle, taskId, todolistId } as const
}