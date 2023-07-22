import { useState } from 'react'
import { router, useForm } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import TooltipMui from '@/Components/Tooltip'
import Textarea from '@/Components/Textarea'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EastOutlinedIcon from '@mui/icons-material/EastOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ShortcutIcon from '@mui/icons-material/Shortcut'

import React from 'react'
import ToolTipMui from '@/Components/Tooltip'
import { Grid } from '@mui/material'

const ArbolObjetivosComponent = ({ auth, convocatoria, proyecto, efectosDirectos, causasDirectas, tiposImpacto, resultados, objetivosEspecificos, faseEvaluacion = false }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const formEfectoIndirecto = useForm({
        id: null,
        efecto_directo_id: null,
        descripcion: '',
    })

    const [showNuevoEfectoIndirectoForm, setShowNuevoEfectoIndirectoForm] = useState(false)
    const [efectoDirectoIdNuevoIndirecto, setEfectoDirectoIdNuevoIndirecto] = useState(null)

    const setNuevoEfectoIndirecto = (efectoDirecto) => {
        setShowNuevoEfectoIndirectoForm(true)
        setShowEfectoIndirectoForm(false)
        setEfectoDirectoIdNuevoIndirecto(efectoDirecto.id)

        formEfectoIndirecto.setData({
            id: null,
            efecto_directo_id: efectoDirecto.id,
            descripcion: '',
        })
    }

    const [showEfectoIndirectoForm, setShowEfectoIndirectoForm] = useState(false)
    const [efectoIndirectoId, setEfectoIndirectoId] = useState(null)

    const setEfectoIndirecto = (efectoDirecto, efectoIndirecto) => {
        // if (showEfectoDirectoForm) {
        //     submitEfectoDirecto()
        // }

        setShowEfectoIndirectoForm(true)
        setEfectoIndirectoId(efectoIndirecto.id)

        formEfectoIndirecto.setData({
            id: efectoIndirecto.id,
            efecto_directo_id: efectoDirecto.id,
            descripcion: efectoIndirecto.descripcion,
        })
    }

    const submitEfectoIndirecto = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formEfectoIndirecto.post(
                route('proyectos.efecto-indirecto', {
                    proyecto: proyecto.id,
                    efecto_directo: formEfectoIndirecto.data.efecto_directo_id,
                }),
                {
                    onSuccess: () => {
                        setShowEfectoIndirectoForm(false)
                        setShowNuevoEfectoIndirectoForm(false)
                        formEfectoIndirecto.setData('id', null)
                        formEfectoIndirecto.setData('efecto_directo_id', null)
                        formEfectoIndirecto.setData('descripcion', '')
                        setEfectoIndirectoId(null)
                        setEfectoDirectoId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    // Efecto Indirecto
    const [showEfectoIndirectoDestroyIcon, setShowEfectoIndirectoDestroyIcon] = useState(false)
    const [efectoIndirectoIdToDestroy, setEfectoIndirectoIdToDestroy] = useState(null)

    const destroyEfectoIndirecto = (efectoIndirecto) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.efecto-indirecto.destroy', [proyecto.id, efectoIndirecto.id]), {
                preserveScroll: true,
            })
        }
    }

    // Efecto Directo
    const formEfectoDirecto = useForm({
        id: null,
        descripcion: '',
    })

    const newEfectoDirecto = () => {
        if (proyecto.allowed.to_update) {
            formEfectoDirecto.post(
                route('proyectos.new-efecto-directo', {
                    proyecto: proyecto.id,
                }),
                {
                    preserveScroll: true,
                },
            )
        }
    }

    const [showEfectoDirectoForm, setShowEfectoDirectoForm] = useState(false)
    const [efectoDirectoId, setEfectoDirectoId] = useState(null)

    const setEfectoDirecto = (efectoDirecto) => {
        formEfectoDirecto.reset()
        // if (showEfectoIndirectoForm) {
        //     submitEfectoIndirecto()
        // }

        setShowEfectoDirectoForm(true)
        setEfectoDirectoId(efectoDirecto.id)

        formEfectoDirecto.setData({
            id: efectoDirecto.id,
            descripcion: efectoDirecto.descripcion,
        })
    }

    const submitEfectoDirecto = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            formEfectoDirecto.post(
                route('proyectos.efecto-directo', {
                    proyecto: proyecto.id,
                    efecto_directo: formEfectoDirecto.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowEfectoDirectoForm(false)
                        formEfectoDirecto.reset()
                        setEfectoDirectoId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [showEfectoDirectoDestroyIcon, setShowEfectoDirectoDestroyIcon] = useState(false)
    const [efectoDirectoIdToDestroy, setEfectoDirectoIdToDestroy] = useState(null)

    const destroyEfectoDirecto = (efectoDirecto) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.efecto-directo.destroy', [proyecto.id, efectoDirecto.id]), {
                preserveScroll: true,
            })
        }
    }

    // Causa Directa
    const formCausaDirecta = useForm({
        id: null,
        descripcion: '',
    })

    const newCausaDirecta = () => {
        if (proyecto.allowed.to_update) {
            formCausaDirecta.post(
                route('proyectos.new-causa-directa', {
                    proyecto: proyecto.id,
                }),
                {
                    preserveScroll: true,
                },
            )
        }
    }

    const [showCausaDirectaForm, setShowCausaDirectaForm] = useState(false)
    const [causaDirectaId, setCausaDirectaId] = useState(null)

    const setCausaDirecta = (causaDirecta) => {
        formCausaDirecta.reset()
        // if (showEfectoIndirectoForm) {
        //     submitEfectoIndirecto()
        // }

        setShowCausaDirectaForm(true)
        setCausaDirectaId(causaDirecta.id)

        formCausaDirecta.setData({
            id: causaDirecta.id,
            descripcion: causaDirecta.descripcion,
        })
    }

    const submitCausaDirecta = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formCausaDirecta.post(
                route('proyectos.causa-directa', {
                    proyecto: proyecto.id,
                    causa_directa: formCausaDirecta.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowCausaDirectaForm(false)
                        formCausaDirecta.reset()
                        setCausaDirectaId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [showCausaDirectaDestroyIcon, setShowCausaDirectaDestroyIcon] = useState(false)
    const [causaDirectaIdToDestroy, setCausaDirectaIdToDestroy] = useState(null)

    const destroyCausaDirecta = (causaDirecta) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.causa-directa.destroy', [proyecto.id, causaDirecta.id]), {
                preserveScroll: true,
            })
        }
    }

    // Causa Indirecta
    const formCausaIndirecta = useForm({
        id: null,
        causa_directa_id: null,
        descripcion: '',
    })

    const [showNuevaCausaIndirectaForm, setShowNuevaCausaIndirectaForm] = useState(false)
    const [causaDirectaIdNuevaIndirecta, setCausaDirectaIdNuevaIndirecta] = useState(null)

    const setNuevoCausaIndirecta = (causaDirecta) => {
        formCausaIndirecta.reset()

        setShowNuevaCausaIndirectaForm(true)
        setShowCausaIndirectaForm(false)
        setCausaDirectaIdNuevaIndirecta(causaDirecta.id)

        formCausaIndirecta.setData({
            causa_directa_id: causaDirecta.id,
        })
    }

    const [showCausaIndirectaForm, setShowCausaIndirectaForm] = useState(false)
    const [causaIndirectaId, setCausaIndirectaId] = useState(null)

    const setCausaIndirecta = (causaDirecta, causaIndirecta) => {
        formCausaIndirecta.reset()
        // if (showEfectoDirectoForm) {
        //     submitEfectoDirecto()
        // }

        setShowCausaIndirectaForm(true)
        setCausaIndirectaId(causaIndirecta.id)

        formCausaIndirecta.setData({
            id: causaIndirecta.id,
            descripcion: causaIndirecta.descripcion,
            causa_directa_id: causaDirecta.id,
        })
    }

    const submitCausaIndirecta = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            formCausaIndirecta.post(
                route('proyectos.causa-indirecta', {
                    proyecto: proyecto.id,
                    causa_directa: formCausaIndirecta.data.causa_directa_id,
                }),
                {
                    onSuccess: () => {
                        setShowCausaIndirectaForm(false)
                        setShowNuevaCausaIndirectaForm(false)
                        formCausaIndirecta.reset()
                        setCausaIndirectaId(null)
                        setCausaDirectaId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    // Causa Indirecta
    const [showCausaIndirectaDestroyIcon, setShowCausaIndirectaDestroyIcon] = useState(false)
    const [causaIndirectaIdToDestroy, setCausaIndirectaIdToDestroy] = useState(null)

    const destroyCausaIndirecta = (causaIndirecta) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.causa-indirecta.destroy', [proyecto.id, causaIndirecta.id]), {
                preserveScroll: true,
            })
        }
    }

    // Impactos
    const formImpacto = useForm({
        id: null,
        efecto_indirecto_id: null,
        descripcion: '',
        tipo: '',
        resultado_id: '',
    })

    const [showImpactoForm, setShowImpactoForm] = useState(false)
    const [impactoId, setImpactoId] = useState(null)

    const setImpacto = (efectoIndirecto, impacto) => {
        formImpacto.reset()
        // if (showResultadoForm) {
        //     submitResultado()
        // }

        setShowImpactoForm(true)
        setImpactoId(impacto.id)

        formImpacto.setData({
            id: impacto.id,
            efecto_indirecto_id: efectoIndirecto.id,
            descripcion: impacto.descripcion,
            tipo: impacto.tipo,
        })
    }

    const submitImpacto = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            formImpacto.post(
                route('proyectos.impacto', {
                    proyecto: proyecto.id,
                    impacto: formImpacto.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowImpactoForm(false)
                        resultadoId = null
                        setImpactoId(null)
                        formImpacto.reset()
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [showImpactoDestroyIcon, setShowImpactoDestroyIcon] = useState(false)
    const [impactoIdToDestroy, setImpactoIdToDestroy] = useState(null)

    const destroyImpacto = (impacto) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.impacto.destroy', [proyecto.id, impacto.id]), {
                preserveScroll: true,
            })
        }
    }

    // Resultados
    const formResultado = useForm({
        descripcion: '',
    })

    const [showResultadoForm, setShowResultadoForm] = useState(false)
    const [resultadoId, setResultadoId] = useState(null)

    const setResultado = (efectoDirecto, resultado) => {
        formResultado.reset()
        // if (showImpactoForm) {
        //     submitImpacto()
        // }

        setShowResultadoForm(true)
        setResultadoId(resultado.id)

        formResultado.setData({
            id: resultado.id,
            descripcion: resultado.descripcion,
            objetivo_especifico_id: resultado.objetivo_especifico_id,
        })
    }

    const submitResultado = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            formResultado.post(
                route('proyectos.resultado', {
                    proyecto: proyecto.id,
                    resultado: formResultado.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowResultadoForm(false)
                        formResultado.reset()
                        setResultadoId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [showResultadoDestroyIcon, setShowResultadoDestroyIcon] = useState(false)
    const [resultadoIdToDestroy, setResultadoIdToDestroy] = useState(null)

    const destroyResultado = (resultado) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.resultado.destroy', [proyecto.id, resultado.id]), {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    // Objetivos Específicos
    const formObjetivoEspecifico = useForm({
        id: null,
        descripcion: '',
        numero: 0,
    })

    const [showObjetivoEspecificoForm, setShowObjetivoEspecificoForm] = useState(false)
    const [objetivoEspecificoId, setObjetivoEspecificoId] = useState(null)

    const setObjetivoEspecifico = (causaDirecta, objetivoEspecifico, numero) => {
        formObjetivoEspecifico.reset()
        // if (showActividadForm) {
        //     submitActividad()
        // }

        setShowObjetivoEspecificoForm(true)
        setObjetivoEspecificoId(objetivoEspecifico.id)

        formObjetivoEspecifico.setData({
            id: objetivoEspecifico.id,
            descripcion: objetivoEspecifico.descripcion,
            numero: numero,
        })
    }

    const submitObjetivoEspecifico = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            formObjetivoEspecifico.post(
                route('proyectos.objetivo-especifico', {
                    proyecto: proyecto.id,
                    objetivo_especifico: formObjetivoEspecifico.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowObjetivoEspecificoForm(false)
                        formObjetivoEspecifico.reset()
                        setObjetivoEspecificoId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [showObjetivoEspecificoDestroyIcon, setShowObjetivoEspecificoDestroyIcon] = useState(false)
    const [objetivoEspecificoIdToDestroy, setObjetivoEspecificoIdToDestroy] = useState(null)

    const destroyObjetivoEspecifico = (objetivoEspecifico) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.objetivo-especifico.destroy', [proyecto.id, objetivoEspecifico.id]), {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    // Actividades
    const formActividad = useForm({
        id: null,
        fecha_inicio: '',
        fecha_finalizacion: '',
        causa_indirecta_id: null,
        objetivo_especifico_id: null,
        resultado_id: null,
        descripcion: '',
    })

    const [showActividadForm, setShowActividadForm] = useState(false)
    const [actividadId, setActividadId] = useState(null)
    const [resultadosFiltrados, setResultadosFiltrados] = useState(null)

    const setActividad = (causaDirecta, causaIndirecta, actividad) => {
        formActividad.reset()
        // if (showObjetivoEspecificoForm) {
        //     submitObjetivoEspecifico()
        // }

        const resultadosPorObjetivo = resultados.filter((item) => item.objetivo_especifico_id === actividad.objetivo_especifico_id)
        setResultadosFiltrados(resultadosPorObjetivo.filter((item) => item.label != null))

        setShowActividadForm(true)
        setActividadId(actividad.id)

        formActividad.setData({
            id: actividad.id,
            fecha_inicio: actividad.fecha_inicio,
            fecha_finalizacion: actividad.fecha_finalizacion,
            causa_indirecta_id: actividad.causa_indirecta_id,
            objetivo_especifico_id: causaDirecta.objetivo_especifico.id,
            descripcion: actividad.descripcion,
            resultado_id: actividad.resultado_id,
        })
    }

    const submitActividad = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            formActividad.post(
                route('proyectos.actividad', {
                    convocatoria: convocatoria.id,
                    proyecto: proyecto.id,
                    actividad: formActividad.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowActividadForm(false)
                        formActividad.reset()
                        setActividadId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [showActividadDestroyIcon, setShowActividadDestroyIcon] = useState(false)
    const [actividadIdToDestroy, setActividadIdToDestroy] = useState(null)

    const destroyActividad = (actividad) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.actividad.destroy', [proyecto.id, actividad.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            {isSuperAdmin || proyecto.mostrar_recomendaciones ? (
                <>
                    {proyecto.evaluaciones.map((evaluacion, i) =>
                        isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                            <ToolTipMui
                                key={i}
                                title={
                                    <div>
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        {evaluacion.idi_evaluacion ? (
                                            <>
                                                <h1 className="font-black mt-10">Objetivos</h1>
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.idi_evaluacion?.objetivos_comentario ? evaluacion.idi_evaluacion.objetivos_comentario : 'Sin recomendación'}
                                                </p>

                                                <hr className="mt-10 mb-10 border-black-200" />
                                                <h1 className="font-black">Resultados</h1>

                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.idi_evaluacion?.resultados_comentario ? evaluacion.idi_evaluacion.resultados_comentario : 'Sin recomendación'}
                                                </p>
                                            </>
                                        ) : evaluacion.cultura_innovacion_evaluacion ? (
                                            <>
                                                <h1 className="font-black mt-10">Objetivos</h1>
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.cultura_innovacion_evaluacion?.objetivos_comentario
                                                        ? evaluacion.cultura_innovacion_evaluacion.objetivos_comentario
                                                        : 'Sin recomendación'}
                                                </p>

                                                <hr className="mt-10 mb-10 border-black-200" />
                                                <h1 className="font-black">Resultados</h1>

                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.cultura_innovacion_evaluacion?.resultados_comentario
                                                        ? evaluacion.cultura_innovacion_evaluacion.resultados_comentario
                                                        : 'Sin recomendación'}
                                                </p>
                                            </>
                                        ) : evaluacion.servicio_tecnologico_evaluacion ? (
                                            <>
                                                <h1 className="font-black mt-10">Objetivo general</h1>

                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.servicio_tecnologico_evaluacion?.objetivo_general_comentario
                                                        ? evaluacion.servicio_tecnologico_evaluacion.objetivo_general_comentario
                                                        : 'Sin recomendación'}
                                                </p>

                                                <hr className="mt-10 mb-10 border-black-200" />
                                                <h1 className="font-black">Objetivos específicos</h1>

                                                <ul className="list-disc pl-4">
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.servicio_tecnologico_evaluacion?.primer_objetivo_comentario
                                                            ? 'Recomendación primer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.primer_objetivo_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.servicio_tecnologico_evaluacion?.segundo_objetivo_comentario
                                                            ? 'Recomendación segundo objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.segundo_objetivo_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.servicio_tecnologico_evaluacion?.tercer_objetivo_comentario
                                                            ? 'Recomendación tercer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.tercer_objetivo_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.servicio_tecnologico_evaluacion?.cuarto_objetivo_comentario
                                                            ? 'Recomendación cuarto objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.cuarto_objetivo_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                </ul>

                                                <hr className="mt-10 mb-10 border-black-200" />
                                                <h1 className="font-black">Resultados</h1>
                                                <ul className="list-disc pl-4">
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.servicio_tecnologico_evaluacion?.resultados_primer_obj_comentario
                                                            ? 'Recomendación resultados del primer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.resultados_primer_obj_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.servicio_tecnologico_evaluacion?.resultados_segundo_obj_comentario
                                                            ? 'Recomendación resultados del segundo objetivo específico: ' +
                                                              evaluacion.servicio_tecnologico_evaluacion.resultados_segundo_obj_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.servicio_tecnologico_evaluacion?.resultados_tercer_obj_comentario
                                                            ? 'Recomendación resultados del tercer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.resultados_tercer_obj_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.servicio_tecnologico_evaluacion?.resultados_cuarto_obj_comentario
                                                            ? 'Recomendación resultados del cuarto objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.resultados_cuarto_obj_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                </ul>
                                            </>
                                        ) : evaluacion.ta_evaluacion ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.ta_evaluacion?.arbol_objetivos_comentario ? evaluacion.ta_evaluacion.arbol_objetivos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : (
                                            evaluacion.tp_evaluacion && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.tp_evaluacion?.arbol_objetivos_comentario ? evaluacion.tp_evaluacion.arbol_objetivos_comentario : 'Sin recomendación'}
                                                </p>
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

            <div>
                {/* Causas directas y causas indirectas relacionados */}

                <Grid container>
                    <Grid item md={12}>
                        <div className="text-3xl font-extrabold mt-28">
                            <span className="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max">
                                1. Causas directas e indirectas <EastOutlinedIcon className="text-app-500" /> Objetivos específicos y actividades
                            </span>
                        </div>

                        <figure className="flex w-full items-center justify-center mt-10">
                            <img src="/images/causas-objetivos.png" alt="" />
                        </figure>

                        <AlertMui hiddenIcon={true} className="mt-8">
                            Recuerde que al crear una causa directa se genera automáticamente el objetivo específico en la sección de la derecha. Pasa igual si se crea una causa indirecta, se genera
                            la actividad respectiva. Ambos ítems deben tener relación.
                        </AlertMui>
                    </Grid>

                    {causasDirectas.map((causaDirecta, i) => (
                        <React.Fragment key={i}>
                            <Grid item md={6} className="!my-20 shadow p-2" style={{ backgroundColor: '#e0dddd30' }}>
                                <small className="inline-block ml-2">Causa directa #{i + 1}</small>
                                {causaDirectaId !== causaDirecta.id && (
                                    <div
                                        className="bg-white relative p-4 rounded-md parent-actions hover:cursor-text min-h-[117px] max-h-[117px] my-4 pr-14"
                                        style={{ overflow: 'hidden', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', display: '-webkit-box' }}
                                        onClick={() => setCausaDirecta(causaDirecta)}>
                                        {causaDirecta.descripcion ? causaDirecta.descripcion : 'Por favor diligencie esta causa directa.'}

                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {showCausaDirectaDestroyIcon && causaDirecta.id === causaDirectaIdToDestroy ? (
                                                <>
                                                    <CheckOutlinedIcon
                                                        className="w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            destroyCausaDirecta(causaDirecta)
                                                        }}
                                                    />
                                                    <ClearOutlinedIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowCausaDirectaDestroyIcon(false)
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setCausaDirecta(causaDirecta)} />
                                                    <DeleteForeverOutlinedIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowCausaDirectaDestroyIcon(true)
                                                            setCausaDirectaIdToDestroy(causaDirecta.id)
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {showCausaDirectaForm && causaDirectaId === causaDirecta.id && (
                                    <form className="relative form-arbol-objetivos" onSubmit={submitCausaDirecta} id="causa-directa">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <Textarea
                                                id="causa-directa-descripcion"
                                                inputBackground="#fff"
                                                disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                error={formCausaDirecta.errors.descripcion}
                                                value={formCausaDirecta.data.descripcion}
                                                onChange={(e) => formCausaDirecta.setData('descripcion', e.target.value)}
                                                required
                                            />
                                        </fieldset>

                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={formCausaDirecta.processing} className="my-4 mr-2 relative" type="submit" form="causa-directa">
                                                Guardar información sobre la causa directa
                                            </PrimaryButton>
                                        )}
                                        <ButtonMui primary={false} onClick={() => (setShowCausaDirectaForm(false), setCausaDirectaId(null))}>
                                            Cancelar
                                        </ButtonMui>
                                    </form>
                                )}

                                <small className="ml-2 mt-6 flex items-center">
                                    Causas indirectas
                                    <ShortcutIcon sx={{ transform: 'rotate(90deg)' }} />
                                </small>

                                {causaDirecta.causas_indirectas.map((causaIndirecta, j) => (
                                    <React.Fragment key={j}>
                                        {causaIndirectaId !== causaIndirecta.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[117px] max-h-[117px] my-4 pr-14"
                                                style={{
                                                    overflow: 'hidden',
                                                    WebkitLineClamp: 4,
                                                    WebkitBoxOrient: 'vertical',
                                                    display: '-webkit-box',
                                                }}
                                                onClick={() => setCausaIndirecta(causaDirecta, causaIndirecta)}>
                                                <p>{causaIndirecta.descripcion ? causaIndirecta.descripcion : 'Por favor diligencie esta causa indirecta.'}</p>

                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {showCausaIndirectaDestroyIcon && causaIndirecta.id === causaIndirectaIdToDestroy ? (
                                                        <>
                                                            <CheckOutlinedIcon
                                                                className="w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    destroyCausaIndirecta(causaIndirecta)
                                                                }}
                                                            />
                                                            <ClearOutlinedIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowCausaIndirectaDestroyIcon(false)
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setCausaIndirecta(causaDirecta, causaIndirecta)} />
                                                            <DeleteForeverOutlinedIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowCausaIndirectaDestroyIcon(true)
                                                                    setCausaIndirectaIdToDestroy(causaIndirecta.id)
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {showCausaIndirectaForm && causaIndirectaId === causaIndirecta.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitCausaIndirecta} id="causa-indirecta">
                                                <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                                    <div>
                                                        <Textarea
                                                            id="causa-directa-descripcion"
                                                            inputBackground="#fff"
                                                            disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                            error={formCausaIndirecta.errors.descripcion}
                                                            value={formCausaIndirecta.data.descripcion}
                                                            onChange={(e) => formCausaIndirecta.setData('descripcion', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </fieldset>

                                                {proyecto.allowed.to_update && (
                                                    <PrimaryButton disabled={formCausaIndirecta.processing} className="my-4 mr-2 relative" type="submit" form="causa-indirecta">
                                                        Guardar información sobre la causa indirecta
                                                    </PrimaryButton>
                                                )}

                                                <ButtonMui primary={false} onClick={() => (setShowCausaIndirectaForm(false), setCausaIndirectaId(null))}>
                                                    Cancelar
                                                </ButtonMui>
                                            </form>
                                        )}
                                    </React.Fragment>
                                ))}

                                <div className="flex items-center justify-end">
                                    <ButtonMui
                                        primary={true}
                                        className="my-4 !ml-2 flex items-center justify-center"
                                        disabled={showNuevaCausaIndirectaForm ? true : undefined}
                                        type="Button"
                                        onClick={() => setNuevoCausaIndirecta(causaDirecta)}>
                                        <TooltipMui
                                            className="relative"
                                            title={<p>Al crear una causa indirecta se genera automáticamente la actividad en la sección de la derecha. Recuerde que ambos deben tener relación.</p>}>
                                            <AddCircleOutlineOutlinedIcon className="mr-2" />
                                            <span>Añadir una causa indirecta</span>
                                        </TooltipMui>
                                    </ButtonMui>
                                </div>

                                {showNuevaCausaIndirectaForm && causaDirectaIdNuevaIndirecta === causaDirecta.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitCausaIndirecta} id="causa-indirecta">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <div>
                                                <Textarea
                                                    id="causa-directa-descripcion"
                                                    inputBackground="#fff"
                                                    disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                    label="Escriba la nueva causa indirecta"
                                                    error={formCausaIndirecta.errors.descripcion}
                                                    value={formCausaIndirecta.data.descripcion}
                                                    onChange={(e) => formCausaIndirecta.setData('descripcion', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </fieldset>

                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={formCausaIndirecta.processing} className="my-4 mr-2 relative" type="submit" form="causa-indirecta">
                                                Añadir causa indirecta
                                            </PrimaryButton>
                                        )}

                                        <ButtonMui primary={false} onClick={() => (setShowNuevaCausaIndirectaForm(false), setCausaDirectaId(null))}>
                                            Cancelar
                                        </ButtonMui>
                                    </form>
                                )}
                            </Grid>

                            {/* Objetivos específicos y actividades */}
                            <Grid item md={6} className="!my-20 shadow p-2 pb-[76px]" style={{ backgroundColor: '#e0dddd30' }}>
                                <small className="inline-block ml-2 mb-4">Objetivo específico #{i + 1}</small>
                                {objetivoEspecificoId !== causaDirecta.objetivo_especifico?.id && (
                                    <div
                                        className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[117px] max-h-[117px] pr-14"
                                        style={{ overflow: 'hidden', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', display: '-webkit-box' }}
                                        onClick={() => setObjetivoEspecifico(causaDirecta, causaDirecta.objetivo_especifico, i + 1)}>
                                        {causaDirecta.objetivo_especifico?.descripcion ? causaDirecta.objetivo_especifico?.descripcion : 'Por favor diligencie este objetivo específico.'}
                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {showObjetivoEspecificoDestroyIcon && causaDirecta.objetivo_especifico?.id === objetivoEspecificoIdToDestroy ? (
                                                <>
                                                    <CheckOutlinedIcon
                                                        className="w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            destroyObjetivoEspecifico(causaDirecta.objetivo_especifico)
                                                        }}
                                                    />
                                                    <ClearOutlinedIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowObjetivoEspecificoDestroyIcon(false)
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <EditOutlinedIcon
                                                        className="w-5 h-5 hover:cursor-pointer"
                                                        onClick={() => setObjetivoEspecifico(causaDirecta, causaDirecta.objetivo_especifico, i + 1)}
                                                    />
                                                    <DeleteForeverOutlinedIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowObjetivoEspecificoDestroyIcon(true)
                                                            setObjetivoEspecificoIdToDestroy(causaDirecta.objetivo_especifico?.id)
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {showObjetivoEspecificoForm && objetivoEspecificoId === causaDirecta.objetivo_especifico?.id && (
                                    <form className="relative form-arbol-objetivos" onSubmit={submitObjetivoEspecifico} id="objetivo-especifico-form">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <div>
                                                <TooltipMui
                                                    className="w-full"
                                                    title={
                                                        <p>
                                                            Los objetivos específicos son los medios cuantificables que llevarán al cumplimiento del objetivo general. Estos surgen de pasar a positivo
                                                            las causas directas identificadas en el árbol de problemas.
                                                            <br />
                                                            La redacción de los objetivos específicos deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en "ar", "er"
                                                            o "ir". La estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el
                                                            cual recae la acción y (3) elementos adicionales de contexto o descriptivos.
                                                        </p>
                                                    }>
                                                    <Textarea
                                                        id="descripcion-objetivo-especifico"
                                                        inputBackground="#fff"
                                                        disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                        error={formObjetivoEspecifico.errors.descripcion}
                                                        value={formObjetivoEspecifico.data.descripcion}
                                                        onChange={(e) => formObjetivoEspecifico.setData('descripcion', e.target.value)}
                                                        required
                                                    />
                                                </TooltipMui>
                                            </div>
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={formObjetivoEspecifico.processing} className="my-4 mr-2 relative" type="submit" form="objetivo-especifico-form">
                                                Guardar información sobre el objetivo específico
                                            </PrimaryButton>
                                        )}
                                        <ButtonMui primary={false} onClick={() => (setShowObjetivoEspecificoForm(false), setObjetivoEspecificoId(null))}>
                                            Cancelar
                                        </ButtonMui>
                                    </form>
                                )}
                                <small className="ml-2 mt-6 flex items-center">
                                    Actividades
                                    <ShortcutIcon sx={{ transform: 'rotate(90deg)' }} />
                                </small>

                                {causaDirecta.causas_indirectas.map((causaIndirecta, j) => (
                                    <div key={j}>
                                        {actividadId !== causaIndirecta.actividad?.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[117px] max-h-[117px] my-4 pr-14"
                                                style={{
                                                    overflow: 'hidden',
                                                    WebkitLineClamp: 4,
                                                    WebkitBoxOrient: 'vertical',
                                                    display: '-webkit-box',
                                                }}
                                                onClick={() => setActividad(causaDirecta, causaIndirecta, causaIndirecta.actividad)}>
                                                {causaIndirecta.actividad?.descripcion ? causaIndirecta.actividad?.descripcion : 'Por favor diligencie esta actividad.'}
                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {showActividadDestroyIcon && causaIndirecta.actividad?.id === actividadIdToDestroy ? (
                                                        <>
                                                            <CheckOutlinedIcon
                                                                className="w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    destroyActividad(causaIndirecta.actividad)
                                                                }}
                                                            />
                                                            <ClearOutlinedIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowActividadDestroyIcon(false)
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EditOutlinedIcon
                                                                className="w-5 h-5 hover:cursor-pointer"
                                                                onClick={() => setActividad(causaDirecta, causaIndirecta, causaIndirecta.actividad)}
                                                            />
                                                            <DeleteForeverOutlinedIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowActividadDestroyIcon(true)
                                                                    setActividadIdToDestroy(causaIndirecta.actividad?.id)
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {showActividadForm && actividadId === causaIndirecta.actividad?.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitActividad} id="actividad-form">
                                                <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                                    <div>
                                                        <TooltipMui
                                                            className="w-full"
                                                            title={
                                                                <p>
                                                                    Se debe evidenciar que la descripción de las actividades se realice de manera secuencial y de forma coherente con los productos a
                                                                    las cuales están asociadas para alcanzar el logro de cada uno de los objetivos específicos.
                                                                    <br />
                                                                    Las actividades deben redactarse en verbos en modo infinitivo, es decir, en palabras que expresen acciones y terminen en “ar”, “er”
                                                                    o “ir”, estos no deben hacer referencia a objetivos específicos o generales. Algunos ejemplos de verbos inadecuados para describir
                                                                    actividades son: apropiar, asegurar, colaborar, consolidar, desarrollar, fomentar, fortalecer, garantizar, implementar, impulsar,
                                                                    mejorar, movilizar, proponer, promover, entre otros.
                                                                </p>
                                                            }>
                                                            <Textarea
                                                                id="descripcion-actividad"
                                                                inputBackground="#fff"
                                                                disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                                error={formActividad.errors.descripcion}
                                                                value={formActividad.data.descripcion}
                                                                onChange={(e) => formActividad.setData('descripcion', e.target.value)}
                                                                required
                                                            />
                                                        </TooltipMui>
                                                    </div>

                                                    {proyecto.codigo_linea_programatica === 69 || proyecto.codigo_linea_programatica === 70 ? (
                                                        <div>
                                                            <Label required labelFor="resultado_id" value="Resultado" />
                                                            <Autocomplete
                                                                id="resultado_id"
                                                                inputBackground="#fff"
                                                                option={resultadosFiltrados}
                                                                selectedValue={formActividad.data.resultado_id}
                                                                onChange={(event, newValue) => formActividad.setData('resultado_id', newValue.value)}
                                                                error={errors.resultado_id}
                                                                placeholder="Seleccione un resultado"
                                                                required
                                                            />
                                                        </div>
                                                    ) : null}

                                                    <div className="ml-2 mt-4">
                                                        <div className={`mt-4 flex ${formActividad.errors.fecha_inicio ? '' : 'items-center'}`}>
                                                            <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                                                            <div className="ml-14">
                                                                <DatePicker
                                                                    id="fecha_inicio"
                                                                    className="mt-1 block w-full p-4"
                                                                    min={proyecto.fecha_inicio}
                                                                    max={proyecto.fecha_finalizacion}
                                                                    value={formActividad.data.fecha_inicio}
                                                                    onChange={(e) => formActividad.setData('fecha_inicio', e.target.value)}
                                                                    error={formActividad.errors.fecha_inicio}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={`mt-4 flex ${formActividad.errors.fecha_finalizacion ? '' : 'items-center'}`}>
                                                            <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                                                            <div className="ml-4">
                                                                <DatePicker
                                                                    id="fecha_finalizacion"
                                                                    className="mt-1 block w-full p-4"
                                                                    min={proyecto.fecha_inicio}
                                                                    max={proyecto.fecha_finalizacion}
                                                                    value={formActividad.data.fecha_finalizacion}
                                                                    onChange={(e) => formActividad.setData('fecha_finalizacion', e.target.value)}
                                                                    error={formActividad.errors.fecha_finalizacion}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>

                                                {proyecto.allowed.to_update && (
                                                    <PrimaryButton disabled={formActividad.processing} className="my-4 mr-2 relative" type="submit" form="actividad-form">
                                                        Guardar información sobre la actividad
                                                    </PrimaryButton>
                                                )}

                                                <ButtonMui primary={false} onClick={() => (setShowActividadForm(false), setActividadId(null))}>
                                                    Cancelar
                                                </ButtonMui>
                                            </form>
                                        )}
                                    </div>
                                ))}
                            </Grid>
                        </React.Fragment>
                    ))}

                    <PrimaryButton className="mt-4 mb-20 mx-auto flex items-center justify-center" onClick={() => newCausaDirecta()}>
                        <AddCircleOutlineOutlinedIcon className="mr-2" />
                        Añadir causa directa <EastOutlinedIcon className="mx-2" /> Objetivo específico
                    </PrimaryButton>
                </Grid>

                {/* Efectos directos y efectos indirectos relacionados */}
                <Grid container>
                    <Grid item md={12}>
                        <div className="text-3xl font-extrabold mt-28">
                            <span className="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max">
                                2. Efectos directos e indirectos <EastOutlinedIcon className="text-app-500" /> Resultados e impactos
                            </span>
                        </div>

                        <figure className="flex w-full items-center justify-center mt-20">
                            <img src="/images/efectos-resultados.png" alt="" />
                        </figure>
                    </Grid>

                    {efectosDirectos.map((efectoDirecto, i) => (
                        <React.Fragment key={i}>
                            <Grid item md={6} className="!my-20 shadow p-2" style={{ backgroundColor: '#e0dddd30' }}>
                                <small className="inline-block ml-2">Efecto directo</small>
                                {efectoDirectoId !== efectoDirecto.id && (
                                    <div
                                        className="bg-white relative p-4 rounded-md parent-actions hover:cursor-text min-h-[117px] max-h-[117px] my-4 pr-14"
                                        style={{ overflow: 'hidden', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', display: '-webkit-box' }}
                                        onClick={() => setEfectoDirecto(efectoDirecto)}>
                                        {efectoDirecto.descripcion ? efectoDirecto.descripcion : 'Por favor diligencie este efecto directo.'}
                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {showEfectoDirectoDestroyIcon && efectoDirecto.id === efectoDirectoIdToDestroy ? (
                                                <>
                                                    <CheckOutlinedIcon
                                                        className="w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            destroyEfectoDirecto(efectoDirecto)
                                                        }}
                                                    />
                                                    <ClearOutlinedIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowEfectoDirectoDestroyIcon(false)
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setEfectoDirecto(efectoDirecto)} />
                                                    <DeleteForeverOutlinedIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowEfectoDirectoDestroyIcon(true)
                                                            setEfectoDirectoIdToDestroy(efectoDirecto.id)
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {showEfectoDirectoForm && efectoDirectoId === efectoDirecto.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoDirecto} id="efecto-directo">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <Textarea
                                                id="efecto-directo-descripcion"
                                                inputBackground="#fff"
                                                disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                error={formEfectoDirecto.errors.descripcion}
                                                value={formEfectoDirecto.data.descripcion}
                                                onChange={(e) => formEfectoDirecto.setData('descripcion', e.target.value)}
                                                required
                                            />
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={formEfectoDirecto.processing} className="my-4 mr-2 relative" type="submit" form="efecto-directo">
                                                Guardar información sobre el efecto directo
                                            </PrimaryButton>
                                        )}
                                        <ButtonMui primary={false} onClick={() => (setShowEfectoDirectoForm(false), setEfectoDirectoId(null))}>
                                            Cancelar
                                        </ButtonMui>
                                    </form>
                                )}
                                <small className="ml-2 mt-6 flex items-center">
                                    Efectos indirectos
                                    <ShortcutIcon sx={{ transform: 'rotate(90deg)' }} />
                                </small>
                                {efectoDirecto.efectos_indirectos.map((efectoIndirecto, j) => (
                                    <div key={j}>
                                        {efectoIndirectoId !== efectoIndirecto.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[117px] max-h-[117px] my-4 pr-14"
                                                style={{ overflow: 'hidden', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', display: '-webkit-box' }}
                                                onClick={() => setEfectoIndirecto(efectoDirecto, efectoIndirecto)}>
                                                {efectoIndirecto.descripcion ? efectoIndirecto.descripcion : 'Por favor diligencie este efecto indirecto.'}
                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {showEfectoIndirectoDestroyIcon && efectoIndirecto.id === efectoIndirectoIdToDestroy ? (
                                                        <>
                                                            <CheckOutlinedIcon
                                                                className="w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    destroyEfectoIndirecto(efectoIndirecto)
                                                                }}
                                                            />
                                                            <ClearOutlinedIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowEfectoIndirectoDestroyIcon(false)
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setEfectoIndirecto(efectoDirecto, efectoIndirecto)} />
                                                            <DeleteForeverOutlinedIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowEfectoIndirectoDestroyIcon(true)
                                                                    setEfectoIndirectoIdToDestroy(efectoIndirecto.id)
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {showEfectoIndirectoForm && efectoIndirectoId === efectoIndirecto.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoIndirecto} id="efecto-indirecto">
                                                <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                                    <div>
                                                        <Textarea
                                                            id="efecto-directo-descripcion"
                                                            inputBackground="#fff"
                                                            disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                            label="Escriba el nuevo efecto indirecto"
                                                            error={formEfectoIndirecto.errors.descripcion}
                                                            value={formEfectoIndirecto.data.descripcion}
                                                            onChange={(e) => formEfectoIndirecto.setData('descripcion', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </fieldset>
                                                {proyecto.allowed.to_update && (
                                                    <PrimaryButton disabled={formEfectoIndirecto.processing} className="my-4 mr-2 relative" type="submit" form="efecto-indirecto">
                                                        Guardar información sobre el efecto indirecto
                                                    </PrimaryButton>
                                                )}
                                                <ButtonMui primary={false} onClick={() => (setShowEfectoIndirectoForm(false), setEfectoIndirectoId(null))}>
                                                    Cancelar
                                                </ButtonMui>
                                            </form>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center justify-end">
                                    <ButtonMui
                                        primary={true}
                                        className="my-4 !ml-2 flex items-center justify-center"
                                        disabled={showNuevoEfectoIndirectoForm ? true : undefined}
                                        type="Button"
                                        onClick={() => setNuevoEfectoIndirecto(efectoDirecto)}>
                                        <TooltipMui
                                            className="relative"
                                            title={<p>Al crear un efecto indirecto se genera automáticamente el impacto en la sección de la derecha. Ambos deben tener relación.</p>}>
                                            <AddCircleOutlineOutlinedIcon className="mr-2" />
                                            <span>Añadir un efecto indirecto</span>
                                        </TooltipMui>
                                    </ButtonMui>
                                </div>
                                {showNuevoEfectoIndirectoForm && efectoDirectoIdNuevoIndirecto === efectoDirecto.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoIndirecto} id="efecto-indirecto">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <div>
                                                <Textarea
                                                    id="efecto-directo-descripcion"
                                                    inputBackground="#fff"
                                                    disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                    label="Escriba el nuevo efecto indirecto"
                                                    error={formEfectoIndirecto.errors.descripcion}
                                                    value={formEfectoIndirecto.data.descripcion}
                                                    onChange={(e) => formEfectoIndirecto.setData('descripcion', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={formEfectoIndirecto.processing} className="my-4 mr-2 relative" type="submit" form="efecto-indirecto">
                                                Añadir efecto indirecto
                                            </PrimaryButton>
                                        )}
                                        <ButtonMui primary={false} onClick={() => (setShowNuevoEfectoIndirectoForm(false), setEfectoDirectoId(null))}>
                                            Cancelar
                                        </ButtonMui>
                                    </form>
                                )}
                            </Grid>

                            {/* Resultados e impactos relacionados */}
                            <Grid item md={6} className="!my-20 shadow p-2 pb-[76px]" style={{ backgroundColor: '#e0dddd30' }}>
                                <small className="inline-block ml-2 mb-4">Resultado</small>
                                {resultadoId !== efectoDirecto.resultado?.id && (
                                    <div
                                        className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[117px] max-h-[117px] pr-14"
                                        style={{ overflow: 'hidden', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', display: '-webkit-box' }}
                                        onClick={() => setResultado(efectoDirecto, efectoDirecto.resultado)}>
                                        {efectoDirecto.resultado?.descripcion ? efectoDirecto.resultado?.descripcion : 'Por favor diligencie este resultado.'}
                                        <div className="absolute flex top-[40%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {showResultadoDestroyIcon && efectoDirecto.resultado?.id === resultadoIdToDestroy ? (
                                                <>
                                                    <CheckOutlinedIcon
                                                        className="w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            destroyResultado(efectoDirecto.resultado)
                                                        }}
                                                    />
                                                    <ClearOutlinedIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowResultadoDestroyIcon(false)
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setResultado(efectoDirecto, efectoDirecto.resultado)} />
                                                    <DeleteForeverOutlinedIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowResultadoDestroyIcon(true)
                                                            setResultadoIdToDestroy(efectoDirecto.resultado?.id)
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {showResultadoForm && resultadoId === efectoDirecto.resultado?.id && (
                                    <form className="relative form-arbol-objetivos" onSubmit={submitResultado} id="resultado-form">
                                        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                                            {objetivosEspecificos.length === 0 ? (
                                                <AlertMui hiddenIcon={true}>Por favor genere primero los objetivos específicos.</AlertMui>
                                            ) : (
                                                <>
                                                    <div>
                                                        <TooltipMui
                                                            className="w-full"
                                                            title={
                                                                <p>
                                                                    Se debe evidenciar que los resultados son directos, medibles y cuantificables que se alcanzarán con el desarrollo de cada uno de los
                                                                    objetivos específicos del proyecto.
                                                                </p>
                                                            }>
                                                            <Textarea
                                                                id="descripcion-resultado"
                                                                inputBackground="#fff"
                                                                disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                                error={formResultado.errors.descripcion}
                                                                value={formResultado.data.descripcion}
                                                                onChange={(e) => formResultado.setData('descripcion', e.target.value)}
                                                                required
                                                            />
                                                        </TooltipMui>
                                                    </div>
                                                    <div className="mt-10">
                                                        <AlertMui className="relative" hiddenIcon={true}>
                                                            Por seleccione un objetivo específico.
                                                        </AlertMui>
                                                        <Autocomplete
                                                            id="objetivo-especifico"
                                                            inputBackground="#fff"
                                                            options={objetivosEspecificos}
                                                            selectedValue={formResultado.data.objetivo_especifico_id}
                                                            onChange={(event, newValue) => formResultado.setData('objetivo_especifico_id', newValue.value)}
                                                            error={formResultado.errors.objetivo_especifico_id}
                                                            autoComplete={false}
                                                            placeholder="Seleccione un objetivo específico"
                                                            required
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={formResultado.processing} className="my-4 mr-2 relative" type="submit" form="resultado-form">
                                                Guardar información sobre el resultado
                                            </PrimaryButton>
                                        )}
                                        <ButtonMui primary={false} onClick={() => (setShowResultadoForm(false), setResultadoId(null))}>
                                            Cancelar
                                        </ButtonMui>
                                    </form>
                                )}
                                <small className="ml-2 mt-6 flex items-center">
                                    Impactos
                                    <ShortcutIcon sx={{ transform: 'rotate(90deg)' }} />
                                </small>

                                {efectoDirecto.efectos_indirectos.map((efectoIndirecto, j) => (
                                    <div key={j}>
                                        {impactoId !== efectoIndirecto.impacto?.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[117px] max-h-[117px] my-4 pr-14"
                                                style={{
                                                    overflow: 'hidden',
                                                    WebkitLineClamp: 4,
                                                    WebkitBoxOrient: 'vertical',
                                                    display: '-webkit-box',
                                                }}
                                                onClick={() => setImpacto(efectoIndirecto, efectoIndirecto.impacto)}>
                                                {efectoIndirecto.impacto?.descripcion ? efectoIndirecto.impacto?.descripcion : 'Por favor diligencie este impacto.'}
                                                <div className="absolute flex top-[40%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {showImpactoDestroyIcon && efectoIndirecto.impacto?.id === impactoIdToDestroy ? (
                                                        <>
                                                            <CheckOutlinedIcon
                                                                className="w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    destroyImpacto(efectoIndirecto.impacto)
                                                                }}
                                                            />
                                                            <ClearOutlinedIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowImpactoDestroyIcon(false)
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setImpacto(efectoIndirecto, efectoIndirecto.impacto)} />
                                                            <DeleteForeverOutlinedIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowImpactoDestroyIcon(true)
                                                                    setImpactoIdToDestroy(efectoIndirecto.impacto?.id)
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {showImpactoForm && impactoId === efectoIndirecto.impacto?.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitImpacto} id="impacto-form">
                                                <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                                                    <div>
                                                        <TooltipMui
                                                            className="w-full"
                                                            title={
                                                                <p>
                                                                    Se busca medir la contribución potencial que genera el proyecto en los siguientes ámbitos: tecnológico, económico, ambiental,
                                                                    social, centro de formación, sector productivo
                                                                    <br />
                                                                    <br />
                                                                    <strong>Impacto social</strong>
                                                                    <br />
                                                                    Se busca minimizar y/o evitar los impactos negativos sobre el medio ambiente, tales como contaminación del aire, contaminación de
                                                                    corrientes de agua naturales, ruido, destrucción del paisaje, separación de comunidades que operan como unidades, etc. Por otro
                                                                    lado, se busca identificar diversas acciones de impacto ambiental positivo, tales como: producción limpia y sustentable, protección
                                                                    medioambiental, uso de residuos y reciclaje.
                                                                    <br />
                                                                    <br />
                                                                    <strong>Impacto tecnológico</strong>
                                                                    <br />
                                                                    Se busca medir la contribución potencial del proyecto en cualquiera de los siguientes ámbitos: generación y aplicación de nuevos
                                                                    conocimientos y tecnologías, desarrollo de infraestructura científico-tecnológica, articulación de diferentes proyectos para lograr
                                                                    un objetivo común, mejoramiento de la infraestructura, desarrollo de capacidades de gestión tecnológica.
                                                                    <br />
                                                                    <br />
                                                                    <strong>Impacto en el centro de formación</strong>
                                                                    <br />
                                                                    Se busca medir la contribución potencial del proyecto al desarrollo de la comunidad Sena (Aprendices, instructores y a la
                                                                    formación).
                                                                    <br />
                                                                    <br />
                                                                    <strong>Impacto en el sector productivo</strong>
                                                                    <br />
                                                                    Se busca medir la contribución potencial del proyecto al desarrollo del sector productivo en concordancia con el sector priorizado
                                                                    de Colombia Productiva y a la mesa técnica a la que pertenece el proyecto.
                                                                </p>
                                                            }>
                                                            <Textarea
                                                                id="descripcion-impacto"
                                                                inputBackground="#fff"
                                                                disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                                error={formImpacto.errors.descripcion}
                                                                value={formImpacto.data.descripcion}
                                                                onChange={(e) => formImpacto.setData('descripcion', e.target.value)}
                                                                required
                                                            />
                                                        </TooltipMui>
                                                    </div>

                                                    <div className="mt-8">
                                                        <Autocomplete
                                                            id="tipo-impacto"
                                                            inputBackground="#fff"
                                                            options={tiposImpacto}
                                                            selectedValue={formImpacto.data.tipo}
                                                            onChange={(event, newValue) => formImpacto.setData('tipo', newValue.value)}
                                                            error={formImpacto.errors.tipo}
                                                            label="Tipo de impacto"
                                                            required
                                                        />
                                                    </div>
                                                </fieldset>

                                                {proyecto.allowed.to_update && (
                                                    <PrimaryButton disabled={formImpacto.processing} className="my-4 mr-2 relative" type="submit" form="impacto-form">
                                                        Guardar información sobre el impacto
                                                    </PrimaryButton>
                                                )}

                                                <ButtonMui primary={false} onClick={() => (setShowImpactoForm(false), setImpactoId(null))}>
                                                    Cancelar
                                                </ButtonMui>
                                            </form>
                                        )}
                                    </div>
                                ))}
                            </Grid>
                        </React.Fragment>
                    ))}

                    <PrimaryButton className="mt-4 mb-20 mx-auto flex items-center justify-center" onClick={() => newEfectoDirecto()}>
                        <AddCircleOutlineOutlinedIcon className="mr-2" />
                        Añadir efecto directo <EastOutlinedIcon className="mx-2" /> Resultado
                    </PrimaryButton>
                </Grid>
            </div>
        </>
    )
}

export default ArbolObjetivosComponent
