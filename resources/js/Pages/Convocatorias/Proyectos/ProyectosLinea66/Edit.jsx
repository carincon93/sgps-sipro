import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import TableMui from '@/Components/Table'
// import Stepper from '@/Components/Stepper';

import Form from './Form'

import { checkRole, route } from '@/Utils'
import { Grid, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'

const Edit = ({
    auth,
    convocatoria,
    proyectoLinea66,
    mesasSectoriales,
    centrosFormacion,
    lineasProgramaticas,
    redesConocimiento,
    disciplinasSubareaConocimiento,
    actividadesEconomicas,
    tematicasEstrategicas,
    lineasTecnoacademia,
    lineasInvestigacion,
    tecnoacademias,
    municipios,
    tecnoacademia,
    areasTematicasEni,
    lineasInvestigacionEni,
    gruposInvestigacion,
    proyectoMunicipios,
    proyectoAreasTematicasEni,
    proyectoLineasInvestigacionEni,
    programasFormacionConRegistroCalificado,
    programasFormacionSinRegistroCalificado,
    mesasSectorialesRelacionadas,
    lineasTecnoacademiaRelacionadas,
    programasFormacionConRegistroRelacionados,
    programasFormacionSinRegistroRelacionados,
}) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [evaluacionIndex, setEvaluacionIndex] = useState(0)
    const [dialogStatus, setDialogStatus] = useState(false)

    const comentariosEvaluaciones = Object.keys(proyectoLinea66?.proyecto.evaluaciones[evaluacionIndex].idi_evaluacion).filter((field) => field.endsWith('_comentario'))

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{proyectoLinea66.titulo}</h2>}>
            <Grid item md={4}>
                Evaluación
            </Grid>

            <Grid item md={8}>
                <ButtonMui onClick={() => setDialogStatus(true)} primary={true}>
                    Revisar evaluaciones
                </ButtonMui>
                <DialogMui
                    fullWidth={true}
                    maxWidth="lg"
                    open={dialogStatus}
                    dialogContent={
                        <>
                            {proyectoLinea66?.proyecto.evaluaciones.map((evaluacion, i) => (
                                <ButtonMui onClick={() => setEvaluacionIndex(i)} primary={evaluacionIndex == i} key={i} className="!ml-2">
                                    Ver comentarios de la evaluación #{i + 1}
                                </ButtonMui>
                            ))}
                            <TableMui className="mt-20" rows={['Ítem', 'Comentario']}>
                                {comentariosEvaluaciones
                                    .sort((a, b) => a.toString().localeCompare(b.toString()))
                                    .map((field, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <p className="first-letter:uppercase">{field.replace(/_comentario/g, '').replace(/_/g, ' ')}</p>
                                            </TableCell>
                                            <TableCell>{proyectoLinea66?.proyecto.evaluaciones[evaluacionIndex].idi_evaluacion[field] ?? 'Sin comentarios'}</TableCell>
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
            </Grid>
            <Grid item md={12}>
                <Form
                    isSuperAdmin={isSuperAdmin}
                    method="editar"
                    proyectoLinea66={proyectoLinea66}
                    centrosFormacion={centrosFormacion}
                    lineasProgramaticas={lineasProgramaticas}
                    gruposInvestigacion={gruposInvestigacion}
                    mesasSectoriales={mesasSectoriales}
                    tecnoacademia={tecnoacademia}
                    convocatoria={convocatoria}
                    redesConocimiento={redesConocimiento}
                    disciplinasSubareaConocimiento={disciplinasSubareaConocimiento}
                    actividadesEconomicas={actividadesEconomicas}
                    tematicasEstrategicas={tematicasEstrategicas}
                    lineasTecnoacademia={lineasTecnoacademia}
                    lineasInvestigacion={lineasInvestigacion}
                    tecnoacademias={tecnoacademias}
                    municipios={municipios}
                    areasTematicasEni={areasTematicasEni}
                    lineasInvestigacionEni={lineasInvestigacionEni}
                    programasFormacionConRegistroCalificado={programasFormacionConRegistroCalificado}
                    programasFormacionSinRegistroCalificado={programasFormacionSinRegistroCalificado}
                    proyectoMunicipios={proyectoMunicipios}
                    proyectoAreasTematicasEni={proyectoAreasTematicasEni}
                    proyectoLineasInvestigacionEni={proyectoLineasInvestigacionEni}
                    mesasSectorialesRelacionadas={mesasSectorialesRelacionadas}
                    lineasTecnoacademiaRelacionadas={lineasTecnoacademiaRelacionadas}
                    programasFormacionConRegistroRelacionados={programasFormacionConRegistroRelacionados}
                    programasFormacionSinRegistroRelacionados={programasFormacionSinRegistroRelacionados}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
