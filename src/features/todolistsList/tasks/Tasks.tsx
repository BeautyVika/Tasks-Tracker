import React, {FC, memo} from "react"
import Task from "features/todolistsList/tasks/task/Task"
import {TaskType} from "features/todolistsList/tasks/tasksApi"
import {TaskStatuses} from "common/enums/enums"
import {FilterValuesType} from "features/todolistsList/todolists/todolists.reducer"

type Props = {
    id: string
    filter: FilterValuesType
    tasks: TaskType[]
}

export const Tasks: FC<Props> = memo(({tasks, id, filter}) => {

    let tasksForTodolist = tasks

    if (filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <ul>
            {tasksForTodolist.map((t) => {
                return <Task task={t}
                             todolistId={id}
                             key={t.id}/>
            })}
        </ul>
    )
})