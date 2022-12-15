import React, {memo, useCallback} from 'react';
import {FilterValueType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Task from "./Task";
import SuperButton from "./SuperButton";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    id: string
    title: string
    filter: FilterValueType
    tasks: Array<TaskType>
    addTask: (newTitle: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeFilter: (value: FilterValueType, todoListId: string) => void
    updateTodolist: (updateTitle: string, todolistId: string) => void
}

const Todolist = memo((props: TodolistPropsType) => {

    console.log('Todolist')

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.changeFilter, props.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.changeFilter, props.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.changeFilter, props.id])

    const removeTodolistHandler = () => {
        props.removeTodolist(props.id)
    }
    const updateTodolistHandler = useCallback((title: string) => {
        props.updateTodolist(title, props.id)
    }, [props.updateTodolist, props.id])

    let tasks = props.tasks

    if (props.filter === 'active') {
        tasks = tasks.filter(t => !t.isDone)
    }
    if (props.filter === 'completed') {
        tasks = tasks.filter(t => t.isDone)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} callback={updateTodolistHandler}/>
                <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            <AddItemForm addTask={addTask}/>

            <ul>
                {tasks.map((t) => {

                    return <Task task={t}
                                 todolistId={props.id}
                                 key={t.id}/>
                })}
            </ul>
            <div>
                <SuperButton variant={props.filter === 'all' ? "outlined" : "contained"}
                             size={"small"}
                             onClick={onAllClickHandler}
                             title={'All'}/>
                <SuperButton variant={props.filter === 'active' ? "outlined" : "contained"}
                             size={"small"}
                             onClick={onActiveClickHandler}
                             title={'Active'}/>
                <SuperButton variant={props.filter === 'completed' ? "outlined" : "contained"}
                             color="error"
                             size={"small"}
                             onClick={onCompletedClickHandler}
                             title={'Completed'}/>
            </div>
        </div>
    )
})

export default Todolist

