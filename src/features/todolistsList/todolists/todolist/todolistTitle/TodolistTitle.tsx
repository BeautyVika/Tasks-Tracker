import React, {FC, memo} from "react"
import {EditableSpan} from "common/components"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import {RequestStatusType} from "app/app.reducer"
import {useActions} from "common/hooks/useAction"
import {todosThunks} from "features/todolistsList/todolists/todolists.reducer"

type Props = {
    id: string
    title: string
    entityStatus: RequestStatusType
}

export const TodolistTitle: FC<Props> = memo(({title, entityStatus, id}) => {

    const {deleteTodolist, changeTodolistTitle} = useActions(todosThunks)

    const removeTodolistHandler = () => {
        deleteTodolist(id)
    }
    const updateTodolistHandler = (title: string) => {
        changeTodolistTitle({todoId: id, title})
    }

    return (
        <h3>
            <EditableSpan title={title} callback={updateTodolistHandler} disabled={entityStatus === 'loading'}/>
            <IconButton aria-label="delete" onClick={removeTodolistHandler} disabled={entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
        </h3>
    )
})