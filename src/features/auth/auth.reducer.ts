import {createAppAsyncThunk} from "common/utils"
import {createSlice} from "@reduxjs/toolkit"
import {setIsInitialized} from "app/app.reducer"
import {RESULT_CODE} from "common/enums/enums"
import {authApi, LoginType} from "features/auth/authApi"
import {todolistsActions} from "features/todolistsList/todolists/todolists.reducer"

const login = createAppAsyncThunk<{isLoggedIn: boolean}, LoginType> ('auth/login',
    async(arg, {rejectWithValue}) => {

            const res = await authApi.login(arg)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                return {isLoggedIn: true}
            } else {
                const isShowAppError = !res.data.fieldsErrors.length
                return rejectWithValue({data: res.data, showGlobalError: isShowAppError})
            }
})
const me = createAppAsyncThunk<{isLoggedIn: boolean}, void>('auth/me',
    async(_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try{
            const res = await authApi.me()
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                return {isLoggedIn: true}
            } else {
                return rejectWithValue({data: res.data, showGlobalError: false})
            }
        }finally {
            dispatch(setIsInitialized({isInitialized: true}))
        }
})
const loginOut = createAppAsyncThunk<{isLoggedIn: boolean}, void>('auth/loginOut',
    async (_, {dispatch, rejectWithValue}) => {

            const res = await authApi.logOut()
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                dispatch(todolistsActions.clearTodosData({todolists: []}))
                return {isLoggedIn: false}
            } else {
                return rejectWithValue({data: res.data, showGlobalError: true})
            }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(me.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(loginOut.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})
export const authReducer = slice.reducer
export const authThunks = {login, me, loginOut}
