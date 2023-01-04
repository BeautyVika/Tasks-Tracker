import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'dc8162ea-151f-40b7-8429-784631a92f82'
    }
})

export const todolistAPI = {
    getTodolist() {
        const promise = instance.get<TodolistType[]>('todo-lists')
        return promise
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', title)
        return promise
    },
    deleteTodolist(todolistId: string) {
        const promise = instance.delete<ResponseType>(`todo-lists/${todolistId}`)
        return promise
    },
    updateTodolist(todolistId: string, title: string) {
        const promise = instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
        return promise
    }
}
type ResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: T
}
type TodolistType = {
    id: string
    addedDate: Date
    order: number
    title: string
}
