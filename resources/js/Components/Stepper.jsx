import PropTypes from 'prop-types'

import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { styled } from '@mui/material/styles'

import Check from '@mui/icons-material/Check'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import VideoLabelIcon from '@mui/icons-material/VideoLabel'

import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'

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

function QontoStepIcon(props) {
    const { active, completed, className } = props

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
            backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
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

function ColorlibStepIcon(props) {
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

export default function StepperMui({ isSuperAdmin, convocatoria, proyecto, ...props }) {
    return (
        <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
            <Step onClick={() => route('convocatorias.proyectos.edit', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>Generalidades</StepLabel>
            </Step>

            {proyecto?.codigo_linea_programatica != 69 && proyecto?.codigo_linea_programatica != 70 ? (
                <Step
                    className={route().current('convocatorias.proyectos.participantes') ? 'active' : ''}
                    onClick={() => route('convocatorias.proyectos.participantes', [convocatoria?.id, proyecto?.id])}>
                    <StepLabel>{proyecto?.codigo_linea_programatica == 68 ? 'Formulador del proyecto' : 'Participantes'}</StepLabel>
                </Step>
            ) : (
                <Step
                    className={route().current('convocatorias.proyectos.articulacion-sennova') ? 'active' : ''}
                    onClick={() => route('convocatorias.proyectos.articulacion-sennova', [convocatoria?.id, proyecto?.id])}>
                    <StepLabel>Articulación SENNOVA</StepLabel>
                </Step>
            )}

            <Step
                className={route().current('convocatorias.proyectos.arbol-problemas') ? 'active' : ''}
                onClick={() => route('convocatorias.proyectos.arbol-problemas', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>Identificación del problema</StepLabel>
            </Step>

            <Step
                className={route().current('convocatorias.proyectos.arbol-objetivos') ? 'active' : ''}
                onClick={() => route('convocatorias.proyectos.arbol-objetivos', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>Objetivos, resultados, impactos y actividades</StepLabel>
            </Step>

            {/* {(proyecto?.codigo_linea_programatica != 23 && proyecto?.codigo_linea_programatica != 65) ||
                (proyecto?.codigo_linea_programatica == 65 && proyecto?.tipo_proyecto != 2 && (
                    <Step
                        className={route().current('convocatorias.proyectos.proyecto-rol-sennova.index') ? 'active' : ''}
                        onClick={() => route('convocatorias.proyectos.proyecto-rol-sennova.index', [convocatoria?.id, proyecto?.id])}>
                        <StepLabel>Roles</StepLabel>
                    </Step>
                ))} */}

            <Step
                className={route().current('convocatorias.proyectos.presupuesto.index') ? 'active' : ''}
                onClick={() => route('convocatorias.proyectos.presupuesto.index', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>
                    Rubros presupuestales
                    <small class="absolute bg-app-500 text-white px-2 py-1 rounded-full w-max text-center total">
                        $ {new Intl.NumberFormat('de-DE').format(!isNaN(proyecto?.precio_proyecto) ? proyecto?.precio_proyecto : 0)} COP
                    </small>
                </StepLabel>
            </Step>

            <Step
                className={route().current('convocatorias.proyectos.actividades.index') ? 'active' : ''}
                onClick={() => route('convocatorias.proyectos.actividades.index', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>Metodología y actividades</StepLabel>
            </Step>

            <Step
                className={route().current('convocatorias.proyectos.productos.index') ? 'active' : ''}
                onClick={() => route('convocatorias.proyectos.productos.index', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>Productos</StepLabel>
            </Step>

            <Step
                className={route().current('convocatorias.proyectos.analisis-riesgos.index') ? 'active' : ''}
                onClick={() => route('convocatorias.proyectos.analisis-riesgos.index', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>
                    Análisis de <br /> riesgos
                </StepLabel>
            </Step>

            {proyecto?.codigo_linea_programatica == 66 ||
                proyecto?.codigo_linea_programatica == 82 ||
                proyecto?.codigo_linea_programatica == 69 ||
                (proyecto?.codigo_linea_programatica == 70 && (
                    <Step
                        className={route().current('convocatorias.proyectos.entidades-aliadas.index') ? 'active' : ''}
                        onClick={() => route('convocatorias.proyectos.entidades-aliadas.index', [convocatoria?.id, proyecto?.id])}>
                        <StepLabel>Entidades aliadas</StepLabel>
                    </Step>
                ))}

            {proyecto?.codigo_linea_programatica == 23 ||
                proyecto?.codigo_linea_programatica == 66 ||
                (proyecto?.codigo_linea_programatica == 82 && (
                    <Step className={route().current('convocatorias.idi.indicadores') ? 'active' : ''} onClick={() => route('convocatorias.idi.indicadores', [convocatoria?.id, proyecto?.id])}>
                        <StepLabel>Indicadores</StepLabel>
                    </Step>
                ))}

            <Step
                className={route().current('convocatorias.proyectos.proyecto-anexos.index') ? 'active' : ''}
                onClick={() => route('convocatorias.proyectos.proyecto-anexos.index', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>Anexos</StepLabel>
            </Step>

            {proyecto?.codigo_linea_programatica == 68 && (
                <Step
                    className={route().current('convocatorias.proyectos.inventario-equipos.index') ? 'active' : ''}
                    onClick={() => route('convocatorias.proyectos.inventario-equipos.index', [convocatoria?.id, proyecto?.id])}>
                    <StepLabel>Inventario de equipos</StepLabel>
                </Step>
            )}

            <Step className={route().current('convocatorias.proyectos.cadena-valor') ? 'active' : ''} onClick={() => route('convocatorias.proyectos.cadena-valor', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>Cadena de valor</StepLabel>
            </Step>

            {(isSuperAdmin && convocatoria?.tipo_convocatoria == 1) ||
                (proyecto?.mostrar_recomendaciones && convocatoria?.tipo_convocatoria == 1 && (
                    <Step
                        className={route().current('convocatorias.proyectos.comentarios-generales-form') ? 'active' : ''}
                        onClick={() => route('convocatorias.proyectos.comentarios-generales-form', [convocatoria?.id, proyecto?.id])}>
                        <StepLabel>Comentarios generales</StepLabel>
                    </Step>
                ))}

            <Step className={route().current('convocatorias.proyectos.summary') ? 'active' : ''} onClick={() => route('convocatorias.proyectos.summary', [convocatoria?.id, proyecto?.id])}>
                <StepLabel>Finalizar proyecto</StepLabel>
            </Step>
        </Stepper>
    )
}
