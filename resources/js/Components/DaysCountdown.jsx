import React, { useState, useEffect } from 'react'

function DaysCountdown({ max_date, ...props }) {
    const [daysLeft, setDaysLeft] = useState(0)

    useEffect(() => {
        // Parse the max_date string in "DD-MM-YYYY" format
        const [day, month, year] = max_date.split('-').map(Number)

        // Create a JavaScript Date object for the max date in UTC
        const maxDateObject = new Date(Date.UTC(year, month - 1, day)) // Months are zero-based in JavaScript

        // Get the current date in Bogotá (UTC-5) timezone
        const currentDate = new Date()
        currentDate.setUTCHours(currentDate.getUTCHours() - 5)

        // Adjust the max date to the Bogotá (UTC-5) timezone
        maxDateObject.setUTCHours(maxDateObject.getUTCHours() - 5)

        // Calculate the difference in milliseconds
        const timeDifference = maxDateObject - currentDate

        // Calculate the number of days
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

        setDaysLeft(daysDifference)
    }, [max_date])

    return <div {...props}> {daysLeft >= 0 ? <p className="text-[12px]">{daysLeft} días para finalizar la etapa de formulación</p> : <p>Ha finalizado la etapa de formulación</p>}</div>
}

export default DaysCountdown
