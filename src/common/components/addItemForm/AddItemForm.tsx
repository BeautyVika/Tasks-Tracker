import React, { ChangeEvent, FC, KeyboardEvent, memo, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { RejectValueType } from 'common/utils'

type Props = {
    addItem: (newTitle: string) => Promise<any>
    disabled?: boolean
}

export const AddItemForm: FC<Props> = memo(({ addItem, disabled }) => {
    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        if (title.trim() !== '') {
            addItem(title)
                .then(() => {
                    setTitle('')
                })
                .catch((err: RejectValueType) => {
                    if (err.data) {
                        const messages = err.data.messages
                        setError(
                            messages.length
                                ? messages[0]
                                : 'Some error occurred'
                        )
                    }
                })
        } else {
            setError('Title is required')
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) setError(null)
        if (e.key === 'Enter') {
            addItemHandler()
        }
    }
    return (
        <div>
            <TextField
                label="Title"
                helperText={error}
                variant="outlined"
                size="small"
                error={!!error}
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyPressHandler}
                disabled={disabled}
            />

            <Button
                variant="contained"
                size="small"
                style={{
                    maxWidth: '39px',
                    maxHeight: '39px',
                    minWidth: '39px',
                    minHeight: '39px',
                    marginLeft: '5px',
                }}
                onClick={addItemHandler}
                disabled={disabled}
            >
                +
            </Button>
        </div>
    )
})
