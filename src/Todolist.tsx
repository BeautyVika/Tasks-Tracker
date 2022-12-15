import React, {ChangeEvent, memo, useCallback} from 'react';
import {FilterValueType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

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
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    updateTask: (updateTitle: string, taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValueType, todoListId: string) => void
    updateTodolist: (updateTitle: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, newStatus: boolean, todolistId: string) => void
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

    const updateTaskHandler = (updateTitle: string, taskId: string) => {
        props.updateTask(updateTitle, taskId, props.id)
    }

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
                    <DeleteIcon />
                </IconButton>
            </h3>
            <AddItemForm addTask={addTask}/>
            <ul>
                {tasks.map((t) => {
                    const onClickHandler = () => {
                        props.removeTask(t.id, props.id)
                    }
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
                    }

                    return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                        <Checkbox checked={t.isDone} onChange={onChangeHandler} />
                        <EditableSpan title={t.title} callback={(updateTitle: string) => updateTaskHandler(updateTitle, t.id)}/>
                        <IconButton aria-label="delete" onClick={onClickHandler}>
                            <DeleteIcon />
                        </IconButton>
                    </li>
                })}
            </ul>
            <div>
                <ButtonWithMemo variant={props.filter === 'all' ? "outlined" : "contained"}
                                size={"small"}
                                onClick={onAllClickHandler}
                                title={'All'}/>
                <ButtonWithMemo variant={props.filter === 'active' ? "outlined" : "contained"}
                                size={"small"}
                                onClick={onActiveClickHandler}
                                title={'Active'}/>
                <ButtonWithMemo variant={props.filter === 'completed' ? "outlined" : "contained"}
                                color="error"
                                size={"small"}
                                onClick={onCompletedClickHandler}
                                title={'Completed'}/>
            </div>
        </div>
    )
})

export default Todolist

type ButtonWithMemo = {
    variant: "outlined" | "contained"
    size: "small"
    color?: "error"
    onClick: () => void
    title: string
}

const ButtonWithMemo = memo((props: ButtonWithMemo) => {
    return <Button variant={props.variant}
                   color={props.color}
                   size={props.size}
                   onClick={props.onClick}>
        {props.title}
    </Button>
})