import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useEffect, useRef, useState } from 'react'
import { FormHelperText } from '@mui/material'

import { makeStyles } from '@mui/styles'
const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiOutlinedInput-root': {
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

const DatePicker = ({ id, name, size = 'medium', label = '', value = null, minDate = null, maxDate = null, onChange, error = '', inputBackground, className = '', required, disabled, ...props }) => {
    const classes = useStyles({ background: inputBackground })

    const inputRef = useRef(null)
    const [newValue, setNewValue] = useState(null)

    const min_date = minDate ? dayjs(minDate).format('YYYY-MM-DD') : null
    const max_date = maxDate ? dayjs(maxDate).format('YYYY-MM-DD') : null

    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {
        if (required && isEmpty) {
            inputRef.current.setCustomValidity('Please fill out this field.')
        } else {
            inputRef.current.setCustomValidity('')
        }

        if (newValue) {
            setNewValue(dayjs(newValue))
        }
    }, [inputRef, newValue, required, isEmpty])

    const handleInputChange = (event) => {
        const newValue = event.target.value
        setNewValue(newValue)

        // Check if the input is empty and update the isEmpty state accordingly
        setIsEmpty(newValue.trim() === '')
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePickerMui
                    format="YYYY-MM-DD"
                    label={label}
                    minDate={dayjs(min_date)}
                    maxDate={dayjs(max_date)}
                    className={`${className} ${error ? 'error' : ''}`}
                    slotProps={{
                        textField: {
                            id: id,
                            name: name,
                            size: size,
                            inputRef: inputRef,
                            required: required ? true : false,
                            classes: { root: inputBackground ? classes.root : '' },
                            onChange: handleInputChange,
                        },
                    }}
                    value={newValue}
                    onChange={(newValue) => {
                        const month = newValue?.$M
                        const day = newValue?.$D
                        const year = newValue?.$y

                        onChange({
                            target: {
                                name: name,
                                value: `${year}-${month + 1 <= 9 ? '0' + (month + 1) : month + 1}-${day <= 9 ? '0' + day : day}`,
                            },
                        })
                    }}
                    disabled={disabled}
                    {...props}
                />
            </LocalizationProvider>
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}
        </>
    )
}

export default DatePicker
