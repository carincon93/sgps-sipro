import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/material'

export default function CircularProgressMui({ ...props }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
            <CircularProgress {...props} />
        </Box>
    )
}
