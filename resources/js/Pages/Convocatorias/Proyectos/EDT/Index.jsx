import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { checkRole } from '@/Utils'
import { router } from '@inertiajs/react'
import { useState } from 'react'

import Form from './Form'

const EDT = ({ auth, convocatoria, proyecto, presupuesto, eventos, tiposEvento, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [eventoToDestroy, setEdtToDestroy] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [edt, setEdt] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} label="EDT" />
            </Grid>

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">EDT</h1>

                {is_super_admin || proyecto.mostrar_recomendaciones ? (
                    <>
                        {proyecto.evaluaciones.map((evaluacion, i) =>
                            is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <ToolTipMui
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.edt_comentario ? evaluacion.ta_evaluacion.edt_comentario : 'Sin recomendación'}</p>
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
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setEdt(null))} variant="raised">
                        Añadir EDT
                    </ButtonMui>
                ) : null}
            </Grid>
            <Grid item md={12}>
                <TableMui className="mt-20 mb-8" rows={['Descripción del evento', 'Fechas', 'Presupuesto', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {eventos.data.map((evento, i) => (
                        <TableRow key={i}>
                            <TableCell>{evento.descripcion_evento}</TableCell>
                            <TableCell>{evento.numero_asistentes}</TableCell>
                            <TableCell>${new Intl.NumberFormat('de-DE').format(!isNaN(evento.proyecto_presupuesto.valor_total) ? evento.proyecto_presupuesto.valor_total : 0)}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {evento.id !== eventoToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setEdt(evento))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setEdtToDestroy(evento.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setEdtToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.presupuesto.edt.destroy', [convocatoria.id, proyecto.id, presupuesto.id, evento.id]), {
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
                            presupuesto={presupuesto}
                            edt={edt}
                            tiposEvento={tiposEvento}
                        />
                    }
                />
            </Grid>
            <PaginationMui links={eventos.links} />
        </AuthenticatedLayout>
    )
}

export default EDT
