import AlertMui from '@/Components/Alert'
import Checkbox from '@/Components/Checkbox'
import MenuMui from '@/Components/Menu'
import PasswordInput from '@/Components/PasswordInput'
import PrimaryButton from '@/Components/PrimaryButton'
import SenaLogo from '@/Components/SenaLogo'
import TabsMui from '@/Components/TabsMui'

import { Chip, Grid, MenuItem, Paper } from '@mui/material'

import Form from './Form'
import FormRoles from './FormRoles'
import EstudiosAcademicos from './Perfil/EstudiosAcademicos/Index'
import FormacionesAcademicasSena from './Perfil/FormacionesAcademicasSena/Index'
import ParticipacionesGrupoInvestigacionSENA from './Perfil/ParticipacionesGruposInvestigacionSena/Index'
import ParticipacionesProyectosSENNOVA from './Perfil/ParticipacionesProyectosSennova/Index'

import { checkRole } from '@/Utils'
import { router, useForm } from '@inertiajs/react'

import React, { useState } from 'react'

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
    const component = router.page?.component

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

    const [evaluador_interno, setEvaluadorInterno] = useState(checkRole(usuario, [11]))
    const [evaluador_externo, setEvaluadorExterno] = useState(checkRole(usuario, [33]))

    const submitEvaluadorInterno = (e) => {
        e.preventDefault()
        setEvaluadorInterno(!evaluador_interno)
        router.put(
            route('users.evaluador'),
            {
                evaluador_interno: true,
            },
            {
                onSuccess: () => router.visit(route('users.perfil', { rol: 'evaluador_interno' })),
                preserveScroll: true,
            },
        )
    }

    const submitEvaluadorExterno = (e) => {
        e.preventDefault()
        setEvaluadorExterno(!evaluador_externo)
        router.put(
            route('users.evaluador'),
            {
                evaluador_externo: true,
            },
            {
                onSuccess: () => router.visit(route('users.perfil', { rol: 'evaluador_externo' })),
                preserveScroll: true,
            },
        )
    }

    const submitEliminarEvaluador = (e) => {
        e.preventDefault()
        router.put(route('users.eliminar-evaluador'), {
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
                    {component == 'Users/Perfil' && (
                        <Grid item md={12}>
                            <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded shadow p-10">
                                <Grid container>
                                    <Grid item md={4}>
                                        <figure>
                                            <img src="/images/evaluadores.png" alt="" className="w-60" />
                                        </figure>
                                    </Grid>
                                    <Grid item md={8}>
                                        <span className="text-white pointer-events-none place-items-center gap-2 flex py-2" href="/">
                                            SENNOVA | <SenaLogo className="w-10" />
                                        </span>
                                        <h1 className="text-white text-4xl">Evaluación de proyectos I+D+i</h1>
                                        <p className="text-white mb-10 mt-4">
                                            ¡Hola {usuario.nombre}! Si tienes experiencia evaluando proyectos bajo la metodología de marco lógico podrás participar en la convocatoria 2024 haciendo
                                            clic en el siguiente botón:
                                        </p>

                                        {checkRole(usuario, [11, 33]) && (
                                            <AlertMui className="mb-4" severity="success">
                                                ¡Postulación realizada, muchas gracias!.
                                            </AlertMui>
                                        )}

                                        <MenuMui text={checkRole(usuario, [11, 33]) ? 'Retirar postulación como evaluador(a)' : 'Quiero participar como evaluador(a)'}>
                                            {!checkRole(usuario, [11, 33]) ? (
                                                <div>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            submitEvaluadorInterno(e)
                                                        }}>
                                                        Pertenezco a SENNOVA
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            submitEvaluadorExterno(e)
                                                        }}>
                                                        No hago parte de SENNOVA
                                                    </MenuItem>
                                                </div>
                                            ) : (
                                                <MenuItem
                                                    onClick={(e) => {
                                                        submitEliminarEvaluador(e)
                                                    }}>
                                                    Confirmo que quiero eliminar mi postulación como evaluador/a
                                                </MenuItem>
                                            )}
                                        </MenuMui>

                                        {checkRole(usuario, [11, 33]) && !usuario.informacion_completa && <AlertMui className="mt-14">Recuerde completar el CENSO.</AlertMui>}
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    )}
                    <Grid item md={4}>
                        <AlertMui>
                            Por favor diligencie la siguiente información:
                            <br />
                            <strong>
                                Datos personales, experiencia profesional y/o académica, información del tipo de vinculación, experiencia como formulador y evaluador de proyectos, cursos realizados.
                            </strong>
                        </AlertMui>

                        {usuario?.allowed?.to_update && (
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
                        )}
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
                            <p>Roles principales: </p>
                            {usuario.roles.map((rol, i) => (
                                <React.Fragment key={i}>
                                    <Chip label={rol.name} size="small" className="bg-app-200 mt-4 mb-10 mr-2 px-2 uppercase" />
                                </React.Fragment>
                            ))}
                            <FormRoles auth_user={auth_user} usuario={usuario} roles_sistema={roles_sistema} />
                        </Paper>
                    </Grid>

                    {usuario?.allowed?.to_update && (
                        <>
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
                        </>
                    )}
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
