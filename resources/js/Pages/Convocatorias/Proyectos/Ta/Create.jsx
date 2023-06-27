import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'

const Create = ({ convocatoria, tecnoacademias, lineasTecnoacademia, allowedToCreate }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    fecha_inicio: null,
    fecha_finalizacion: null,
    max_meses_ejecucion: 0,
    tecnoacademia_id: null,
    centro_formacion_id: null,
    tecnoacademia_linea_tecnoacademia_id: null,
    linea_programatica: null,
  })

  return (
    <>
        Test
    </>
  )
}

export default Create
