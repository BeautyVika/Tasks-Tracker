import React, {ChangeEvent, memo} from 'react'
import Checkbox from "@mui/material/Checkbox"
import EditableSpan from "../../../../components/editableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import {removeTaskTC, updateTaskTC} from "../../tasks-reducer"
import {TaskStatuses, TaskType} from "api/todolist-api"
import {AppDispatch} from "app/store"

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}
const Task = memo(({task, todolistId}: TaskPropsType) => {

    // получение таски, 1 способ
    // const taskTl = useSelector<AppRootStateType,TaskType>(state => state.tasks[todolistId].filter(t => t.id === task.id)[0])
    // получение таски, 2 способ
    // const taskTl = useSelector<AppRootStateType, TaskType>(state => state.tasks[todolistId].find(t => t.id === task.id) as TaskType)

    const dispatch = AppDispatch()

    const onClickHandler = () => {
        dispatch(removeTaskTC(todolistId, task.id))
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(updateTaskTC(todolistId, task.id, {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}))
    }
    const updateTaskHandler = (updateTitle: string, taskId: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {title: updateTitle}))
    }
    return (
        <li key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox checked={task.status === TaskStatuses.Completed} onChange={onChangeHandler}/>
            <EditableSpan title={task.title}
                          callback={(updateTitle: string) => updateTaskHandler(updateTitle, task.id)}/>
            <IconButton aria-label="delete" onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    )
})

export default Task