import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { makeStyles } from '@mui/styles'
const useStyles = makeStyles((theme) => ({
    paper: {
        '&.MuiDialog-paper': {
            backgroundColor: '#dcf2ff8f',
        },
    },
    root: {
        '& .MuiModal-backdrop': {
            backdropFilter: 'blur(8px)',
        },
    },
}))

export default function DialogMui({ open = false, blurEnabled = false, dialogTitle, dialogContent, dialogContentText, dialogActions, ...props }) {
    const classes = useStyles()

    return (
        <div>
            <Dialog
                open={open}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: blurEnabled ? classes.paper : null, root: classes.root }}
                {...props}>
                <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{dialogContentText}</DialogContentText>
                    {dialogContent}
                </DialogContent>
                <DialogActions>{dialogActions}</DialogActions>
            </Dialog>
        </div>
    )
}
