import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import TableMui from '@/Components/Table'
import StepperMui from '@/Components/Stepper'

import Form from './Form'

import { checkRole } from '@/Utils'
import { Chip, Grid, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'
import Evaluacion from './Evaluacion'

const Edit = ({
    auth,
    convocatoria,
    proyecto_formulario_6_linea_82,
    evaluacion,
    centros_formacion,
    mesas_sectoriales_relacionadas,
    lineas_tecnoacademia_relacionadas,
    tecnoacademia,
    mesas_sectoriales,
    areas_conocimiento,
    subareas_conocimiento,
    disciplinas_subarea_conocimiento,
    actividades_economicas,
    tematicas_estrategicas,
    redes_conocimiento,
    lineas_tecnoacademia,
    lineas_investigacion,
    tecnoacademias,
    municipios,
    grupos_investigacion,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    areas_cualificacion_mnc,
    lineas_estrategicas,
    roles_sennova,
}) => {
    const auth_user = auth.user

    const [evaluacion_index, setEvaluacionIndex] = useState(0)
    const [dialog_status, setDialogStatus] = useState(false)

    const comentarios_evaluaciones =
        proyecto_formulario_6_linea_82?.proyecto?.evaluaciones?.length > 0
            ? Object.keys(proyecto_formulario_6_linea_82?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_formulario6_linea82).filter((field) => field.endsWith('_comentario'))
            : null

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{proyecto_formulario_6_linea_82.titulo}</h2>}>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto_formulario_6_linea_82?.proyecto} evaluacion={evaluacion} />
            </Grid>

            {/* {!evaluacion && (
                <>
                    <Grid item md={4}>
                        Evaluación
                    </Grid>
                    <Grid item md={8}>
                        {comentarios_evaluaciones && (
                            <>
                                <ButtonMui onClick={() => setDialogStatus(true)} primary={true}>
                                    Revisar evaluaciones
                                </ButtonMui>
                                <DialogMui
                                    fullWidth={true}
                                    maxWidth="lg"
                                    open={dialog_status}
                                    dialogContent={
                                        <>
                                            {proyecto_formulario_6_linea_82?.proyecto.evaluaciones.map((evaluacion, i) => (
                                                <ButtonMui onClick={() => setEvaluacionIndex(i)} primary={evaluacion_index == i} key={i} className="!ml-2">
                                                    Comentarios de la evaluación #{i + 1} <Chip className="ml-2 !text-white" label={evaluacion.id} size="small" />
                                                </ButtonMui>
                                            ))}
                                            <TableMui className="mt-20" rows={['Ítem', 'Comentario']}>
                                                {comentarios_evaluaciones &&
                                                    comentarios_evaluaciones
                                                        .sort((a, b) => a.toString().localeCompare(b.toString()))
                                                        .map((field, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell>
                                                                    <p className="first-letter:uppercase">{field.replace(/_comentario/g, '').replace(/_/g, ' ')}</p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {proyecto_formulario_6_linea_82?.proyecto.evaluaciones[evaluacion_index]?.evaluacion_proyecto_formulario6_linea82[field] ?? 'Sin comentarios'}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                            </TableMui>
                                        </>
                                    }
                                    dialogActions={
                                        <ButtonMui onClick={() => setDialogStatus(false)} primary={true} className="!mr-6">
                                            Cerrar
                                        </ButtonMui>
                                    }
                                />
                            </>
                        )}
                    </Grid>
                </>
            )}

            <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
            </Grid> */}

            <Grid item md={12}>
                <Form
                    auth_user={auth_user}
                    method="PUT"
                    convocatoria={convocatoria}
                    proyecto_formulario_6_linea_82={proyecto_formulario_6_linea_82}
                    evaluacion={evaluacion}
                    centros_formacion={centros_formacion}
                    mesas_sectoriales_relacionadas={mesas_sectoriales_relacionadas}
                    lineas_tecnoacademia_relacionadas={lineas_tecnoacademia_relacionadas}
                    tecnoacademia={tecnoacademia}
                    mesas_sectoriales={mesas_sectoriales}
                    areas_conocimiento={areas_conocimiento}
                    subareas_conocimiento={subareas_conocimiento}
                    disciplinas_subarea_conocimiento={disciplinas_subarea_conocimiento}
                    actividades_economicas={actividades_economicas}
                    tematicas_estrategicas={tematicas_estrategicas}
                    redes_conocimiento={redes_conocimiento}
                    lineas_tecnoacademia={lineas_tecnoacademia}
                    lineas_investigacion={lineas_investigacion}
                    tecnoacademias={tecnoacademias}
                    municipios={municipios}
                    grupos_investigacion={grupos_investigacion}
                    programas_formacion_con_registro_calificado={programas_formacion_con_registro_calificado}
                    programas_formacion_sin_registro_calificado={programas_formacion_sin_registro_calificado}
                    areas_cualificacion_mnc={areas_cualificacion_mnc}
                    lineas_estrategicas={lineas_estrategicas}
                    roles_sennova={roles_sennova}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
