import {setError, setStatus} from 'app/app-reducer'
import { Dispatch } from 'redux'
import {ResponseType} from "api/todolist-api"

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setError({error: data.messages[0]}))
    } else {
        dispatch(setError({error: "Some error occurred"}))
    }
    dispatch(setStatus({status: "failed"}))
}

export const handleServerNetworkError = (error: {message: string }, dispatch: Dispatch) => {
    dispatch(setError({error: error.message ? error.message : "Some error occurred"}))
    dispatch(setStatus({status: "failed"}))
}