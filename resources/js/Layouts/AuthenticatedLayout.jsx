import { useState } from 'react'
import MiniDrawer from '@/Components/Drawer'

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

    return (
        <MiniDrawer user={user}>
            <div className="md:max-w-full 2xl:max-w-[1536px] px-6 mx-auto">{children}</div>
        </MiniDrawer>
    )
}
