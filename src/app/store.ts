import {AnyAction, combineReducers} from "redux"
import {tasksReducer} from "features/todolistsList/tasks-reducer"
import {todolistsReducer} from "features/todolistsList/todolists-reducer"
import thunkMiddleware, {ThunkDispatch} from "redux-thunk"
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import {appReducer} from "./app-reducer"
import {authReducer} from "features/auth/auth.reducer"
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

// export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

export const AppDispatch = () => useDispatch<AppDispatchType>()
export const AppUseSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store