import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

type InitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setError: (state, action: PayloadAction<{error: null | string}>) => {
            state.error = action.payload.error
        },
        setIsInitialized: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer

export const {setStatus, setError, setIsInitialized} = slice.actions

// export const setStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const )
// export const setErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)
// export const setIsInitializedAC = (isInitialized: boolean) => ({type: 'SET-IS-INITIALIZED', isInitialized} as const)

//types
// type AppActionsType = SetStatusActionType
//     | SetErrorActionType
//     | SetIsInitializedActionType
//
// export type SetStatusActionType = ReturnType<typeof setStatusAC>
// export type SetErrorActionType = ReturnType<typeof setErrorAC>
// export type SetIsInitializedActionType = ReturnType<typeof setIsInitializedAC>