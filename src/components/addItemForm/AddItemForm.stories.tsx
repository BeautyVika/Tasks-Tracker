import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AddItemForm from "./AddItemForm"
import {action} from "@storybook/addon-actions"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

export default {
  title: 'TODOLIST/AddItemForm',
  component: AddItemForm,
  argTypes: {
    addTask: {
      description: 'Button clicked inside'
    },
  }
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template.bind({});

AddItemFormStory.args = {
  addTask: action('Button clicked inside')
};

const TemplateWithError: ComponentStory<typeof AddItemForm> = (args) => {

  let [title, setTitle] = useState('')
  let [error, setError]= useState<string | null>('Title is required')

  const addTask = () => {
    if (title.trim() !== ''){
      args.addTask(title.trim())
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
                   onKeyDown={onKeyPressHandler}/>
        <Button variant="contained"
                size="small"
                style={{maxWidth: '39px', maxHeight: '39px', minWidth: '39px', minHeight: '39px', marginLeft: '5px'}}
                onClick={addTask}>
          +
        </Button>
      </div>
  )
}
export const AddItemFormWithErrorStory = TemplateWithError.bind({})