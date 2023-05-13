import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'dc8162ea-151f-40b7-8429-784631a92f82'
    }
})

//api
export const authAPI = {
    login(data: LoginType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
    },
    logOut() {
        return instance.delete<ResponseType>('auth/login')
    },
    me(){
        return instance.get<ResponseType<UserType>>('auth/me')
    }
}
export const todolistAPI = {
    getTodolist() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string){
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(arg: AddTaskArgType){
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title})
    },
    deleteTask(todolistId: string, taskId: string){
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType){
        return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
    // updateTask(arg: UpdateTaskArgType){
    //     return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todoId}/tasks/${arg.taskId}`, {domainModel: arg.domainModel})
    // }
}

//types
export type UserType ={
    id: number,
    email: string,
    login: string
}
export type LoginType ={
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}
export type ResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: T
}
export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: []
}
export enum RESULT_CODE {
    SUCCESS = 0,
    ERROR = 1,
    CAPTCHA = 10
}
export type AddTaskArgType = {
    todolistId: string,
    title: string
}
export type RemoveTaskArgType = {
    todoId: string
    taskId: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type UpdateTaskArgType = {
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todoId: string
}
