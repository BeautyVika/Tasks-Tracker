import React, {useCallback} from 'react';
import './App.css';
import Todolist, {TaskType} from "./Todolist";
import AddItemForm from "./AddItemForm";
import ButtonAppBar from "./ButtonAppBar";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
} from "./state/todolists-reducer";
import {addTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValueType = 'all' | 'active' | 'completed'

export type TodolistsType = {
    id: string
    title: string
    filter: FilterValueType
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const todolists = useSelector<AppRootStateType, Array<TodolistsType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const dispatch = useDispatch()

    const changeFilter = useCallback((value: FilterValueType, todoListId: string) => {
        dispatch(changeTodolistFilterAC(todoListId, value))
    }, [dispatch])

    const addTask = useCallback((newTitle: string, todolistId: string) => {
        dispatch(addTaskAC(newTitle, todolistId))
    }, [dispatch])


    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [dispatch])

    const updateTodolist = useCallback((updateTitle: string, todolistId: string) => {
        dispatch(changeTodolistTitleAC(todolistId, updateTitle))
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
