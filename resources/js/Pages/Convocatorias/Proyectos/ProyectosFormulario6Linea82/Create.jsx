import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'

import { useState } from 'react'

const Create = ({
    auth,
    convocatoria,
    centros_formacion,
    disciplinas_subarea_conocimiento,
    lineas_investigacion,
    actividades_economicas,
    tematicas_estrategicas,
    redes_conocimiento,
    grupos_investigacion,
    lineas_investigacion_eni,
    areas_tematicas_eni,
    areas_cualificacion_mnc,
    roles_sennova,
}) => {
    const [auth_user, setAuthUser] = useState(auth.user)
    const [is_super_admin, setIsSuperAdmin] = useState(checkRole(auth_user, [1]))

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                is_super_admin={is_super_admin}
                method="POST"
                convocatoria={convocatoria}
                centros_formacion={centros_formacion}
                disciplinas_subarea_conocimiento={disciplinas_subarea_conocimiento}
                lineas_investigacion={lineas_investigacion}
                actividades_economicas={actividades_economicas}
                tematicas_estrategicas={tematicas_estrategicas}
                redes_conocimiento={redes_conocimiento}
                grupos_investigacion={grupos_investigacion}
                lineas_investigacion_eni={lineas_investigacion_eni}
                areas_tematicas_eni={areas_tematicas_eni}
                areas_cualificacion_mnc={areas_cualificacion_mnc}
                roles_sennova={roles_sennova}
            />
        </AuthenticatedLayout>
    )
}

export default Create
