import { FormHelperText, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { forwardRef } from 'react'

const useStyles = makeStyles({
    textField: {
        background: (props) => props.background,
    },
})
export default forwardRef(function TextInput({ type = 'text', id = '', label = '', error = '', value = '', variant = 'outlined', className = '', inputBackground = '', isFocused = false, ...props }, ref) {
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
                    root: classes.textField,
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
