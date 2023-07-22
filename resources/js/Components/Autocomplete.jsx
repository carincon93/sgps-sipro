import AutocompleteMui from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { FormHelperText } from '@mui/material'
import { makeStyles } from '@mui/styles'

import ToolTipMui from './Tooltip'

import React, { useEffect, useState } from 'react'

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
            left: '-4px',
        },
    },
    inputRoot: {
        background: (props) => props.background,
    },
}))

export default function Autocomplete({ id = '', label = '', className = '', error = '', options = [], isGroupable = false, selectedValue, inputBackground, ...props }) {
    const classes = useStyles({ background: inputBackground })

    const [selectedOption, setSelectedOption] = useState(null)
    const [optionsFiltered, setOptions] = useState([])

    useEffect(() => {
        const tmpOptionsFiltered = options.map((option) => {
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

        setOptions(tmpOptionsFiltered)

        setSelectedOption(options.find((option) => option.value == selectedValue) || null)
    }, [selectedValue])

    return (
        <>
            <AutocompleteMui
                disablePortal
                className={className}
                classes={{ popper: classes.popper, root: inputBackground ? classes.root : '', inputRoot: classes.inputRoot }}
                id={id}
                value={selectedOption}
                options={isGroupable ? optionsFiltered.sort((a, b) => a.group.toString().localeCompare(b.group.toString())) : optionsFiltered}
                disableClearable={true}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => {
                    return (
                        <React.Fragment key={option.value}>
                            {option.tooltip ? (
                                <ToolTipMui title={option.tooltip} className="!block">
                                    <li {...props}>{option.label}</li>
                                </ToolTipMui>
                            ) : (
                                <li {...props}>{option.label}</li>
                            )}
                        </React.Fragment>
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
