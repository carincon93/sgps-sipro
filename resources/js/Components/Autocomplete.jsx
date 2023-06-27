import * as React from 'react';
import TextField from '@mui/material/TextField';
import AutocompleteMui from '@mui/material/Autocomplete';
import { FormHelperText } from '@mui/material';

export default function Autocomplete({id = '', label = '', className = '', options = [], ...props}) {
  return (
    <>
        <AutocompleteMui
            disablePortal
            className={className}
            id={id}
            options={options}
            renderInput={(params) => <TextField {...params} label={label} />}
            {...props}
        />
        {props.error && <FormHelperText id={`component-error-${id}`} className="!text-red-600">{props.error}</FormHelperText> }
    </>
  )
}
