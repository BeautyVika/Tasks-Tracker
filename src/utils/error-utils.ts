import {setError, setStatus} from 'app/app-reducer'
import { Dispatch } from 'redux'
import {ResponseType} from "api/todolist-api"
import axios, {AxiosError} from "axios";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setError({error: data.messages[0]}))
    } else {
        dispatch(setError({error: "Some error occurred"}))
    }
    dispatch(setStatus({status: "failed"}))
}

export const _handleServerNetworkError = (error: {message: string }, dispatch: Dispatch) => {
    dispatch(setError({error: error.message ? error.message : "Some error occurred"}))
    dispatch(setStatus({status: "failed"}))
}
export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(setError({error}))
    } else {
        dispatch(setError({error: `Native error ${err.message}`}))
    }
    dispatch(setStatus({status: 'failed'}))
}