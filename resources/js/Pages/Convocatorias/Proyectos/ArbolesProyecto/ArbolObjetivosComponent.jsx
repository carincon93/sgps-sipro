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

const ArbolObjetivosComponent = ({ auth, convocatoria, proyecto, efectos_directos, causas_directas, tipos_impacto, resultados, objetivos_especificos, fase_evaluacion = false }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const form_efecto_indirecto = useForm({
        id: null,
        efecto_directo_id: null,
        descripcion: '',
    })

    const [showNuevo_efecto_indirecto_form, setShowNuevoEfectoIndirectoForm] = useState(false)
    const [efecto_directo_id_nuevo_indirecto, setEfectoDirectoIdNuevoIndirecto] = useState(null)

    const setNuevoEfectoIndirecto = (efectoDirecto) => {
        setShowNuevoEfectoIndirectoForm(true)
        setShowEfectoIndirectoForm(false)
        setEfectoDirectoIdNuevoIndirecto(efectoDirecto.id)

        form_efecto_indirecto.setData({
            id: null,
            efecto_directo_id: efectoDirecto.id,
            descripcion: '',
        })
    }

    const [show_efecto_indirecto_form, setShowEfectoIndirectoForm] = useState(false)
    const [efecto_indirecto_id, setEfectoIndirectoId] = useState(null)

    const setEfectoIndirecto = (efectoDirecto, efectoIndirecto) => {
        // if (show_efecto_directo_form) {
        //     submitEfectoDirecto()
        // }

        setShowEfectoIndirectoForm(true)
        setEfectoIndirectoId(efectoIndirecto.id)

        form_efecto_indirecto.setData({
            id: efectoIndirecto.id,
            efecto_directo_id: efectoDirecto.id,
            descripcion: efectoIndirecto.descripcion,
        })
    }

    const submitEfectoIndirecto = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_efecto_indirecto.post(
                route('proyectos.efecto-indirecto', {
                    proyecto: proyecto.id,
                    efecto_directo: form_efecto_indirecto.data.efecto_directo_id,
                }),
                {
                    onSuccess: () => {
                        setShowEfectoIndirectoForm(false)
                        setShowNuevoEfectoIndirectoForm(false)
                        form_efecto_indirecto.setData('id', null)
                        form_efecto_indirecto.setData('efecto_directo_id', null)
                        form_efecto_indirecto.setData('descripcion', '')
                        setEfectoIndirectoId(null)
                        setEfectoDirectoId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    // Efecto Indirecto
    const [show_efecto_indirecto_destroy_icon, setShowEfectoIndirectoDestroyIcon] = useState(false)
    const [efecto_indirecto_idToDestroy, setEfectoIndirectoIdToDestroy] = useState(null)

    const destroyEfectoIndirecto = (efectoIndirecto) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.efecto-indirecto.destroy', [proyecto.id, efectoIndirecto.id]), {
                preserveScroll: true,
            })
        }
    }

    // Efecto Directo
    const form_efecto_directo = useForm({
        id: null,
        descripcion: '',
    })

    const newEfectoDirecto = () => {
        if (proyecto.allowed.to_update) {
            form_efecto_directo.post(
                route('proyectos.new-efecto-directo', {
                    proyecto: proyecto.id,
                }),
                {
                    preserveScroll: true,
                },
            )
        }
    }

    const [show_efecto_directo_form, setShowEfectoDirectoForm] = useState(false)
    const [efecto_directo_id, setEfectoDirectoId] = useState(null)

    const setEfectoDirecto = (efectoDirecto) => {
        form_efecto_directo.reset()
        // if (show_efecto_indirecto_form) {
        //     submitEfectoIndirecto()
        // }

        setShowEfectoDirectoForm(true)
        setEfectoDirectoId(efectoDirecto.id)

        form_efecto_directo.setData({
            id: efectoDirecto.id,
            descripcion: efectoDirecto.descripcion,
        })
    }

    const submitEfectoDirecto = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            form_efecto_directo.post(
                route('proyectos.efecto-directo', {
                    proyecto: proyecto.id,
                    efecto_directo: form_efecto_directo.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowEfectoDirectoForm(false)
                        form_efecto_directo.reset()
                        setEfectoDirectoId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [show_efecto_directo_destroy_icon, setShowEfectoDirectoDestroyIcon] = useState(false)
    const [efecto_directo_idToDestroy, setEfectoDirectoIdToDestroy] = useState(null)

    const destroyEfectoDirecto = (efectoDirecto) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.efecto-directo.destroy', [proyecto.id, efectoDirecto.id]), {
                preserveScroll: true,
            })
        }
    }

    // Causa Directa
    const form_causa_directa = useForm({
        id: null,
        descripcion: '',
    })

    const newCausaDirecta = () => {
        if (proyecto.allowed.to_update) {
            form_causa_directa.post(
                route('proyectos.new-causa-directa', {
                    proyecto: proyecto.id,
                }),
                {
                    preserveScroll: true,
                },
            )
        }
    }

    const [show_causa_directa_form, setShowCausaDirectaForm] = useState(false)
    const [causa_directa_id, setCausaDirectaId] = useState(null)

    const setCausaDirecta = (causaDirecta) => {
        form_causa_directa.reset()
        // if (show_efecto_indirecto_form) {
        //     submitEfectoIndirecto()
        // }

        setShowCausaDirectaForm(true)
        setCausaDirectaId(causaDirecta.id)

        form_causa_directa.setData({
            id: causaDirecta.id,
            descripcion: causaDirecta.descripcion,
        })
    }

    const submitCausaDirecta = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_causa_directa.post(
                route('proyectos.causa-directa', {
                    proyecto: proyecto.id,
                    causa_directa: form_causa_directa.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowCausaDirectaForm(false)
                        form_causa_directa.reset()
                        setCausaDirectaId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [show_causa_directa_destroy_icon, setShowCausaDirectaDestroyIcon] = useState(false)
    const [causa_directa_idToDestroy, setCausaDirectaIdToDestroy] = useState(null)

    const destroyCausaDirecta = (causaDirecta) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.causa-directa.destroy', [proyecto.id, causaDirecta.id]), {
                preserveScroll: true,
            })
        }
    }

    // Causa Indirecta
    const form_causa_indirecta = useForm({
        id: null,
        causa_directa_id: null,
        descripcion: '',
    })

    const [show_nueva_causa_indirecta_form, setShowNuevaCausaIndirectaForm] = useState(false)
    const [causa_directa_idNuevaIndirecta, setCausaDirectaIdNuevaIndirecta] = useState(null)

    const setNuevoCausaIndirecta = (causaDirecta) => {
        form_causa_indirecta.reset()

        setShowNuevaCausaIndirectaForm(true)
        setShowCausaIndirectaForm(false)
        setCausaDirectaIdNuevaIndirecta(causaDirecta.id)

        form_causa_indirecta.setData({
            causa_directa_id: causaDirecta.id,
        })
    }

    const [show_causa_indirecta_form, setShowCausaIndirectaForm] = useState(false)
    const [causa_indirecta_id, setCausaIndirectaId] = useState(null)

    const setCausaIndirecta = (causaDirecta, causaIndirecta) => {
        form_causa_indirecta.reset()
        // if (show_efecto_directo_form) {
        //     submitEfectoDirecto()
        // }

        setShowCausaIndirectaForm(true)
        setCausaIndirectaId(causaIndirecta.id)

        form_causa_indirecta.setData({
            id: causaIndirecta.id,
            descripcion: causaIndirecta.descripcion,
            causa_directa_id: causaDirecta.id,
        })
    }

    const submitCausaIndirecta = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            form_causa_indirecta.post(
                route('proyectos.causa-indirecta', {
                    proyecto: proyecto.id,
                    causa_directa: form_causa_indirecta.data.causa_directa_id,
                }),
                {
                    onSuccess: () => {
                        setShowCausaIndirectaForm(false)
                        setShowNuevaCausaIndirectaForm(false)
                        form_causa_indirecta.reset()
                        setCausaIndirectaId(null)
                        setCausaDirectaId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    // Causa Indirecta
    const [show_causa_indirecta_destroy_icon, setShowCausaIndirectaDestroyIcon] = useState(false)
    const [causa_indirecta_idToDestroy, setCausaIndirectaIdToDestroy] = useState(null)

    const destroyCausaIndirecta = (causaIndirecta) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.causa-indirecta.destroy', [proyecto.id, causaIndirecta.id]), {
                preserveScroll: true,
            })
        }
    }

    // Impactos
    const form_impacto = useForm({
        id: null,
        efecto_indirecto_id: null,
        descripcion: '',
        tipo: '',
        resultado_id: '',
    })

    const [show_impacto_form, setShowImpactoForm] = useState(false)
    const [impacto_id, setImpactoId] = useState(null)

    const setImpacto = (efectoIndirecto, impacto) => {
        form_impacto.reset()
        // if (show_resultado_form) {
        //     submitResultado()
        // }

        setShowImpactoForm(true)
        setImpactoId(impacto.id)

        form_impacto.setData({
            id: impacto.id,
            efecto_indirecto_id: efectoIndirecto.id,
            descripcion: impacto.descripcion,
            tipo: impacto.tipo,
        })
    }

    const submitImpacto = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            form_impacto.post(
                route('proyectos.impacto', {
                    proyecto: proyecto.id,
                    impacto: form_impacto.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowImpactoForm(false)
                        setImpactoId(null)
                        form_impacto.reset()
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [show_impacto_destroy_icon, setShowImpactoDestroyIcon] = useState(false)
    const [impacto_id_to_destroy, setImpactoIdToDestroy] = useState(null)

    const destroyImpacto = (impacto) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.impacto.destroy', [proyecto.id, impacto.id]), {
                preserveScroll: true,
            })
        }
    }

    // Resultados
    const form_resultado = useForm({
        descripcion: '',
    })

    const [show_resultado_form, setShowResultadoForm] = useState(false)
    const [resultado_id, setResultadoId] = useState(null)

    const setResultado = (efectoDirecto, resultado) => {
        form_resultado.reset()
        // if (show_impacto_form) {
        //     submitImpacto()
        // }

        setShowResultadoForm(true)
        setResultadoId(resultado.id)

        form_resultado.setData({
            id: resultado.id,
            descripcion: resultado.descripcion,
            objetivo_especifico_id: resultado.objetivo_especifico_id,
        })
    }

    const submitResultado = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            form_resultado.post(
                route('proyectos.resultado', {
                    proyecto: proyecto.id,
                    resultado: form_resultado.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowResultadoForm(false)
                        form_resultado.reset()
                        setResultadoId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [show_resultado_destroy_icon, setShowResultadoDestroyIcon] = useState(false)
    const [resultado_id_to_destroy, setResultadoIdToDestroy] = useState(null)

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
    const form_objetivo_especifico = useForm({
        id: null,
        descripcion: '',
        numero: 0,
    })

    const [show_objetivo_especifico_form, setShowObjetivoEspecificoForm] = useState(false)
    const [objetivo_especifico_id, setObjetivoEspecificoId] = useState(null)

    const setObjetivoEspecifico = (causaDirecta, objetivoEspecifico, numero) => {
        form_objetivo_especifico.reset()
        // if (show_actividad_form) {
        //     submitActividad()
        // }

        setShowObjetivoEspecificoForm(true)
        setObjetivoEspecificoId(objetivoEspecifico.id)

        form_objetivo_especifico.setData({
            id: objetivoEspecifico.id,
            descripcion: objetivoEspecifico.descripcion,
            numero: numero,
        })
    }

    const submitObjetivoEspecifico = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            form_objetivo_especifico.post(
                route('proyectos.objetivo-especifico', {
                    proyecto: proyecto.id,
                    objetivo_especifico: form_objetivo_especifico.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowObjetivoEspecificoForm(false)
                        form_objetivo_especifico.reset()
                        setObjetivoEspecificoId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [show_objetivo_especifico_destroy_icon, setShowObjetivoEspecificoDestroyIcon] = useState(false)
    const [objetivo_especifico_id_to_destroy, setObjetivoEspecificoIdToDestroy] = useState(null)

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
    const form_actividad = useForm({
        id: null,
        fecha_inicio: '',
        fecha_finalizacion: '',
        causa_indirecta_id: null,
        objetivo_especifico_id: null,
        resultado_id: null,
        descripcion: '',
    })

    const [show_actividad_form, setShowActividadForm] = useState(false)
    const [actividad_id, setActividadId] = useState(null)
    const [resultados_filtrados, setResultadosFiltrados] = useState(null)

    const setActividad = (causaDirecta, causaIndirecta, actividad) => {
        form_actividad.reset()
        // if (show_objetivo_especifico_form) {
        //     submitObjetivoEspecifico()
        // }

        const resultados_por_objetivo = resultados.filter((item) => item.objetivo_especifico_id === actividad.objetivo_especifico_id)
        setResultadosFiltrados(resultados_por_objetivo.filter((item) => item.label != null))

        setShowActividadForm(true)
        setActividadId(actividad.id)

        form_actividad.setData({
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
            form_actividad.post(
                route('proyectos.actividad', {
                    convocatoria: convocatoria.id,
                    proyecto: proyecto.id,
                    actividad: form_actividad.data.id,
                }),
                {
                    onSuccess: () => {
                        setShowActividadForm(false)
                        form_actividad.reset()
                        setActividadId(null)
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    const [show_actividad_destroy_icon, setShowActividadDestroyIcon] = useState(false)
    const [actividad_id_to_destroy, setActividadIdToDestroy] = useState(null)

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
                                            <>
                                                <h1 className="font-black mt-10">Objetivos</h1>
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.evaluacion_proyecto_linea66?.objetivos_comentario ? evaluacion.evaluacion_proyecto_linea66.objetivos_comentario : 'Sin recomendación'}
                                                </p>

                                                <hr className="mt-10 mb-10 border-black-200" />
                                                <h1 className="font-black">Resultados</h1>

                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.evaluacion_proyecto_linea66?.resultados_comentario ? evaluacion.evaluacion_proyecto_linea66.resultados_comentario : 'Sin recomendación'}
                                                </p>
                                            </>
                                        ) : evaluacion.evaluacion_proyecto_linea65 ? (
                                            <>
                                                <h1 className="font-black mt-10">Objetivos</h1>
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.evaluacion_proyecto_linea65?.objetivos_comentario ? evaluacion.evaluacion_proyecto_linea65.objetivos_comentario : 'Sin recomendación'}
                                                </p>

                                                <hr className="mt-10 mb-10 border-black-200" />
                                                <h1 className="font-black">Resultados</h1>

                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.evaluacion_proyecto_linea65?.resultados_comentario ? evaluacion.evaluacion_proyecto_linea65.resultados_comentario : 'Sin recomendación'}
                                                </p>
                                            </>
                                        ) : evaluacion.evaluacion_proyecto_linea68 ? (
                                            <>
                                                <h1 className="font-black mt-10">Objetivo general</h1>

                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.evaluacion_proyecto_linea68?.objetivo_general_comentario
                                                        ? evaluacion.evaluacion_proyecto_linea68.objetivo_general_comentario
                                                        : 'Sin recomendación'}
                                                </p>

                                                <hr className="mt-10 mb-10 border-black-200" />
                                                <h1 className="font-black">Objetivos específicos</h1>

                                                <ul className="list-disc pl-4">
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.evaluacion_proyecto_linea68?.primer_objetivo_comentario
                                                            ? 'Recomendación primer objetivo específico: ' + evaluacion.evaluacion_proyecto_linea68.primer_objetivo_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.evaluacion_proyecto_linea68?.segundo_objetivo_comentario
                                                            ? 'Recomendación segundo objetivo específico: ' + evaluacion.evaluacion_proyecto_linea68.segundo_objetivo_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.evaluacion_proyecto_linea68?.tercer_objetivo_comentario
                                                            ? 'Recomendación tercer objetivo específico: ' + evaluacion.evaluacion_proyecto_linea68.tercer_objetivo_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.evaluacion_proyecto_linea68?.cuarto_objetivo_comentario
                                                            ? 'Recomendación cuarto objetivo específico: ' + evaluacion.evaluacion_proyecto_linea68.cuarto_objetivo_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                </ul>

                                                <hr className="mt-10 mb-10 border-black-200" />
                                                <h1 className="font-black">Resultados</h1>
                                                <ul className="list-disc pl-4">
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.evaluacion_proyecto_linea68?.resultados_primer_obj_comentario
                                                            ? 'Recomendación resultados del primer objetivo específico: ' + evaluacion.evaluacion_proyecto_linea68.resultados_primer_obj_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.evaluacion_proyecto_linea68?.resultados_segundo_obj_comentario
                                                            ? 'Recomendación resultados del segundo objetivo específico: ' + evaluacion.evaluacion_proyecto_linea68.resultados_segundo_obj_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.evaluacion_proyecto_linea68?.resultados_tercer_obj_comentario
                                                            ? 'Recomendación resultados del tercer objetivo específico: ' + evaluacion.evaluacion_proyecto_linea68.resultados_tercer_obj_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                        {evaluacion.evaluacion_proyecto_linea68?.resultados_cuarto_obj_comentario
                                                            ? 'Recomendación resultados del cuarto objetivo específico: ' + evaluacion.evaluacion_proyecto_linea68.resultados_cuarto_obj_comentario
                                                            : 'Sin recomendación'}
                                                    </li>
                                                </ul>
                                            </>
                                        ) : evaluacion.evaluacion_proyecto_linea70 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea70?.arbol_objetivos_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea70.arbol_objetivos_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        ) : (
                                            evaluacion.evaluacion_proyecto_linea69 && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.evaluacion_proyecto_linea69?.arbol_objetivos_comentario
                                                        ? evaluacion.evaluacion_proyecto_linea69.arbol_objetivos_comentario
                                                        : 'Sin recomendación'}
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

                        <AlertMui className="mt-8">
                            Recuerde que al crear una causa directa se genera automáticamente el objetivo específico en la sección de la derecha. Pasa igual si se crea una causa indirecta, se genera
                            la actividad respectiva. Ambos ítems deben tener relación.
                        </AlertMui>
                    </Grid>

                    {causas_directas.map((causaDirecta, i) => (
                        <React.Fragment key={i}>
                            <Grid item md={6} className="!my-20 shadow p-2" style={{ backgroundColor: '#e0dddd30' }}>
                                <small className="inline-block ml-2">Causa directa #{i + 1}</small>
                                {causa_directa_id !== causaDirecta.id && (
                                    <div
                                        className="bg-white relative p-4 rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                        onClick={() => setCausaDirecta(causaDirecta)}>
                                        <p className="line-clamp-3">{causaDirecta.descripcion ? causaDirecta.descripcion : 'Por favor diligencie esta causa directa.'}</p>

                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {show_causa_directa_destroy_icon && causaDirecta.id === causa_directa_idToDestroy ? (
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

                                {show_causa_directa_form && causa_directa_id === causaDirecta.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitCausaDirecta} id="causa-directa">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <Textarea
                                                id="causa-directa-descripcion"
                                                inputBackground="#fff"
                                                disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                error={form_causa_directa.errors.descripcion}
                                                value={form_causa_directa.data.descripcion}
                                                onChange={(e) => form_causa_directa.setData('descripcion', e.target.value)}
                                                required
                                            />
                                        </fieldset>

                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={form_causa_directa.processing} className="my-4 mr-2 relative" type="submit" form="causa-directa">
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
                                        {causa_indirecta_id !== causaIndirecta.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                                onClick={() => setCausaIndirecta(causaDirecta, causaIndirecta)}>
                                                <p className="line-clamp-3">{causaIndirecta.descripcion ? causaIndirecta.descripcion : 'Por favor diligencie esta causa indirecta.'}</p>

                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {show_causa_indirecta_destroy_icon && causaIndirecta.id === causa_indirecta_idToDestroy ? (
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

                                        {show_causa_indirecta_form && causa_indirecta_id === causaIndirecta.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitCausaIndirecta} id="causa-indirecta">
                                                <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                                    <div>
                                                        <Textarea
                                                            id="causa-directa-descripcion"
                                                            inputBackground="#fff"
                                                            disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                            error={form_causa_indirecta.errors.descripcion}
                                                            value={form_causa_indirecta.data.descripcion}
                                                            onChange={(e) => form_causa_indirecta.setData('descripcion', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </fieldset>

                                                {proyecto.allowed.to_update && (
                                                    <PrimaryButton disabled={form_causa_indirecta.processing} className="my-4 mr-2 relative" type="submit" form="causa-indirecta">
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
                                    <TooltipMui
                                        className="relative"
                                        title={<p>Al crear una causa indirecta se genera automáticamente la actividad en la sección de la derecha. Recuerde que ambos deben tener relación.</p>}>
                                        <ButtonMui
                                            primary={true}
                                            className="my-4 !ml-2 flex items-center justify-center"
                                            disabled={show_nueva_causa_indirecta_form ? true : undefined}
                                            type="Button"
                                            onClick={() => setNuevoCausaIndirecta(causaDirecta)}>
                                            <AddCircleOutlineOutlinedIcon className="mr-2" />
                                            <span>Añadir una causa indirecta</span>
                                        </ButtonMui>
                                    </TooltipMui>
                                </div>

                                {show_nueva_causa_indirecta_form && causa_directa_idNuevaIndirecta === causaDirecta.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitCausaIndirecta} id="causa-indirecta">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <div>
                                                <Textarea
                                                    id="causa-directa-descripcion"
                                                    inputBackground="#fff"
                                                    disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                    label="Escriba la nueva causa indirecta"
                                                    error={form_causa_indirecta.errors.descripcion}
                                                    value={form_causa_indirecta.data.descripcion}
                                                    onChange={(e) => form_causa_indirecta.setData('descripcion', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </fieldset>

                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={form_causa_indirecta.processing} className="my-4 mr-2 relative" type="submit" form="causa-indirecta">
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
                                {objetivo_especifico_id !== causaDirecta.objetivo_especifico?.id && (
                                    <div
                                        className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] pr-14"
                                        onClick={() => setObjetivoEspecifico(causaDirecta, causaDirecta.objetivo_especifico, i + 1)}>
                                        <p className="line-clamp-3">
                                            {causaDirecta.objetivo_especifico?.descripcion ? causaDirecta.objetivo_especifico?.descripcion : 'Por favor diligencie este objetivo específico.'}
                                        </p>
                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {show_objetivo_especifico_destroy_icon && causaDirecta.objetivo_especifico?.id === objetivo_especifico_id_to_destroy ? (
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
                                {show_objetivo_especifico_form && objetivo_especifico_id === causaDirecta.objetivo_especifico?.id && (
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
                                                        disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                        error={form_objetivo_especifico.errors.descripcion}
                                                        value={form_objetivo_especifico.data.descripcion}
                                                        onChange={(e) => form_objetivo_especifico.setData('descripcion', e.target.value)}
                                                        required
                                                    />
                                                </TooltipMui>
                                            </div>
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={form_objetivo_especifico.processing} className="my-4 mr-2 relative" type="submit" form="objetivo-especifico-form">
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
                                        {actividad_id !== causaIndirecta.actividad?.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                                onClick={() => setActividad(causaDirecta, causaIndirecta, causaIndirecta.actividad)}>
                                                <p className="line-clamp-3">{causaIndirecta.actividad?.descripcion ? causaIndirecta.actividad?.descripcion : 'Por favor diligencie esta actividad.'}</p>
                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {show_actividad_destroy_icon && causaIndirecta.actividad?.id === actividad_id_to_destroy ? (
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

                                        {show_actividad_form && actividad_id === causaIndirecta.actividad?.id && (
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
                                                                disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                                error={form_actividad.errors.descripcion}
                                                                value={form_actividad.data.descripcion}
                                                                onChange={(e) => form_actividad.setData('descripcion', e.target.value)}
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
                                                                option={resultados_filtrados}
                                                                selectedValue={form_actividad.data.resultado_id}
                                                                onChange={(event, newValue) => form_actividad.setData('resultado_id', newValue.value)}
                                                                error={errors.resultado_id}
                                                                placeholder="Seleccione un resultado"
                                                                required
                                                            />
                                                        </div>
                                                    ) : null}

                                                    <div className="ml-2 mt-4">
                                                        <div className={`mt-4 flex ${form_actividad.errors.fecha_inicio ? '' : 'items-center'}`}>
                                                            <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                                                            <div className="ml-14">
                                                                <DatePicker
                                                                    id="fecha_inicio"
                                                                    className="mt-1 block w-full p-4"
                                                                    inputBackground="#fff"
                                                                    minDate={proyecto.fecha_inicio}
                                                                    maxDate={proyecto.fecha_finalizacion}
                                                                    value={form_actividad.data.fecha_inicio}
                                                                    onChange={(e) => form_actividad.setData('fecha_inicio', e.target.value)}
                                                                    error={form_actividad.errors.fecha_inicio}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={`mt-4 flex ${form_actividad.errors.fecha_finalizacion ? '' : 'items-center'}`}>
                                                            <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                                                            <div className="ml-4">
                                                                <DatePicker
                                                                    id="fecha_finalizacion"
                                                                    className="mt-1 block w-full p-4"
                                                                    inputBackground="#fff"
                                                                    minDate={proyecto.fecha_inicio}
                                                                    maxDate={proyecto.fecha_finalizacion}
                                                                    value={form_actividad.data.fecha_finalizacion}
                                                                    onChange={(e) => form_actividad.setData('fecha_finalizacion', e.target.value)}
                                                                    error={form_actividad.errors.fecha_finalizacion}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>

                                                {proyecto.allowed.to_update && (
                                                    <PrimaryButton disabled={form_actividad.processing} className="my-4 mr-2 relative" type="submit" form="actividad-form">
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

                    {efectos_directos.map((efectoDirecto, i) => (
                        <React.Fragment key={i}>
                            <Grid item md={6} className="!my-20 shadow p-2" style={{ backgroundColor: '#e0dddd30' }}>
                                <small className="inline-block ml-2">Efecto directo</small>
                                {efecto_directo_id !== efectoDirecto.id && (
                                    <div
                                        className="bg-white relative p-4 rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                        onClick={() => setEfectoDirecto(efectoDirecto)}>
                                        <p className="line-clamp-3">{efectoDirecto.descripcion ? efectoDirecto.descripcion : 'Por favor diligencie este efecto directo.'}</p>
                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {show_efecto_directo_destroy_icon && efectoDirecto.id === efecto_directo_idToDestroy ? (
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
                                {show_efecto_directo_form && efecto_directo_id === efectoDirecto.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoDirecto} id="efecto-directo">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <Textarea
                                                id="efecto-directo-descripcion"
                                                inputBackground="#fff"
                                                disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                error={form_efecto_directo.errors.descripcion}
                                                value={form_efecto_directo.data.descripcion}
                                                onChange={(e) => form_efecto_directo.setData('descripcion', e.target.value)}
                                                required
                                            />
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={form_efecto_directo.processing} className="my-4 mr-2 relative" type="submit" form="efecto-directo">
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
                                        {efecto_indirecto_id !== efectoIndirecto.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                                onClick={() => setEfectoIndirecto(efectoDirecto, efectoIndirecto)}>
                                                <p className="line-clamp-3">{efectoIndirecto.descripcion ? efectoIndirecto.descripcion : 'Por favor diligencie este efecto indirecto.'}</p>
                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {show_efecto_indirecto_destroy_icon && efectoIndirecto.id === efecto_indirecto_idToDestroy ? (
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
                                        {show_efecto_indirecto_form && efecto_indirecto_id === efectoIndirecto.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoIndirecto} id="efecto-indirecto">
                                                <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                                    <div>
                                                        <Textarea
                                                            id="efecto-directo-descripcion"
                                                            inputBackground="#fff"
                                                            disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                            label="Escriba el nuevo efecto indirecto"
                                                            error={form_efecto_indirecto.errors.descripcion}
                                                            value={form_efecto_indirecto.data.descripcion}
                                                            onChange={(e) => form_efecto_indirecto.setData('descripcion', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </fieldset>
                                                {proyecto.allowed.to_update && (
                                                    <PrimaryButton disabled={form_efecto_indirecto.processing} className="my-4 mr-2 relative" type="submit" form="efecto-indirecto">
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
                                        disabled={showNuevo_efecto_indirecto_form ? true : undefined}
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
                                {showNuevo_efecto_indirecto_form && efecto_directo_id_nuevo_indirecto === efectoDirecto.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoIndirecto} id="efecto-indirecto">
                                        <fieldset className="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                            <div>
                                                <Textarea
                                                    id="efecto-directo-descripcion"
                                                    inputBackground="#fff"
                                                    disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                    label="Escriba el nuevo efecto indirecto"
                                                    error={form_efecto_indirecto.errors.descripcion}
                                                    value={form_efecto_indirecto.data.descripcion}
                                                    onChange={(e) => form_efecto_indirecto.setData('descripcion', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={form_efecto_indirecto.processing} className="my-4 mr-2 relative" type="submit" form="efecto-indirecto">
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
                                {resultado_id !== efectoDirecto.resultado?.id && (
                                    <div
                                        className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] pr-14"
                                        onClick={() => setResultado(efectoDirecto, efectoDirecto.resultado)}>
                                        <p className="line-clamp-3">{efectoDirecto.resultado?.descripcion ? efectoDirecto.resultado?.descripcion : 'Por favor diligencie este resultado.'}</p>
                                        <div className="absolute flex top-[40%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {show_resultado_destroy_icon && efectoDirecto.resultado?.id === resultado_id_to_destroy ? (
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
                                {show_resultado_form && resultado_id === efectoDirecto.resultado?.id && (
                                    <form className="relative form-arbol-objetivos" onSubmit={submitResultado} id="resultado-form">
                                        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                                            {objetivos_especificos.length === 0 ? (
                                                <AlertMui>Por favor genere primero los objetivos específicos.</AlertMui>
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
                                                                disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                                error={form_resultado.errors.descripcion}
                                                                value={form_resultado.data.descripcion}
                                                                onChange={(e) => form_resultado.setData('descripcion', e.target.value)}
                                                                required
                                                            />
                                                        </TooltipMui>
                                                    </div>
                                                    <div className="mt-10">
                                                        <AlertMui className="relative">Por seleccione un objetivo específico.</AlertMui>
                                                        <Autocomplete
                                                            id="objetivo-especifico"
                                                            inputBackground="#fff"
                                                            options={objetivos_especificos}
                                                            selectedValue={form_resultado.data.objetivo_especifico_id}
                                                            onChange={(event, newValue) => form_resultado.setData('objetivo_especifico_id', newValue.value)}
                                                            error={form_resultado.errors.objetivo_especifico_id}
                                                            autoComplete={false}
                                                            placeholder="Seleccione un objetivo específico"
                                                            required
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={form_resultado.processing} className="my-4 mr-2 relative" type="submit" form="resultado-form">
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
                                        {impacto_id !== efectoIndirecto.impacto?.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                                onClick={() => setImpacto(efectoIndirecto, efectoIndirecto.impacto)}>
                                                <p className="line-clamp-3">{efectoIndirecto.impacto?.descripcion ? efectoIndirecto.impacto?.descripcion : 'Por favor diligencie este impacto.'}</p>
                                                <div className="absolute flex top-[40%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {show_impacto_destroy_icon && efectoIndirecto.impacto?.id === impacto_id_to_destroy ? (
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

                                        {show_impacto_form && impacto_id === efectoIndirecto.impacto?.id && (
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
                                                                disabled={is_super_admin ? false : proyecto.codigo_linea_programatica === 70 ? true : false}
                                                                error={form_impacto.errors.descripcion}
                                                                value={form_impacto.data.descripcion}
                                                                onChange={(e) => form_impacto.setData('descripcion', e.target.value)}
                                                                required
                                                            />
                                                        </TooltipMui>
                                                    </div>

                                                    <div className="mt-8">
                                                        <Autocomplete
                                                            id="tipo-impacto"
                                                            inputBackground="#fff"
                                                            options={tipos_impacto}
                                                            selectedValue={form_impacto.data.tipo}
                                                            onChange={(event, newValue) => form_impacto.setData('tipo', newValue.value)}
                                                            error={form_impacto.errors.tipo}
                                                            label="Tipo de impacto"
                                                            required
                                                        />
                                                    </div>
                                                </fieldset>

                                                {proyecto.allowed.to_update && (
                                                    <PrimaryButton disabled={form_impacto.processing} className="my-4 mr-2 relative" type="submit" form="impacto-form">
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
