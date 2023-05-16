import {setError} from 'app/app-reducer'
import { Dispatch } from 'redux'
import axios, {AxiosError} from "axios";

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(setError({error}))
    } else {
        dispatch(setError({error: `Native error ${err.message}`}))
    }
}