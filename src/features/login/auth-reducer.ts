import {Dispatch} from 'redux'
import {
    SetErrorActionType,
    setIsInitializedAC,
    SetIsInitializedActionType,
    setStatusAC,
    SetStatusActionType
} from 'app/app-reducer'
import {authAPI, LoginType, RESULT_CODE} from "api/todolist-api"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import axios from "axios"

const initialState = {
    isLoggedIn: false
}
type AuthStateType = typeof initialState

export const authReducer = (state: AuthStateType = initialState, action: AuthActionsType): AuthStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch<AuthActionsType>) => {
    dispatch(setStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setStatusAC('succeeded'))
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
export const meTC = () => async (dispatch: Dispatch<AuthActionsType>) => {
    dispatch(setStatusAC('loading'))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setStatusAC('succeeded'))
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
        dispatch(setIsInitializedAC(true))
    }
}
export const loginOutTC = () => async (dispatch: Dispatch<AuthActionsType>) => {
    dispatch(setStatusAC('loading'))
    try {
        const res = await authAPI.logOut()
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setStatusAC('succeeded'))
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


// types
type AuthActionsType = ReturnType<typeof setIsLoggedInAC>
    | SetStatusActionType
    | SetErrorActionType
    | SetIsInitializedActionType
