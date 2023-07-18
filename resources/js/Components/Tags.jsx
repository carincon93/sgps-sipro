import Tagify from '@yaireo/tagify'

import '@yaireo/tagify/dist/tagify.css'

import { useEffect, useRef } from 'react'
import { FormHelperText } from '@mui/material'

const Tags = ({ error, placeholder, whitelist, tags, value = '', id, enforceWhitelist = true, ...props }) => {
    const inputElm = useRef(null)
    const tagify = useRef(null)

    useEffect(() => {
        inputElm.current = document.getElementById(id)

        if (inputElm.current) {
            tagify.current = new Tagify(inputElm.current, {
                enforceWhitelist: enforceWhitelist,
                whitelist: inputElm.current.value.trim().split(/\s*,\s*/),
            })

            tagify.current.on('add', onAddTag).on('remove', onRemoveTag).on('input', onInput).on('edit', onTagEdit).on('dropdown:hide dropdown:show')
        }

        return () => {
            if (tagify.current) {
                tagify.current.destroy()
            }
        }
    }, [id, enforceWhitelist, whitelist])

    const mockAjax = (duration) => {
        let timeout
        return new Promise((resolve, reject) => {
            timeout = setTimeout(resolve, duration || 700, whitelist)
        })
    }

    const onAddTag = (e) => {
        tags = inputElm.current.value
    }

    const onRemoveTag = (e) => {
        tags = inputElm.current.value
    }

    const onTagEdit = (e) => {
        tags = inputElm.current.value
    }

    const onInput = (e) => {
        tagify.current.settings.whitelist.length = 0
        tagify.current.loading(true).dropdown.hide.call(tagify.current)

        mockAjax().then((result) => {
            if (result !== undefined) {
                tagify.current.settings.whitelist.push(...result, ...tagify.current.value)
            }

            tagify.current.loading(false).dropdown.show.call(tagify.current, e.detail.value)
        })
    }

    if (value === null) {
        value = ''
    }

    return (
        <>
            <input id={id} name="tags" {...props} placeholder={placeholder} value={value} {...props} />
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}
        </>
    )
}

export default Tags
