import {setErrorAC, SetErrorActionType, setStatusAC, SetStatusActionType} from 'app/app-reducer'
import { Dispatch } from 'redux'
import {ResponseType} from "api/todolist-api"

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC('Some error occurred'))
    }
    dispatch(setStatusAC('failed'))
}

export const handleServerNetworkError = (error: {message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetErrorActionType | SetStatusActionType>
