import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";
import thunkMiddleware, {ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export type AppRootStateType = ReturnType<typeof rootReducer>

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))

 type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

export const AppDispatch = () => useDispatch<AppDispatchType>()
export const AppUseSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store