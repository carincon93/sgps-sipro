import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'

import { useState } from 'react'
import { Head } from '@inertiajs/react'

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
    areas_cualificacion_mnc,
    lineas_estrategicas,
    roles_sennova,
    allowed_to_create,
}) => {
    const [auth_user, setAuthUser] = useState(auth.user)

    return (
        <AuthenticatedLayout>
            <Head title="Formular proyecto" />

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
                areas_cualificacion_mnc={areas_cualificacion_mnc}
                lineas_estrategicas={lineas_estrategicas}
                roles_sennova={roles_sennova}
                allowed_to_create={allowed_to_create}
            />
        </AuthenticatedLayout>
    )
}

export default Create
