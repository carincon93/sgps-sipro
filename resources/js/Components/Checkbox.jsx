import CheckboxMui from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

export default function Checkbox({ label = '', name, prevData, checked: formDataCheckedStatus, ...props }) {
    return (
        <FormControlLabel label={label} {...props} control={<CheckboxMui name={name} checked={formDataCheckedStatus} inputProps={{ 'aria-label': 'controlled' }} />} />
    );
}
