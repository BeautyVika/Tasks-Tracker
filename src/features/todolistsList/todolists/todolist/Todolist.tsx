import React, {memo, useCallback, useEffect} from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Task from "features/todolistsList/tasks/task/Task"
import {FilterValuesType, todolistsActions, todosThunks} from "features/todolistsList/todolists/todolists.reducer"
import {tasksThunks} from "features/todolistsList/tasks/tasks.reducer"
import {RequestStatusType} from "app/app.reducer"
import {AddItemForm, EditableSpan, SuperButton} from "common/components"
import {TaskStatuses} from "common/enums/enums"
import {TaskType} from "features/todolistsList/tasks/tasksApi"
import {useActions} from "common/hooks/useAction"

type TodolistPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    entityStatus: RequestStatusType
    addTask: (newTitle: string, todolistId: string) => void
}

const Todolist = memo((props: TodolistPropsType) => {
    //получение тасок todolists
    // const tasksTl = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.id])
    const {fetchTasks} = useActions(tasksThunks)
    const {changeTodolistFilter} = useActions(todolistsActions)
    const {deleteTodolist, changeTodolistTitle} = useActions(todosThunks)

    useEffect(() => {
      fetchTasks(props.id)
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const changeFilter = (filter: FilterValuesType, id: string) => {
        changeTodolistFilter({id, filter})
    }

    const removeTodolistHandler = () => {
        deleteTodolist(props.id)
    }
    const updateTodolistHandler = useCallback((title: string) => {
        changeTodolistTitle({todoId: props.id, title})
    }, [changeTodolistTitle, props.id])

    let tasks = props.tasks

    if (props.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} callback={updateTodolistHandler} disabled={props.entityStatus === 'loading'}/>
                <IconButton aria-label="delete" onClick={removeTodolistHandler} disabled={props.entityStatus === 'loading'}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            <AddItemForm addTask={addTask} disabled={props.entityStatus === 'loading'}/>

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
                             onClick={() => changeFilter('all', props.id)}
                             title={'All'}/>
                <SuperButton variant={props.filter === 'active' ? "outlined" : "contained"}
                             size={"small"}
                             onClick={() => changeFilter('active', props.id)}
                             title={'Active'}/>
                <SuperButton variant={props.filter === 'completed' ? "outlined" : "contained"}
                             color="error"
                             size={"small"}
                             onClick={() => changeFilter('completed', props.id)}
                             title={'Completed'}/>
            </div>
        </div>
    )
})

export default Todolist

