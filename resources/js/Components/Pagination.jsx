import Pagination from '@mui/material/Pagination'

import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function PaginationControlled({ links = [], routeParams = '', ...props }) {
    const searchParams = new URLSearchParams(window.location.search)

    const [page, setPage] = useState(searchParams.get('page') ? Number(searchParams.get('page')) : 1)

    const handleChange = (event, value) => {
        const searchQuery = searchParams.get('search')

        if (searchQuery) {
            router.visit(`?search=${searchQuery}&page=${value}`, { preserveScroll: true })
        } else {
            router.visit(`?page=${value}`, { preserveScroll: true })
        }

        setPage(value)
    }

    return <>{links.length > 3 && <Pagination count={Number(links[links.length - 2].label)} page={page} onChange={handleChange} {...props} />}</>
}
