import { Tooltip, Typography } from '@mui/material'

import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    popper: {
        '&.MuiTooltip-popper > .MuiTooltip-tooltip': {
            backgroundColor: '#fff',
            color: '#374151',
            padding: '1rem',
            marginTop: '0px',
            backgroundImage: 'url(/images/cyan-blur.png)',
            backgroundSize: '5.2rem',
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundPosition: 'right top, left bottom',
            whiteSpace: 'pre-line',
            boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
        },
        '&.MuiTooltip-popper > .MuiTooltip-tooltip > .MuiTooltip-arrow': {
            color: 'white',
        },
    },
}))

export default function ToolTipMui({ title = {}, children, className = '', ...props }) {
    const classes = useStyles()

    return (
        <Tooltip title={title} arrow className={`inline-block ` + className} classes={{ popper: classes.popper }} {...props}>
            <Typography className="whitespace-pre-line">{children}</Typography>
        </Tooltip>
    )
}
