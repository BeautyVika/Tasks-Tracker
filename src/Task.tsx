import React, {ChangeEvent, memo} from 'react'
import Checkbox from "@mui/material/Checkbox";
import EditableSpan from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from "./Todolist";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";


export type TaskPropsType = {
    task: TaskType
    todolistId: string
}
const Task = memo(({task, todolistId}: TaskPropsType) => {

     // получение таски, 1 способ
    // const taskTl = useSelector<AppRootStateType,TaskType>(state => state.tasks[todolistId].filter(t => t.id === task.id)[0])
    // получение таски, 2 способ
    // const taskTl = useSelector<AppRootStateType, TaskType>(state => state.tasks[todolistId].find(t => t.id === task.id) as TaskType)

    const dispatch = useDispatch()

    const onClickHandler = () => {
        dispatch(removeTaskAC(task.id, todolistId))
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(task.id, e.currentTarget.checked, todolistId))
    }
    const updateTaskHandler = (updateTitle: string, taskId: string) => {
        dispatch(changeTaskTitleAC(updateTitle, taskId, todolistId))
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