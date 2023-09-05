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
    allowed_to_create,
}) => {
    const [auth_user, setAuthUser] = useState(auth.user)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                auth_user={auth_user}
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
                allowed_to_create={allowed_to_create}
            />
        </AuthenticatedLayout>
    )
}

export default Create
