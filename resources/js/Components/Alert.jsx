import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > .MuiAlert-message': {
            width: '100%',
        },
    },
}))

export default function AlertMui({ children, error, hiddenCloseIcon = true, ...props }) {
    const [open, setOpen] = useState(true)
    const classes = useStyles()

    return (
        <Collapse in={open}>
            <Alert
                severity={error ? 'error' : error == false ? 'success' : 'info'}
                classes={{ root: classes.root }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false)
                        }}>
                        <CloseIcon fontSize="inherit" className={hiddenCloseIcon ? '!hidden' : ''} />
                    </IconButton>
                }
                {...props}>
                {children}
            </Alert>
        </Collapse>
    )
}
