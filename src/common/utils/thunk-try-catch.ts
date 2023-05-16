import {AppDispatchType, AppRootStateType} from "app/store"
import {setStatus} from "app/app-reducer"
import {handleServerNetworkError} from "common/utils/handle-server-network-error"
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk"
import {ResponseType} from "common/types/common.types"

/**
 * This function allows us to avoid code duplication and reuse of try-catch blocks in each of the thunk.
 * @param thunkAPI  - an object containing all of the parameters that are normally passed to a Redux thunk function
 * @param logic - this is the function we want to execute with try-catch
 */
export const thunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatchType, null | ResponseType>, logic: Function) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(setStatus({status: 'loading'}))
    try {
        return await logic()
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }finally {
        dispatch(setStatus({status: 'idle'}))
    }
}
