import Switch from '@mui/material/Switch';

export default function ControlledSwitches({checked = false, setData, disabled, onMessage = 'Si', offMessage = 'No', ...props}) {
  return (
    <Switch
      checked={checked}
      label={checked ? onMessage : offMessage}
      inputProps={{ 'aria-label': 'controlled' }}
      {...props}
    />
  );
}
