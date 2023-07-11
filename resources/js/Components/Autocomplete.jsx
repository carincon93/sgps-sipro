import TextField from '@mui/material/TextField'
import AutocompleteMui from '@mui/material/Autocomplete'
import { FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'

export default function Autocomplete({ id = '', label = '', className = '', error = '', options = [], selectedValue, ...props }) {
    const [selectedOption, setSelectedOption] = useState(null)

    useEffect(() => {
        setSelectedOption(options.find((option) => option.value == selectedValue) || null)
    }, [selectedValue])

    return (
        <>
            <AutocompleteMui
                disablePortal
                className={className}
                id={id}
                value={selectedOption}
                options={options}
                disableClearable={true}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.value}>
                            {option.label}
                        </li>
                    )
                }}
                renderInput={(params) => <TextField {...params} label={label} />}
                {...props}
            />
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {props.error}
                </FormHelperText>
            )}
        </>
    )
}
