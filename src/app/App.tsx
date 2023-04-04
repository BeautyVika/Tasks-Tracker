import React, {useEffect} from 'react'
import Container from '@mui/material/Container'
import ButtonAppBar from "../components/buttonAppBar/ButtonAppBar"
import TodolistsList from "../features/todolistsList/TodolistsList"
import {ErrorSnackbar} from "components/errorSnackbar/ErrorSnackbar"
import {Navigate, Route, Routes} from "react-router-dom"
import {Login} from "features/login/Login"
import {meTC} from "features/login/auth-reducer"
import {AppDispatch, AppUseSelector} from "./store"
import {CircularProgress} from "@mui/material"

import './App.css'

function App() {

    const isInitialized = AppUseSelector(state => state.app.isInitialized)

    const dispatch = AppDispatch()

    useEffect(() => {
        dispatch(meTC())
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
                    <Route path={'/login'} element={<Login/>}/>
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
