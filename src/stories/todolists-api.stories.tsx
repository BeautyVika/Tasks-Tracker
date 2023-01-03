import React, {useEffect, useState} from 'react'
import axios from "axios";

export default {
    title: 'API'
}
const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'dc8162ea-151f-40b7-8429-784631a92f82'
    }
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)
            .then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title: 'NewTodolist'}, settings)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'bf532001-13c7-490f-bf64-20698d84876c'
        axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, settings)
            .then((res) => setState(res.data))

    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'a0fcf4f5-a67b-4385-8dda-2ed2194866ce'
        axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, {title: 'REACT'}, settings)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

