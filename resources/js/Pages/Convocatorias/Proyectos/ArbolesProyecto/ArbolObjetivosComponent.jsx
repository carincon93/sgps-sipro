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
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import EastOutlinedIcon from '@mui/icons-material/EastOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ShortcutIcon from '@mui/icons-material/Shortcut'

import React from 'react'
import { Divider, Grid } from '@mui/material'

const ArbolObjetivosComponent = ({ auth, convocatoria, proyecto, efectos_directos, causas_directas, tipos_impacto, resultados, objetivos_especificos, fase_evaluacion = false }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const is_proyecto_disabled = !proyecto?.allowed?.to_update

    const form_efecto_indirecto = useForm({
        id: null,
        efecto_directo_id: null,
        descripcion: '',
    })

    const [show_nuevo_efecto_indirecto_form, setShowNuevoEfectoIndirectoForm] = useState(false)
    const [efecto_directo_id_nuevo_indirecto, setEfectoDirectoIdNuevoIndirecto] = useState(null)

    const setNuevoEfectoIndirecto = (efecto_directo) => {
        setShowNuevoEfectoIndirectoForm(true)
        setShowEfectoIndirectoForm(false)
        setEfectoDirectoIdNuevoIndirecto(efecto_directo.id)

        form_efecto_indirecto.setData({
            id: null,
            efecto_directo_id: efecto_directo.id,
            descripcion: '',
        })
    }

    const sorted_efectos_directos = [...efectos_directos]

    sorted_efectos_directos.sort((a, b) => {
        const idA = a.resultado?.objetivo_especifico_id
        const idB = b.resultado?.objetivo_especifico_id

        if (idA < idB) {
            return -1
        }
        if (idA > idB) {
            return 1
        }
        return 0
    })

    const [show_efecto_indirecto_form, setShowEfectoIndirectoForm] = useState(false)
    const [efecto_indirecto_id, setEfectoIndirectoId] = useState(null)

    const setEfectoIndirecto = (efecto_directo, efecto_indirecto) => {
        // if (show_efecto_directo_form) {
        //     submitEfectoDirecto()
        // }

        if (!is_proyecto_disabled) {
            setShowEfectoIndirectoForm(true)
            setEfectoIndirectoId(efecto_indirecto.id)
        }

        form_efecto_indirecto.setData({
            id: efecto_indirecto.id,
            efecto_directo_id: efecto_directo.id,
            descripcion: efecto_indirecto.descripcion,
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
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    // Efecto Indirecto
    const [show_efecto_indirecto_destroy_icon, setShowEfectoIndirectoDestroyIcon] = useState(false)
    const [efecto_indirecto_id_to_destroy, setEfectoIndirectoIdToDestroy] = useState(null)

    const destroyEfectoIndirecto = (efecto_indirecto) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.efecto-indirecto.destroy', [proyecto.id, efecto_indirecto.id]), {
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

    const setEfectoDirecto = (efecto_directo) => {
        form_efecto_directo.reset()
        // if (show_efecto_indirecto_form) {
        //     submitEfectoIndirecto()
        // }

        if (!is_proyecto_disabled) {
            setShowEfectoDirectoForm(true)
            setEfectoDirectoId(efecto_directo.id)
        }

        form_efecto_directo.setData({
            id: efecto_directo.id,
            descripcion: efecto_directo.descripcion,
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
    const [efecto_directo_id_to_destroy, setEfectoDirectoIdToDestroy] = useState(null)

    const destroyEfectoDirecto = (efecto_directo) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.efecto-directo.destroy', [proyecto.id, efecto_directo.id]), {
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

    const setCausaDirecta = (causa_directa) => {
        form_causa_directa.reset()
        // if (show_efecto_indirecto_form) {
        //     submitEfectoIndirecto()
        // }

        if (!is_proyecto_disabled) {
            setShowCausaDirectaForm(true)
            setCausaDirectaId(causa_directa.id)
        }

        form_causa_directa.setData({
            id: causa_directa.id,
            descripcion: causa_directa.descripcion,
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
    const [causa_directa_id_to_destroy, setCausaDirectaIdToDestroy] = useState(null)

    const destroyCausaDirecta = (causa_directa) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.causa-directa.destroy', [proyecto.id, causa_directa.id]), {
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
    const [causa_directa_id_nueva_indirecta, setCausaDirectaIdNuevaIndirecta] = useState(null)

    const setNuevoCausaIndirecta = (causa_directa) => {
        form_causa_indirecta.reset()

        if (!is_proyecto_disabled) {
            setShowNuevaCausaIndirectaForm(true)
            setShowCausaIndirectaForm(false)
            setCausaDirectaIdNuevaIndirecta(causa_directa.id)
        }

        form_causa_indirecta.setData({
            causa_directa_id: causa_directa.id,
        })
    }

    const [show_causa_indirecta_form, setShowCausaIndirectaForm] = useState(false)
    const [causa_indirecta_id, setCausaIndirectaId] = useState(null)

    const setCausaIndirecta = (causa_directa, causa_indirecta) => {
        form_causa_indirecta.reset()
        // if (show_efecto_directo_form) {
        //     submitEfectoDirecto()
        // }

        if (!is_proyecto_disabled) {
            setShowCausaIndirectaForm(true)
            setCausaIndirectaId(causa_indirecta.id)
        }

        form_causa_indirecta.setData({
            id: causa_indirecta.id,
            descripcion: causa_indirecta.descripcion,
            causa_directa_id: causa_directa.id,
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
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    // Causa Indirecta
    const [show_causa_indirecta_destroy_icon, setShowCausaIndirectaDestroyIcon] = useState(false)
    const [causa_indirecta_id_to_destroy, setCausaIndirectaIdToDestroy] = useState(null)

    const destroyCausaIndirecta = (causa_indirecta) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('proyectos.causa-indirecta.destroy', [proyecto.id, causa_indirecta.id]), {
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

    const setImpacto = (efecto_indirecto, impacto) => {
        form_impacto.reset()
        // if (show_resultado_form) {
        //     submitResultado()
        // }

        if (!is_proyecto_disabled) {
            setShowImpactoForm(true)
            setImpactoId(impacto.id)
        }

        form_impacto.setData({
            id: impacto.id,
            efecto_indirecto_id: efecto_indirecto.id,
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

    const setResultado = (efecto_directo, resultado) => {
        form_resultado.reset()
        // if (show_impacto_form) {
        //     submitImpacto()
        // }

        if (!is_proyecto_disabled) {
            setShowResultadoForm(true)
            if (resultado) {
                setResultadoId(resultado.id)
            }
        }

        if (resultado) {
            form_resultado.setData({
                id: resultado.id,
                descripcion: resultado.descripcion,
                objetivo_especifico_id: resultado.objetivo_especifico_id,
            })
        }
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

    const setObjetivoEspecifico = (causa_directa, objetivoEspecifico, numero) => {
        form_objetivo_especifico.reset()
        // if (show_actividad_form) {
        //     submitActividad()
        // }

        if (!is_proyecto_disabled) {
            setShowObjetivoEspecificoForm(true)
            setObjetivoEspecificoId(objetivoEspecifico.id)
        }

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

    const setActividad = (causa_directa, causa_indirecta, actividad) => {
        form_actividad.reset()
        // if (show_objetivo_especifico_form) {
        //     submitObjetivoEspecifico()
        // }

        const resultados_por_objetivo = resultados.filter((item) => item.objetivo_especifico_id === actividad.objetivo_especifico_id)
        setResultadosFiltrados(resultados_por_objetivo.filter((item) => item.label != null))

        if (!is_proyecto_disabled) {
            setShowActividadForm(true)
            setActividadId(actividad.id)
        }

        form_actividad.setData({
            id: actividad.id,
            fecha_inicio: actividad.fecha_inicio,
            fecha_finalizacion: actividad.fecha_finalizacion,
            causa_indirecta_id: actividad.causa_indirecta_id,
            objetivo_especifico_id: causa_directa.objetivo_especifico.id,
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
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            {/* {is_super_admin || proyecto.mostrar_recomendaciones ? (
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
            ) : null} */}

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

                    {causas_directas.map((causa_directa, i) => (
                        <React.Fragment key={i}>
                            <Grid item md={6} className="!my-20 shadow p-2" style={{ backgroundColor: '#e0dddd30' }}>
                                <small className="inline-block ml-2">Causa directa #{i + 1}</small>
                                {causa_directa_id !== causa_directa.id && (
                                    <div
                                        className="bg-white relative p-4 rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                        onClick={() => setCausaDirecta(causa_directa)}>
                                        <p className="line-clamp-3">
                                            {causa_directa.descripcion ? (
                                                causa_directa.descripcion
                                            ) : (
                                                <span className="text-red-500 bg-red-100 p-1 rounded">Por favor diligencie esta causa directa</span>
                                            )}
                                        </p>

                                        <DoubleArrowIcon className="absolute right-[-23px] top-[50%]" />

                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {show_causa_directa_destroy_icon && causa_directa.id === causa_directa_id_to_destroy ? (
                                                <>
                                                    <TooltipMui className="relative" title="Confirmar la eliminación del ítem">
                                                        <DeleteForeverOutlined
                                                            className="w-5 h-5 hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                destroyCausaDirecta(causa_directa)
                                                            }}
                                                        />
                                                    </TooltipMui>
                                                    <ArrowRightAltIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowCausaDirectaDestroyIcon(false)
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                !is_proyecto_disabled && (
                                                    <>
                                                        <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setCausaDirecta(causa_directa)} />
                                                        <DeleteOutlineIcon
                                                            className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setShowCausaDirectaDestroyIcon(true)
                                                                setCausaDirectaIdToDestroy(causa_directa.id)
                                                            }}
                                                        />
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                                {show_causa_directa_form && causa_directa_id === causa_directa.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitCausaDirecta} id="causa-directa">
                                        <fieldset className="relative">
                                            <Textarea
                                                id="causa-directa-descripcion"
                                                inputBackground="#fff"
                                                disabled={is_proyecto_disabled}
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
                                <Divider>
                                    <small>Causas indirectas</small>
                                </Divider>
                                {causa_directa.causas_indirectas.map((causa_indirecta, j) => (
                                    <React.Fragment key={j}>
                                        {causa_indirecta_id !== causa_indirecta.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                                onClick={() => setCausaIndirecta(causa_directa, causa_indirecta)}>
                                                <p className="line-clamp-3">
                                                    {causa_indirecta.descripcion ? (
                                                        causa_indirecta.descripcion
                                                    ) : (
                                                        <span className="text-red-500 bg-red-100 p-1 rounded">Por favor diligencie esta causa indirecta.</span>
                                                    )}
                                                </p>

                                                <DoubleArrowIcon className="absolute right-[-23px] top-[50%]" />

                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {show_causa_indirecta_destroy_icon && causa_indirecta.id === causa_indirecta_id_to_destroy ? (
                                                        <>
                                                            <TooltipMui className="relative" title="Confirmar la eliminación del ítem">
                                                                <DeleteForeverOutlined
                                                                    className="w-5 h-5 hover:cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        destroyCausaIndirecta(causa_indirecta)
                                                                    }}
                                                                />
                                                            </TooltipMui>

                                                            <ArrowRightAltIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowCausaIndirectaDestroyIcon(false)
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        !is_proyecto_disabled && (
                                                            <>
                                                                <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setCausaIndirecta(causa_directa, causa_indirecta)} />
                                                                <DeleteOutlineIcon
                                                                    className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setShowCausaIndirectaDestroyIcon(true)
                                                                        setCausaIndirectaIdToDestroy(causa_indirecta.id)
                                                                    }}
                                                                />
                                                            </>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {show_causa_indirecta_form && causa_indirecta_id === causa_indirecta.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitCausaIndirecta} id="causa-indirecta">
                                                <fieldset className="relative">
                                                    <div>
                                                        <Textarea
                                                            id="causa-directa-descripcion"
                                                            inputBackground="#fff"
                                                            disabled={is_proyecto_disabled}
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
                                {causa_directa.causas_indirectas.length == 0 && (
                                    <AlertMui severity="error" className="my-3">
                                        Debe generar una causa indirecta
                                    </AlertMui>
                                )}
                                <div className="flex items-center justify-end">
                                    <TooltipMui
                                        className="relative"
                                        title={<p>Al crear una causa indirecta se genera automáticamente la actividad en la sección de la derecha. Recuerde que ambos deben tener relación.</p>}>
                                        <ButtonMui
                                            primary={true}
                                            className="my-4 !ml-2 flex items-center justify-center"
                                            disabled={is_proyecto_disabled ? true : show_nueva_causa_indirecta_form}
                                            type="Button"
                                            onClick={() => setNuevoCausaIndirecta(causa_directa)}>
                                            <AddCircleOutlineOutlinedIcon className="mr-2" />
                                            <span>Añadir una causa indirecta</span>
                                        </ButtonMui>
                                    </TooltipMui>
                                </div>
                                {show_nueva_causa_indirecta_form && causa_directa_id_nueva_indirecta === causa_directa.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitCausaIndirecta} id="causa-indirecta">
                                        <fieldset className="relative">
                                            <div>
                                                <Textarea
                                                    id="causa-directa-descripcion"
                                                    inputBackground="#fff"
                                                    disabled={is_proyecto_disabled}
                                                    label="Escriba la nueva causa indirecta"
                                                    error={form_causa_indirecta.errors.descripcion}
                                                    value={form_causa_indirecta.data.descripcion}
                                                    onChange={(e) => form_causa_indirecta.setData('descripcion', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </fieldset>

                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={form_causa_indirecta.processing || is_proyecto_disabled} className="my-4 mr-2 relative" type="submit" form="causa-indirecta">
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
                                {objetivo_especifico_id !== causa_directa.objetivo_especifico?.id && (
                                    <div
                                        className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] pr-14"
                                        onClick={() => setObjetivoEspecifico(causa_directa, causa_directa.objetivo_especifico, i + 1)}>
                                        <p className="line-clamp-3">
                                            {causa_directa.objetivo_especifico?.descripcion ? (
                                                causa_directa.objetivo_especifico?.descripcion
                                            ) : (
                                                <span className="text-red-500 bg-red-100 p-1 rounded">Por favor diligencie este objetivo específico.</span>
                                            )}
                                        </p>
                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {show_objetivo_especifico_destroy_icon && causa_directa.objetivo_especifico?.id === objetivo_especifico_id_to_destroy ? (
                                                <>
                                                    <TooltipMui className="relative" title="Confirmar la eliminación del ítem">
                                                        <DeleteForeverOutlined
                                                            className="w-5 h-5 hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                destroyObjetivoEspecifico(causa_directa.objetivo_especifico)
                                                            }}
                                                        />
                                                    </TooltipMui>

                                                    <ArrowRightAltIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowObjetivoEspecificoDestroyIcon(false)
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                !is_proyecto_disabled && (
                                                    <>
                                                        <EditOutlinedIcon
                                                            className="w-5 h-5 hover:cursor-pointer"
                                                            onClick={() => setObjetivoEspecifico(causa_directa, causa_directa.objetivo_especifico, i + 1)}
                                                        />
                                                        <DeleteOutlineIcon
                                                            className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setShowObjetivoEspecificoDestroyIcon(true)
                                                                setObjetivoEspecificoIdToDestroy(causa_directa.objetivo_especifico?.id)
                                                            }}
                                                        />
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                                {show_objetivo_especifico_form && objetivo_especifico_id === causa_directa.objetivo_especifico?.id && (
                                    <form className="relative form-arbol-objetivos" onSubmit={submitObjetivoEspecifico} id="objetivo-especifico-form">
                                        <fieldset className="relative">
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
                                                        disabled={is_proyecto_disabled}
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
                                <Divider className="!mt-4">
                                    <small>Actividades</small>
                                </Divider>

                                {causa_directa.causas_indirectas.map((causa_indirecta, j) => (
                                    <div key={j}>
                                        {actividad_id !== causa_indirecta.actividad?.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                                onClick={() => setActividad(causa_directa, causa_indirecta, causa_indirecta.actividad)}>
                                                <p className="line-clamp-3">
                                                    {causa_indirecta.actividad?.descripcion ? (
                                                        causa_indirecta.actividad?.descripcion
                                                    ) : (
                                                        <span className="text-red-500 bg-red-100 p-1 rounded">Por favor diligencie esta actividad.</span>
                                                    )}
                                                </p>
                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {show_actividad_destroy_icon && causa_indirecta.actividad?.id === actividad_id_to_destroy ? (
                                                        <>
                                                            <TooltipMui className="relative" title="Confirmar la eliminación del ítem">
                                                                <DeleteForeverOutlined
                                                                    className="w-5 h-5 hover:cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        destroyActividad(causa_indirecta.actividad)
                                                                    }}
                                                                />
                                                            </TooltipMui>

                                                            <ArrowRightAltIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowActividadDestroyIcon(false)
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        !is_proyecto_disabled && (
                                                            <>
                                                                <EditOutlinedIcon
                                                                    className="w-5 h-5 hover:cursor-pointer"
                                                                    onClick={() => setActividad(causa_directa, causa_indirecta, causa_indirecta.actividad)}
                                                                />
                                                                <DeleteOutlineIcon
                                                                    className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setShowActividadDestroyIcon(true)
                                                                        setActividadIdToDestroy(causa_indirecta.actividad?.id)
                                                                    }}
                                                                />
                                                            </>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {show_actividad_form && actividad_id === causa_indirecta.actividad?.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitActividad} id="actividad-form">
                                                <fieldset className="relative">
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
                                                                disabled={is_proyecto_disabled}
                                                                error={form_actividad.errors.descripcion}
                                                                value={form_actividad.data.descripcion}
                                                                onChange={(e) => form_actividad.setData('descripcion', e.target.value)}
                                                                required
                                                            />
                                                        </TooltipMui>
                                                    </div>

                                                    {/* {proyecto.tipo_formulario_convocatoria_id == 5 || proyecto.tipo_formulario_convocatoria_id == 4 ? (
                                                        <div>
                                                            <Label required labelFor="resultado_id" value="Resultado" />
                                                            <Autocomplete
                                                                id="resultado_id"
                                                                inputBackground="#fff"
                                                                option={resultados_filtrados}
                                                                selectedValue={form_actividad.data.resultado_id}
                                                                onChange={(event, newValue) => form_actividad.setData('resultado_id', newValue.value)}
                                                                error={form_actividad.errors.resultado_id}
                                                                placeholder="Seleccione un resultado"
                                                                required
                                                            />
                                                        </div>
                                                    ) : null} */}

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
                                {causa_directa.causas_indirectas.length == 0 && (
                                    <AlertMui severity="error" className="mt-3">
                                        Debe generar una causa indirecta
                                    </AlertMui>
                                )}
                            </Grid>
                        </React.Fragment>
                    ))}

                    <PrimaryButton className="mt-4 mb-20 mx-auto flex items-center justify-center" onClick={() => newCausaDirecta()} disabled={is_proyecto_disabled}>
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
                    {sorted_efectos_directos.map((efecto_directo, i) => (
                        <React.Fragment key={i}>
                            <Grid item md={6} className="!my-20 shadow p-2" style={{ backgroundColor: '#e0dddd30' }}>
                                <small className="inline-block ml-2">Efecto directo #{i + 1}</small>
                                {efecto_directo_id !== efecto_directo.id && (
                                    <div
                                        className="bg-white relative p-4 rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                        onClick={() => setEfectoDirecto(efecto_directo)}>
                                        <p className="line-clamp-3">
                                            {efecto_directo.descripcion ? (
                                                efecto_directo.descripcion
                                            ) : (
                                                <span className="text-red-500 bg-red-100 p-1 rounded">Por favor diligencie este efecto directo.</span>
                                            )}
                                        </p>

                                        <DoubleArrowIcon className="absolute right-[-23px] top-[50%]" />

                                        <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {show_efecto_directo_destroy_icon && efecto_directo.id === efecto_directo_id_to_destroy ? (
                                                <>
                                                    <TooltipMui className="relative" title="Confirmar la eliminación del ítem">
                                                        <DeleteForeverOutlined
                                                            className="w-5 h-5 hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                destroyEfectoDirecto(efecto_directo)
                                                            }}
                                                        />
                                                    </TooltipMui>

                                                    <ArrowRightAltIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowEfectoDirectoDestroyIcon(false)
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                !is_proyecto_disabled && (
                                                    <>
                                                        <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setEfectoDirecto(efecto_directo)} />
                                                        <DeleteOutlineIcon
                                                            className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setShowEfectoDirectoDestroyIcon(true)
                                                                setEfectoDirectoIdToDestroy(efecto_directo.id)
                                                            }}
                                                        />
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                                {show_efecto_directo_form && efecto_directo_id === efecto_directo.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoDirecto} id="efecto-directo">
                                        <fieldset className="relative">
                                            <Textarea
                                                id="efecto-directo-descripcion"
                                                inputBackground="#fff"
                                                disabled={is_proyecto_disabled}
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
                                <Divider>
                                    <small>Efectos indirectos</small>
                                </Divider>
                                {efecto_directo.efectos_indirectos.map((efecto_indirecto, j) => (
                                    <div key={j}>
                                        {efecto_indirecto_id !== efecto_indirecto.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                                onClick={() => setEfectoIndirecto(efecto_directo, efecto_indirecto)}>
                                                <p className="line-clamp-3">
                                                    {efecto_indirecto.descripcion ? (
                                                        efecto_indirecto.descripcion
                                                    ) : (
                                                        <span className="text-red-500 bg-red-100 p-1 rounded">Por favor diligencie este efecto indirecto.</span>
                                                    )}
                                                </p>

                                                <DoubleArrowIcon className="absolute right-[-23px] top-[50%]" />

                                                <div className="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {show_efecto_indirecto_destroy_icon && efecto_indirecto.id === efecto_indirecto_id_to_destroy ? (
                                                        <>
                                                            <TooltipMui className="relative" title="Confirmar la eliminación del ítem">
                                                                <DeleteForeverOutlined
                                                                    className="w-5 h-5 hover:cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        destroyEfectoIndirecto(efecto_indirecto)
                                                                    }}
                                                                />
                                                            </TooltipMui>

                                                            <ArrowRightAltIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowEfectoIndirectoDestroyIcon(false)
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        !is_proyecto_disabled && (
                                                            <>
                                                                <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setEfectoIndirecto(efecto_directo, efecto_indirecto)} />
                                                                <DeleteOutlineIcon
                                                                    className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setShowEfectoIndirectoDestroyIcon(true)
                                                                        setEfectoIndirectoIdToDestroy(efecto_indirecto.id)
                                                                    }}
                                                                />
                                                            </>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {show_efecto_indirecto_form && efecto_indirecto_id === efecto_indirecto.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoIndirecto} id="efecto-indirecto">
                                                <fieldset className="relative">
                                                    <div>
                                                        <Textarea
                                                            id="efecto-directo-descripcion"
                                                            inputBackground="#fff"
                                                            disabled={is_proyecto_disabled}
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

                                {efecto_directo.efectos_indirectos.length == 0 && (
                                    <AlertMui severity="error" className="my-3">
                                        Debe generar un efecto indirecto
                                    </AlertMui>
                                )}

                                <div className="flex items-center justify-end">
                                    <ButtonMui
                                        primary={true}
                                        className="my-4 !ml-2 flex items-center justify-center"
                                        disabled={is_proyecto_disabled ? true : show_nuevo_efecto_indirecto_form}
                                        type="Button"
                                        onClick={() => setNuevoEfectoIndirecto(efecto_directo)}>
                                        <TooltipMui
                                            className="relative"
                                            title={<p>Al crear un efecto indirecto se genera automáticamente el impacto en la sección de la derecha. Ambos deben tener relación.</p>}>
                                            <AddCircleOutlineOutlinedIcon className="mr-2" />
                                            <span>Añadir un efecto indirecto</span>
                                        </TooltipMui>
                                    </ButtonMui>
                                </div>
                                {show_nuevo_efecto_indirecto_form && efecto_directo_id_nuevo_indirecto === efecto_directo.id && (
                                    <form className="relative form-arbol-objetivos mt-4" onSubmit={submitEfectoIndirecto} id="efecto-indirecto">
                                        <fieldset className="relative">
                                            <div>
                                                <Textarea
                                                    id="efecto-directo-descripcion"
                                                    inputBackground="#fff"
                                                    disabled={is_proyecto_disabled}
                                                    label="Escriba el nuevo efecto indirecto"
                                                    error={form_efecto_indirecto.errors.descripcion}
                                                    value={form_efecto_indirecto.data.descripcion}
                                                    onChange={(e) => form_efecto_indirecto.setData('descripcion', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </fieldset>
                                        {proyecto.allowed.to_update && (
                                            <PrimaryButton disabled={form_efecto_indirecto.processing || is_proyecto_disabled} className="my-4 mr-2 relative" type="submit" form="efecto-indirecto">
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
                                <small className="inline-block ml-2 mb-4">
                                    Resultado {efecto_directo.resultado?.objetivo_especifico?.numero ? `del objetivo específico #${efecto_directo.resultado?.objetivo_especifico?.numero}` : ''}
                                </small>
                                {efecto_directo.resultado && resultado_id !== efecto_directo.resultado?.id ? (
                                    <div
                                        className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] pr-14"
                                        onClick={() => setResultado(efecto_directo, efecto_directo.resultado)}>
                                        <p className="line-clamp-3">
                                            {efecto_directo.resultado?.descripcion ? (
                                                efecto_directo.resultado?.descripcion
                                            ) : (
                                                <span className="text-red-500 bg-red-100 p-1 rounded">Por favor diligencie este resultado.</span>
                                            )}
                                        </p>
                                        <div className="absolute flex top-[40%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                            {show_resultado_destroy_icon && efecto_directo.resultado?.id === resultado_id_to_destroy ? (
                                                <>
                                                    <TooltipMui className="relative" title="Confirmar la eliminación del ítem">
                                                        <DeleteForeverOutlined
                                                            className="w-5 h-5 hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                destroyResultado(efecto_directo.resultado)
                                                            }}
                                                        />
                                                    </TooltipMui>

                                                    <ArrowRightAltIcon
                                                        className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowResultadoDestroyIcon(false)
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                !is_proyecto_disabled && (
                                                    <>
                                                        <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setResultado(efecto_directo, efecto_directo.resultado)} />
                                                        <DeleteOutlineIcon
                                                            className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setShowResultadoDestroyIcon(true)
                                                                setResultadoIdToDestroy(efecto_directo.resultado?.id)
                                                            }}
                                                        />
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {!show_resultado_form && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] pr-14"
                                                onClick={() =>
                                                    router.post(route('proyectos.new-resultado', [proyecto.id, efecto_directo.id]), [], {
                                                        preserveScroll: true,
                                                    })
                                                }>
                                                <span className="text-green-600 bg-green-100 p-1 rounded flex items-center hover:cursor-pointer">
                                                    <AddCircleOutlineOutlinedIcon className="mr-1" />
                                                    Crear resultado
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                                {show_resultado_form && resultado_id === efecto_directo.resultado?.id && (
                                    <form className="relative form-arbol-objetivos" onSubmit={submitResultado} id="resultado-form">
                                        <fieldset>
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
                                                                disabled={is_proyecto_disabled}
                                                                error={form_resultado.errors.descripcion}
                                                                value={form_resultado.data.descripcion}
                                                                onChange={(e) => form_resultado.setData('descripcion', e.target.value)}
                                                                placeholder="Descripción del resultado"
                                                                required
                                                            />
                                                        </TooltipMui>
                                                    </div>
                                                    <div className="mt-10">
                                                        <Autocomplete
                                                            id="objetivo-especifico"
                                                            inputBackground="#fff"
                                                            options={objetivos_especificos}
                                                            selectedValue={form_resultado.data.objetivo_especifico_id}
                                                            onChange={(event, newValue) => form_resultado.setData('objetivo_especifico_id', newValue.value)}
                                                            error={form_resultado.errors.objetivo_especifico_id}
                                                            autoComplete={false}
                                                            label="Seleccione un objetivo específico"
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
                                <Divider className="!mt-4">
                                    <small>Impactos</small>
                                </Divider>

                                {efecto_directo.efectos_indirectos.map((efecto_indirecto, j) => (
                                    <div key={j}>
                                        {impacto_id !== efecto_indirecto.impacto?.id && (
                                            <div
                                                className="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[108px] max-h-[108px] my-4 pr-14"
                                                onClick={() => setImpacto(efecto_indirecto, efecto_indirecto.impacto)}>
                                                <p className="line-clamp-3">
                                                    {efecto_indirecto.impacto?.descripcion ? (
                                                        efecto_indirecto.impacto?.descripcion
                                                    ) : (
                                                        <span className="text-red-500 bg-red-100 p-1 rounded">Por favor diligencie este impacto.</span>
                                                    )}
                                                </p>
                                                <div className="absolute flex top-[40%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                                    {show_impacto_destroy_icon && efecto_indirecto.impacto?.id === impacto_id_to_destroy ? (
                                                        <>
                                                            <TooltipMui className="relative" title="Confirmar la eliminación del ítem">
                                                                <DeleteForeverOutlined
                                                                    className="w-5 h-5 hover:cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        destroyImpacto(efecto_indirecto.impacto)
                                                                    }}
                                                                />
                                                            </TooltipMui>

                                                            <ArrowRightAltIcon
                                                                className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setShowImpactoDestroyIcon(false)
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        !is_proyecto_disabled && (
                                                            <>
                                                                <EditOutlinedIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => setImpacto(efecto_indirecto, efecto_indirecto.impacto)} />
                                                                <DeleteOutlineIcon
                                                                    className="ml-2 w-5 h-5 hover:cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setShowImpactoDestroyIcon(true)
                                                                        setImpactoIdToDestroy(efecto_indirecto.impacto?.id)
                                                                    }}
                                                                />
                                                            </>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {show_impacto_form && impacto_id === efecto_indirecto.impacto?.id && (
                                            <form className="relative form-arbol-objetivos mt-4" onSubmit={submitImpacto} id="impacto-form">
                                                <fieldset>
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
                                                                disabled={is_proyecto_disabled}
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

                                {efecto_directo.efectos_indirectos.length == 0 && (
                                    <AlertMui severity="error" className="my-3">
                                        Debe generar un efecto indirecto
                                    </AlertMui>
                                )}
                            </Grid>
                        </React.Fragment>
                    ))}
                    <PrimaryButton className="mt-4 mb-20 mx-auto flex items-center justify-center" onClick={() => newEfectoDirecto()} disabled={is_proyecto_disabled}>
                        <AddCircleOutlineOutlinedIcon className="mr-2" />
                        Añadir efecto directo <EastOutlinedIcon className="mx-2" /> Resultado
                    </PrimaryButton>
                </Grid>
            </div>
        </>
    )
}

export default ArbolObjetivosComponent
