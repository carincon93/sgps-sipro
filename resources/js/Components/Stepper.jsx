import PropTypes from 'prop-types'

import AlertMui from './Alert'
import ButtonMui from './Button'
import DialogMui from './Dialog'
import DownloadFile from './DownloadFile'

import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Chip, Divider, Grid } from '@mui/material'

import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import Check from '@mui/icons-material/Check'
import ChecklistIcon from '@mui/icons-material/Checklist'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import SettingsIcon from '@mui/icons-material/Settings'
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined'
import VideoLabelIcon from '@mui/icons-material/VideoLabel'

import { Link, useForm } from '@inertiajs/react'

import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import FileTypeIcon from './FileTypeIcon'

import React, { useState } from 'react'

import EvaluacionProyectosFormulario1Linea65 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario1Linea65/Evaluacion'
import EvaluacionProyectosFormulario3Linea61 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario3Linea61/Evaluacion'
import EvaluacionProyectosFormulario4Linea70 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario4Linea70/Evaluacion'
import EvaluacionProyectosFormulario5Linea69 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario5Linea69/Evaluacion'
import EvaluacionProyectosFormulario6Linea82 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario6Linea82/Evaluacion'
import EvaluacionProyectosFormulario7Linea23 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario7Linea23/Evaluacion'
import EvaluacionProyectosFormulario8Linea66 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario8Linea66/Evaluacion'
import EvaluacionProyectosFormulario9Linea23 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario9Linea23/Evaluacion'
import EvaluacionProyectosFormulario10Linea69 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario10Linea69/Evaluacion'
import EvaluacionProyectosFormulario12Linea68 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario12Linea68/Evaluacion'
import EvaluacionProyectosFormulario13Linea65 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario13Linea65/Evaluacion'
import EvaluacionProyectosFormulario15Linea65 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario15Linea65/Evaluacion'
import EvaluacionProyectosFormulario16Linea65 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario16Linea65/Evaluacion'
import EvaluacionProyectosFormulario17Linea69 from '@/Pages/Convocatorias/Proyectos/ProyectosFormulario17Linea69/Evaluacion'

import { checkRole } from '@/Utils'

import TabsMui from './TabsMui'
import Textarea from './Textarea'
import { useEffect } from 'react'
import PrimaryButton from './PrimaryButton'

const useStyles = makeStyles({
    root: {
        '& .MuiStepLabel-label': {
            fontSize: '12px',
        },
        '& .MuiStepLabel-labelContainer:hover': {
            color: 'rgb(0 0 0)',
            cursor: 'pointer',
        },
        '& .MuiStepLabel-iconContainer:hover': {
            cursor: 'pointer',
        },
        '& .MuiStepIcon-root:hover': {
            color: 'rgb(0 0 0)',
        },
    },
})

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}))

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: '#784af4',
    }),
    '& .QontoStepIcon-completedIcon': {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}))

const QontoStepIcon = (props) => {
    const { active, completed, className, route } = props

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
        </QontoStepIconRoot>
    )
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    route: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg, rgb(144 163 255) 10%, rgb(83 163 199) 20%, rgb(55 65 81) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg, rgb(144 163 255) 10%, rgb(83 163 199) 20%, rgb(55 65 81) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}))

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}))

const ColorlibStepIcon = (props) => {
    const { active, completed, className } = props

    const icons = {
        1: <SettingsIcon />,
        2: <GroupAddIcon />,
        3: <VideoLabelIcon />,
    }

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    )
}

ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
}

