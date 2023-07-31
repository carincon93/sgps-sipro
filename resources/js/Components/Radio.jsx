import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import { FormHelperText } from '@mui/material'

export default function RadioMui({ value = '', label = '', error = '', ...props }) {
    return (
        <>
            <FormControlLabel value={value} control={<Radio />} label={label} {...props} />
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}
        </>
    )
}
