import { router, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import PrimaryButton from '@/Components/PrimaryButton'
import TableMui from '@/Components/Table'
import TextInput from '@/Components/TextInput'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'

import { checkRole } from '@/Utils'

import Form from './Form'

const RolesSennova = ({
    auth,
    convocatoria,
    proyecto,
    proyectoRolesSennova,
    convocatoriaRolesSennova,
    actividades,
    lineasTecnologicas,
    proyectoActividadesRelacionadas,
    proyectoLineasTecnologicasRelacionadas,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [proyectoRolSennova, setProyectoRolSennova] = useState(null)
    const [proyectoRolSennovaIdToDestroy, setProyectoRolSennovaIdToDestroy] = useState(null)

    const form = useForm({
        cantidad_instructores_planta: proyecto.cantidad_instructores_planta,
        cantidad_dinamizadores_planta: proyecto.cantidad_dinamizadores_planta,
        cantidad_psicopedagogos_planta: proyecto.cantidad_psicopedagogos_planta,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.rol-sennova-ta.update', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>

            <Grid item md={12}>
                <h1 className="mt-24 mb-8 text-center text-3xl">Roles SENNOVA</h1>

                <AlertMui className="my-14">
                    <p>
                        <strong>Actualmente el total del costo de los roles requeridos es de:</strong> $
                        {new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_roles_sennova) ? proyecto.total_roles_sennova : 0)} COP. Tenga en cuenta que el rol{' '}
                        <strong>Aprendiz SENNOVA (contrato aprendizaje)</strong> no suma al total del presupuesto del proyecto.
                    </p>
                </AlertMui>
            </Grid>

            <Grid item md={12}>
                <h2 className="text-center mt-10 mb-24">
                    {proyecto.codigo_linea_programatica == 70
                        ? 'Ingrese el número de instructores de planta, dinamizadores de planta y psicopedagógos de planta que requiere el proyecto.'
                        : 'Ingrese cada uno de los roles SENNOVA que requiere el proyecto.'}
                </h2>

                {proyecto.codigo_linea_programatica == 70 && (
                    <form onSubmit={submit} className="mb-40">
                        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                            <div className="mt-8">
                                <TextInput
                                    label="Número de instructores de planta"
                                    id="cantidad_instructores_planta"
                                    type="number"
                                    inputProps={{ min: 0, max: 32767 }}
                                    className="mt-1"
                                    error={form.errors.cantidad_instructores_planta}
                                    value={form.data.cantidad_instructores_planta}
                                    onChange={(e) => form.setData('cantidad_instructores_planta', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    label="Número de dinamizadores de planta"
                                    id="cantidad_dinamizadores_planta"
                                    type="number"
                                    inputProps={{ min: 0, max: 32767 }}
                                    className="mt-1"
                                    error={form.errors.cantidad_dinamizadores_planta}
                                    value={form.data.cantidad_dinamizadores_planta}
                                    onChange={(e) => form.setData('cantidad_dinamizadores_planta', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    label="Número de psicopedagógos de planta"
                                    id="cantidad_psicopedagogos_planta"
                                    type="number"
                                    inputProps={{ min: 0, max: 32767 }}
                                    className="mt-1"
                                    error={form.errors.cantidad_psicopedagogos_planta}
                                    value={form.data.cantidad_psicopedagogos_planta}
                                    onChange={(e) => form.setData('cantidad_psicopedagogos_planta', e.target.value)}
                                    required
                                />
                            </div>
                        </fieldset>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {proyecto.allowed.to_update && (
                                <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                    Guardar
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                )}

                {proyecto.allowed.to_update && (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setProyectoRolSennova(null))} variant="raised">
                        Añadir Rol SENNOVA
                    </ButtonMui>
                )}
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20 mb-8" rows={['Nombre', 'Asignación mensual', 'Evaluación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {proyectoRolesSennova.data.map((proyectoRolSennova, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                {proyectoRolSennova?.convocatoria_rol_sennova?.rol_sennova?.nombre}
                                <br />
                                <Chip label={proyectoRolSennova?.convocatoria_rol_sennova?.nivel_academico} />
                            </TableCell>
                            <TableCell>
                                $
                                {new Intl.NumberFormat('de-DE').format(
                                    !isNaN(proyectoRolSennova?.convocatoria_rol_sennova?.asignacion_mensual) ? proyectoRolSennova?.convocatoria_rol_sennova?.asignacion_mensual : 0,
                                )}{' '}
                                / Meses: {proyectoRolSennova.numero_meses} / Cantidad: {proyectoRolSennova.numero_roles}
                            </TableCell>
                            <TableCell>
                                {is_super_admin || proyecto.mostrar_recomendaciones ? (
                                    <>
                                        {proyectoRolSennova.proyecto_roles_evaluaciones.map((evaluacion, i) =>
                                            is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                <ToolTipMui
                                                    key={i}
                                                    title={
                                                        <div>
                                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.comentario ? evaluacion.comentario : 'Aprobado'}</p>
                                                        </div>
                                                    }>
                                                    Evaluación {i + 1}
                                                </ToolTipMui>
                                            ) : null,
                                        )}
                                        {proyectoRolSennova.proyecto_roles_evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El ítem no ha sido evaluado aún.</p> : null}
                                    </>
                                ) : null}
                            </TableCell>
                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {proyectoRolSennova.id !== proyectoRolSennovaIdToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setProyectoRolSennova(proyectoRolSennova))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setProyectoRolSennovaIdToDestroy(proyectoRolSennova.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProyectoRolSennovaIdToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.proyecto-rol-sennova.destroy', [convocatoria.id, proyecto.id, proyectoRolSennova.id]), {
                                                            preserveScroll: true,
                                                        })
                                                    }
                                                }}>
                                                Confirmar
                                            </MenuItem>
                                        </div>
                                    )}
                                </MenuMui>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableMui>

                <PaginationMui links={proyectoRolesSennova.links} />

                <DialogMui
                    open={dialogStatus}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            convocatoria={convocatoria}
                            proyecto={proyecto}
                            proyectoRolSennova={proyectoRolSennova}
                            convocatoriaRolesSennova={convocatoriaRolesSennova}
                            actividades={actividades}
                            lineasTecnologicas={lineasTecnologicas}
                            proyectoActividadesRelacionadas={proyectoActividadesRelacionadas}
                            proyectoLineasTecnologicasRelacionadas={proyectoLineasTecnologicasRelacionadas}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default RolesSennova
