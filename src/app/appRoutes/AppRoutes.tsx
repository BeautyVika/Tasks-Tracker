import React from "react"
import {Navigate, Route, Routes} from "react-router-dom"
import TodolistsList from "features/todolistsList/TodolistsList"
import {Login} from "features/auth/Login"

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path={'/'} element={<TodolistsList/>}/>
            <Route path={'/auth'} element={<Login/>}/>
            <Route path={'/404'}
                   element={<h1 style={{display: 'flex',justifyContent:'center', alignItems: 'center'}}>404 not found</h1>}/>
            <Route path={'*'}
                   element={<Navigate to={'/404'}/>}/>
        </Routes>
    )
}