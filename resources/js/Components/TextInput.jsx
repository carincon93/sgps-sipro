import TextField from '@mui/material/TextField'

import PropTypes from 'prop-types'
import { forwardRef } from 'react'

import { NumericFormat } from 'react-number-format'

import { FormHelperText } from '@mui/material'
import { makeStyles } from '@mui/styles'

const NumericFormatCustom = forwardRef(function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                })
            }}
            thousandSeparator="."
            decimalSeparator=","
            valueIsNumericString
        />
    )
})

NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const useStyles = makeStyles({
    root: {
        '& .MuiFormLabel-root': {
            background: (props) => props.background,
            padding: '0 5px',
            borderRadius: '8px',
            left: '-4px',
        },

        '& .MuiInputBase-root': {
            background: (props) => props.background,
            borderRadius: '4px',
        },
    },
})

export default function TextInput({ id = '', name = '', inputBackground, error = '', isCurrency = false, className = '', ...props }) {
    const classes = useStyles({ background: inputBackground })

    return (
        <>
            <TextField
                name={name}
                error={error ? true : false}
                InputProps={{
                    inputComponent: isCurrency ? NumericFormatCustom : null,
                }}
                classes={{
                    root: inputBackground ? classes.root : '',
                }}
                variant="outlined"
                className={'w-full ' + className}
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
