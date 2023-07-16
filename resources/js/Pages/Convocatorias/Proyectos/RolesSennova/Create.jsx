import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Form from './Form'

import { useForm } from '@inertiajs/react'
import { checkRole } from '@/Utils'
import { Grid, Paper } from '@mui/material'

const CrearRolSennova = ({ auth, convocatoria, proyecto, convocatoriaRolesSennova, lineasTecnologicas, actividades }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const form = useForm({
        proyecto_id: proyecto.id,
        numero_meses: '',
        numero_roles: '',
        descripcion: '',
        educacion: '',
        formacion: '',
        experiencia: '',
        convocatoria_rol_sennova_id: null,
        actividad_id: null,
        linea_tecnologica_id: [],
        numero_monitorias: null,
        numero_meses_monitorias: null,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.proyecto-rol-sennova.store', [convocatoria.id, proyecto.id]))
        }
    }

    return (
        <AuthenticatedLayout>
            <Grid item md={4}>
                <h1 className="font-black text-2xl sticky top-0">Añadir rol SENNOVA</h1>
            </Grid>

            <Grid item md={8} className="drop-shadow-lg">
                <Paper elevation={0} sx={{ padding: 2 }}>
                    <Form proyecto={proyecto} convocatoriaRolesSennova={convocatoriaRolesSennova} form={form} submit={submit} lineasTecnologicas={lineasTecnologicas} actividades={actividades} isSuperAdmin={isSuperAdmin} />
                </Paper>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default CrearRolSennova
