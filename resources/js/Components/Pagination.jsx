import Pagination from '@mui/material/Pagination'

import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function PaginationMui({ links = [], route_params = '', route_params_value, ...props }) {
    const searchParams = new URLSearchParams(window.location.search)

    const [page, setPage] = useState(searchParams.get('page') ? Number(searchParams.get('page')) : 1)

    const handleChange = (event, value) => {
        const searchQuery = searchParams.get('search')

        if (searchQuery) {
            router.visit(`?search=${searchQuery}&page=${value}`, { preserveScroll: true })
        } else if (route_params) {
            router.visit(`?${route_params}=${route_params_value}&page=${value}`, { preserveScroll: true })
        } else {
            router.visit(`?page=${value}`, { preserveScroll: true })
        }

        setPage(value)
    }

    return <>{links.length > 3 && <Pagination count={Number(links[links.length - 2].label)} page={page} onChange={handleChange} {...props} />}</>
}
