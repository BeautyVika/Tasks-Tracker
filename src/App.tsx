import React from 'react';
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
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
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

    const removeTask = (taskId: string, todolistId: string) => {
        dispatch(removeTaskAC(taskId, todolistId))
    }
    const changeFilter = (value: FilterValueType, todoListId: string) => {
        dispatch(changeTodolistFilterAC(todoListId, value))
    }

    const addTask = (newTitle: string, todolistId: string) => {
        dispatch(addTaskAC(newTitle, todolistId))
    }
    const changeTaskStatus = (taskId: string, newStatus: boolean, todolistId: string) => {
        dispatch(changeTaskStatusAC(taskId, newStatus, todolistId))
    }
    const updateTask = (updateTitle: string, taskId: string, todolistId: string) => {
        dispatch(changeTaskTitleAC(updateTitle, taskId, todolistId))
    }

    const removeTodolist = (todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))
    }
    const addTodolist = (title: string) => {
        dispatch(addTodolistAC(title))
    }
    const updateTodolist = (updateTitle: string, todolistId: string) => {
        dispatch(changeTodolistTitleAC(updateTitle, todolistId))
    }
    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addTask={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(todolist => {
                        let tasksForTodoList = tasks[todolist.id]

                        if (todolist.filter === 'active') {
                            tasksForTodoList = tasks[todolist.id].filter(t => !t.isDone)
                        }
                        if (todolist.filter === 'completed') {
                            tasksForTodoList = tasks[todolist.id].filter(t => t.isDone)
                        }
                        return <Grid item={true} key={todolist.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist title={todolist.title}
                                          id={todolist.id}
                                          tasks={tasksForTodoList}
                                          filter={todolist.filter}
                                          addTask={addTask}
                                          removeTask={removeTask}
                                          removeTodolist={removeTodolist}
                                          changeFilter={changeFilter}
                                          updateTask={updateTask}
                                          updateTodolist={updateTodolist}
                                          changeTaskStatus={changeTaskStatus}/>
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
