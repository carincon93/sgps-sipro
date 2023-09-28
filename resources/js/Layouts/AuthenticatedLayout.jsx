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
                <DaysCountdown max_date="20-10-2023" className="bg-gradient-to-r from-rose-500 via-red-400 to-red-500 p-2 text-center text-white rounded shadow fixed right-[40%] top-[1.25%] z-[99999]" />
                <Grid container={true} maxWidth="lg" spacing={2} justifyContent="center" alignItems="center" className="!m-auto pt-4 pb-40">
                    {children}
                    <HelpDesk />
                </Grid>
            </MiniDrawer>
            <FlashMessage />
        </>
    )
}
