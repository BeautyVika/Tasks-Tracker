import React, {ChangeEvent, FC, memo, useState} from 'react'

type Props = {
    title: string
    callback: (title: string) => void
    disabled?: boolean
}

export const EditableSpan: FC<Props> = memo(({title, disabled, callback}) => {
    const [edit, setEdit] = useState(false)
    let [updateTitle, setUpdateTitle] = useState(title)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdateTitle(e.currentTarget.value)
    }
    const addTask = () => {
        callback(updateTitle)
    }

    const onDoubleClickHandler = () => {
        setEdit(!edit)
        edit && addTask()
    }
    return (
       edit
            ? <input value={updateTitle} onChange={onChangeHandler} onBlur={onDoubleClickHandler}
                     disabled={disabled}
                     autoFocus/>
            : <><span onDoubleClick={onDoubleClickHandler}>{title}</span></>
    )
})