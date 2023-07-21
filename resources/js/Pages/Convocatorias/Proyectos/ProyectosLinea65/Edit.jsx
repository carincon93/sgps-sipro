import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import DialogMui from '@/Components/Dialog'
import ButtonMui from '@/Components/Button'

import { checkRole } from '@/Utils'
import { Grid, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'
import TableMui from '@/Components/Table'

const Edit = ({
    auth,
    convocatoria,
    proyectoLinea65,
    mesasSectoriales,
    areasConocimiento,
    lineasInvestigacion,
    lineasProgramaticas,
    lineasTecnoacademia,
    actividadesEconomicas,
    tematicasEstrategicas,
    tecnoacademia,
    tecnoacademias,
    programasFormacionConRegistroCalificado,
    programasFormacionSinRegistroCalificado,
    municipios,
    proyectoMunicipios,
    mesasSectorialesRelacionadas,
    lineasTecnoacademiaRelacionadas,
    programasFormacionConRegistroRelacionados,
    programasFormacionSinRegistroRelacionados,
    tiposProyectos,
    tiposEventos,
    ...props
}) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [evaluacionIndex, setEvaluacionIndex] = useState(0)
    const [dialogStatus, setDialogStatus] = useState(false)

    const comentariosEvaluaciones = Object.keys(proyectoLinea65?.proyecto.evaluaciones[evaluacionIndex].cultura_innovacion_evaluacion).filter((field) => field.endsWith('_comentario'))

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{proyectoLinea65.titulo}</h2>}>
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
                            {proyectoLinea65?.proyecto.evaluaciones.map((evaluacion, i) => (
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
                                            <TableCell>{proyectoLinea65?.proyecto.evaluaciones[evaluacionIndex].cultura_innovacion_evaluacion[field] ?? 'Sin comentarios'}</TableCell>
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
                    convocatoria={convocatoria}
                    proyectoLinea65={proyectoLinea65}
                    mesasSectoriales={mesasSectoriales}
                    areasConocimiento={areasConocimiento}
                    lineasInvestigacion={lineasInvestigacion}
                    lineasProgramaticas={lineasProgramaticas}
                    lineasTecnoacademia={lineasTecnoacademia}
                    actividadesEconomicas={actividadesEconomicas}
                    tematicasEstrategicas={tematicasEstrategicas}
                    tecnoacademia={tecnoacademia}
                    tecnoacademias={tecnoacademias}
                    programasFormacionConRegistroCalificado={programasFormacionConRegistroCalificado}
                    programasFormacionSinRegistroCalificado={programasFormacionSinRegistroCalificado}
                    municipios={municipios}
                    proyectoMunicipios={proyectoMunicipios}
                    mesasSectorialesRelacionadas={mesasSectorialesRelacionadas}
                    lineasTecnoacademiaRelacionadas={lineasTecnoacademiaRelacionadas}
                    programasFormacionConRegistroRelacionados={programasFormacionConRegistroRelacionados}
                    programasFormacionSinRegistroRelacionados={programasFormacionSinRegistroRelacionados}
                    tiposProyectos={tiposProyectos}
                    tiposEventos={tiposEventos}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
