import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

// import Stepper from '@/Components/Stepper';

import Form from './Form'

import { checkRole } from '@/Utils'

const Create = ({ auth, convocatoria, centrosFormacion, lineasProgramaticas, tiposProyectoSt, sectoresProductivos, estadosSistemaGestion, programasFormacionConRegistroCalificado, rolesSennova }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                isSuperAdmin={isSuperAdmin}
                method="crear"
                convocatoria={convocatoria}
                centrosFormacion={centrosFormacion}
                lineasProgramaticas={lineasProgramaticas}
                tiposProyectoSt={tiposProyectoSt}
                sectoresProductivos={sectoresProductivos}
                estadosSistemaGestion={estadosSistemaGestion}
                rolesSennova={rolesSennova}
                programasFormacionConRegistroCalificado={programasFormacionConRegistroCalificado}
            />
        </AuthenticatedLayout>
    )
}

export default Create
