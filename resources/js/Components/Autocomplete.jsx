import AutocompleteMui from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import ToolTipMui from '@/Components/Tooltip'

import { FormHelperText } from '@mui/material'
import { makeStyles } from '@mui/styles'

import React, { useEffect, useState } from 'react'
import { useRef } from 'react'

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
        '&.MuiFormLabel-root': {
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

export default function Autocomplete({
    id = '',
    label = '',
    className = '',
    error = '',
    options = [],
    isGroupable = false,
    disabled = false,
    selectedValue,
    inputBackground,
    required = false,
    ...props
}) {
    const classes = useStyles({ background: inputBackground })

    const [selected_option, setSelectedOption] = useState(null)
    const [options_filtered, setOptions] = useState([])
    const inputRef = useRef(null)

    useEffect(() => {
        const tmp_options_filtered = options.map((option) => {
            if (option.tooltip) {
                const { value, label, tooltip } = option
                return { value, label, tooltip }
            } else if (option.group) {
                const { value, label, group } = option
                return { value, label, group }
            } else if (option.group && option.tooltip) {
                const { value, label, group, tooltip } = option
                return { value, label, group, tooltip }
            } else {
                const { value, label } = option
                return { value, label }
            }
        })

        setOptions(tmp_options_filtered)

        setSelectedOption(options.find((option) => option.value == selectedValue) || null)
    }, [selectedValue])

    return (
        <>
            <AutocompleteMui
                disabled={disabled}
                className={`${className} ${error ? 'error' : ''}`}
                classes={{ popper: classes.popper, root: inputBackground ? classes.root : '', inputRoot: classes.inputRoot }}
                id={id}
                value={selected_option}
                options={isGroupable ? options_filtered.sort((a, b) => a.group.toString().localeCompare(b.group.toString())) : options_filtered}
                disableClearable={true}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => {
                    return (
                        <React.Fragment key={option.value} className="odd:bg-white even:bg-slate-50">
                            {option.tooltip ? (
                                <ToolTipMui title={option.tooltip} className="!block ">
                                    <li {...props}>{option.label}</li>
                                </ToolTipMui>
                            ) : (
                                <li {...props}>{option.label}</li>
                            )}
                        </React.Fragment>
                    )
                }}
                renderInput={(params) => <TextField {...params} label={label} inputRef={inputRef} required={required} />}
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
