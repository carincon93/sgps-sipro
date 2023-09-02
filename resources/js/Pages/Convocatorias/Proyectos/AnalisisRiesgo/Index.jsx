import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import ButtonMui from '@/Components/Button'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, TableRow, TableCell, MenuItem } from '@mui/material'

import Form from './Form'
import Evaluacion from './Evaluacion'

import { useState } from 'react'
import { router } from '@inertiajs/react'

const AnalisisRiesgos = ({ auth, convocatoria, proyecto, analisis_riesgos, niveles_riesgo, tipos_riesgo, probabilidades_riesgo, impactos_riesgo, evaluacion, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [analisis_riesgo_to_destroy, setAnalisisRiesgoToDestroy] = useState(null)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [analisis_riesgo, setAnalisisRiesgo] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>
            {/*
            <Grid item md={4}>
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
            </Grid> */}

            {/* {is_super_admin || proyecto.mostrar_recomendaciones ? (
                <>
                    {proyecto.evaluaciones.map((evaluacion, i) =>
                        is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                            <ToolTipMui
                                key={i}
                                title={
                                    <div>
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        {evaluacion.evaluacion_proyecto_linea66 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea66?.analisis_riesgos_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea66.analisis_riesgos_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea65 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea65?.analisis_riesgos_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea65.analisis_riesgos_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea70 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea70?.analisis_riesgos_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea70.analisis_riesgos_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea69 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea69?.analisis_riesgos_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea69.analisis_riesgos_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        ) : (
                                            evaluacion.evaluacion_proyecto_linea68 && (
                                                <>
                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Análisis de riesgos</h1>

                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.riesgos_objetivo_general_comentario
                                                                ? 'Recomendación riesgos a nivel de objetivo general: ' + evaluacion.evaluacion_proyecto_linea68.riesgos_objetivo_general_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.riesgos_productos_comentario
                                                                ? 'Recomendación riesgos a nivel de productos: ' + evaluacion.evaluacion_proyecto_linea68.riesgos_productos_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.riesgos_analisis_riesgoes_comentario
                                                                ? 'Recomendación riesgos a nivel de analisis_riesgoes: ' + evaluacion.evaluacion_proyecto_linea68.riesgos_analisis_riesgoes_comentario
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
            ) : null} */}

            <Grid item md={12}>
                <h1 className="text-3xl mt-24 mb-8 text-center">Análisis de riesgos</h1>
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20 mb-8" rows={['Descripción', 'Nivel', 'Tipo de riesgo', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {proyecto.allowed.to_update ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setAnalisisRiesgo(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar análisis de riesgo
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {analisis_riesgos.data.map((analisis_riesgo, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <p className="line-clamp-3">{analisis_riesgo.descripcion}</p>
                            </TableCell>
                            <TableCell>{niveles_riesgo.find((item) => item.value == analisis_riesgo.nivel).label}</TableCell>
                            <TableCell>{tipos_riesgo.find((item) => item.value == analisis_riesgo.tipo).label}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {analisis_riesgo.id !== analisis_riesgo_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setAnalisisRiesgo(analisis_riesgo))} disabled={!proyecto?.allowed?.to_view}>
                                                {proyecto?.allowed?.to_view && !proyecto?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setAnalisisRiesgoToDestroy(analisis_riesgo.id)
                                                }}
                                                disabled={!proyecto?.allowed?.to_update}>
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
                                                        router.delete(route('convocatorias.proyectos.analisis-riesgos.destroy', [convocatoria.id, proyecto.id, analisis_riesgo.id]), {
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

                <PaginationMui links={analisis_riesgos.links} />

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
                            analisis_riesgo={analisis_riesgo}
                            niveles_riesgo={niveles_riesgo}
                            tipos_riesgo={tipos_riesgo}
                            probabilidades_riesgo={probabilidades_riesgo}
                            impactos_riesgo={impactos_riesgo}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default AnalisisRiesgos
