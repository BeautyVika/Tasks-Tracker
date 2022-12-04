import React, {ChangeEvent} from 'react';
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

const Todolist = (props: TodolistPropsType) => {

    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }

    const onAllClickHandler = () => props.changeFilter('all', props.id)
    const onActiveClickHandler = () => props.changeFilter('active', props.id)
    const onCompletedClickHandler = () => props.changeFilter('completed', props.id)

    const removeTodolistHandler = () => {
        props.removeTodolist(props.id)
    }
    const updateTodolistHandler = (title: string) => {
        props.updateTodolist(title, props.id)
    }
    const updateTaskHandler = (updateTitle: string, taskId: string) => {
        props.updateTask(updateTitle, taskId, props.id)
    }
    return (
        <div>
            <h3>
                <EditableSpan title={props.title} callback={updateTodolistHandler}/>
                <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                    <DeleteIcon />
                </IconButton>
                {/*<button onClick={removeTodolistHandler}>✖</button>*/}
            </h3>
            <AddItemForm addTask={addTask}/>
            <ul>
                {props.tasks.map((t) => {
                    const onClickHandler = () => {
                        props.removeTask(t.id, props.id)
                    }
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
                    }

                    return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                        {/*<input type="checkbox" checked={t.isDone} onChange={onChangeHandler}/>*/}
                        <Checkbox checked={t.isDone} onChange={onChangeHandler} />
                        <EditableSpan title={t.title} callback={(updateTitle: string) => updateTaskHandler(updateTitle, t.id)}/>
                        {/*<button onClick={onClickHandler}>✖</button>*/}
                        <IconButton aria-label="delete" onClick={onClickHandler}>
                            <DeleteIcon />
                        </IconButton>
                    </li>
                })}
            </ul>
            <div>
                <Button variant={props.filter === 'all' ? "outlined" : "contained"}
                        size="small"
                        onClick={onAllClickHandler}>
                    All
                </Button>
                <Button variant={props.filter === 'active' ? "outlined" : "contained"}
                        size="small"
                        onClick={onActiveClickHandler}>
                    Active
                </Button>
                <Button variant={props.filter === 'completed' ? "outlined" : "contained"}
                        color="error"
                        size="small"
                        onClick={onCompletedClickHandler}>
                    Completed
                </Button>
                {/*<button className={props.filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>*/}
                {/*<button className={props.filter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active</button>*/}
                {/*<button className={props.filter === 'completed' ? 'active-filter' : ''} onClick={onCompletedClickHandler}>Completed</button>*/}
            </div>
        </div>
    )
}

export default Todolist