import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import StepperMui from '@/Components/Stepper'
import SwitchMui from '@/Components/Switch'
import TableMui from '@/Components/Table'
import Textarea from '@/Components/Textarea'
import TextInput from '@/Components/TextInput'
import ToolTipMui from '@/Components/Tooltip'

import Evaluacion from './Evaluacion'
import Form from './Form'

import { checkRole } from '@/Utils'

import DownloadIcon from '@mui/icons-material/Download'
import { Grid, TableCell, TableRow } from '@mui/material'

import { useForm } from '@inertiajs/react'

import { useState } from 'react'

const Anexos = ({ auth, convocatoria, proyecto, evaluacion, proyecto_anexo, anexos, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)

    const form = useForm({
        video: proyecto.video,
        infraestructura_adecuada: proyecto.infraestructura_adecuada ? proyecto.infraestructura_adecuada : false,
        especificaciones_area: proyecto.especificaciones_area,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.servicios-tecnologicos.infraestructura', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

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
            </Grid>

            {proyecto.codigo_linea_programatica == 68 && (
                <>
                    <h1 className="mt-24 mb-8 text-center text-3xl">Especificaciones e infraestructura</h1>

                    <form onSubmit={submit} className="mt-4 p-4">
                        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                            <div className="mt-8">
                                <Label
                                    required
                                    labelFor="infraestructura_adecuada"
                                    value="¿Cuenta con infraestructura adecuada y propia para el funcionamiento de la línea servicios tecnológicos en el centro de formación?"
                                    className="inline-block mb-4"
                                />
                                <br />
                                <SwitchMui checked={form.infraestructura_adecuada} />
                            </div>
                            <div className="mt-8">
                                <Label
                                    required
                                    labelFor="especificaciones_area"
                                    value="Relacione las especificaciones del área donde se desarrollan las actividades de servicios tecnológicos en el centro de formación"
                                    className="inline-block mb-4"
                                />
                                <Textarea label="Especificaciones del área" id="especificaciones_area" error={form.errors.especificaciones_area} value={form.data.especificaciones_area} required />
                            </div>
                            <div className="mt-8">
                                <Label
                                    required
                                    labelFor="video"
                                    value="Enlace del video de las instalaciones donde se desarrollan las actividades de la línea servicios tecnológicos. (Youtube, Vídeo en Google Drive con visualización pública)"
                                    className="inline-block mb-4"
                                />
                                <TextInput label="Enlace del video" type="url" value={form.data.video} error={form.errors.video} required />
                                <AlertMui>
                                    El vídeo debe incluir durante el recorrido en las instalaciones, una voz en off que justifique puntualmente el proyecto e incluya: el impacto a la formación, al
                                    sector productivo y a la política nacional de ciencia, tecnología e innovación.
                                </AlertMui>
                            </div>
                            <div className="w-1/12">
                                <PrimaryButton disabled={form.processing} className="w-full mt-4" type="submit">
                                    Guardar
                                </PrimaryButton>
                            </div>
                        </fieldset>
                    </form>
                </>
            )}

            <AlertMui className="mt-20">
                <h1 className="mb-10 font-black">Importante:</h1>
                <ul>
                    <li>
                        <strong>ANEXO 1A. Acta_Reunión Regional</strong> NO se adjunta en plataforma. Se envía junto al Anexo 1B a la Coordinación Sennova (Obligatorio)
                    </li>

                    <li>
                        <strong>ANEXO 1C. Carta C.I Director Regional</strong> NO se adjunta en plataforma. Se envía a la Coordinación Sennova, uno por regional, junto con el Anexo 1A (Obligatorio)
                    </li>
                </ul>
            </AlertMui>

            {is_super_admin || proyecto.mostrar_recomendaciones ? (
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
                                                {evaluacion.evaluacion_proyecto_linea66?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea66.anexos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea65 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea65?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea65.anexos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea70 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea70?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea70.anexos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea69 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea69?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea69.anexos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : (
                                            evaluacion.evaluacion_proyecto_linea68 && (
                                                <>
                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Anexos</h1>

                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.anexos_comentario
                                                                ? 'Recomendación anexos: ' + evaluacion.evaluacion_proyecto_linea68.anexos_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                    </ul>

                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Video</h1>

                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.video_comentario
                                                                ? 'Recomendación video: ' + evaluacion.evaluacion_proyecto_linea68.video_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                    </ul>

                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Especificaciones del área</h1>

                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.especificaciones_area_comentario
                                                                ? 'Recomendación especificaciones área: ' + evaluacion.evaluacion_proyecto_linea68.especificaciones_area_comentario
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

            <Grid item md={12}>
                <TableMui className="mt-20" rows={['Nombre', 'Archivo']} sxCellThead={{ width: '320px' }}>
                    {anexos.data.map((anexo, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <p className="px-6 py-4 focus:text-app-500">
                                    {anexo.nombre}
                                    <br />
                                    {anexo.obligatorio && <span className="text-red-500">* El anexo es obligatorio</span>}
                                    {anexo.archivo && (
                                        <a target="_blank" className="text-app-400 underline mt-4 mb-4 flex" download href={anexo.archivo}>
                                            <DownloadIcon /> Descargar formato para diligenciar dando clic en este enlace.
                                        </a>
                                    )}
                                </p>
                            </TableCell>
                            <TableCell>
                                <Form convocatoria={convocatoria} proyecto={proyecto} anexo={anexo} proyecto_anexo={proyecto_anexo} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableMui>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Anexos
