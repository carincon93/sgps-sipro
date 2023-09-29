import React, { useState, useEffect } from 'react'

function DaysCountdown({ max_date, ...props }) {
    const [days_left, setDaysLeft] = useState(0)

    useEffect(() => {
        // Parse the max_date string in "DD-MM-YYYY" format
        const [day, month, year] = max_date.split('-').map(Number)

        // Create a JavaScript Date object for the max date in UTC
        const max_date_object = new Date(Date.UTC(year, month - 1, day)) // Months are zero-based in JavaScript

        // Get the current date in Bogotá (UTC-5) timezone
        const current_date = new Date()
        current_date.setUTCHours(current_date.getUTCHours() - 5)

        // Adjust the max date to the Bogotá (UTC-5) timezone
        max_date_object.setUTCHours(max_date_object.getUTCHours() - 5)

        // Calculate the difference in milliseconds
        const time_difference = max_date_object - current_date

        // Calculate the number of days
        const days_difference = Math.ceil(time_difference / (1000 * 60 * 60 * 24))

        setDaysLeft(days_difference)
    }, [max_date])

    return <div {...props}> {days_left >= 0 ? <p className="text-[12px]">{days_left} días para finalizar la etapa de formulación</p> : <p>Ha finalizado la etapa de formulación</p>}</div>
}

export default DaysCountdown
