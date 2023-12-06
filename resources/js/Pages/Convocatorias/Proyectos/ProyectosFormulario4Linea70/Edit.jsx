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
import { Head, usePage } from '@inertiajs/react'

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

    const [dialog_status, setDialogStatus] = useState(true)

    const { props: page_props } = usePage()
    const evaluacion_id = page_props.ziggy.query.evaluacion_id

    return (
        <AuthenticatedLayout>
            <Head title={proyecto_formulario_4_linea_70.titulo} />

            <Grid item md={12} className="!mb-20">
                <StepperMui auth_user={auth_user} convocatoria={convocatoria} proyecto={proyecto_formulario_4_linea_70?.proyecto} evaluacion={evaluacion} />
            </Grid>

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

                        {['1'].includes(convocatoria.fase) ? (
                            <>
                                <figure>
                                    <img src="/images/proyecto-sgps.png" alt="" className="mx-auto w-44" />
                                </figure>

                                {!proyecto_formulario_4_linea_70.bibliografia && (
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
                        ) : evaluacion_id ? (
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
                        ) : ['3'].includes(convocatoria.fase) ? (
                            <>
                                <figure>
                                    <img src="/images/proyecto-sgps.png" alt="" className="mx-auto w-44" />
                                </figure>

                                <p className="mt-10">No olvide darle un vistazo al instructivo de subsanación.</p>

                                <a
                                    href="/storage/documentos-descarga/Instructivo_subsanacion_sgps_sipro.pdf"
                                    className="bg-white text-black text-center p-2 rounded block mt-6 hover:opacity-90"
                                    target="_blank">
                                    Descargar el instructivo de subsanación
                                </a>
                            </>
                        ) : null}
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
