import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'
import { Head } from '@inertiajs/react'

const Create = ({ auth, convocatoria, centros_formacion, lineas_programaticas, tipos_proyecto_linea_68, sectores_productivos, estados_sistema_gestion, roles_sennova, allowed_to_create }) => {
    const auth_user = auth.user

    return (
        <AuthenticatedLayout>
            <Head title="Formular proyecto" />

            <Form
                auth_user={auth_user}
                method="POST"
                convocatoria={convocatoria}
                centros_formacion={centros_formacion}
                lineas_programaticas={lineas_programaticas}
                tipos_proyecto_linea_68={tipos_proyecto_linea_68}
                sectores_productivos={sectores_productivos}
                estados_sistema_gestion={estados_sistema_gestion}
                roles_sennova={roles_sennova}
                allowed_to_create={allowed_to_create}
            />
        </AuthenticatedLayout>
    )
}

export default Create
