import React, { FC, memo } from 'react'
import Button from '@mui/material/Button'

type Props = {
    variant: 'outlined' | 'contained'
    size: 'small'
    color?: 'error'
    onClick: () => void
    title: string
}

export const SuperButton: FC<Props> = memo(
    ({ variant, title, onClick, color, size }) => {
        return (
            <Button
                variant={variant}
                color={color}
                size={size}
                onClick={onClick}
            >
                {title}
            </Button>
        )
    }
)
