import fitTextarea from 'fit-textarea'

import { makeStyles } from '@mui/styles'
import { FormHelperText, TextField } from '@mui/material'

import { useRef, useLayoutEffect } from 'react'

const useStyles = makeStyles({
    root: {
        '& .MuiFormLabel-root': {
            background: (props) => props.background,
            padding: '0 5px',
            borderRadius: '8px',
            left: '-3px',
        },

        '& .MuiInputBase-root': {
            background: (props) => props.background,
            borderRadius: '4px',
            paddingRight: '3.5rem',
        },
    },
})
const Textarea = ({ error, id, value = '', label = '', disabled, inputBackground, className, ...props }) => {
    const containerRef = useRef(null)
    const classes = useStyles({ background: inputBackground })

    useLayoutEffect(() => {
        const textarea = containerRef.current.querySelector('textarea')

        fitTextarea.watch(textarea)
        textarea.setAttribute('id', id)
    }, [value !== null])

    if (value === null) {
        value = ''
    }

    return (
        <div ref={containerRef}>
            <TextField
                disabled={disabled}
                value={value}
                error={error}
                label={label}
                multiline
                color="secondary"
                rows={4}
                className={`w-full p-1 block ${className || ''}`}
                classes={{
                    root: inputBackground ? classes.root : '',
                }}
                {...props}
            />
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}
        </div>
    )
}

export default Textarea
