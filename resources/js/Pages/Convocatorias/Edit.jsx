import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Grid, Paper } from '@mui/material'

import { route, checkRole } from '@/Utils'

import Form from './Form'
import { Head } from '@inertiajs/react'

const Edit = ({ auth, convocatoria, convocatorias, tipos_formulario_convocatoria, fases, tipos_convocatoria }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Lista de convocatorias" />

            <Grid container>
                <Grid item md={4}>
                    <h1 className="font-black text-2xl">Modificar convocatoria</h1>
                </Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <Form
                            method="PUT"
                            is_super_admin={is_super_admin}
                            convocatoria={convocatoria}
                            convocatorias={convocatorias}
                            tipos_formulario_convocatoria={tipos_formulario_convocatoria}
                            tipos_convocatoria={tipos_convocatoria}
                            fases={fases}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
