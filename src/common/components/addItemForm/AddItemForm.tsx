import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

type AddItemFormPropsType = {
    addTask: (newTitle: string) => void
    disabled?: boolean
}

export const AddItemForm = memo((props: AddItemFormPropsType) => {

    let [title, setTitle] = useState('')
    let [error, setError]= useState<string | null>(null)

    const addTask = () => {
        if (title.trim() !== ''){
            props.addTask(title.trim())
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
            addTask();
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
                      helperText={error}
                      disabled={props.disabled}/>
           <Button variant="contained"
                   size="small"
                   style={{maxWidth: '39px', maxHeight: '39px', minWidth: '39px', minHeight: '39px', marginLeft: '5px'}}
                   onClick={addTask}
                   disabled={props.disabled}>
               +
           </Button>
       </div>
   )
})