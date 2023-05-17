import React, {FC, useEffect} from 'react'
import {AppUseSelector} from "app/store"
import {todosThunks} from "features/todolistsList/todolists/todolists.reducer"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Todolist from "features/todolistsList/todolists/todolist/Todolist"
import {Navigate} from "react-router-dom"
import {selectIsLoggedIn} from "features/auth/auth.selectors"
import {selectTodolists} from "features/todolistsList/todolists/todolists.selectors"
import {AddItemForm} from "common/components"
import {useActions} from "common/hooks/useAction"
import {selectTasks} from "features/todolistsList/tasks/tasks.selectors"

const TodolistsList:FC = () => {

    const todolists = AppUseSelector(selectTodolists)
    const isLoggedIn = AppUseSelector(selectIsLoggedIn)
    const tasks = AppUseSelector(selectTasks)

    const {fetchTodos, addTodolist} = useActions(todosThunks)

    useEffect(() => {
        if (!isLoggedIn) return
       fetchTodos({})
    }, [])

    const addNewTodolist =(title: string) => {
       return addTodolist(title).unwrap()
    }

    if (!isLoggedIn) {
        return <Navigate to={'/auth'}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addNewTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map(todolist => {

                    return <Grid item={true} key={todolist.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist title={todolist.title}
                                      id={todolist.id}
                                      tasks={tasks[todolist.id]}
                                      entityStatus={todolist.entityStatus}
                                      filter={todolist.filter}
                            />
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </>
    )
}
export default TodolistsList