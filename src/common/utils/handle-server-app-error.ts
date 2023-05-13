import {Dispatch} from "redux";
import {setError, setStatus} from "app/app-reducer";
import {ResponseType} from "common/types/common.types"

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setError({error: data.messages[0]}))
    } else {
        dispatch(setError({error: "Some error occurred"}))
    }
    dispatch(setStatus({status: "failed"}))
}