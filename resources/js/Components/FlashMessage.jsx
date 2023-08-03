import SnackbarMui from '@/Components/Snackbar'

import { usePage } from '@inertiajs/react'

import React, { useState, useEffect } from 'react'
const FlashMessage = () => {
    const {
        props: { flash, errors },
    } = usePage()
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const { success, error } = flash

        if (success) {
            setShowSuccessMessage(true)
            setSuccessMessage(success)

            setTimeout(() => {
                setShowSuccessMessage(false)
                setSuccessMessage(null)
            }, 10000)
        }

        if (error) {
            setShowErrorMessage(true)
            setErrorMessage(error)

            setTimeout(() => {
                setShowErrorMessage(false)
                setErrorMessage(null)
            }, 10000)
        }

        if (Object.keys(errors).length > 0) {
            setShowErrorMessage(true)
            setErrorMessage(
                'Errorres: ' +
                    Object.values(errors)
                        .map((error) => '• ' + error)
                        .join(' '),
            )

            setTimeout(() => {
                setShowErrorMessage(false)
                setErrorMessage(null)
            }, 20000)
        }
    }, [flash, errors])

    return (
        <div>
            {(showSuccessMessage && successMessage) || (showErrorMessage && errorMessage) ? (
                <div className="fixed flex h-full flex-col items-center justify-center left-0 right-0" style={{ zIndex: 9999 }}>
                    <SnackbarMui message={successMessage ? successMessage : errorMessage ? errorMessage : ''} />
                </div>
            ) : null}
        </div>
    )
}

export default FlashMessage
