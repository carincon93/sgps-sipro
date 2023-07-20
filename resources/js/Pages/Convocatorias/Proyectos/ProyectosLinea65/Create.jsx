import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'

const Create = ({
    auth,
    convocatoria,
    centrosFormacion,
    mesasSectoriales,
    areasConocimiento,
    lineasInvestigacion,
    lineasProgramaticas,
    lineasTecnoacademia,
    actividadesEconomicas,
    tematicasEstrategicas,
    tecnoacademia,
    tecnoacademias,
    programasFormacionConRegistroCalificado,
    programasFormacionSinRegistroCalificado,
    municipios,
    tiposProyectos,
    tiposEventos,
    roles,
    ...props
}) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                isSuperAdmin={isSuperAdmin}
                method="crear"
                convocatoria={convocatoria}
                centrosFormacion={centrosFormacion}
                mesasSectoriales={mesasSectoriales}
                areasConocimiento={areasConocimiento}
                lineasInvestigacion={lineasInvestigacion}
                lineasProgramaticas={lineasProgramaticas}
                lineasTecnoacademia={lineasTecnoacademia}
                actividadesEconomicas={actividadesEconomicas}
                tematicasEstrategicas={tematicasEstrategicas}
                tecnoacademia={tecnoacademia}
                tecnoacademias={tecnoacademias}
                programasFormacionConRegistroCalificado={programasFormacionConRegistroCalificado}
                programasFormacionSinRegistroCalificado={programasFormacionSinRegistroCalificado}
                municipios={municipios}
                tiposProyectos={tiposProyectos}
                tiposEventos={tiposEventos}
                roles={roles}
            />
        </AuthenticatedLayout>
    )
}

export default Create
