import {instance} from "common/api/commonApi"
import {ResponseType} from "common/types/common.types"

export const todolistsApi = {
    getTodolist() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(arg: UpdateTodolistTitleArgType) {
        return instance.put<ResponseType>(`todo-lists/${arg.todoId}`, {title: arg.title})
    },
}
export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}
export type UpdateTodolistTitleArgType = {
    todoId: string
    title: string
}