export default function StepperMui({ auth_user, convocatoria, proyecto, evaluacion, ...props }) {
    const classes = useStyles()
    const is_super_admin = checkRole(auth_user, [1])
    const [dialog_evaluaciones_status, setDialogEvaluacionesStatus] = useState(false)
    const [dialog_evaluaciones_2_status, setDialogEvaluaciones2Status] = useState(false)
    const [dialog_evaluacion_status, setDialogEvaluacionStatus] = useState(false)
    const [dialog_archivos_status, setDialogArchivosStatus] = useState(false)
    const [dialog_respuesta_evaluador_status, setDialogRespuestaFormuladorStatus] = useState(false)
    const [respuesta_evaluador, setRespuestaFormulador] = useState(null)

    const isActive =
        route().current('convocatorias.proyectos-formulario-3-linea-61.edit') ||
        route().current('convocatorias.proyectos-formulario-7-linea-23.edit') ||
        route().current('convocatorias.proyectos-formulario-9-linea-23.edit') ||
        route().current('convocatorias.proyectos-formulario-8-linea-66.edit') ||
        route().current('convocatorias.proyectos-formulario-1-linea-65.edit') ||
        route().current('convocatorias.proyectos-formulario-13-linea-65.edit') ||
        route().current('convocatorias.proyectos-formulario-15-linea-65.edit') ||
        route().current('convocatorias.proyectos-formulario-16-linea-65.edit') ||
        route().current('convocatorias.proyectos-formulario-12-linea-68.edit') ||
        route().current('convocatorias.proyectos-formulario-5-linea-69.edit') ||
        route().current('convocatorias.proyectos-formulario-10-linea-69.edit') ||
        route().current('convocatorias.proyectos-formulario-17-linea-69.edit') ||
        route().current('convocatorias.proyectos-formulario-4-linea-70.edit') ||
        route().current('convocatorias.proyectos-formulario-6-linea-82.edit') ||
        route().current('convocatorias.proyectos-formulario-11-linea-83.edit')

    const evaluacion_tabs = []
    proyecto.evaluaciones.filter((item) => item.habilitado == true).map((evaluacion) => evaluacion_tabs.push({ label: 'Evaluación #' + evaluacion.id }))

    const form_respuesta_formulador = useForm({
        id: null,
        comentario_formulador: '',
    })

    useEffect(() => {
        if (respuesta_evaluador) {
            form_respuesta_formulador.setData({ id: respuesta_evaluador.id, comentario_formulador: respuesta_evaluador.comentario_formulador })
        }
    }, [respuesta_evaluador])

    const submitRespuestaFormulador = (e) => {
        e.preventDefault()

        form_respuesta_formulador.put(route('convocatorias.evaluaciones.respuesta-formulador', [convocatoria.id, respuesta_evaluador.id]), {
            onSuccess: () => setDialogRespuestaFormuladorStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <>
            {is_super_admin && (
                <>
                    <ButtonMui className="!fixed bottom-0 z-[1200]" onClick={() => setDialogEvaluacionesStatus(true)} primary={true}>
                        <ChecklistIcon className="mr-2" />
                        Revisar evaluaciones - Versión anterior
                    </ButtonMui>
                    <DialogMui
                        fullWidth={true}
                        maxWidth="lg"
                        open={dialog_evaluaciones_status}
                        dialogContent={
                            <>
                                <TabsMui tabs={evaluacion_tabs}>
                                    {proyecto.evaluaciones
                                        .filter((item) => item.habilitado == true)
                                        .map((evaluacion, i) => (
                                            <React.Fragment key={i}>
                                                {evaluacion.evaluaciones_proyecto_formulario1_linea65.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario1_linea65.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario3_linea61.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario3_linea61.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario4_linea70.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario4_linea70.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario6_linea82.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario6_linea82.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario7_linea23.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario7_linea23.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario8_linea66.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario8_linea66.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario9_linea23.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario9_linea23.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario10_linea69.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario10_linea69.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario12_linea68.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario12_linea68.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario13_linea65.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario13_linea65.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario15_linea65.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario15_linea65.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario16_linea65.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario16_linea65.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {evaluacion.evaluaciones_proyecto_formulario17_linea69.map((item_evaluado, j) => (
                                                    <div key={j}>
                                                        <p className="whitespace-pre-line mb-10">
                                                            <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario17_linea69.campo}</strong>
                                                            <br />
                                                            {item_evaluado.comentario ?? 'Sin recomendaciones'}
                                                        </p>
                                                    </div>
                                                ))}
                                                <Divider className="!my-10">RUBROS PRESUPUESTALES</Divider>
                                                {evaluacion.proyecto_presupuestos_evaluaciones
                                                    .filter((item) => item.correcto == false)
                                                    .map((evaluacion_presupuesto, k) => (
                                                        <p className="whitespace-pre-line mb-10" key={k}>
                                                            <strong>Código del presupuesto #{evaluacion_presupuesto.proyecto_presupuesto_id}</strong> {' - Recomendación: '}
                                                            {evaluacion_presupuesto.comentario}
                                                        </p>
                                                    ))}
                                                {evaluacion.proyecto_presupuestos_evaluaciones.filter((item) => item.correcto == false).length == 0 && <>Sin recomendaciones</>}

                                                <Divider className="!my-10">ROLES</Divider>
                                                {evaluacion.proyecto_roles_evaluaciones
                                                    .filter((item) => item.correcto == false)
                                                    .map((evaluacion_rol, k) => (
                                                        <p className="whitespace-pre-line mb-10" key={k}>
                                                            <strong>Código del rol #{evaluacion_rol.proyecto_rol_sennova_id}</strong> {' - '}
                                                            {evaluacion_rol.comentario}
                                                        </p>
                                                    ))}
                                                {evaluacion.proyecto_roles_evaluaciones.filter((item) => item.correcto == false).length == 0 && <>Sin recomendaciones</>}

                                                <Divider className="!my-10">COMENTARIO GENERAL</Divider>
                                                {evaluacion.comentario_evaluador ?? 'No hay comentarios'}

                                                {proyecto?.allowed?.to_update && (
                                                    <div className="mt-10">
                                                        <AlertMui>
                                                            Haga clic en el siguiente botón si quiere hacer una aclaración al evaluador/a sobre ítems formulados
                                                            <br />
                                                            <ButtonMui
                                                                className="!mt-4"
                                                                onClick={() => (form_respuesta_formulador.reset(), setDialogRespuestaFormuladorStatus(true), setRespuestaFormulador(evaluacion))}>
                                                                Respuesta al evaluador
                                                            </ButtonMui>
                                                        </AlertMui>

                                                        <DialogMui
                                                            open={dialog_respuesta_evaluador_status}
                                                            maxWidth="md"
                                                            fullWidth={true}
                                                            dialogContent={
                                                                <form onSubmit={submitRespuestaFormulador}>
                                                                    <Textarea
                                                                        label="Respuesta"
                                                                        className="!mt-10"
                                                                        inputBackground="#fff"
                                                                        id="comentario_formulador"
                                                                        value={form_respuesta_formulador.data.comentario_formulador}
                                                                        error={form_respuesta_formulador.errors.comentario_formulador}
                                                                        onChange={(e) => form_respuesta_formulador.setData('comentario_formulador', e.target.value)}
                                                                        disabled={proyecto.finalizado}
                                                                        required
                                                                    />

                                                                    <div className="mt-6 flex items-center justify-end">
                                                                        <ButtonMui onClick={() => setDialogRespuestaFormuladorStatus(false)} className="!bg-transparent !text-app-700 !mr-2">
                                                                            Cerrar
                                                                        </ButtonMui>
                                                                        {!proyecto.finalizado && (
                                                                            <PrimaryButton disabled={form_respuesta_formulador.processing} type="submit">
                                                                                Guardar
                                                                            </PrimaryButton>
                                                                        )}
                                                                    </div>
                                                                </form>
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                </TabsMui>
                            </>
                        }
                        dialogActions={
                            <ButtonMui onClick={() => setDialogEvaluacionesStatus(false)} className="!mr-8">
                                Cerrar
                            </ButtonMui>
                        }
                    />
                </>
            )}

            {(proyecto.evaluaciones.length > 0 && is_super_admin) ||
            (proyecto.evaluaciones.length > 0 && ['3', '4', '5'].includes(convocatoria.fase) && proyecto?.estado_evaluacion_proyecto?.requiere_subsanar) ? (
                <>
                    <ButtonMui className="!fixed bottom-10 z-[1200]" onClick={() => setDialogEvaluaciones2Status(true)} primary={true}>
                        <ChecklistIcon className="mr-2" />
                        Revisar evaluaciones
                    </ButtonMui>
                    <DialogMui
                        fullWidth={true}
                        maxWidth="lg"
                        open={dialog_evaluaciones_2_status}
                        dialogContent={
                            <>
                                {proyecto.evaluaciones
                                    .filter((item) => item.habilitado == true)
                                    .map((evaluacion, i) => (
                                        <React.Fragment key={i}>
                                            <Divider className="!my-10" />
                                            {evaluacion.evaluaciones_proyecto_formulario1_linea65.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario1_linea65.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario3_linea61.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario3_linea61.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario4_linea70.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario4_linea70.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario6_linea82.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario6_linea82.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario7_linea23.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario7_linea23.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario8_linea66.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario8_linea66.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario9_linea23.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario9_linea23.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario10_linea69.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario10_linea69.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario12_linea68.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario12_linea68.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario13_linea65.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario13_linea65.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario15_linea65.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario15_linea65.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario16_linea65.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario16_linea65.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {evaluacion.evaluaciones_proyecto_formulario17_linea69.map((item_evaluado, j) => (
                                                <React.Fragment key={j}>
                                                    {item_evaluado.comentario && (
                                                        <div>
                                                            <p className="whitespace-pre-line mb-10">
                                                                <strong className="whitespace-pre-line font-black">{item_evaluado.pregunta_evaluacion_formulario17_linea69.campo}</strong>
                                                                <br />
                                                                {item_evaluado.comentario}
                                                            </p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            <Divider className="!my-10">RUBROS PRESUPUESTALES</Divider>
                                            {evaluacion.proyecto_presupuestos_evaluaciones
                                                .filter((item) => item.correcto == false)
                                                .map((evaluacion_presupuesto, k) => (
                                                    <p className="whitespace-pre-line mb-10" key={k}>
                                                        <Chip size="small" label={<>Código del presupuesto #{evaluacion_presupuesto.proyecto_presupuesto_id}</>} />
                                                        <strong> - Recomendación: </strong>
                                                        {evaluacion_presupuesto.comentario}
                                                    </p>
                                                ))}
                                            {evaluacion.proyecto_presupuestos_evaluaciones.filter((item) => item.correcto == false).length == 0 && <>Sin recomendaciones</>}

                                            <Divider className="!my-10">ROLES</Divider>
                                            {evaluacion.proyecto_roles_evaluaciones
                                                .filter((item) => item.correcto == false)
                                                .map((evaluacion_rol, k) => (
                                                    <p className="whitespace-pre-line mb-10" key={k}>
                                                        <Chip size="small" label={<>Código del rol #{evaluacion_rol.proyecto_rol_sennova_id}</>} />
                                                        <strong> - Recomendación: </strong>
                                                        {evaluacion_rol.comentario}
                                                    </p>
                                                ))}
                                            {evaluacion.proyecto_roles_evaluaciones.filter((item) => item.correcto == false).length == 0 && <>Sin recomendaciones</>}

                                            <Divider className="!my-10">COMENTARIO GENERAL</Divider>
                                            {evaluacion.comentario_evaluador ?? 'No hay comentarios'}

                                            {proyecto?.allowed?.to_update && (
                                                <div className="mt-10">
                                                    <AlertMui>
                                                        Haga clic en el siguiente botón si quiere hacer una aclaración al evaluador/a sobre ítems formulados
                                                        <br />
                                                        <ButtonMui className="!mt-4" onClick={() => (setDialogRespuestaFormuladorStatus(true), setRespuestaFormulador(evaluacion))}>
                                                            Respuesta
                                                        </ButtonMui>
                                                    </AlertMui>

                                                    <DialogMui
                                                        open={dialog_respuesta_evaluador_status}
                                                        maxWidth="md"
                                                        fullWidth={true}
                                                        dialogContent={
                                                            <form onSubmit={submitRespuestaFormulador}>
                                                                <Textarea
                                                                    label="Respuesta"
                                                                    className="!mt-10"
                                                                    inputBackground="#fff"
                                                                    id="comentario_formulador"
                                                                    value={form_respuesta_formulador.data.comentario_formulador}
                                                                    error={form_respuesta_formulador.errors.comentario_formulador}
                                                                    onChange={(e) => form_respuesta_formulador.setData('comentario_formulador', e.target.value)}
                                                                    disabled={proyecto.finalizado}
                                                                    required
                                                                />

                                                                <div className="mt-6 flex items-center justify-end">
                                                                    <ButtonMui onClick={() => setDialogRespuestaFormuladorStatus(false)} className="!bg-transparent !text-app-700 !mr-2">
                                                                        Cerrar
                                                                    </ButtonMui>
                                                                    {!proyecto.finalizado && (
                                                                        <PrimaryButton disabled={form_respuesta_formulador.processing} type="submit">
                                                                            Guardar
                                                                        </PrimaryButton>
                                                                    )}
                                                                </div>
                                                            </form>
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                            </>
                        }
                        dialogActions={
                            <ButtonMui onClick={() => setDialogEvaluaciones2Status(false)} className="!mr-8">
                                Cerrar
                            </ButtonMui>
                        }
                    />
                </>
            ) : null}

            {evaluacion.length > 0 && (
                <>
                    <ButtonMui className="!fixed bottom-20 z-[1200] !bg-red-500" onClick={() => setDialogEvaluacionStatus(true)} primary={true}>
                        <ChecklistIcon className="mr-2" />
                        Evaluar
                    </ButtonMui>
                    <DialogMui
                        fullWidth={true}
                        maxWidth="lg"
                        open={dialog_evaluacion_status}
                        dialogTitle={
                            <AlertMui severity="success">
                                <figure className="mt-4">
                                    <img src="/images/evaluadores.png" alt="" className="mx-auto rounded" width="120" />
                                </figure>

                                <h1 className="text-1xl text-center my-4">Código: #{evaluacion[0]?.evaluacion_id}</h1>

                                {evaluacion[0]?.puntaje_total > 0 && (
                                    <p className="text-center">
                                        <strong>Puntaje total:</strong> {evaluacion[0]?.puntaje_total.toFixed(1)}
                                    </p>
                                )}
                            </AlertMui>
                        }
                        dialogContent={
                            <>
                                {evaluacion.length > 0 ? (
                                    <>
                                        {evaluacion[0].comentario_formulador && (
                                            <AlertMui className="mt-4">
                                                <h1 className="mb-5 font-black text-2xl">Comentario del formulador/a</h1>
                                                {evaluacion[0].comentario_formulador}
                                            </AlertMui>
                                        )}

                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 1 ? (
                                            <EvaluacionProyectosFormulario1Linea65
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 3 ? (
                                            <EvaluacionProyectosFormulario3Linea61
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 4 ? (
                                            <EvaluacionProyectosFormulario4Linea70
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 5 ? (
                                            <EvaluacionProyectosFormulario5Linea69
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 6 ? (
                                            <EvaluacionProyectosFormulario6Linea82
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 7 ? (
                                            <EvaluacionProyectosFormulario7Linea23
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 8 ? (
                                            <EvaluacionProyectosFormulario8Linea66
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 9 ? (
                                            <EvaluacionProyectosFormulario9Linea23
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 10 ? (
                                            <EvaluacionProyectosFormulario10Linea69
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 12 ? (
                                            <EvaluacionProyectosFormulario12Linea68
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 13 ? (
                                            <EvaluacionProyectosFormulario13Linea65
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 15 ? (
                                            <EvaluacionProyectosFormulario15Linea65
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 16 ? (
                                            <EvaluacionProyectosFormulario16Linea65
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                        {evaluacion[0]?.tipo_formulario_convocatoria_id == 17 ? (
                                            <EvaluacionProyectosFormulario17Linea69
                                                auth_user={auth_user}
                                                convocatoria={convocatoria}
                                                allowed={evaluacion[0]?.allowed}
                                                evaluacion={evaluacion}
                                                proyecto={proyecto}
                                                setDialogEvaluacionStatus={setDialogEvaluacionStatus}
                                            />
                                        ) : null}
                                    </>
                                ) : (
                                    <AlertMui severity="error">No se ha definido el formulario de evaluación.</AlertMui>
                                )}
                            </>
                        }
                        dialogActions={
                            <>
                                {(evaluacion.length > 0 && evaluacion[0]?.allowed.to_update && !evaluacion[0]?.finalizado) || checkRole(auth_user, [1, 5, 17, 18, 19, 20]) ? (
                                    <ButtonMui type="submit" form="form-evaluacion" className="!mr-8">
                                        Guardar y cerrar
                                    </ButtonMui>
                                ) : (
                                    <ButtonMui
                                        type="button"
                                        onClick={() => {
                                            setDialogEvaluacionStatus(false)
                                        }}
                                        className="!mr-8">
                                        Cerrar
                                    </ButtonMui>
                                )}
                            </>
                        }
                    />
                </>
            )}
            <DialogMui
                fullWidth={true}
                maxWidth="lg"
                open={dialog_archivos_status}
                dialogContent={
                    <>
                        <h1 className="text-2xl font-black text-center mb-10">Archivos del proyecto {proyecto?.codigo}</h1>
                        <Grid container rowSpacing={6}>
                            {proyecto.lista_archivos.map((item, i) => (
                                <React.Fragment key={i}>
                                    <Grid item md={4}>
                                        <small>
                                            {item.modulo} ({item.tipo_archivo.replace(/_/g, ' ').toUpperCase()})
                                        </small>
                                        <p className="uppercase">{item.nombre ? item.nombre : item.modulo}</p>
                                    </Grid>
                                    <Grid item md={8}>
                                        <DownloadFile
                                            label="Archivo"
                                            className="!p-2"
                                            filename={item.filename}
                                            extension={item.extension}
                                            downloadRoute={item.path?.includes('http') ? item.path : route('proyectos.descargar-archivo', [proyecto?.id, item.id])}
                                        />
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </>
                }
                dialogActions={
                    <ButtonMui onClick={() => setDialogArchivosStatus(false)} className="!mr-8">
                        Cerrar
                    </ButtonMui>
                }
            />
            <div className="flex items-center justify-center mb-10">
                <div className="mr-6">
                    <small className=" bg-app-500 text-white py-1 px-3 rounded-full w-max text-center mx-auto">
                        Precio del proyecto:
                        <AttachMoneyOutlinedIcon />
                        {new Intl.NumberFormat('de-DE').format(!isNaN(proyecto?.precio_proyecto) ? proyecto?.precio_proyecto : 0)} COP
                    </small>
                </div>
                |
                <div className="mx-6">
                    <a
                        href={route(`convocatorias.proyectos.pdf-formulario${proyecto.tipo_formulario_convocatoria_id}-linea${proyecto.tipo_formulario_convocatoria.linea_programatica.codigo}`, [
                            convocatoria.id,
                            proyecto.id,
                        ])}
                        target="_blank"
                        className="flex items-center">
                        <FileTypeIcon fileType="pdf" className="w-6 mr-4" />
                        <small>PDF del proyecto</small>
                    </a>
                </div>
                |
                <div className="mx-6">
                    <CalendarMonthIcon className="w-6 mr-2 text-gray-500" />
                    <small>Ejecución del proyecto: {proyecto.diff_meses} meses</small>
                </div>
                |
                <div className="ml-6 flex items-center hover:cursor-pointer" onClick={() => setDialogArchivosStatus(true)}>
                    <img src="/images/files.png" width="25" className="mr-3" />
                    <small>Archivos</small>
                </div>
            </div>
            <Stepper alternativeLabel connector={<ColorlibConnector />}>
                <Step active={isActive}>
                    <Link href={route('convocatorias.proyectos.edit', [proyecto?.convocatoria_id, proyecto?.id, evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>Generalidades</StepLabel>
                    </Link>
                </Step>

                {proyecto?.tipo_formulario_convocatoria_id != 4 &&
                proyecto?.tipo_formulario_convocatoria_id != 5 &&
                proyecto?.tipo_formulario_convocatoria_id != 10 &&
                proyecto?.tipo_formulario_convocatoria_id != 17 &&
                proyecto?.tipo_formulario_convocatoria_id != 11 ? (
                    <Step active={route().current('convocatorias.proyectos.participantes')}>
                        <Link
                            href={route('convocatorias.proyectos.participantes', [
                                proyecto?.convocatoria_id,
                                proyecto?.id,
                                evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                            ])}>
                            <StepLabel classes={{ root: classes.root }}>{proyecto?.tipo_formulario_convocatoria_id == 12 ? 'Formulador del proyecto' : 'Participantes'}</StepLabel>
                        </Link>
                    </Step>
                ) : (
                    <Step active={route().current('convocatorias.proyectos.articulacion-sennova')}>
                        <Link
                            href={route('convocatorias.proyectos.articulacion-sennova', [
                                proyecto?.convocatoria_id,
                                proyecto?.id,
                                evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                            ])}>
                            <StepLabel classes={{ root: classes.root }}>Articulación</StepLabel>
                        </Link>
                    </Step>
                )}

                <Step active={route().current('convocatorias.proyectos.arbol-problemas')}>
                    <Link
                        href={route('convocatorias.proyectos.arbol-problemas', [
                            proyecto?.convocatoria_id,
                            proyecto?.id,
                            evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                        ])}>
                        <StepLabel classes={{ root: classes.root }}>Definición del problema</StepLabel>
                    </Link>
                </Step>

                <Step active={route().current('convocatorias.proyectos.arbol-objetivos')}>
                    <Link
                        href={route('convocatorias.proyectos.arbol-objetivos', [
                            proyecto?.convocatoria_id,
                            proyecto?.id,
                            evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                        ])}>
                        <StepLabel classes={{ root: classes.root }}>
                            <p className="line-clamp-2">Objetivos, resultados, impactos y actividades</p>
                        </StepLabel>
                    </Link>
                </Step>

                {proyecto?.tipo_formulario_convocatoria_id != 7 && proyecto?.tipo_formulario_convocatoria_id != 9 && proyecto?.tipo_formulario_convocatoria_id != 1 && (
                    <Step active={route().current('convocatorias.proyectos.proyecto-rol-sennova.index')}>
                        <Link
                            href={route('convocatorias.proyectos.proyecto-rol-sennova.index', [
                                proyecto?.convocatoria_id,
                                proyecto?.id,
                                evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                            ])}>
                            <StepLabel classes={{ root: classes.root }}>Roles</StepLabel>
                        </Link>
                    </Step>
                )}

                <Step
                    active={
                        route().current('convocatorias.proyectos.presupuesto.index') ? true : props.label == 'Estudios de mercado' ? true : props.label == 'EDT' ? true : props.label == 'Municipios'
                    }>
                    <Link
                        href={route('convocatorias.proyectos.presupuesto.index', [
                            proyecto?.convocatoria_id,
                            proyecto?.id,
                            evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                        ])}>
                        <StepLabel classes={{ root: classes.root }}>
                            Rubros presupuestales
                            {props.label == 'Estudios de mercado' ? (
                                <>
                                    <SouthOutlinedIcon className="!block mx-auto my-2" />
                                    Estudios de mercado
                                </>
                            ) : props.label == 'EDT' ? (
                                <>
                                    <SouthOutlinedIcon className="!block mx-auto my-2" />
                                    EDT
                                </>
                            ) : (
                                props.label == 'Municipios' && (
                                    <>
                                        <SouthOutlinedIcon className="!block mx-auto my-2" />
                                        Municipios
                                    </>
                                )
                            )}
                        </StepLabel>
                    </Link>
                </Step>

                <Step active={route().current('convocatorias.proyectos.actividades.index')}>
                    <Link
                        href={route('convocatorias.proyectos.actividades.index', [
                            proyecto?.convocatoria_id,
                            proyecto?.id,
                            evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                        ])}>
                        <StepLabel classes={{ root: classes.root }}>Metodología Actividades</StepLabel>
                    </Link>
                </Step>

                <Step active={route().current('convocatorias.proyectos.productos.index')}>
                    <Link
                        href={route('convocatorias.proyectos.productos.index', [
                            proyecto?.convocatoria_id,
                            proyecto?.id,
                            evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                        ])}>
                        <StepLabel classes={{ root: classes.root }}>Productos</StepLabel>
                    </Link>
                </Step>

                <Step active={route().current('convocatorias.proyectos.analisis-riesgos.index')}>
                    <Link
                        href={route('convocatorias.proyectos.analisis-riesgos.index', [
                            proyecto?.convocatoria_id,
                            proyecto?.id,
                            evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                        ])}>
                        <StepLabel classes={{ root: classes.root }}>
                            Análisis de <br /> riesgos
                        </StepLabel>
                    </Link>
                </Step>

                {proyecto?.tipo_formulario_convocatoria_id == 4 ||
                proyecto?.tipo_formulario_convocatoria_id == 5 ||
                proyecto?.tipo_formulario_convocatoria_id == 6 ||
                proyecto?.tipo_formulario_convocatoria_id == 7 ||
                proyecto?.tipo_formulario_convocatoria_id == 8 ||
                proyecto?.tipo_formulario_convocatoria_id == 11 ? (
                    <Step active={route().current('convocatorias.proyectos.entidades-aliadas.index') ? true : props.label == 'Miembros entidad aliada' ? true : false}>
                        <Link
                            href={route('convocatorias.proyectos.entidades-aliadas.index', [
                                proyecto?.convocatoria_id,
                                proyecto?.id,
                                evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                            ])}>
                            <StepLabel classes={{ root: classes.root }}>
                                Entidades aliadas
                                {props.label == 'Miembros entidad aliada' && (
                                    <>
                                        <SouthOutlinedIcon className="!block mx-auto my-2" />
                                        Miembros entidad aliada
                                    </>
                                )}
                            </StepLabel>
                        </Link>
                    </Step>
                ) : null}

                {proyecto?.tipo_formulario_convocatoria_id == 6 ||
                proyecto?.tipo_formulario_convocatoria_id == 7 ||
                proyecto?.tipo_formulario_convocatoria_id == 8 ||
                proyecto?.tipo_formulario_convocatoria_id == 9 ? (
                    <Step active={route().current('convocatorias.proyectos.indicadores')}>
                        <Link
                            href={route('convocatorias.proyectos.indicadores', [
                                proyecto?.convocatoria_id,
                                proyecto?.id,
                                evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                            ])}>
                            <StepLabel classes={{ root: classes.root }}>Indicadores</StepLabel>
                        </Link>
                    </Step>
                ) : null}

                <Step active={route().current('convocatorias.proyectos.proyecto-anexos.index')}>
                    <Link
                        href={route('convocatorias.proyectos.proyecto-anexos.index', [
                            proyecto?.convocatoria_id,
                            proyecto?.id,
                            evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                        ])}>
                        <StepLabel classes={{ root: classes.root }}>Anexos</StepLabel>
                    </Link>
                </Step>

                {/* {proyecto?.tipo_formulario_convocatoria_id == 12 && (
                <Step active={route().current('convocatorias.proyectos.inventario-equipos.index')}>
                    <Link href={route('convocatorias.proyectos.inventario-equipos.index', [proyecto?.convocatoria_id, proyecto?.id])}>
                        <StepLabel classes={{ root: classes.root }}>Inventario de equipos</StepLabel>
                    </Link>
                </Step>
            )} */}

                <Step active={route().current('convocatorias.proyectos.cadena-valor')}>
                    <Link
                        href={route('convocatorias.proyectos.cadena-valor', [proyecto?.convocatoria_id, proyecto?.id, evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>Cadena de valor</StepLabel>
                    </Link>
                </Step>

                {/* {(is_super_admin && convocatoria?.tipo_convocatoria == 1) || (proyecto?.mostrar_recomendaciones && convocatoria?.tipo_convocatoria == 1) ? (
                <Step active={route().current('convocatorias.proyectos.comentarios-generales-form')}>
                    <Link href={route('convocatorias.proyectos.comentarios-generales-form', [proyecto?.convocatoria_id, proyecto?.id])}>
                        <StepLabel classes={{ root: classes.root }}>Comentarios generales</StepLabel>
                    </Link>
                </Step>
            ) : (
                <></>
            )} */}

                <Step active={route().current('convocatorias.proyectos.resumen-final')}>
                    <Link
                        href={route('convocatorias.proyectos.resumen-final', [
                            proyecto?.convocatoria_id,
                            proyecto?.id,
                            evaluacion.length > 0 ? { evaluacion_id: evaluacion[0]?.evaluacion_id } : null,
                        ])}>
                        <StepLabel classes={{ root: classes.root }}>Finalizar {evaluacion[0]?.evaluacion_id ? 'evaluación' : 'proyecto'}</StepLabel>
                    </Link>
                </Step>
            </Stepper>
        </>
    )
}
