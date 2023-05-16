import React, {useEffect} from 'react'
import Container from '@mui/material/Container'
import TodolistsList from "../features/todolistsList/TodolistsList"
import {Navigate, Route, Routes} from "react-router-dom"
import {Login} from "features/auth/Login"
import {authThunks} from "features/auth/auth.reducer"
import {AppUseSelector} from "./store"
import {CircularProgress} from "@mui/material"
import {selectIsInitialized} from "app/app.selectors"
import {ButtonAppBar, ErrorSnackbar} from "common/components"
import './App.css'
import {useActions} from "common/hooks/useAction"

function App() {

    const isInitialized = AppUseSelector(selectIsInitialized)

    const {me} = useActions(authThunks)

    useEffect(() => {
       me()
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <ButtonAppBar/>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/auth'} element={<Login/>}/>
                    <Route path={'/404'}
                           element={<h1 style={{display: 'flex',justifyContent:'center', alignItems: 'center'}}>404 not found</h1>}/>
                    <Route path={'*'}
                           element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
        </div>
    );
}
export default App;
