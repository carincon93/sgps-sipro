import DaysCountdown from '@/Components/DaysCountdown'
import FlashMessage from '@/Components/FlashMessage'
import MiniDrawer from '@/Components/Drawer'

import HelpDesk from './HelpDesk'

import { usePage } from '@inertiajs/react'
import { Grid } from '@mui/material'

export default function Authenticated({ header, children }) {
    const { auth } = usePage().props

    return (
        <>
            <MiniDrawer user={auth.user}>
                <Grid container={true} maxWidth="lg" spacing={2} justifyContent="center" alignItems="center" className="!m-auto pt-4 pb-40">
                    {children}
                    <HelpDesk />
                </Grid>
            </MiniDrawer>
            <FlashMessage />
        </>
    )
}
