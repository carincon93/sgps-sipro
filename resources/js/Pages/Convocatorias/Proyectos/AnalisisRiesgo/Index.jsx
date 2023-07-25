import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import ButtonMui from '@/Components/Button'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, TableRow, TableCell, MenuItem } from '@mui/material'

import Form from './Form'

import { router } from '@inertiajs/react'
import { useState } from 'react'

const AnalisisRiesgos = ({ auth, convocatoria, proyecto, analisisRiesgos, nivelesRiesgo, tiposRiesgo, probabilidadesRiesgo, impactosRiesgo, ...props }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [analisisRiesgoToDestroy, setAnalisisRiesgoToDestroy] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [analisisRiesgo, setAnalisisRiesgo] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Análisis de riesgos</h1>

                {isSuperAdmin || proyecto.mostrar_recomendaciones ? (
                    <>
                        {proyecto.evaluaciones.map((evaluacion, i) =>
                            isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <ToolTipMui
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            {evaluacion.idi_evaluacion ? (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.idi_evaluacion?.analisis_riesgos_comentario ? evaluacion.idi_evaluacion.analisis_riesgos_comentario : 'Sin recomendación'}
                                                </p>
                                            ) : evaluacion.cultura_innovacion_evaluacion ? (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.cultura_innovacion_evaluacion?.analisis_riesgos_comentario
                                                        ? evaluacion.cultura_innovacion_evaluacion.analisis_riesgos_comentario
                                                        : 'Sin recomendación'}
                                                </p>
                                            ) : evaluacion.ta_evaluacion ? (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.ta_evaluacion?.analisis_riesgos_comentario ? evaluacion.ta_evaluacion.analisis_riesgos_comentario : 'Sin recomendación'}
                                                </p>
                                            ) : evaluacion.tp_evaluacion ? (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.tp_evaluacion?.analisis_riesgos_comentario ? evaluacion.tp_evaluacion.analisis_riesgos_comentario : 'Sin recomendación'}
                                                </p>
                                            ) : (
                                                evaluacion.servicio_tecnologico_evaluacion && (
                                                    <>
                                                        <hr className="mt-10 mb-10 border-black-200" />
                                                        <h1 className="font-black">Análisis de riesgos</h1>

                                                        <ul className="list-disc pl-4">
                                                            <li className="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion?.riesgos_objetivo_general_comentario
                                                                    ? 'Recomendación riesgos a nivel de objetivo general: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.riesgos_objetivo_general_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                            <li className="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion?.riesgos_productos_comentario
                                                                    ? 'Recomendación riesgos a nivel de productos: ' + evaluacion.servicio_tecnologico_evaluacion.riesgos_productos_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                            <li className="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion?.riesgos_analisisRiesgoes_comentario
                                                                    ? 'Recomendación riesgos a nivel de analisisRiesgoes: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.riesgos_analisisRiesgoes_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                        </ul>
                                                    </>
                                                )
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

                {isSuperAdmin || proyecto.allowed.to_update ? (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setAnalisisRiesgo(null))} variant="raised">
                        Añadir análisis de riesgo
                    </ButtonMui>
                ) : null}
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20 mb-8" rows={['Descripción', 'Nivel', 'Tipo de riesgo', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {analisisRiesgos.data.map((analisisRiesgo, i) => (
                        <TableRow key={i}>
                            <TableCell>{analisisRiesgo.descripcion}</TableCell>
                            <TableCell>{nivelesRiesgo.find((item) => item.value == analisisRiesgo.nivel).label}</TableCell>
                            <TableCell>{tiposRiesgo.find((item) => item.value == analisisRiesgo.tipo).label}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {analisisRiesgo.id !== analisisRiesgoToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setAnalisisRiesgo(analisisRiesgo))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setAnalisisRiesgoToDestroy(analisisRiesgo.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setAnalisisRiesgoToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.analisis-riesgos.destroy', [convocatoria.id, proyecto.id, analisisRiesgo.id]), {
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

                <PaginationMui links={analisisRiesgos.links} />

                <DialogMui
                    open={dialogStatus}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            isSuperAdmin={isSuperAdmin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            analisisRiesgo={analisisRiesgo}
                            nivelesRiesgo={nivelesRiesgo}
                            tiposRiesgo={tiposRiesgo}
                            probabilidadesRiesgo={probabilidadesRiesgo}
                            impactosRiesgo={impactosRiesgo}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default AnalisisRiesgos
