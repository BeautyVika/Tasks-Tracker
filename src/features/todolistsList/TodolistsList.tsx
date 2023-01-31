import React, {useCallback, useEffect} from 'react';
import {AppDispatch, AppUseSelector} from "../../app/store";
import {
    addTodolistTC,
    changeTodolistFilterAC, changeTodolistTitleTC,
    deleteTodolistTC,
    FilterValuesType,
    getTodoTC,
    TodolistDomainType
} from "./todolists-reducer";
import {addTaskTC, TaskStateType} from "./tasks-reducer";
import Grid from "@mui/material/Grid";
import AddItemForm from "../../components/addItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import Todolist from "./todolist/Todolist";

type TodolistsListPropsType = {}
const TodolistsList: React.FC<TodolistsListPropsType> = (props) => {

    const todolists = AppUseSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = AppUseSelector<TaskStateType>(state => state.tasks)

    const dispatch = AppDispatch()

    useEffect(() => {
        dispatch(getTodoTC())
    }, [])

    const changeFilter = useCallback((value: FilterValuesType, todoListId: string) => {
        dispatch(changeTodolistFilterAC(todoListId, value))
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