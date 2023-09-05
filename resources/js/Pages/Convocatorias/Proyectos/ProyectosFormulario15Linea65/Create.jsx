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
    actividades_economicas,
    tematicas_estrategicas,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    municipios,
    areas_cualificacion_mnc,
    ejes_sennova,
    roles_sennova,
    allowed_to_create,
    ...props
}) => {
    const auth_user = auth.user

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                auth_user={auth_user}
                method="POST"
                convocatoria={convocatoria}
                centros_formacion={centros_formacion}
                mesas_sectoriales={mesas_sectoriales}
                areas_conocimiento={areas_conocimiento}
                lineas_investigacion={lineas_investigacion}
                lineas_programaticas={lineas_programaticas}
                actividades_economicas={actividades_economicas}
                tematicas_estrategicas={tematicas_estrategicas}
                programas_formacion_con_registro_calificado={programas_formacion_con_registro_calificado}
                programas_formacion_sin_registro_calificado={programas_formacion_sin_registro_calificado}
                municipios={municipios}
                ejes_sennova={ejes_sennova}
                areas_cualificacion_mnc={areas_cualificacion_mnc}
                roles_sennova={roles_sennova}
                allowed_to_create={allowed_to_create}
            />
        </AuthenticatedLayout>
    )
}

export default Create
