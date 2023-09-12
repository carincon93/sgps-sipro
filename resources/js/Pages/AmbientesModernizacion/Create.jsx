import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { checkRole } from '@/Utils'

import Form from './Form'

const Edit = ({
    auth,
    centros_formacion,
    codigos_sgps,
    mesas_sectoriales,
    tipologias_ambientes,
    disciplinas_subarea_conocimiento,
    programas_formacion_con_registro,
    programas_formacion_sin_registro,
    tematicas_estrategicas,
    redes_conocimiento,
    actividades_economicas,
    lineas_investigacion,
    semilleros_investigacion,
    roles,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Seguimiento post cierre - Ambientes de modernización SENNOVA</h2>}>
            <Form
                auth_user={auth_user}
                method="POST"
                centros_formacion={centros_formacion}
                codigos_sgps={codigos_sgps}
                mesas_sectoriales={mesas_sectoriales}
                tipologias_ambientes={tipologias_ambientes}
                disciplinas_subarea_conocimiento={disciplinas_subarea_conocimiento}
                programas_formacion_con_registro={programas_formacion_con_registro}
                programas_formacion_sin_registro={programas_formacion_sin_registro}
                tematicas_estrategicas={tematicas_estrategicas}
                redes_conocimiento={redes_conocimiento}
                actividades_economicas={actividades_economicas}
                lineas_investigacion={lineas_investigacion}
                semilleros_investigacion={semilleros_investigacion}
                roles={roles}
            />
        </AuthenticatedLayout>
    )
}

export default Edit
