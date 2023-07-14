import debounce from 'lodash/debounce'
import pickBy from 'lodash/pickBy'

import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { route } from '@/Utils'

import { router, useForm } from '@inertiajs/react'

const SearchBar = ({ routeParams = '', placeholder = 'Buscar…', inputBackground = '', ...props }) => {
    const form = useForm({ search: '' })

    const reset = () => {
        form.reset()
        router.get(route(route().current(), routeParams), {}, { preserveState: true, preserveScroll: true })
    }

    const search = debounce(() => {
        const query = pickBy(form.data)
        router.get(route(route().current(), routeParams), Object.keys(query).length ? query : { remember: 'forget' }, { preserveState: true, preserveScroll: true })
    }, 150)

    return (
        <div {...props} className={`flex items-center ${props.className || ''}`}>
            <TextInput className="relative w-full px-6 py-3 rounded focus:shadow-outline" size="small" autoComplete="false" type="text" name="search" inputBackground={inputBackground} placeholder={placeholder} value={form.data.search} onChange={(e) => form.setData('search', e.target.value)} />

            <PrimaryButton className="ml-3 text-sm text-gray-500 hover:text-gray-700 focus:text-app-500" type="button" onClick={() => search()} disabled={form.data.search == ''}>
                Buscar
            </PrimaryButton>
        </div>
    )
}

export default SearchBar
