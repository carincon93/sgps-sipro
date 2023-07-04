import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { FormHelperText, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarks({items, id, error, selectedValues}) {
  const [itemsSelected, setItemSelected] = useState([])

  useEffect(() => {
    // const selectedLabels = selectedValues.map((selectedValue) =>
    //     items.find((item) => item.value === selectedValue)?.label
    // );

    // setItemSelected(selectedLabels);

    // console.log(selectedLabels)
  }, [])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setItemSelected(
      // On autofill we get a stringified value.
      typeof value.label === 'string' ? value.split(',') : value,
    )
  }

  return (
    <div>
      <FormControl className='w-full'>
        <InputLabel id={`${id}-multiple-checkbox-label`}>Tag</InputLabel>
        <Select
          labelId={`${id}-multiple-checkbox-label`}
          id={`${id}-multiple-checkbox`}
          multiple
          value={itemsSelected}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {items.map((item) => (
            <MenuItem key={item.value} value={item.label} data-id={item.value}  >
              <Checkbox checked={itemsSelected.indexOf(item.label) > -1} />
              <ListItemText primary={item.label} name="test" />
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText id={`component-error-${id}`} className="!text-red-600">{error}</FormHelperText> }
      </FormControl>
    </div>
  )
}
