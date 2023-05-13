import React, {memo} from "react"
import Button from "@mui/material/Button"

type SuperButtonType = {
    variant: "outlined" | "contained"
    size: "small"
    color?: "error"
    onClick: () => void
    title: string
}

export const SuperButton = memo((props: SuperButtonType) => {
    return <Button variant={props.variant}
                   color={props.color}
                   size={props.size}
                   onClick={props.onClick}>
        {props.title}
    </Button>
})