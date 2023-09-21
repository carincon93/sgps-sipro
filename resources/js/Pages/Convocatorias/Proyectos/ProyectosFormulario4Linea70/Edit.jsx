import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import TableMui from '@/Components/Table'
import SenaLogo from '@/Components/SenaLogo'
import StepperMui from '@/Components/Stepper'

import Form from './Form'

import { checkRole, route } from '@/Utils'
import { Chip, Grid, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'
import { Head } from '@inertiajs/react'

const Edit = ({
    auth,
    convocatoria,
    proyecto_formulario_4_linea_70,
    evaluacion,
    tecnoacademias,
    tecnoacademia,
    lineas_programaticas,
    lineas_tecnoacademia,
    infraestructura_tecnoacademia,
    roles_sennova,
}) => {
    const auth_user = auth.user

    const [evaluacion_index, setEvaluacionIndex] = useState(0)
    const [dialog_status, setDialogStatus] = useState(true)

    const comentarios_evaluaciones =
        proyecto_formulario_4_linea_70?.proyecto?.evaluaciones?.lenght > 0
            ? Object.keys(proyecto_formulario_4_linea_70?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_formulario4_linea70).filter((field) => field.endsWith('_comentario'))
            : null

    return (
        <AuthenticatedLayout>
            <Head title={proyecto_formulario_4_linea_70.titulo} />

            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto_formulario_4_linea_70?.proyecto} evaluacion={evaluacion} />
            </Grid>

            {/* <Grid item md={4}>
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
                            {proyecto_formulario_4_linea_70?.proyecto.evaluaciones.map((evaluacion, i) => (
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
                                                <TableCell>{proyecto_formulario_4_linea_70?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_formulario4_linea70[field] ?? 'Sin comentarios'}</TableCell>
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
            </Grid> */}
            <Grid item md={12}>
                <Form
                    auth_user={auth_user}
                    method="PUT"
                    convocatoria={convocatoria}
                    proyecto_formulario_4_linea_70={proyecto_formulario_4_linea_70}
                    tecnoacademias={tecnoacademias}
                    tecnoacademia={tecnoacademia}
                    lineas_tecnoacademia={lineas_tecnoacademia}
                    lineas_programaticas={lineas_programaticas}
                    infraestructura_tecnoacademia={infraestructura_tecnoacademia}
                    roles_sennova={roles_sennova}
                />
            </Grid>

            <DialogMui
                fullWidth={true}
                maxWidth="md"
                blurEnabled={true}
                open={dialog_status}
                enableGradient={true}
                dialogContent={
                    <div className="text-white">
                        <span className="pointer-events-none place-items-center gap-2 flex py-2" href="/">
                            SENNOVA | <SenaLogo className="w-10" />
                        </span>
                        <h1 className="text-center text-3xl mt-6 mb-10">PROYECTO {proyecto_formulario_4_linea_70?.proyecto.codigo}</h1>

                        <figure>
                            <img src="/images/proyecto-sgps.png" alt="" className="mx-auto" />
                        </figure>

                        <p className="mt-10">
                            Por favor, termine de diligenciar la información del formulario <strong>1. Generalidades</strong>. Luego continúe con el resto del flujo de formulación.
                        </p>

                        <figure className="mt-4">
                            <img src="/images/flujo-formulacion.png" alt="" className="mx-auto rounded" />
                        </figure>

                        <p className="mt-10">No olvide darle un vistazp al instructivo de formulación.</p>

                        <a
                            href="/storage/documentos-descarga/Instructivo_formulacion_sgps_sipro.pdf"
                            className="bg-white text-black text-center p-2 rounded block mt-6 hover:opacity-90"
                            target="_blank">
                            Descargar el instructivo de formulación
                        </a>
                    </div>
                }
                dialogActions={
                    <>
                        <ButtonMui onClick={() => setDialogStatus(false)} className="!mr-4">
                            Cerrar
                        </ButtonMui>
                    </>
                }
            />
        </AuthenticatedLayout>
    )
}

export default Edit
