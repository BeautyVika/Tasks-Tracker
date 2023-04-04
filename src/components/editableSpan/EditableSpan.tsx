import React, {ChangeEvent, memo, useState} from 'react'

type EditableSpanPropsType = {
    title: string
    callback: (title: string) => void
    disabled?: boolean
}

const EditableSpan = memo((props: EditableSpanPropsType) => {
    const [edit, setEdit] = useState(false)
    let [updateTitle, setUpdateTitle] = useState(props.title)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdateTitle(e.currentTarget.value)
    }
    const addTask = () => {
        props.callback(updateTitle)
    }

    const onDoubleClickHandler = () => {
        setEdit(!edit)
        edit && addTask()
    }
    return (
       edit
            ? <input value={updateTitle} onChange={onChangeHandler} onBlur={onDoubleClickHandler}
                     disabled={props.disabled}
                     autoFocus/>
            : <><span onDoubleClick={onDoubleClickHandler}>{props.title}</span></>
    )
})

export default EditableSpan