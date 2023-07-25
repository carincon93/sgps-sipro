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

export default function SelectMultiple({ id = '', label = '', className = '', error = '', isGroupable = false, options = [], bdValues, inputBackground, ...props }) {
    const [selectedOptions, setSelectedOptions] = useState([])
    const [optionsFiltered, setOptions] = useState([])
    const classes = useStyles({ background: inputBackground })

    useEffect(() => {
        const tmpOptionsFiltered = options.map((option) => {
            if (option.tooltip != undefined) {
                const { value, label, group, tooltip } = option
                return { value, label, group, tooltip }
            } else {
                const { value, label, group } = option
                return { value, label, group }
            }
        })

        setOptions(tmpOptionsFiltered)

        if (bdValues) {
            const selectedValues = Array.isArray(bdValues) ? bdValues : [bdValues]

            const optionsSelected = tmpOptionsFiltered.filter((option) => selectedValues.includes(option.value))

            setSelectedOptions(optionsSelected)
        }
    }, [bdValues, options])

    return (
        <>
            <AutocompleteMui
                disablePortal
                multiple
                limitTags={10}
                classes={{ popper: classes.popper, root: inputBackground ? classes.root : '', inputRoot: classes.inputRoot }}
                className={className}
                id={id}
                value={selectedOptions}
                options={isGroupable ? optionsFiltered.sort((a, b) => a.group.toString().localeCompare(b.group.toString())) : optionsFiltered}
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
