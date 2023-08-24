import AlertMui from '@/Components/Alert'
import Checkbox from '@/Components/Checkbox'
import PasswordInput from '@/Components/PasswordInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TabsMui from '@/Components/TabsMui'

import { Grid, Paper } from '@mui/material'

import Form from './Form'
import FormRoles from './FormRoles'
import EstudiosAcademicos from './Perfil/EstudiosAcademicos/Index'
import FormacionesAcademicasSena from './Perfil/FormacionesAcademicasSena/Index'
import ParticipacionesGrupoInvestigacionSENA from './Perfil/ParticipacionesGruposInvestigacionSena/Index'
import ParticipacionesProyectosSENNOVA from './Perfil/ParticipacionesProyectosSennova/Index'

import { checkRole } from '@/Utils'
import { router, useForm } from '@inertiajs/react'

import React from 'react'

const EditComponent = ({
    auth_user,
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
    roles_sistema,
}) => {
    const form_cambio_password = useForm({
        user_id: usuario?.id,
        default_password: false,
        password: '',
        password_confirmation: '',
    })

    const submitCambioPassword = (e) => {
        e.preventDefault()
        form_cambio_password.put(route('users.cambiar-password'), {
            preserveScroll: true,
        })
    }

    return (
        <TabsMui
            tabs={[
                { label: 'Datos personales' },
                { label: 'Formación académica SENA' },
                { label: 'Estudios académicos' },
                { label: 'Participaciones en grupo de investigación SENA' },
                { label: 'Participaciones en proyectos SENNOVA' },
            ]}>
            <div>
                <Grid container rowSpacing={10} className="!mt-4">
                    <Grid item md={4}>
                        <AlertMui>
                            Por favor diligencie la siguiente información:
                            <br />
                            <strong>
                                Datos personales, experiencia profesional y/o académica, información del tipo de vinculación, experiencia como formulador y evaluador de proyectos, cursos realizados.
                            </strong>
                        </AlertMui>

                        {checkRole(auth_user, [1, 3, 4, 5, 17, 18, 19, 20, 21, 22, 24, 27]) && (
                            <AlertMui className="mt-10">
                                ¿Desea habilitar este usuario?
                                <Checkbox
                                    name="default_password"
                                    className="mt-3"
                                    checked={usuario?.habilitado}
                                    onChange={(e) =>
                                        router.put(
                                            route('users.habilitar-usuario'),
                                            {
                                                user_id: usuario?.id,
                                                habilitado: e.target.checked,
                                            },
                                            {
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                    label="Habilitado(a)"
                                />
                            </AlertMui>
                        )}

                        <AlertMui severity="error" className="mt-10">
                            Una vez haya finalizado de diligenciar active la siguiente casilla:
                            <Checkbox
                                name="default_password"
                                className="mt-3"
                                checked={usuario?.informacion_completa}
                                onChange={(e) =>
                                    router.put(
                                        route('users.informacion-completa'),
                                        {
                                            user_id: usuario?.id,
                                            informacion_completa: e.target.checked,
                                        },
                                        {
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                label="Confirmo que la información ha sido diligenciada completamente"
                            />
                        </AlertMui>
                    </Grid>
                    <Grid item md={8} className="drop-shadow-lg">
                        <Paper elevation={0} sx={{ padding: 2 }}>
                            <Form
                                method="PUT"
                                auth_user={auth_user}
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

                    <Grid item md={4}>
                        <strong>Roles de sistema</strong>
                    </Grid>
                    <Grid item md={8} className="drop-shadow-lg">
                        <Paper elevation={0} sx={{ padding: 6 }}>
                            {usuario.roles.map((rol, i) => (
                                <React.Fragment key={i}>{rol.name}</React.Fragment>
                            ))}
                            <FormRoles usuario={usuario} roles_sistema={roles_sistema} />
                        </Paper>
                    </Grid>

                    <Grid item md={4}>
                        <strong>Cambiar contraseña</strong>
                    </Grid>
                    <Grid item md={8} className="drop-shadow-lg">
                        <Paper elevation={0} sx={{ padding: 6 }}>
                            <form onSubmit={submitCambioPassword}>
                                <fieldset className="space-y-10">
                                    <AlertMui>
                                        Si desea utilizar la contraseña por defecto: <strong>sena{usuario?.numero_documento}*</strong> por favor habilite la siguiente casilla, de lo contrario
                                        diligencie una nueva constraseña:
                                        <Checkbox
                                            name="default_password"
                                            checked={form_cambio_password.data.default_password}
                                            onChange={(e) => form_cambio_password.setData('default_password', e.target.checked)}
                                            error={form_cambio_password.errors.default_password}
                                            label="Habilitar contraseña por defecto"
                                        />
                                    </AlertMui>

                                    {!form_cambio_password.data.default_password && (
                                        <>
                                            <PasswordInput
                                                label="Nueva contraseña"
                                                id="password"
                                                type="password"
                                                value={form_cambio_password.data.password}
                                                onChange={(e) => form_cambio_password.setData('password', e.target.value)}
                                                error={form_cambio_password.errors.password}
                                                required
                                                autoComplete="new-password"
                                            />

                                            <PasswordInput
                                                label="Vuelva a escribir la nueva contraseña"
                                                id="password_confirmation"
                                                type="password"
                                                value={form_cambio_password.data.password_confirmation}
                                                onChange={(e) => form_cambio_password.setData('password_confirmation', e.target.value)}
                                                error={form_cambio_password.errors.password_confirmation}
                                                required
                                                autoComplete="new-password"
                                            />
                                        </>
                                    )}
                                </fieldset>
                                <div className="flex items-center justify-end">
                                    <PrimaryButton disabled={form_cambio_password.processing || !form_cambio_password.isDirty} type="submit" className="mt-4">
                                        Cambiar contraseña
                                    </PrimaryButton>
                                </div>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </div>

            <div>
                <Paper elevation={0}>
                    <FormacionesAcademicasSena
                        usuario={usuario}
                        formaciones_academicas_sena={formaciones_academicas_sena}
                        modalidades_estudio={modalidades_estudio}
                        niveles_formacion={niveles_formacion}
                    />
                </Paper>
            </div>

            <div>
                <Paper elevation={0}>
                    <EstudiosAcademicos usuario={usuario} estudios_academicos={estudios_academicos} niveles_academicos={niveles_academicos} />
                </Paper>
            </div>

            <div>
                <Paper elevation={0}>
                    <ParticipacionesGrupoInvestigacionSENA
                        usuario={usuario}
                        participaciones_grupos_investigacion_sena={participaciones_grupos_investigacion_sena}
                        grupos_investigacion={grupos_investigacion}
                        semilleros_investigacion={semilleros_investigacion}
                    />
                </Paper>
            </div>

            <div>
                <Paper elevation={0}>
                    <ParticipacionesProyectosSENNOVA usuario={usuario} participaciones_proyectos_sennova={participaciones_proyectos_sennova} tipos_proyectos={tipos_proyectos} />
                </Paper>
            </div>
        </TabsMui>
    )
}

export default EditComponent
