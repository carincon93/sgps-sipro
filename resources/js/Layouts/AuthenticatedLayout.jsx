import { useState } from 'react'
import MiniDrawer from '@/Components/Drawer'

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

    return (
        <div className="min-h-screen">
            <MiniDrawer user={user}>
                <div className="md:max-w-full 2xl:max-w-[1536px] mx-auto">{children}</div>
            </MiniDrawer>
        </div>
    )
}
