import MiniDrawer from '@/Components/Drawer'
import SnackbarMui from '@/Components/Snackbar'

import { usePage } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Authenticated({ header, children }) {
    const { auth, flash } = usePage().props
    const [severity, setSeverity] = useState('')

    useEffect(() => {
        if (flash.success) {
            setSeverity('success')
        } else if (flash.error) {
            setSeverity('error')
        } else {
            setSeverity('warn')
        }
    }, [flash])

    return (
        <>
            <MiniDrawer user={auth.user}>
                <Grid container={true} maxWidth="lg" spacing={2} justifyContent="center" alignItems="center" className="!m-auto py-4">
                    {children}
                </Grid>
            </MiniDrawer>
            {flash.success || flash.error || flash.warn ? <SnackbarMui pageStatus={true} severity={severity} message={flash.success || flash.error || flash.warn} /> : null}
        </>
    )
}
