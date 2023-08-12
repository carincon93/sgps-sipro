import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'

const Create = ({ auth, convocatoria, centros_formacion, lineas_programaticas, tipos_proyecto_linea_68, sectores_productivos, estados_sistema_gestion, roles_sennova }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                is_super_admin={is_super_admin}
                method="POST"
                convocatoria={convocatoria}
                centros_formacion={centros_formacion}
                lineas_programaticas={lineas_programaticas}
                tipos_proyecto_linea_68={tipos_proyecto_linea_68}
                sectores_productivos={sectores_productivos}
                estados_sistema_gestion={estados_sistema_gestion}
                roles_sennova={roles_sennova}
            />
        </AuthenticatedLayout>
    )
}

export default Create
