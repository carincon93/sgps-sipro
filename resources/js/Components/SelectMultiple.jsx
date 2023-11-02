import AutocompleteMui from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import { FormHelperText } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { useEffect, useState } from 'react'

const useStyles = makeStyles((theme) => ({
    popper: {
        '&.MuiAutocomplete-popper': {
            whiteSpace: 'pre-line',
        },
        '& .MuiAutocomplete-option': {
            fontSize: '12px',
            textTransform: 'uppercase',
        },
    },
    root: {
        '& .MuiFormLabel-root': {
            background: (props) => props.background,
            padding: '0 5px',
            borderRadius: '8px',
            left: '-3px',
        },
    },
    inputRoot: {
        background: (props) => props.background,
    },
}))

export default function SelectMultiple({ id = '', label = '', className = '', error = '', isGroupable = false, options = [], bdValues, inputBackground, required, ...props }) {
    const [selected_options, setSelectedOptions] = useState([])
    const [options_filtered, setOptions] = useState([])
    const classes = useStyles({ background: inputBackground })

    useEffect(() => {
        const tmp_options_filtered = options.map((option) => {
            if (option.tooltip != undefined) {
                const { value, label, group, tooltip } = option
                return { value, label, group, tooltip }
            } else {
                const { value, label, group } = option
                return { value, label, group }
            }
        })

        setOptions(tmp_options_filtered)

        if (bdValues) {
            const selected_values = Array.isArray(bdValues) ? bdValues : [bdValues]

            const options_selected = tmp_options_filtered.filter((option) => selected_values.includes(option.value))

            setSelectedOptions(options_selected)
        }
    }, [bdValues, options])

    return (
        <>
            <AutocompleteMui
                multiple
                limitTags={10}
                classes={{ popper: classes.popper, root: inputBackground ? classes.root : '', inputRoot: classes.inputRoot }}
                className={className}
                id={id}
                value={selected_options}
                options={isGroupable ? options_filtered.sort((a, b) => a.group.toString().localeCompare(b.group.toString())) : options_filtered}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disableClearable={true}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.value}>
                            {option.label}
                        </li>
                    )
                }}
                renderInput={(params) => <TextField {...params} label={label} required={required} />}
                {...props}
            />
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}
        </>
    )
}
