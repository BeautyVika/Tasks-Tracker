import React, {useEffect} from 'react'
import Container from '@mui/material/Container'
import {authThunks} from "features/auth/auth.reducer"
import {AppUseSelector} from "./store"
import {CircularProgress} from "@mui/material"
import {selectIsInitialized} from "app/app.selectors"
import {ButtonAppBar, ErrorSnackbar} from "common/components"
import './App.css'
import {useActions} from "common/hooks/useAction"
import {AppRoutes} from "app/appRoutes/AppRoutes"

function App() {

    const isInitialized = AppUseSelector(selectIsInitialized)
    const {me} = useActions(authThunks)

    useEffect(() => {
       me({})
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
                <AppRoutes/>
            </Container>
        </div>
    );
}
export default App;
