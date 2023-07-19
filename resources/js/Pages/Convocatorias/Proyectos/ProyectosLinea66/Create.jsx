import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Grid, Paper } from '@mui/material'

import Form from './Form'
import { checkRole } from '@/Utils'

import { useState, useEffect } from 'react'

const Create = ({ auth, convocatoria, centrosFormacion, disciplinasSubareaConocimiento, lineasInvestigacion, lineasProgramaticas, actividadesEconomicas, tematicasEstrategicas, redesConocimiento, allowedToCreate, gruposInvestigacion, lineasInvestigacionEni, areasTematicasEni, roles }) => {
    const [authUser, setAuthUser] = useState(auth.user)
    const [isSuperAdmin, setIsSuperAdmin] = useState(checkRole(authUser, [1]))

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear proyecto de I+D+i</h2>}>
            <Grid item md={3}></Grid>
            <Grid item md={9}>
                <Paper className="p-10">
                    <Form
                        isSuperAdmin={isSuperAdmin}
                        centrosFormacion={centrosFormacion}
                        lineasProgramaticas={lineasProgramaticas}
                        gruposInvestigacion={gruposInvestigacion}
                        convocatoria={convocatoria}
                        redesConocimiento={redesConocimiento}
                        disciplinasSubareaConocimiento={disciplinasSubareaConocimiento}
                        actividadesEconomicas={actividadesEconomicas}
                        tematicasEstrategicas={tematicasEstrategicas}
                        lineasInvestigacion={lineasInvestigacion}
                        areasTematicasEni={areasTematicasEni}
                        lineasInvestigacionEni={lineasInvestigacionEni}
                        roles={roles}
                        method="crear"
                    />
                </Paper>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Create
