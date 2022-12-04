import React, {useState} from 'react';
import './App.css';
import Todolist, {TaskType} from "./Todolist";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import ButtonAppBar from "./ButtonAppBar";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';

export type FilterValueType = 'all' | 'active' | 'completed'

type TodolistsType = {
    id: string
    title: string
    filter: FilterValueType
}
type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TaskStateType>({
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},

        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    })

    const removeTask = (taskId: string, todolistId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== taskId)})
    }
    const changeFilter = (value: FilterValueType, todoListId: string) => {
        setTodolists(todolists.map(el => el.id === todoListId ? {...el, filter: value} : el))
    }

    const addTask = (newTitle: string, todolistId: string) => {
        let newTask = {id: v1(), title: newTitle, isDone: false}
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }
    const changeTaskStatus = (taskId: string, newStatus: boolean, todolistId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, isDone: newStatus} : t)})
    }
    const updateTask = (updateTitle: string, taskId: string, todolistId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, title: updateTitle} : t)})
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistId))
        delete tasks[todolistId]
    }
    const addTodolist = (title: string) => {
        let newTodolistID1 = v1()
        let newTodolist: TodolistsType = {id: newTodolistID1, title: title, filter: 'all'}
        setTodolists([newTodolist, ...todolists])
        setTasks({...tasks, [newTodolistID1]: []})
    }
    const updateTodolist = (updateTitle: string, todolistId: string) => {
        setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, title: updateTitle} : tl))
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
                        return <Grid item={true}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist title={todolist.title}
                                          id={todolist.id}
                                          key={todolist.id}
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
