import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'

import { useState } from 'react'

const Create = ({
    auth,
    convocatoria,
    centrosFormacion,
    disciplinasSubareaConocimiento,
    lineasInvestigacion,
    lineasProgramaticas,
    actividadesEconomicas,
    tematicasEstrategicas,
    redesConocimiento,
    gruposInvestigacion,
    lineasInvestigacionEni,
    areasTematicasEni,
    rolesSennova,
}) => {
    const [authUser, setAuthUser] = useState(auth.user)
    const [isSuperAdmin, setIsSuperAdmin] = useState(checkRole(authUser, [1]))

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                isSuperAdmin={isSuperAdmin}
                method="crear"
                convocatoria={convocatoria}
                centrosFormacion={centrosFormacion}
                lineasProgramaticas={lineasProgramaticas}
                gruposInvestigacion={gruposInvestigacion}
                redesConocimiento={redesConocimiento}
                disciplinasSubareaConocimiento={disciplinasSubareaConocimiento}
                actividadesEconomicas={actividadesEconomicas}
                tematicasEstrategicas={tematicasEstrategicas}
                lineasInvestigacion={lineasInvestigacion}
                areasTematicasEni={areasTematicasEni}
                lineasInvestigacionEni={lineasInvestigacionEni}
                rolesSennova={rolesSennova}
            />
        </AuthenticatedLayout>
    )
}

export default Create
