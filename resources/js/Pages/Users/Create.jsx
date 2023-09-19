import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Grid, Paper } from '@mui/material'

import { checkRole } from '@/Utils'

import Form from './Form'
import FormRoles from './FormRoles'

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
    roles_sistema,
    allowed_to_create,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const centros_formacion_filtrados = checkRole(auth_user, [4])
        ? [centros_formacion.find((item) => item.value == auth_user.centro_formacion_id)]
        : checkRole(auth_user, [2])
        ? [centros_formacion.filter((item) => item.regional_id == auth_user.regional_id)][0]
        : centros_formacion

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
                            method="POST"
                            allowed_to_create={allowed_to_create}
                            tipos_documento={tipos_documento}
                            tipos_vinculacion={tipos_vinculacion}
                            centros_formacion={centros_formacion_filtrados}
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

                <Grid item md={4}>
                    <strong>Roles de sistema</strong>
                </Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 6 }}>
                        <FormRoles roles_sistema={roles_sistema} />
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Crear
