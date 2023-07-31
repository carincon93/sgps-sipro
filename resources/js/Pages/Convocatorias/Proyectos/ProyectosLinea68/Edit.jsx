import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import TableMui from '@/Components/Table'
import StepperMui from '@/Components/Stepper'

import Form from './Form'

import { checkRole } from '@/Utils'
import { Chip, Grid, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'

const Edit = ({
    auth,
    convocatoria,
    proyecto_linea_68,
    evaluacion,
    centros_formacion,
    lineas_programaticas,
    tipos_proyecto_linea_68,
    sectores_productivos,
    estados_sistema_gestion,
    programas_formacion_con_registro_calificado,
    roles_sennova,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [evaluacion_index, setEvaluacionIndex] = useState(0)
    const [dialog_status, setDialogStatus] = useState(false)

    const comentarios_evaluaciones =
        proyecto_linea_68?.proyecto.evaluaciones.length > 0
            ? Object.keys(proyecto_linea_68?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_linea68).filter((field) => field.endsWith('_comentario'))
            : null

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{proyecto_linea_68.titulo}</h2>}>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto_linea_68?.proyecto} evaluacion={evaluacion} />
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
                    open={dialog_status}
                    dialogContent={
                        <>
                            {proyecto_linea_68?.proyecto.evaluaciones.map((evaluacion, i) => (
                                <ButtonMui onClick={() => setEvaluacionIndex(i)} primary={evaluacion_index == i} key={i} className="!ml-2">
                                    Comentarios de la evaluación #{i + 1} <Chip className="ml-2 !text-white" label={evaluacion.id} size="small" />
                                </ButtonMui>
                            ))}
                            <TableMui className="mt-20" rows={['Ítem', 'Comentario']} sxCellThead={{ width: '320px' }}>
                                {comentarios_evaluaciones &&
                                    comentarios_evaluaciones
                                        .sort((a, b) => a.toString().localeCompare(b.toString()))
                                        .map((field, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <p className="first-letter:uppercase">{field.replace(/_comentario/g, '').replace(/_/g, ' ')}</p>
                                                </TableCell>
                                                <TableCell>{proyecto_linea_68?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_linea68[field] ?? 'Sin comentarios'}</TableCell>
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
                    is_super_admin={is_super_admin}
                    method="editar"
                    convocatoria={convocatoria}
                    proyecto_linea_68={proyecto_linea_68}
                    centros_formacion={centros_formacion}
                    lineas_programaticas={lineas_programaticas}
                    tipos_proyecto_linea_68={tipos_proyecto_linea_68}
                    sectores_productivos={sectores_productivos}
                    estados_sistema_gestion={estados_sistema_gestion}
                    programas_formacion_con_registro_calificado={programas_formacion_con_registro_calificado}
                    roles_sennova={roles_sennova}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
