import TextField from '@mui/material/TextField'
import AutocompleteMui from '@mui/material/Autocomplete'
import { FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'

export default function SelectMultiple({ id = '', label = '', className = '', error = '', isGroupable = false, options = [], bdValues, ...props }) {
    const [selectedOptions, setSelectedOptions] = useState([])

    useEffect(() => {
        const selectedValues = Array.isArray(bdValues) ? bdValues : [bdValues]
        const optionsSelected = options.filter((option) => selectedValues.includes(option.value))
        setSelectedOptions(optionsSelected)
    }, [bdValues, options])

    return (
        <>
            <AutocompleteMui
                disablePortal
                multiple
                className={className}
                id={id}
                value={selectedOptions}
                options={
                    isGroupable
                        ? options.map((option) => ({
                              ...option,
                              firstLetter: option?.group[0].toUpperCase(),
                          }))
                        : options
                }
                groupBy={(option) => option.group}
                disableClearable={true}
                getOptionLabel={(option) => option.label}
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
