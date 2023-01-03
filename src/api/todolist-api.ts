import axios from 'axios'

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'dc8162ea-151f-40b7-8429-784631a92f82'
    }
}

export const todolistAPI = {
    getTodolist() {
        const promise = axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)
        return promise
    },
    createTodolist(title: string) {
        const promise = axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', title, settings)
        return promise
    },
    deleteTodolist(todolistId: string) {
        const promise = axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, settings)
        return promise
    },
    updateTodolist(todolistId: string, title: string) {
        const promise = axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`,
            {title: title}, settings)
        return promise
    }
}