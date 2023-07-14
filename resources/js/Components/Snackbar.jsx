import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { forwardRef, useState } from 'react'
import { useEffect } from 'react'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function SnackbarMui({ pageStatus = false, message = '', severity = 'info', ...props }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(pageStatus)
    }, [pageStatus])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}
