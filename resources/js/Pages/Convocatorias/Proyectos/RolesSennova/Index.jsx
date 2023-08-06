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

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { router, useForm } from '@inertiajs/react'

import { checkRole } from '@/Utils'

import Form from './Form'
import Evaluacion from './Evaluacion'

const RolesSennova = ({ auth, convocatoria, proyecto, evaluacion, proyecto_roles_sennova, convocatoria_roles_sennova, actividades, lineas_tecnologicas, niveles_academicos }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [proyecto_rol_a_evaluar, setRolAEvaluar] = useState(null)
    const [method, setMethod] = useState('')
    const [proyecto_rol_sennova, setProyectoRolSennova] = useState(null)
    const [proyecto_rol_sennova_id_to_destroy, setProyectoRolSennovaIdToDestroy] = useState(null)

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
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12}>
                <h1 className="mt-24 mb-8 text-center text-3xl">Roles SENNOVA</h1>

                <AlertMui className="my-8">
                    <p>
                        <strong>Actualmente el total del costo de los roles requeridos es de:</strong> $
                        {new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_roles_sennova) ? proyecto.total_roles_sennova : 0)} COP. Tenga en cuenta que el rol{' '}
                        <strong>Aprendiz SENNOVA (contrato aprendizaje)</strong> no suma al total del presupuesto del proyecto.
                    </p>
                </AlertMui>
            </Grid>

            <Grid item md={12}>
                {proyecto.codigo_linea_programatica == 70 && (
                    <>
                        <AlertMui>Ingrese el número de instructores de planta, dinamizadores de planta y psicopedagógos de planta que requiere el proyecto.</AlertMui>
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
                    </>
                )}
            </Grid>

            <Grid item md={12}>
                <TableMui className="mb-8" rows={['Nombre', 'Asignación mensual', 'Evaluación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {proyecto.allowed.to_update && (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setProyectoRolSennova(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar Rol SENNOVA
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    )}

                    {proyecto_roles_sennova.data.map((proyecto_rol_sennova, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                {proyecto_rol_sennova?.convocatoria_rol_sennova?.rol_sennova?.nombre}
                                <br />

                                <Chip
                                    className="!bg-blue-200 hover:!bg-blue-50 !text-blue-500 mt-1"
                                    label={
                                        <span className="flex">
                                            Nivel académico:
                                            <p className="first-letter:uppercase">
                                                {niveles_academicos.find((item) => item.value == proyecto_rol_sennova?.convocatoria_rol_sennova?.nivel_academico).label}
                                            </p>
                                        </span>
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                $
                                {new Intl.NumberFormat('de-DE').format(
                                    !isNaN(proyecto_rol_sennova?.convocatoria_rol_sennova?.asignacion_mensual) ? proyecto_rol_sennova?.convocatoria_rol_sennova?.asignacion_mensual : 0,
                                )}{' '}
                                / Meses: {proyecto_rol_sennova.numero_meses} / Cantidad: {proyecto_rol_sennova.numero_roles}
                                {!proyecto_rol_sennova.convocatoria_rol_sennova.sumar_al_presupuesto && (
                                    <>
                                        <br />
                                        <Chip className="!bg-red-200 hover:!bg-red-50 !text-red-500 mt-1" label="No suma al presupuesto" />
                                    </>
                                )}
                            </TableCell>
                            <TableCell>
                                {is_super_admin || proyecto.mostrar_recomendaciones ? (
                                    <>
                                        {proyecto_rol_sennova.proyecto_roles_evaluaciones.map((evaluacion, i) =>
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
                                        {proyecto_rol_sennova.proyecto_roles_evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El ítem no ha sido evaluado aún.</p> : null}
                                    </>
                                ) : null}
                            </TableCell>
                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {proyecto_rol_sennova.id !== proyecto_rol_sennova_id_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('PUT'), setProyectoRolSennova(proyecto_rol_sennova))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            {evaluacion && <MenuItem onClick={() => (setRolAEvaluar(proyecto_rol_sennova), setEvaluacionDialogStatus(true))}>Evaluar</MenuItem>}

                                            <MenuItem
                                                onClick={() => {
                                                    setProyectoRolSennovaIdToDestroy(proyecto_rol_sennova.id)
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
                                                        router.delete(route('convocatorias.proyectos.proyecto-rol-sennova.destroy', [convocatoria.id, proyecto.id, proyecto_rol_sennova.id]), {
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

                <PaginationMui links={proyecto_roles_sennova.links} />

                <DialogMui
                    fullWidth={true}
                    maxWidth="lg"
                    open={evaluacion_dialog_status}
                    dialogContent={
                        <>
                            <Evaluacion auth_user={auth_user} proyecto={proyecto} evaluacion={evaluacion} proyecto_rol_a_evaluar={proyecto_rol_a_evaluar} />
                        </>
                    }
                    dialogActions={
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                            Cerrar
                        </ButtonMui>
                    }
                />

                <DialogMui
                    open={dialog_status}
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
                            proyecto_rol_sennova={proyecto_rol_sennova}
                            convocatoria_roles_sennova={convocatoria_roles_sennova}
                            actividades={actividades}
                            lineas_tecnologicas={lineas_tecnologicas}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default RolesSennova
