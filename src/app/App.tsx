import React from 'react';
import './App.css';
import Container from '@mui/material/Container';
import ButtonAppBar from "../components/buttonAppBar/ButtonAppBar";
import TodolistsList from "../features/todolistsList/TodolistsList";
import {ErrorSnackbar} from "../components/errorSnackbar/ErrorSnackbar";


function App() {

    return (
        <div className="App">
            <ErrorSnackbar/>
            <ButtonAppBar/>
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}
export default App;
