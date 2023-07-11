import { useRef, useLayoutEffect } from 'react'
import { FormHelperText, TextField } from '@mui/material'
import fitTextarea from 'fit-textarea'

const Textarea = ({ error, id, value = '', label = '', disabled, ...props }) => {
    const containerRef = useRef(null)

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
            <TextField disabled={disabled} value={value} error={error} label={label} multiline rows={4} className={`w-full p-1 block bg-white ${props.className || ''}`} {...props} />
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}
        </div>
    )
}

export default Textarea
