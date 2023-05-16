import {setError} from 'app/app-reducer'
import { Dispatch } from 'redux'
import axios, {AxiosError} from "axios"

/**
 * This function is used to handle network errors that may occur when sending requests to the server.
 * @param e is a mistake Axios
 * @param dispatch is a function that accepts an action or an async action; it then may or may not dispatch one or more actions to the store.
 */

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(setError({error}))
    } else {
        dispatch(setError({error: `Native error ${err.message}`}))
    }
}