import PropTypes from 'prop-types'

import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import Check from '@mui/icons-material/Check'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import SettingsIcon from '@mui/icons-material/Settings'
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined'
import VideoLabelIcon from '@mui/icons-material/VideoLabel'

import { Link } from '@inertiajs/react'

import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import FileTypeIcon from './FileTypeIcon'

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

export default function StepperMui({ isSuperAdmin, convocatoria, proyecto, evaluacion, ...props }) {
    const classes = useStyles()

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

    return (
        <>
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
                <div className="ml-6">
                    <CalendarMonthIcon className="w-6 mr-2 text-gray-500" />
                    <small>Ejecución del proyecto: {proyecto.diff_meses} meses</small>
                </div>
            </div>
            <Stepper alternativeLabel connector={<ColorlibConnector />}>
                <Step active={isActive}>
                    <Link href={route('convocatorias.proyectos.edit', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>Generalidades</StepLabel>
                    </Link>
                </Step>

                {proyecto?.tipo_formulario_convocatoria_id != 4 &&
                proyecto?.tipo_formulario_convocatoria_id != 5 &&
                proyecto?.tipo_formulario_convocatoria_id != 10 &&
                proyecto?.tipo_formulario_convocatoria_id != 17 &&
                proyecto?.tipo_formulario_convocatoria_id != 11 ? (
                    <Step active={route().current('convocatorias.proyectos.participantes')}>
                        <Link href={route('convocatorias.proyectos.participantes', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                            <StepLabel classes={{ root: classes.root }}>{proyecto?.tipo_formulario_convocatoria_id == 12 ? 'Formulador del proyecto' : 'Participantes'}</StepLabel>
                        </Link>
                    </Step>
                ) : (
                    <Step active={route().current('convocatorias.proyectos.articulacion-sennova')}>
                        <Link href={route('convocatorias.proyectos.articulacion-sennova', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                            <StepLabel classes={{ root: classes.root }}>Articulación</StepLabel>
                        </Link>
                    </Step>
                )}

                <Step active={route().current('convocatorias.proyectos.arbol-problemas')}>
                    <Link href={route('convocatorias.proyectos.arbol-problemas', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>Definición del problema</StepLabel>
                    </Link>
                </Step>

                <Step active={route().current('convocatorias.proyectos.arbol-objetivos')}>
                    <Link href={route('convocatorias.proyectos.arbol-objetivos', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>
                            <p className="line-clamp-2">Objetivos, resultados, impactos y actividades</p>
                        </StepLabel>
                    </Link>
                </Step>

                {proyecto?.tipo_formulario_convocatoria_id != 7 && proyecto?.tipo_formulario_convocatoria_id != 9 && proyecto?.tipo_formulario_convocatoria_id != 1 && (
                    <Step active={route().current('convocatorias.proyectos.proyecto-rol-sennova.index')}>
                        <Link href={route('convocatorias.proyectos.proyecto-rol-sennova.index', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                            <StepLabel classes={{ root: classes.root }}>Roles</StepLabel>
                        </Link>
                    </Step>
                )}

                <Step
                    active={
                        route().current('convocatorias.proyectos.presupuesto.index') ? true : props.label == 'Estudios de mercado' ? true : props.label == 'EDT' ? true : props.label == 'Municipios'
                    }>
                    <Link href={route('convocatorias.proyectos.presupuesto.index', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
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
                    <Link href={route('convocatorias.proyectos.actividades.index', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>Metodología Actividades</StepLabel>
                    </Link>
                </Step>

                <Step active={route().current('convocatorias.proyectos.productos.index')}>
                    <Link href={route('convocatorias.proyectos.productos.index', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>Productos</StepLabel>
                    </Link>
                </Step>

                <Step active={route().current('convocatorias.proyectos.analisis-riesgos.index')}>
                    <Link href={route('convocatorias.proyectos.analisis-riesgos.index', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
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
                        <Link href={route('convocatorias.proyectos.entidades-aliadas.index', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
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
                        <Link href={route('convocatorias.proyectos.indicadores', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                            <StepLabel classes={{ root: classes.root }}>Indicadores</StepLabel>
                        </Link>
                    </Step>
                ) : null}

                <Step active={route().current('convocatorias.proyectos.proyecto-anexos.index')}>
                    <Link href={route('convocatorias.proyectos.proyecto-anexos.index', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
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
                    <Link href={route('convocatorias.proyectos.cadena-valor', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>Cadena de valor</StepLabel>
                    </Link>
                </Step>

                {/* {(isSuperAdmin && convocatoria?.tipo_convocatoria == 1) || (proyecto?.mostrar_recomendaciones && convocatoria?.tipo_convocatoria == 1) ? (
                <Step active={route().current('convocatorias.proyectos.comentarios-generales-form')}>
                    <Link href={route('convocatorias.proyectos.comentarios-generales-form', [proyecto?.convocatoria_id, proyecto?.id])}>
                        <StepLabel classes={{ root: classes.root }}>Comentarios generales</StepLabel>
                    </Link>
                </Step>
            ) : (
                <></>
            )} */}

                <Step active={route().current('convocatorias.proyectos.resumen-final')}>
                    <Link href={route('convocatorias.proyectos.resumen-final', [proyecto?.convocatoria_id, proyecto?.id, evaluacion ? { evaluacion_id: evaluacion?.id } : null])}>
                        <StepLabel classes={{ root: classes.root }}>Finalizar proyecto</StepLabel>
                    </Link>
                </Step>
            </Stepper>
        </>
    )
}
