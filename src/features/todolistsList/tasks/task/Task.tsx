import React, {ChangeEvent, FC, memo} from 'react'
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import {tasksThunks} from "features/todolistsList/tasks/tasks.reducer"
import {EditableSpan} from "common/components"
import {TaskStatuses} from "common/enums/enums"
import {TaskType} from "features/todolistsList/tasks/tasksApi"
import {useActions} from "common/hooks/useAction"

export type Props = {
    task: TaskType
    todolistId: string
}
const Task: FC<Props> = memo(({task, todolistId}) => {

    // получение таски, 1 способ
    // const taskTl = useSelector<AppRootStateType,TaskType>(state => state.tasks[todolistId].filter(t => t.id === tasks.id)[0])
    // получение таски, 2 способ
    // const taskTl = useSelector<AppRootStateType, TaskType>(state => state.tasks[todolistId].find(t => t.id === tasks.id) as TaskType)

    const {removeTask, updateTask} = useActions(tasksThunks)

    const deleteTaskHandler = () => {
        removeTask({todoId: todolistId, taskId: task.id})
    }
    const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
       updateTask(
            {
                todoId: todolistId,
                taskId: task.id,
                domainModel: {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}
            })
    }
    const updateTaskHandler = (updateTitle: string, taskId: string) => {
       updateTask({todoId: todolistId, taskId, domainModel: {title: updateTitle}})
    }
    return (
        <li key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox checked={task.status === TaskStatuses.Completed} onChange={changeStatusHandler}/>
            <EditableSpan title={task.title}
                          callback={(updateTitle: string) => updateTaskHandler(updateTitle, task.id)}/>
            <IconButton aria-label="delete" onClick={deleteTaskHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    )
})

export default Task