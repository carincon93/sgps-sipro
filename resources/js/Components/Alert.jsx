import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

export default function AlertMui({children, error, hiddenIcon = false, ...props}) {
  const [open, setOpen] = useState(true);

  return (
    <Collapse in={open}>
        <Alert
            severity={error ? 'error' : error == false ? 'success' : 'info'}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    <CloseIcon fontSize="inherit"
                        className={hiddenIcon ? '!hidden' : ''}
                     />
                </IconButton>
            }
            {...props}
        >
            {children}
        </Alert>
    </Collapse>
  );
}
