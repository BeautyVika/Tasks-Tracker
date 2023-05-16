import {Dispatch} from "redux"
import {setError} from "app/app-reducer"
import {ResponseType} from "common/types/common.types"

/**
 * This function handles errors that may occur when interacting with the server.
 * @param data  - response from the server in the format ResponseType<D>
 * @param dispatch - function to send messages to store Redux
 */

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setError({error: data.messages[0] }))
    } else {
        dispatch(setError({error: "Some error occurred"}))
    }
}