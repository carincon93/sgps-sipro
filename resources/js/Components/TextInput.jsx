import { FormHelperText, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { forwardRef } from 'react'

const useStyles = makeStyles({
    root: {
        '& .MuiFormLabel-root': {
            background: (props) => props.background,
            padding: '0 5px',
            borderRadius: '8px',
            left: '-4px',
        },

        '& .MuiInputBase-root': {
            background: (props) => props.background,
            borderRadius: '4px',
        },
    },
})
export default forwardRef(function TextInput(
    { type = 'text', id = '', label = '', error = '', value = '', variant = 'outlined', className = '', inputBackground = '', isFocused = false, ...props },
    ref,
) {
    const classes = useStyles({ background: inputBackground })

    if (value === null) {
        value = ''
    }
    return (
        <>
            <TextField
                id={id}
                label={label}
                type={type}
                value={value}
                variant={variant}
                error={error ? true : false}
                classes={{
                    root: inputBackground ? classes.root : '',
                }}
                className={'w-full ' + className}
                {...props}
            />
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}
        </>
    )
})
