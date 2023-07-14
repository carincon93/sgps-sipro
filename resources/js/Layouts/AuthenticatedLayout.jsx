import MiniDrawer from '@/Components/Drawer'
import SnackbarMui from '@/Components/Snackbar'

import { usePage } from '@inertiajs/react'
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
                <div className="md:max-w-full 2xl:max-w-[1536px] px-6 mx-auto">{children}</div>
            </MiniDrawer>
            {flash.success || flash.error || flash.warn ? <SnackbarMui pageStatus={true} severity={severity} message={flash.success || flash.error || flash.warn} /> : null}
        </>
    )
}
