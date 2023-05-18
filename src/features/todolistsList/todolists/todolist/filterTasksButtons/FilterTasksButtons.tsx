import React, { FC, memo } from 'react'
import { SuperButton } from 'common/components'
import {
    FilterValuesType,
    todolistsActions,
} from 'features/todolistsList/todolists/todolists.reducer'
import { useActions } from 'common/hooks/useAction'

type Props = {
    id: string
    filter: FilterValuesType
}

export const FilterTasksButtons: FC<Props> = memo(({ filter, id }) => {
    const { changeTodolistFilter } = useActions(todolistsActions)

    const changeFilterHandler = (filter: FilterValuesType, id: string) => {
        changeTodolistFilter({ id, filter })
    }

    return (
        <div>
            <SuperButton
                variant={filter === 'all' ? 'outlined' : 'contained'}
                size={'small'}
                onClick={() => changeFilterHandler('all', id)}
                title={'All'}
            />
            <SuperButton
                variant={filter === 'active' ? 'outlined' : 'contained'}
                size={'small'}
                onClick={() => changeFilterHandler('active', id)}
                title={'Active'}
            />
            <SuperButton
                variant={filter === 'completed' ? 'outlined' : 'contained'}
                color="error"
                size={'small'}
                onClick={() => changeFilterHandler('completed', id)}
                title={'Completed'}
            />
        </div>
    )
})
