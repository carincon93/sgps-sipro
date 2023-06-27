import { FormHelperText, TextField } from '@mui/material';
import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', id = '', label = '', variant = 'outlined', className = '', isFocused = false, ...props }, ref) {
    return (
        <>
            <TextField {...props} id={id} label={label} type={type} variant={variant} className={' ' + className} />
            {props.error && <FormHelperText id={`component-error-${id}`} className="!text-red-600">{props.error}</FormHelperText> }
        </>
    );
});
