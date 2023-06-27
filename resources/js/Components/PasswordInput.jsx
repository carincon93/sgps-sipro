import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'
import { FormHelperText } from '@mui/material'

export default function PasswordInput({ disabled = false, id = '', name = '', className = '', size = 'medium', label = '', variant = 'outlined', ...props }) {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    return (
        <FormControl variant={variant} {...props} disabled={disabled} className={className} size={size}>
            <InputLabel htmlFor={`${variant}-adornment-password`}>{label}</InputLabel>
                <OutlinedInput
                    id={`outlined-adornment-password-${props.id}`}
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={label}
                />
                {props.error && <FormHelperText id={`component-error-${id}`} className="!text-red-600">{props.error}</FormHelperText> }
        </FormControl>
    )
}
