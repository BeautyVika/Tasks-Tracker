import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import LinearProgress from '@mui/material/LinearProgress'
import {AppDispatch, AppUseSelector} from "app/store"
import {loginOutTC} from "features/auth/auth.reducer"
import {selectStatus} from "app/app.selectors"
import {selectIsLoggedIn} from "features/auth/auth.selectors"

export default function ButtonAppBar() {

    const status = AppUseSelector(selectStatus)
    const isLoggedIn = AppUseSelector(selectIsLoggedIn)

    const dispatch = AppDispatch()

    const logOutHandler = () => dispatch(loginOutTC())


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Todolist
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logOutHandler}>Log Out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress color="error" /> }
            </AppBar>
        </Box>
    );
}