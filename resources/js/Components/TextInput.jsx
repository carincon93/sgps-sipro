import { FormHelperText, TextField } from '@mui/material';
import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', id = '', label = '', error = '', value = '', variant = 'outlined', className = '', isFocused = false, ...props }, ref) {
    return (
        <>
            <TextField {...props} id={id} label={label} type={type} value={value} variant={variant} error={error ? true : false} className={'w-full ' + className} />
            {error && <FormHelperText id={`component-error-${id}`} className="!text-red-600">{error}</FormHelperText> }
        </>
    );
});
