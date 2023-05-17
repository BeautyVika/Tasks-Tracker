import {Dispatch} from "redux"
import {setError} from "app/app.reducer"
import {ResponseType} from "common/types/common.types"

/**
 * This function handles errors that may occur when interacting with the server.
 * @param data  - response from the server in the format ResponseType<D>
 * @param dispatch - function to send messages to store Redux
 * @param showError -parameter responsible for displaying errors, by default - true
 */

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
    if (showError) {
        dispatch(setError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
}
