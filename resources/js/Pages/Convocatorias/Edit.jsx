import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Grid, Paper } from '@mui/material'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Edit = ({ auth, convocatoria, convocatorias, lineas_programaticas, fases, tipos_convocatoria }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}>
            <Grid container>
                <Grid item md={4}>
                    <h1 className="font-black text-2xl">Modificar convocatoria</h1>
                </Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <Form
                            method="editar"
                            is_super_admin={is_super_admin}
                            convocatoria={convocatoria}
                            convocatorias={convocatorias}
                            lineas_programaticas={lineas_programaticas}
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
