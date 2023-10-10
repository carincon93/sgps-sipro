import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'
import { Head } from '@inertiajs/react'

const Create = ({
    auth,
    convocatoria,
    centros_formacion,
    mesas_sectoriales,
    areas_conocimiento,
    disciplinas_subarea_conocimiento,
    lineas_investigacion,
    lineas_programaticas,
    ejes_sennova,
    areas_cualificacion_mnc,
    lineas_estrategicas_sena,
    lineas_tecnoacademia,
    actividades_economicas,
    tematicas_estrategicas,
    redes_conocimiento,
    tecnoacademia,
    tecnoacademias,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    municipios,
    tipos_eventos,
    roles_sennova,
    allowed_to_create,
    ...props
}) => {
    const auth_user = auth.user

    return (
        <AuthenticatedLayout>
            <Head title="Formular proyecto" />

            <Form
                auth_user={auth_user}
                method="POST"
                convocatoria={convocatoria}
                centros_formacion={centros_formacion}
                mesas_sectoriales={mesas_sectoriales}
                areas_conocimiento={areas_conocimiento}
                disciplinas_subarea_conocimiento={disciplinas_subarea_conocimiento}
                lineas_investigacion={lineas_investigacion}
                lineas_programaticas={lineas_programaticas}
                ejes_sennova={ejes_sennova}
                areas_cualificacion_mnc={areas_cualificacion_mnc}
                lineas_estrategicas_sena={lineas_estrategicas_sena}
                lineas_tecnoacademia={lineas_tecnoacademia}
                actividades_economicas={actividades_economicas}
                tematicas_estrategicas={tematicas_estrategicas}
                redes_conocimiento={redes_conocimiento}
                tecnoacademia={tecnoacademia}
                tecnoacademias={tecnoacademias}
                programas_formacion_con_registro_calificado={programas_formacion_con_registro_calificado}
                programas_formacion_sin_registro_calificado={programas_formacion_sin_registro_calificado}
                municipios={municipios}
                tipos_eventos={tipos_eventos}
                roles_sennova={roles_sennova}
                allowed_to_create={allowed_to_create}
            />
        </AuthenticatedLayout>
    )
}

export default Create
