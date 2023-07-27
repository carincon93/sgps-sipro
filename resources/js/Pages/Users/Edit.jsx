import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Grid, Paper } from '@mui/material'

import { useForm } from '@inertiajs/react'
import { route, checkRole } from '@/Utils'
import Form from './Form'
import EstudiosAcademicos from './Perfil/EstudiosAcademicos/Index'
import FormacionesAcademicasSena from './Perfil/FormacionesAcademicasSena/Index'
import ParticipacionesGrupoInvestigacionSENA from './Perfil/ParticipacionesGruposInvestigacionSena/Index'
import ParticipacionesProyectosSENNOVA from './Perfil/ParticipacionesProyectosSennova/Index'

const Edit = ({
    auth,
    usuario,
    tipos_documento,
    tipos_vinculacion,
    municipios,
    redes_conocimiento,
    disciplinas_conocimiento,
    niveles_ingles,
    grupos_etnicos,
    opciones_genero,
    tipos_discapacidad,
    roles_sennova,
    subareas_experiencia,
    centros_formacion,
    estudios_academicos,
    niveles_academicos,
    formaciones_academicas_sena,
    modalidades_estudio,
    niveles_formacion,
    grupos_investigacion,
    semilleros_investigacion,
    tipos_proyectos,
    participaciones_grupos_investigacion_sena,
    participaciones_proyectos_sennova,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const formChangePassword = useForm({
        old_password: '',
        password: '',
        password_confirmation: '',
    })

    const submitChangePassword = (e) => {
        e.preventDefault()
        formChangePassword.put(route('users.change-password'))
    }

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil</h2>}>
            <Grid container>
                <Grid item md={4}></Grid>

                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <Form
                            usuario={usuario}
                            tipos_documento={tipos_documento}
                            tipos_vinculacion={tipos_vinculacion}
                            municipios={municipios}
                            redes_conocimiento={redes_conocimiento}
                            disciplinas_conocimiento={disciplinas_conocimiento}
                            niveles_ingles={niveles_ingles}
                            grupos_etnicos={grupos_etnicos}
                            opciones_genero={opciones_genero}
                            tipos_discapacidad={tipos_discapacidad}
                            roles_sennova={roles_sennova}
                            subareas_experiencia={subareas_experiencia}
                            centros_formacion={centros_formacion}
                            estudios_academicos={estudios_academicos}
                            formaciones_academicas_sena={formaciones_academicas_sena}
                            participaciones_grupos_investigacion_sena={participaciones_grupos_investigacion_sena}
                            participaciones_proyectos_sennova={participaciones_proyectos_sennova}
                        />
                    </Paper>
                </Grid>

                <Grid item md={4}></Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <EstudiosAcademicos usuario={usuario} estudios_academicos={estudios_academicos} niveles_academicos={niveles_academicos} />
                    </Paper>
                </Grid>

                <Grid item md={4}></Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <FormacionesAcademicasSena
                            usuario={usuario}
                            formaciones_academicas_sena={formaciones_academicas_sena}
                            modalidades_estudio={modalidades_estudio}
                            niveles_formacion={niveles_formacion}
                        />
                    </Paper>
                </Grid>

                <Grid item md={4}></Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <ParticipacionesGrupoInvestigacionSENA
                            usuario={usuario}
                            participaciones_grupos_investigacion_sena={participaciones_grupos_investigacion_sena}
                            grupos_investigacion={grupos_investigacion}
                            semilleros_investigacion={semilleros_investigacion}
                        />
                    </Paper>
                </Grid>

                <Grid item md={4}></Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <ParticipacionesProyectosSENNOVA usuario={usuario} participaciones_proyectos_sennova={participaciones_proyectos_sennova} tipos_proyectos={tipos_proyectos} />
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
