import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

type Props = {
    addTask: (newTitle: string) => void
    disabled?: boolean
}

export const AddItemForm: FC<Props> = memo(({addTask, disabled}) => {

    let [title, setTitle] = useState('')
    let [error, setError]= useState<string | null>(null)

    const addItemHandler = () => {
        if (title.trim() !== ''){
            addTask(title.trim())
            setTitle('')
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
            addItemHandler();
        }
    }
   return (
       <div>
           <TextField id="outlined-basic"
                      label={error ? 'Title is required' : 'type your text...'}
                      variant="outlined"
                      size="small"
                      error={!!error}
                      value={title}
                      onChange={onChangeHandler}
                      onKeyDown={onKeyPressHandler}
                      disabled={disabled}/>
           <Button variant="contained"
                   size="small"
                   style={{maxWidth: '39px', maxHeight: '39px', minWidth: '39px', minHeight: '39px', marginLeft: '5px'}}
                   onClick={addItemHandler}
                   disabled={disabled}>
               +
           </Button>
       </div>
   )
})