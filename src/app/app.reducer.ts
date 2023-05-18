import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
}

export type AppInitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStatus: (
            state,
            action: PayloadAction<{ status: RequestStatusType }>
        ) => {
            state.status = action.payload.status
        },
        setError: (state, action: PayloadAction<{ error: null | string }>) => {
            state.error = action.payload.error
        },
        setIsInitialized: (
            state,
            action: PayloadAction<{ isInitialized: boolean }>
        ) => {
            state.isInitialized = action.payload.isInitialized
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => {
                    return action.type.endsWith('/pending')
                },
                (state) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    const { payload, error } = action
                    if (payload) {
                        if (payload.showGlobalError) {
                            state.error = payload.data.messages.length
                                ? payload.data.messages[0]
                                : 'Some error occurred'
                        }
                    } else {
                        state.error = error.message
                            ? error.message
                            : 'Some error occurred'
                    }
                    state.status = 'failed'
                }
            )
            .addMatcher(
                (action) => {
                    return action.type.endsWith('/fulfilled')
                },
                (state) => {
                    state.status = 'succeeded'
                }
            )
    },
})

export const appReducer = slice.reducer
export const { setStatus, setError, setIsInitialized } = slice.actions
