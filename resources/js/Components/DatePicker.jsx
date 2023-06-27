import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useEffect, useRef, useState } from 'react'

const DatePicker = ({ id, name, size = 'small', label, value = null, onChange, required, disabled, ...props }) => {
    const inputRef = useRef(null)
    const [newValue, setNewValue] = useState(null)

    useEffect(() => {
        if (inputRef.current) {
            if (value?.indexOf('NaN') !== -1) {
                inputRef.current.setCustomValidity('Please fill out this field.')
            } else if (value != null) {
                inputRef.current.setCustomValidity('')
            }
        }

        if (value) {
            setNewValue(dayjs(value))
        }
    }, [value])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePickerMui
                format="DD-MM-YYYY"
                label={label}
                slotProps={{
                    textField: {
                        id: id,
                        name: name,
                        size: size,
                        inputRef: inputRef,
                        required: required ? true : undefined,
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
                            value: `${month + 1 <= 9 ? '0' + (month + 1) : month + 1}-${day <= 9 ? '0' + day : day}-${year}`,
                        },
                    })
                }}
                disabled={disabled}
                {...props}
            />
        </LocalizationProvider>

    )
}

export default DatePicker
