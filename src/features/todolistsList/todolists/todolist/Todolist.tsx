import React, {FC, memo, useCallback, useEffect} from 'react'
import {FilterValuesType} from "features/todolistsList/todolists/todolists.reducer"
import {tasksThunks} from "features/todolistsList/tasks/tasks.reducer"
import {RequestStatusType} from "app/app.reducer"
import {AddItemForm} from "common/components"
import {useActions} from "common/hooks/useAction"
import {TaskType} from "features/todolistsList/tasks/tasksApi"
import {FilterTasksButtons} from "features/todolistsList/todolists/todolist/filterTasksButtons/FilterTasksButtons"
import {Tasks} from "features/todolistsList/tasks/Tasks"
import {TodolistTitle} from "features/todolistsList/todolists/todolist/todolistTitle/TodolistTitle"

type Props = {
    id: string
    title: string
    tasks: TaskType[]
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const Todolist: FC<Props> = memo(({id, filter, title, entityStatus, tasks}) => {
    //получение тасок todolists
    // const tasksTl = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.id])

    const {fetchTasks, addTask} = useActions(tasksThunks)

    useEffect(() => {
      fetchTasks(id)
    }, [])

    const addNewTask = useCallback((title: string) => {
        addTask({todolistId: id, title})
    }, [addTask, id])



    return (
        <div>
            <TodolistTitle title={title} entityStatus={entityStatus} id={id}/>

            <AddItemForm addTask={addNewTask} disabled={entityStatus === 'loading'}/>

            <Tasks tasks={tasks} filter={filter} id={id}/>

            <div>
                <FilterTasksButtons filter={filter} id={id} />
            </div>
        </div>
    )
})

export default Todolist

