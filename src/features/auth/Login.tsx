import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { FormikHelpers, useFormik } from 'formik'
import { AppUseSelector } from 'app/store'
import { authThunks } from 'features/auth/auth.reducer'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn } from 'features/auth/auth.selectors'
import { useActions } from 'common/hooks/useAction'
import { LoginType } from 'features/auth/authApi'
import { ResponseType } from 'common/types/common.types'

export const Login = () => {
    const isLoggedIn = AppUseSelector(selectIsLoggedIn)
    const { login } = useActions(authThunks)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: (values) => {
            const errors: Partial<Omit<LoginType, 'captcha'>> = {}
            if (!values.email) {
                errors.email = 'Enter your email!'
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Enter your password!'
            } else if (values.password.length < 3) {
                errors.password = 'Length should be more 3 symbols'
            }
            return errors
        },
        onSubmit: (
            values: LoginType,
            formikHelpers: FormikHelpers<LoginType>
        ) => {
            login(values)
                .unwrap()
                .catch((reason: ResponseType) => {
                    const { fieldsErrors } = reason
                    if (fieldsErrors) {
                        fieldsErrors.forEach((fieldError) => {
                            formikHelpers.setFieldError(
                                fieldError.field,
                                fieldError.error
                            )
                        })
                    }
                })
        },
    })
    if (isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered
                            <a
                                href={'https://social-network.samuraijs.com/'}
                                target={'_blank'}
                            >
                                {' '}
                                here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <form onSubmit={formik.handleSubmit}>
                        <FormGroup>
                            <TextField
                                label="Email"
                                margin="normal"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div style={{ color: 'red' }}>
                                    {formik.errors.email}
                                </div>
                            )}
                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password &&
                                formik.errors.password && (
                                    <div style={{ color: 'red' }}>
                                        {formik.errors.password}
                                    </div>
                                )}
                            <FormControlLabel
                                label={'Remember me'}
                                control={
                                    <Checkbox
                                        checked={formik.values.rememberMe}
                                        {...formik.getFieldProps('rememberMe')}
                                    />
                                }
                            />
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                            >
                                Login
                            </Button>
                        </FormGroup>
                    </form>
                </FormControl>
            </Grid>
        </Grid>
    )
}
