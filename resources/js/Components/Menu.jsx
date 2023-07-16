import ButtonMui from '@/Components/Button'

import Menu from '@mui/material/Menu'
import { makeStyles } from '@mui/styles'

import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    list: {
        // padding: '0px',
        backgroundImage: 'url(/images/cyan-blur.png)',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'right top, left bottom',
        backgroundSize: '5rem',
    },
}))

export default function MenuMui({ children, ...props }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const classes = useStyles()

    const handleClick = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <ButtonMui id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick} backgroundColor="transparent" backgroundColorHover="#37415129" colorHover="#374151" {...props}>
                {props.text}
            </ButtonMui>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                classes={{ list: classes.list }}
            >
                {children}
            </Menu>
        </>
    )
}
