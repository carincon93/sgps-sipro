import Menu from '@mui/material/Menu';
import { useState } from 'react';
import ButtonMui from '@/Components/Button';

export default function MenuMui({children, ...props}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonMui
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        backgroundColor='transparent'
        backgroundColorHover="#37415129"
        colorHover="#374151"
        {...props}
      >
        {props.text}
      </ButtonMui>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {children}
      </Menu>
    </>
  );
}
