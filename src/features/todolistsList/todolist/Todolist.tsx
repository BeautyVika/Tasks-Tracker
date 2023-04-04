import React, {memo, useCallback, useEffect} from 'react'
import AddItemForm from "../../../components/addItemForm/AddItemForm"
import EditableSpan from "../../../components/editableSpan/EditableSpan"
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Task from "./task/Task"
import SuperButton from "../../../components/superButton/SuperButton"
import {FilterValuesType} from "../todolists-reducer"
import {TaskStatuses, TaskType} from "api/todolist-api"
import {AppDispatch} from "app/store"
import {getTaskTC} from "../tasks-reducer"
import {RequestStatusType} from "app/app-reducer"

type TodolistPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    entityStatus: RequestStatusType
    addTask: (newTitle: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    updateTodolist: (updateTitle: string, todolistId: string) => void
}

const Todolist = memo((props: TodolistPropsType) => {
    //получение тасок todolist
    // const tasksTl = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.id])
    const dispatch = AppDispatch()

    // useEffect(() => {
    //     dispatch(getTaskTC(props.id))
    // }, [])

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

