import React, {useCallback, useEffect} from 'react';
import './App.css';
import Todolist from "./Todolist";
import AddItemForm from "./AddItemForm";
import ButtonAppBar from "./ButtonAppBar";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC, deleteTodolistTC, FilterValuesType, getTodoTC,
    TodolistDomainType,
} from "./state/todolists-reducer";
import {addTaskTC} from "./state/tasks-reducer";
import {AppDispatch, AppUseSelector} from "./state/store";
import {TaskType} from "./api/todolist-api";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

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
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addTask={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(todolist => {

                        return <Grid item={true} key={todolist.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist title={todolist.title}
                                          id={todolist.id}
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
            </Container>
        </div>
    );
}

export default App;
