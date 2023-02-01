import React from 'react';
import './App.css';
import Container from '@mui/material/Container';
import ButtonAppBar from "../components/buttonAppBar/ButtonAppBar";
import TodolistsList from "../features/todolistsList/TodolistsList";
import {ErrorSnackbar} from "../components/errorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/login/Login";

function App() {


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
