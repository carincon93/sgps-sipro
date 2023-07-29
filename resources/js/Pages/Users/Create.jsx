import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Grid, Paper } from '@mui/material'

import { checkRole } from '@/Utils'
import Form from './Form'

const Crear = ({
    auth,
    tipos_documento,
    tipos_vinculacion,
    centros_formacion,
    niveles_ingles,
    opciones_genero,
    grupos_etnicos,
    tipos_discapacidad,
    subareas_experiencia,
    municipios,
    roles_sennova,
    redes_conocimiento,
    disciplinas_conocimiento,
    allowed_to_create,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil</h2>}>
            <Grid container rowSpacing={10}>
                <Grid item md={4}>
                    Por favor diligencie la siguiente información
                    <br />
                    <strong>
                        Datos personales, experiencia profesional y/o académica, información del tipo de vinculación, experiencia como formulador y evaluador de proyectos, cursos realizados.
                    </strong>
                </Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <Form
                            method="crear"
                            tipos_documento={tipos_documento}
                            tipos_vinculacion={tipos_vinculacion}
                            centros_formacion={centros_formacion}
                            niveles_ingles={niveles_ingles}
                            opciones_genero={opciones_genero}
                            grupos_etnicos={grupos_etnicos}
                            tipos_discapacidad={tipos_discapacidad}
                            subareas_experiencia={subareas_experiencia}
                            municipios={municipios}
                            roles_sennova={roles_sennova}
                            redes_conocimiento={redes_conocimiento}
                            disciplinas_conocimiento={disciplinas_conocimiento}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Crear
