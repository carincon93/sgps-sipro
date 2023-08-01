import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'
import { router } from '@inertiajs/react'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'

import Form from './Form'
import Evaluacion from './Evaluacion'

const EntidadesAliadas = ({ auth, convocatoria, proyecto, evaluacion, entidades_aliadas, actividades, tipos_entidad_aliada, naturaleza_entidad_aliada, tipos_empresa, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [entidad_aliada_to_destroy, setEntidadAliadaToDestroy] = useState(null)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [entidad_aliada, setEntidadAliada] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            {/* <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={evaluacion_dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion auth_user={auth.user} proyecto={proyecto} evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
            </Grid>

            {is_super_admin || proyecto.mostrar_recomendaciones ? (
                <>
                    {proyecto.evaluaciones.map((evaluacion, i) =>
                        is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                            <ToolTipMui
                                key={i}
                                title={
                                    <div>
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        {evaluacion.evaluacion_proyecto_linea66 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea66?.entidad_aliada_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea66.entidad_aliada_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        )}
                                        {evaluacion.evaluacion_proyecto_linea70 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea70?.entidad_aliada_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea70.entidad_aliada_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        )}
                                    </div>
                                }>
                                Evaluación {i + 1}
                            </ToolTipMui>
                        ) : null,
                    )}
                    {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                </>
            ) : null} */}

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Entidades aliadas</h1>
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20 mb-8" rows={['Nombre', 'Tipo de entidad aliada', 'Miembros', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {proyecto.allowed.to_update ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('crear'), setEntidadAliada(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar entidad aliada
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {entidades_aliadas.data.map((entidad_aliada, i) => (
                        <TableRow key={i}>
                            <TableCell>{entidad_aliada.nombre}</TableCell>
                            <TableCell>{tipos_entidad_aliada.find((item) => item.value == entidad_aliada.tipo).label}</TableCell>

                            <TableCell>
                                <ButtonMui
                                    onClick={() => router.visit(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.index', [convocatoria.id, proyecto.id, entidad_aliada.id]))}>
                                    <GroupAddIcon />
                                </ButtonMui>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {entidad_aliada.id !== entidad_aliada_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setEntidadAliada(entidad_aliada))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setEntidadAliadaToDestroy(entidad_aliada.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setEntidadAliadaToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.entidades-aliadas.destroy', [convocatoria.id, proyecto.id, entidad_aliada.id]), {
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

                <PaginationMui links={entidades_aliadas.links} />

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
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            entidad_aliada={entidad_aliada}
                            actividades={actividades}
                            tipos_entidad_aliada={tipos_entidad_aliada}
                            naturaleza_entidad_aliada={naturaleza_entidad_aliada}
                            tipos_empresa={tipos_empresa}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default EntidadesAliadas
