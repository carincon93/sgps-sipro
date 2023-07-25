import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import TableMui from '@/Components/Table'
import StepperMui from '@/Components/Stepper'

import Form from './Form'

import { checkRole, route } from '@/Utils'
import { Grid, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'

const Edit = ({ auth, convocatoria, proyectoLinea70, lineasProgramaticas, lineasTecnoacademia, infraestructuraTecnoacademia, rolesSennova }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [evaluacionIndex, setEvaluacionIndex] = useState(0)
    const [dialogStatus, setDialogStatus] = useState(false)

    const comentariosEvaluaciones =
        proyectoLinea70?.proyecto.evaluaciones.lenght > 0 ? Object.keys(proyectoLinea70?.proyecto.evaluaciones[evaluacionIndex].ta_evaluacion).filter((field) => field.endsWith('_comentario')) : null

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{proyectoLinea70.titulo}</h2>}>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyectoLinea70?.proyecto} />
            </Grid>

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
                            {proyectoLinea70?.proyecto.evaluaciones.map((evaluacion, i) => (
                                <ButtonMui onClick={() => setEvaluacionIndex(i)} primary={evaluacionIndex == i} key={i} className="!ml-2">
                                    Ver comentarios de la evaluación #{i + 1}
                                </ButtonMui>
                            ))}
                            <TableMui className="mt-20" rows={['Ítem', 'Comentario']}>
                                {comentariosEvaluaciones &&
                                    comentariosEvaluaciones
                                        .sort((a, b) => a.toString().localeCompare(b.toString()))
                                        .map((field, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <p className="first-letter:uppercase">{field.replace(/_comentario/g, '').replace(/_/g, ' ')}</p>
                                                </TableCell>
                                                <TableCell>{proyectoLinea70?.proyecto.evaluaciones[evaluacionIndex].ta_evaluacion[field] ?? 'Sin comentarios'}</TableCell>
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
                    authUser={authUser}
                    method="editar"
                    convocatoria={convocatoria}
                    proyectoLinea70={proyectoLinea70}
                    lineasTecnoacademia={lineasTecnoacademia}
                    lineasProgramaticas={lineasProgramaticas}
                    infraestructuraTecnoacademia={infraestructuraTecnoacademia}
                    rolesSennova={rolesSennova}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
