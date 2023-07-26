import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'

const Create = ({
    auth,
    convocatoria,
    centros_formacion,
    mesas_sectoriales,
    areas_conocimiento,
    lineas_investigacion,
    lineas_programaticas,
    lineas_tecnoacademia,
    actividades_economicas,
    tematicas_estrategicas,
    tecnoacademia,
    tecnoacademias,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    municipios,
    tipos_proyectos,
    tipos_eventos,
    roles_sennova,
    ...props
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                is_super_admin={is_super_admin}
                method="crear"
                centros_formacion={centros_formacion}
                mesas_sectoriales={mesas_sectoriales}
                areas_conocimiento={areas_conocimiento}
                lineas_investigacion={lineas_investigacion}
                lineas_programaticas={lineas_programaticas}
                lineas_tecnoacademia={lineas_tecnoacademia}
                actividades_economicas={actividades_economicas}
                tematicas_estrategicas={tematicas_estrategicas}
                tecnoacademia={tecnoacademia}
                tecnoacademias={tecnoacademias}
                programas_formacion_con_registro_calificado={programas_formacion_con_registro_calificado}
                programas_formacion_sin_registro_calificado={programas_formacion_sin_registro_calificado}
                municipios={municipios}
                tipos_proyectos={tipos_proyectos}
                tipos_eventos={tipos_eventos}
                roles_sennova={roles_sennova}
            />
        </AuthenticatedLayout>
    )
}

export default Create
