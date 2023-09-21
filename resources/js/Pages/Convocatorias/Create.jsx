import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Head, useForm } from '@inertiajs/react'
import { route, checkRole } from '@/Utils'
import { Grid, Paper } from '@mui/material'

import Form from './Form'

const CreateConvocatoria = ({ auth, convocatorias, tipos_formulario_convocatoria, tipos_convocatoria }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout>
            <Head title="Lista de convocatorias" />

            <Grid container>
                <Grid item md={4}>
                    <h1 className="font-black text-2xl">Nueva convocatoria</h1>
                </Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <Form
                            method="POST"
                            is_super_admin={is_super_admin}
                            convocatorias={convocatorias}
                            tipos_formulario_convocatoria={tipos_formulario_convocatoria}
                            tipos_convocatoria={tipos_convocatoria}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default CreateConvocatoria
