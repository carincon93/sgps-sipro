import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import PrimaryButton from '@/Components/PrimaryButton'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'
import { router, useForm } from '@inertiajs/react'

import GroupAddIcon from '@mui/icons-material/GroupAdd'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'

import Form from './Form'

const EntidadesAliadas = ({ auth, convocatoria, proyecto, entidadesAliadas, actividades, tiposEntidadAliada, naturalezaEntidadAliada, tiposEmpresa, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [entidadAliadaToDestroy, setEntidadAliadaToDestroy] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [entidadAliada, setEntidadAliada] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Entidades aliadas</h1>

                {is_super_admin || proyecto.mostrar_recomendaciones ? (
                    <>
                        {proyecto.evaluaciones.map((evaluacion, i) =>
                            is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <ToolTipMui
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            {evaluacion.idi_evaluacion && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.idi_evaluacion?.entidad_aliada_comentario ? evaluacion.idi_evaluacion.entidad_aliada_comentario : 'Sin recomendación'}
                                                </p>
                                            )}
                                            {evaluacion.ta_evaluacion && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.ta_evaluacion?.entidad_aliada_comentario ? evaluacion.ta_evaluacion.entidad_aliada_comentario : 'Sin recomendación'}
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
                ) : null}

                {is_super_admin || proyecto.allowed.to_update ? (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setEntidadAliada(null))} variant="raised">
                        Añadir entidad aliada
                    </ButtonMui>
                ) : null}
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20 mb-8" rows={['Nombre', 'Tipo de entidad aliada', 'Miembros', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {entidadesAliadas.data.map((entidadAliada, i) => (
                        <TableRow key={i}>
                            <TableCell>{entidadAliada.nombre}</TableCell>
                            <TableCell>{tiposEntidadAliada.find((item) => item.value == entidadAliada.tipo).label}</TableCell>

                            <TableCell>
                                <ButtonMui
                                    onClick={() => router.visit(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.index', [convocatoria.id, proyecto.id, entidadAliada.id]))}>
                                    <GroupAddIcon />
                                </ButtonMui>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {entidadAliada.id !== entidadAliadaToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setEntidadAliada(entidadAliada))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setEntidadAliadaToDestroy(entidadAliada.id)
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
                                                        router.delete(route('convocatorias.proyectos.entidades-aliadas.destroy', [convocatoria.id, proyecto.id, entidadAliada.id]), {
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

                <PaginationMui links={entidadesAliadas.links} />

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
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            entidadAliada={entidadAliada}
                            actividades={actividades}
                            tiposEntidadAliada={tiposEntidadAliada}
                            naturalezaEntidadAliada={naturalezaEntidadAliada}
                            tiposEmpresa={tiposEmpresa}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default EntidadesAliadas
