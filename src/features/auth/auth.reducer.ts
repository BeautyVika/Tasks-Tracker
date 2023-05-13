import {Dispatch} from 'redux'
import axios from "axios"
import {handleServerAppError, handleServerNetworkError} from "common/utils"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {setIsInitialized, setStatus} from "app/app-reducer"
import {clearTodosData} from "features/todolistsList/todolists-reducer"
import {RESULT_CODE} from "common/enums/enums"
import {authApi, LoginType} from "features/auth/authApi"

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})
export const authReducer = slice.reducer

export const {setIsLoggedIn} = slice.actions

// thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    try {
        const res = await authApi.login(data)
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedIn({isLoggedIn: true}))
            dispatch(setStatus({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }
        // catch (e: AxiosError<{message: string}>) {
        //     handleServerNetworkError(e, dispatch)
        // }
    catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        } else {
            return 'Some error occurred'
        }
    }
}
export const meTC = () => async (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    try {
        const res = await authApi.me()
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedIn({isLoggedIn: true}))
            dispatch(setStatus({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        } else {
            return 'Some error occurred'
        }
    } finally {
        dispatch(setIsInitialized({isInitialized: true}))
    }
}
export const loginOutTC = () => async (dispatch: Dispatch) => {
    dispatch(setStatus({status: "loading"}))
    try {
        const res = await authApi.logOut()
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedIn({isLoggedIn: false}))
            dispatch(setStatus({status: "succeeded"}))
            dispatch(clearTodosData({todolists: []}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        } else {
            return 'Some error occurred'
        }
    }
}
