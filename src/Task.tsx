import React, {ChangeEvent, memo} from 'react'
import Checkbox from "@mui/material/Checkbox";
import EditableSpan from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from "./Todolist";

export type TaskPropsType = {
    task: TaskType
    removeTask: (taskId: string) => void
    updateTask: (updateTitle: string, taskId: string) => void
    changeTaskStatus: (taskId: string, newStatus: boolean) => void
}
const Task = memo(({task, removeTask, updateTask, changeTaskStatus}: TaskPropsType) => {

    const onClickHandler = () => {
        removeTask(task.id)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked)
    }
    const updateTaskHandler = (updateTitle: string, taskId: string) => {
        updateTask(updateTitle, taskId)
    }
    return (
        <li key={task.id} className={task.isDone ? 'is-done' : ''}>
            <Checkbox checked={task.isDone} onChange={onChangeHandler} />
            <EditableSpan title={task.title} callback={(updateTitle: string) => updateTaskHandler(updateTitle, task.id)}/>
            <IconButton aria-label="delete" onClick={onClickHandler}>
                <DeleteIcon />
            </IconButton>
        </li>
    )
})

export default Task