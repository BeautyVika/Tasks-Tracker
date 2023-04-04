import React, {useCallback, useEffect} from 'react'
import {AppDispatch, AppUseSelector} from "app/store"
import {
    addTodolistTC,
    changeTodolistFilter, changeTodolistTitleTC,
    deleteTodolistTC,
    FilterValuesType,
    getTodoTC,
} from "./todolists-reducer"
import {addTaskTC} from "./tasks-reducer"
import Grid from "@mui/material/Grid"
import AddItemForm from "../../components/addItemForm/AddItemForm"
import Paper from "@mui/material/Paper"
import Todolist from "./todolist/Todolist"
import {Navigate} from "react-router-dom"
import {selectIsLoggedIn} from "features/auth/auth.selectors"
import {selectTasks} from "features/todolistsList/tasks.selectors"
import {selectTodolists} from "features/todolistsList/todolists.selectors"

type TodolistsListPropsType = {}
const TodolistsList: React.FC<TodolistsListPropsType> = (props) => {

    const todolists = AppUseSelector(selectTodolists)
    const tasks = AppUseSelector(selectTasks)
    const isLoggedIn = AppUseSelector(selectIsLoggedIn)

    const dispatch = AppDispatch()

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(getTodoTC())
    }, [])

    const changeFilter = useCallback((filter: FilterValuesType, id: string) => {
        dispatch(changeTodolistFilter({id, filter}))
    }, [dispatch])

    const addTask = useCallback((newTitle: string, todolistId: string) => {
        dispatch(addTaskTC(todolistId, newTitle))
    }, [dispatch])


    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(deleteTodolistTC(todolistId))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    const updateTodolist = useCallback((updateTitle: string, todolistId: string) => {
        dispatch(changeTodolistTitleTC(todolistId, updateTitle))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={'/auth'}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addTask={addTodolist}/>
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
                                      addTask={addTask}
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