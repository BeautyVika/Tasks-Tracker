import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatchType, AppRootStateType } from 'app/store'
import { ResponseType } from 'common/types/common.types'

/**
 * The wrapper function, thanks to it we can not type the error (rejectValue), dispatch (dispatch), state (state) every time.
 */
export type RejectValueType = {
    data: ResponseType
    showGlobalError: boolean
}

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatchType
    rejectValue: null | RejectValueType
}>()
