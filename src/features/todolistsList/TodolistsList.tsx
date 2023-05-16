import React, {useCallback, useEffect} from 'react'
import {AppUseSelector} from "app/store"
import {FilterValuesType, todolistsActions, todosThunks,} from "./todolists-reducer"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Todolist from "./todolist/Todolist"
import {Navigate} from "react-router-dom"
import {selectIsLoggedIn} from "features/auth/auth.selectors"
import {selectTasks} from "features/todolistsList/tasks.selectors"
import {selectTodolists} from "features/todolistsList/todolists.selectors"
import {tasksThunks} from "features/todolistsList/tasks-reducer"
import {AddItemForm} from "common/components"
import {useActions} from "common/hooks/useAction"

type TodolistsListPropsType = {}
const TodolistsList: React.FC<TodolistsListPropsType> = (props) => {

    const todolists = AppUseSelector(selectTodolists)
    const tasks = AppUseSelector(selectTasks)
    const isLoggedIn = AppUseSelector(selectIsLoggedIn)

    const {fetchTodos, deleteTodolist, addTodolist, changeTodolistTitle} = useActions(todosThunks)
    const {addTask} = useActions(tasksThunks)
    const {changeTodolistFilter} = useActions(todolistsActions)

    useEffect(() => {
        if (!isLoggedIn) return
       fetchTodos()
    }, [])

    const changeFilter = useCallback((filter: FilterValuesType, id: string) => {
        changeTodolistFilter({id, filter})
    }, [])

    const addNewTask = useCallback((title: string, todolistId: string) => {
        addTask({todolistId, title})
    }, [])


    const removeTodolist = useCallback((todolistId: string) => {
       deleteTodolist(todolistId)
    }, [])

    const addNewTodolist = useCallback((title: string) => {
       addTodolist(title)
    }, [])

    const updateTodolist = useCallback((updateTitle: string, todolistId: string) => {
       changeTodolistTitle({todoId: todolistId, title: updateTitle})
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/auth'}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addTask={addNewTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map(todolist => {

                    return <Grid item={true} key={todolist.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist title={todolist.title}
                                      id={todolist.id}
                                      entityStatus={todolist.entityStatus}
                                      tasks={tasks[todolist.id]}
                                      filter={todolist.filter}
                                      addTask={addNewTask}
                                      removeTodolist={removeTodolist}
                                      changeFilter={changeFilter}
                                      updateTodolist={updateTodolist}/>
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </>
    )
}
export default TodolistsList