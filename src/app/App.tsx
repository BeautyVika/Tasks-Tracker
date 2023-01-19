import React from 'react';
import './App.css';
import Container from '@mui/material/Container';
import ButtonAppBar from "../components/buttonAppBar/ButtonAppBar";
import TodolistsList from "../features/todolistsList/TodolistsList";


function App() {

    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}
export default App;
