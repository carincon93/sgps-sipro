import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import TableMui from '@/Components/Table'
import SenaLogo from '@/Components/SenaLogo'
import StepperMui from '@/Components/Stepper'

import Form from './Form'

import { checkRole } from '@/Utils'
import { Chip, Grid, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'
import { Head, usePage } from '@inertiajs/react'

const Edit = ({
    auth,
    convocatoria,
    proyecto_formulario_12_linea_68,
    evaluacion,
    centros_formacion,
    lineas_programaticas,
    tipos_proyecto_linea_68,
    sectores_productivos,
    estados_sistema_gestion,
    programas_formacion_sin_registro_calificado,
    programas_formacion_con_registro_calificado,
    municipios,
    roles_sennova,
    campos_convocatoria,
}) => {
    const auth_user = auth.user

    const [evaluacion_index, setEvaluacionIndex] = useState(0)
    const [dialog_status, setDialogStatus] = useState(true)

    const { props: page_props } = usePage()
    const evaluacion_id = page_props.ziggy.query.evaluacion_id

    const comentarios_evaluaciones =
        proyecto_formulario_12_linea_68?.proyecto?.evaluaciones?.length > 0
            ? Object.keys(proyecto_formulario_12_linea_68?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_formulario12_linea68).filter((field) => field.endsWith('_comentario'))
            : null

    return (
        <AuthenticatedLayout>
            <Head title={proyecto_formulario_12_linea_68.titulo} />

            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto_formulario_12_linea_68?.proyecto} evaluacion={evaluacion} />
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
                            {proyecto_formulario_12_linea_68?.proyecto.evaluaciones.map((evaluacion, i) => (
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
                                                <TableCell>{proyecto_formulario_12_linea_68?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_formulario12_linea68[field] ?? 'Sin comentarios'}</TableCell>
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
                    proyecto_formulario_12_linea_68={proyecto_formulario_12_linea_68}
                    centros_formacion={centros_formacion}
                    lineas_programaticas={lineas_programaticas}
                    tipos_proyecto_linea_68={tipos_proyecto_linea_68}
                    sectores_productivos={sectores_productivos}
                    estados_sistema_gestion={estados_sistema_gestion}
                    programas_formacion_sin_registro_calificado={programas_formacion_sin_registro_calificado}
                    programas_formacion_con_registro_calificado={programas_formacion_con_registro_calificado}
                    municipios={municipios}
                    roles_sennova={roles_sennova}
                    campos_convocatoria={campos_convocatoria}
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
                        <h1 className="text-center text-3xl mt-6 mb-10">PROYECTO {proyecto_formulario_12_linea_68?.proyecto.codigo}</h1>

                        {!evaluacion_id ? (
                            <>
                                <figure>
                                    <img src="/images/proyecto-sgps.png" alt="" className="mx-auto w-44" />
                                </figure>

                                {!proyecto_formulario_12_linea_68.bibliografia && (
                                    <>
                                        <p className="mt-10">
                                            Por favor, termine de diligenciar la información del formulario <strong>1. Generalidades</strong>. Luego continúe con el resto del flujo de formulación.
                                        </p>

                                        <figure className="mt-4">
                                            <img src="/images/flujo-formulacion.png" alt="" className="mx-auto rounded" />
                                        </figure>
                                    </>
                                )}

                                <p className="mt-10">No olvide darle un vistazo al instructivo de formulación.</p>

                                <a
                                    href="/storage/documentos-descarga/Instructivo_formulacion_sgps_sipro.pdf"
                                    className="bg-white text-black text-center p-2 rounded block mt-6 hover:opacity-90"
                                    target="_blank">
                                    Descargar el instructivo de formulación
                                </a>
                            </>
                        ) : (
                            <>
                                <p className="mt-10"></p>

                                <figure className="mt-4">
                                    <img src="/images/evaluadores.png" alt="" className="mx-auto rounded" width="250" />
                                </figure>

                                <a
                                    href="/storage/documentos-descarga/Instructivo_evaluacion_sgps_sipro.pdf"
                                    className="bg-white text-black text-center p-2 rounded block mt-6 hover:opacity-90"
                                    target="_blank">
                                    Descargar el instructivo de evaluación
                                </a>
                            </>
                        )}
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
