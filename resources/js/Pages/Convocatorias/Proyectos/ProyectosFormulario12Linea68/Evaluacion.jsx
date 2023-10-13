import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import Checkbox from '@/Components/Checkbox'
import DialogMui from '@/Components/Dialog'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Divider, Grid } from '@mui/material'

import React, { useEffect, useState } from 'react'

const Evaluacion = ({ convocatoria, evaluacion, allowed, proyecto, setDialogEvaluacionStatus, ...props }) => {
    const evaluacion_proyecto_formulario12_linea68 = evaluacion.evaluacion_proyecto_formulario12_linea68 ?? evaluacion

    const form = useForm({
        evaluacion_id: evaluacion?.id,
        clausula_confidencialidad: evaluacion?.clausula_confidencialidad ?? evaluacion?.evaluacion?.clausula_confidencialidad,
        titulo_puntaje: evaluacion_proyecto_formulario12_linea68?.titulo_puntaje,
        titulo_comentario: evaluacion_proyecto_formulario12_linea68?.titulo_comentario ? evaluacion_proyecto_formulario12_linea68?.titulo_comentario : '',
        titulo_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.titulo_comentario == null ? true : false,
        resumen_comentario: evaluacion_proyecto_formulario12_linea68?.resumen_comentario ? evaluacion_proyecto_formulario12_linea68?.resumen_comentario : '',
        resumen_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.resumen_comentario == null ? true : false,
        resumen_puntaje: evaluacion_proyecto_formulario12_linea68?.resumen_puntaje,
        antecedentes_comentario: evaluacion_proyecto_formulario12_linea68?.antecedentes_comentario ? evaluacion_proyecto_formulario12_linea68?.antecedentes_comentario : '',
        antecedentes_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.antecedentes_comentario == null ? true : false,
        antecedentes_puntaje: evaluacion_proyecto_formulario12_linea68?.antecedentes_puntaje,
        justificacion_problema_comentario: evaluacion_proyecto_formulario12_linea68?.justificacion_problema_comentario
            ? evaluacion_proyecto_formulario12_linea68?.justificacion_problema_comentario
            : '',
        justificacion_problema_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.justificacion_problema_comentario == null ? true : false,
        justificacion_problema_puntaje: evaluacion_proyecto_formulario12_linea68?.justificacion_problema_puntaje,
        pregunta_formulacion_problema_comentario: evaluacion_proyecto_formulario12_linea68?.pregunta_formulacion_problema_comentario
            ? evaluacion_proyecto_formulario12_linea68?.pregunta_formulacion_problema_comentario
            : '',
        pregunta_formulacion_problema_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.pregunta_formulacion_problema_comentario == null ? true : false,
        pregunta_formulacion_problema_puntaje: evaluacion_proyecto_formulario12_linea68?.pregunta_formulacion_problema_puntaje,
        propuesta_sostenibilidad_comentario: evaluacion_proyecto_formulario12_linea68?.propuesta_sostenibilidad_comentario
            ? evaluacion_proyecto_formulario12_linea68?.propuesta_sostenibilidad_comentario
            : '',
        propuesta_sostenibilidad_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.propuesta_sostenibilidad_comentario == null ? true : false,
        propuesta_sostenibilidad_puntaje: evaluacion_proyecto_formulario12_linea68?.propuesta_sostenibilidad_puntaje,
        identificacion_problema_comentario: evaluacion_proyecto_formulario12_linea68?.identificacion_problema_comentario
            ? evaluacion_proyecto_formulario12_linea68?.identificacion_problema_comentario
            : '',
        identificacion_problema_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.identificacion_problema_comentario == null ? true : false,
        identificacion_problema_puntaje: evaluacion_proyecto_formulario12_linea68?.identificacion_problema_puntaje,
        arbol_problemas_comentario: evaluacion_proyecto_formulario12_linea68?.arbol_problemas_comentario ? evaluacion_proyecto_formulario12_linea68?.arbol_problemas_comentario : '',
        arbol_problemas_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.arbol_problemas_comentario == null ? true : false,
        arbol_problemas_puntaje: evaluacion_proyecto_formulario12_linea68?.arbol_problemas_puntaje,
        arbol_objetivos_comentario: evaluacion_proyecto_formulario12_linea68?.arbol_objetivos_comentario ? evaluacion_proyecto_formulario12_linea68?.arbol_objetivos_comentario : '',
        arbol_objetivos_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.arbol_objetivos_comentario == null ? true : false,
        impacto_ambiental_puntaje: evaluacion_proyecto_formulario12_linea68?.impacto_ambiental_puntaje,
        impacto_ambiental_comentario: evaluacion_proyecto_formulario12_linea68?.impacto_ambiental_comentario ? evaluacion_proyecto_formulario12_linea68?.impacto_ambiental_comentario : '',
        impacto_ambiental_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.impacto_ambiental_comentario == null ? true : false,
        impacto_social_centro_puntaje: evaluacion_proyecto_formulario12_linea68?.impacto_social_centro_puntaje,
        impacto_social_centro_comentario: evaluacion_proyecto_formulario12_linea68?.impacto_social_centro_comentario ? evaluacion_proyecto_formulario12_linea68?.impacto_social_centro_comentario : '',
        impacto_social_centro_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.impacto_social_centro_comentario == null ? true : false,
        impacto_social_productivo_puntaje: evaluacion_proyecto_formulario12_linea68?.impacto_social_productivo_puntaje,
        impacto_social_productivo_comentario: evaluacion_proyecto_formulario12_linea68?.impacto_social_productivo_comentario
            ? evaluacion_proyecto_formulario12_linea68?.impacto_social_productivo_comentario
            : '',
        impacto_social_productivo_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.impacto_social_productivo_comentario == null ? true : false,
        impacto_tecnologico_puntaje: evaluacion_proyecto_formulario12_linea68?.impacto_tecnologico_puntaje,
        impacto_tecnologico_comentario: evaluacion_proyecto_formulario12_linea68?.impacto_tecnologico_comentario ? evaluacion_proyecto_formulario12_linea68?.impacto_tecnologico_comentario : '',
        impacto_tecnologico_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.impacto_tecnologico_comentario == null ? true : false,
        riesgos_objetivo_general_puntaje: evaluacion_proyecto_formulario12_linea68?.riesgos_objetivo_general_puntaje,
        riesgos_objetivo_general_comentario: evaluacion_proyecto_formulario12_linea68?.riesgos_objetivo_general_comentario
            ? evaluacion_proyecto_formulario12_linea68?.riesgos_objetivo_general_comentario
            : '',
        riesgos_objetivo_general_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.riesgos_objetivo_general_comentario == null ? true : false,
        riesgos_productos_puntaje: evaluacion_proyecto_formulario12_linea68?.riesgos_productos_puntaje,
        riesgos_productos_comentario: evaluacion_proyecto_formulario12_linea68?.riesgos_productos_comentario ? evaluacion_proyecto_formulario12_linea68?.riesgos_productos_comentario : '',
        riesgos_productos_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.riesgos_productos_comentario == null ? true : false,
        riesgos_actividades_puntaje: evaluacion_proyecto_formulario12_linea68?.riesgos_actividades_puntaje,
        riesgos_actividades_comentario: evaluacion_proyecto_formulario12_linea68?.riesgos_actividades_comentario ? evaluacion_proyecto_formulario12_linea68?.riesgos_actividades_comentario : '',
        riesgos_actividades_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.riesgos_actividades_comentario == null ? true : false,
        objetivo_general_puntaje: evaluacion_proyecto_formulario12_linea68?.objetivo_general_puntaje,
        metodologia_puntaje: evaluacion_proyecto_formulario12_linea68?.metodologia_puntaje,
        metodologia_comentario: evaluacion_proyecto_formulario12_linea68?.metodologia_comentario ? evaluacion_proyecto_formulario12_linea68?.metodologia_comentario : '',
        metodologia_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.metodologia_comentario == null ? true : false,
        resultados_comentario: evaluacion_proyecto_formulario12_linea68?.resultados_comentario ? evaluacion_proyecto_formulario12_linea68?.resultados_comentario : '',
        resultados_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.resultados_comentario == null ? true : false,
        resultados_puntaje: evaluacion_proyecto_formulario12_linea68?.resultados_puntaje,
        actividades_comentario: evaluacion_proyecto_formulario12_linea68?.actividades_comentario ? evaluacion_proyecto_formulario12_linea68?.actividades_comentario : '',
        actividades_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.actividades_comentario == null ? true : false,
        actividades_puntaje: evaluacion_proyecto_formulario12_linea68?.actividades_puntaje,
        productos_comentario: evaluacion_proyecto_formulario12_linea68?.productos_comentario ? evaluacion_proyecto_formulario12_linea68?.productos_comentario : '',
        productos_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.productos_comentario == null ? true : false,
        productos_puntaje: evaluacion_proyecto_formulario12_linea68?.productos_puntaje,
        objetivos_especificos_comentario: evaluacion_proyecto_formulario12_linea68?.objetivos_especificos_comentario ? evaluacion_proyecto_formulario12_linea68?.objetivos_especificos_comentario : '',
        objetivos_especificos_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.objetivos_especificos_comentario == null ? true : false,
        objetivos_especificos_puntaje: evaluacion_proyecto_formulario12_linea68?.objetivos_especificos_puntaje,
        video_comentario: evaluacion_proyecto_formulario12_linea68?.video_comentario ? evaluacion_proyecto_formulario12_linea68?.video_comentario : '',
        video_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.video_comentario == null ? true : false,
        especificaciones_area_comentario: evaluacion_proyecto_formulario12_linea68?.especificaciones_area_comentario ? evaluacion_proyecto_formulario12_linea68?.especificaciones_area_comentario : '',
        especificaciones_area_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.especificaciones_area_comentario == null ? true : false,
        ortografia_comentario: evaluacion_proyecto_formulario12_linea68?.ortografia_comentario ? evaluacion_proyecto_formulario12_linea68?.ortografia_comentario : '',
        ortografia_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.ortografia_comentario == null ? true : false,
        redaccion_comentario: evaluacion_proyecto_formulario12_linea68?.redaccion_comentario ? evaluacion_proyecto_formulario12_linea68?.redaccion_comentario : '',
        redaccion_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.redaccion_comentario == null ? true : false,
        normas_apa_comentario: evaluacion_proyecto_formulario12_linea68?.normas_apa_comentario ? evaluacion_proyecto_formulario12_linea68?.normas_apa_comentario : '',
        normas_apa_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.normas_apa_comentario == null ? true : false,
        anexos_comentario: evaluacion_proyecto_formulario12_linea68?.anexos_comentario ? evaluacion_proyecto_formulario12_linea68?.anexos_comentario : '',
        anexos_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.anexos_comentario == null ? true : false,
        bibliografia_comentario: evaluacion_proyecto_formulario12_linea68?.bibliografia_comentario ? evaluacion_proyecto_formulario12_linea68?.bibliografia_comentario : '',
        bibliografia_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.bibliografia_comentario == null ? true : false,
        inventario_equipos_comentario: evaluacion_proyecto_formulario12_linea68?.inventario_equipos_comentario ? evaluacion_proyecto_formulario12_linea68?.inventario_equipos_comentario : '',
        inventario_equipos_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.inventario_equipos_comentario == null ? true : false,
        objetivo_general_comentario: evaluacion_proyecto_formulario12_linea68?.objetivo_general_comentario ? evaluacion_proyecto_formulario12_linea68?.objetivo_general_comentario : '',
        objetivo_general_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.objetivo_general_comentario == null ? true : false,
        fecha_ejecucion_comentario: evaluacion_proyecto_formulario12_linea68?.fecha_ejecucion_comentario ? evaluacion_proyecto_formulario12_linea68?.fecha_ejecucion_comentario : '',
        fecha_ejecucion_requiere_comentario: evaluacion_proyecto_formulario12_linea68?.fecha_ejecucion_comentario == null ? true : false,
    })

    const submit = (e) => {
        e.preventDefault()

        if (allowed.to_update) {
            form.put(route('convocatorias.evaluaciones-formulario-12-linea-68.update', [convocatoria.id, evaluacion.id]), {
                onSuccess: () => setDialogEvaluacionStatus(false),
                preserveScroll: true,
            })
        }
    }

    const [evaluacion_rol_sennova, setEvaluacionRolSennova] = useState(null)
    const [dialog_evaluacion_rol_status, setDialogEvaluacionRolStatus] = useState(false)
    const form_evaluacion_rol = useForm({
        correcto: evaluacion_rol_sennova?.comentario == null ? true : false,
        comentario: evaluacion_rol_sennova?.comentario ? evaluacion_rol_sennova?.comentario : '',
    })

    useEffect(() => {
        if (evaluacion_rol_sennova) {
            const evaluacion_rol_sennova_seleccionado = evaluacion_rol_sennova.proyecto_roles_evaluaciones.find((evaluacion_rol) => evaluacion_rol.evaluacion_id == evaluacion.id)
            if (evaluacion_rol_sennova_seleccionado) {
                form_evaluacion_rol.setData({ correcto: evaluacion_rol_sennova_seleccionado.correcto, comentario: evaluacion_rol_sennova_seleccionado.comentario })
            }
        }
    }, [evaluacion_rol_sennova])

    const submitEvaluacionRol = (e) => {
        e.preventDefault()

        form_evaluacion_rol.put(route('convocatorias.evaluaciones.proyecto-rol-sennova.update', [convocatoria.id, evaluacion.id, evaluacion_rol_sennova.id]), {
            onSuccess: () => setDialogEvaluacionRolStatus(false),
            preserveScroll: true,
        })
    }

    const [evaluacion_rubro, setEvaluacionRubro] = useState(null)
    const [dialog_evaluacion_rubro_status, setDialogEvaluacionRubroStatus] = useState(false)
    const form_evaluacion_rubro = useForm({
        correcto: evaluacion_rubro?.comentario == null ? true : false,
        comentario: evaluacion_rubro?.comentario ? evaluacion_rubro?.comentario : '',
    })

    useEffect(() => {
        if (evaluacion_rubro) {
            const evaluacion_rubro_seleccionado = evaluacion_rubro.proyecto_presupuestos_evaluaciones.find((evaluacion_rubro) => evaluacion_rubro.evaluacion_id == evaluacion.id)
            if (evaluacion_rubro_seleccionado) {
                form_evaluacion_rubro.setData({ correcto: evaluacion_rubro_seleccionado.correcto, comentario: evaluacion_rubro_seleccionado.comentario })
            }
        }
    }, [evaluacion_rubro])

    const submitEvaluacionRubro = (e) => {
        e.preventDefault()

        form_evaluacion_rubro.put(route('convocatorias.evaluaciones.presupuesto.update', [convocatoria.id, evaluacion.id, evaluacion_rubro.id]), {
            onSuccess: () => setDialogEvaluacionRubroStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <>
            <form onSubmit={submit} className="space-y-10" id="form-evaluacion">
                <div>
                    <Divider className="!my-20 font-black">CLÁUSULA DE CONFIDENCIALIDAD</Divider>

                    <AlertMui severity={form.data.clausula_confidencialidad ? 'success' : 'error'}>
                        Por favor acepte la la cláusula de confidencialidad
                        <br />
                        <Checkbox
                            className="mt-8"
                            name="clausula_confidencialidad"
                            checked={form.data.clausula_confidencialidad}
                            error={form.errors.clausula_confidencialidad}
                            onChange={(e) => form.setData('clausula_confidencialidad', e.target.checked)}
                            label={form.data.clausula_confidencialidad ? 'He aceptado la cláusula de confidencialidad' : 'Acepto la cláusula de confidencialidad-'}
                        />
                    </AlertMui>
                </div>
                <div>
                    <Divider className="!my-20 font-black">TÍTULO</Divider>

                    <Label className="!mb-10" labelFor="titulo_puntaje" value="Puntaje (Máximo 4)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="titulo_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 4,
                        }}
                        value={form.data.titulo_puntaje}
                        onChange={(e) => form.setData('titulo_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.titulo_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0 a 4</strong> Debe corresponder al contenido del proyecto y responder a los siguientes interrogantes: ¿Qué se va a hacer?, ¿Sobre qué o quiénes se
                                hará?, ¿Cómo?, ¿Dónde se llevará a cabo? Tiene que estar escrito de manera breve y concisa. Un buen título describe con exactitud y usando el menor número posible de
                                palabras el tema central del proyecto.
                                <br />
                                Nota: las respuestas a las preguntas anteriormente formuladas no necesariamente deben responderse en mismo orden en el que aparecen. (Máximo 40 palabras)
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El título es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.titulo_requiere_comentario} onChange={(e) => form.setData('titulo_requiere_comentario', e.target.checked)} />
                        {form.data.titulo_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="titulo_comentario"
                                value={form.data.titulo_comentario}
                                error={form.errors.titulo_comentario}
                                onChange={(e) => form.setData('titulo_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">resumen_puntaje</Divider>

                    <Label className="!mb-10" labelFor="resumen_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="resumen_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.resumen_puntaje}
                        onChange={(e) => form.setData('resumen_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.resumen_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0 a 3</strong> Información necesaria para darle al lector una idea precisa de la pertinencia y calidad proyecto. Explique en qué consiste el problema o
                                necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto. Nota: El
                                resumen por lo general se construye al final de la contextualización con el fin de tener claros todos los puntos que intervinieron en la misma y poder dar a conocer de
                                forma más pertinente los por menores del proyecto. (Máximo 1000 caracteres).
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El resumen_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.resumen_requiere_comentario} onChange={(e) => form.setData('resumen_requiere_comentario', e.target.checked)} />
                        {form.data.resumen_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="resumen_comentario"
                                value={form.data.resumen_comentario}
                                error={form.errors.resumen_comentario}
                                onChange={(e) => form.setData('resumen_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">antecedentes_puntaje</Divider>

                    <Label className="!mb-10" labelFor="antecedentes_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="antecedentes_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.antecedentes_puntaje}
                        onChange={(e) => form.setData('antecedentes_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.antecedentes_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El antecedentes_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.antecedentes_requiere_comentario} onChange={(e) => form.setData('antecedentes_requiere_comentario', e.target.checked)} />
                        {form.data.antecedentes_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="antecedentes_comentario"
                                value={form.data.antecedentes_comentario}
                                error={form.errors.antecedentes_comentario}
                                onChange={(e) => form.setData('antecedentes_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">justificacion_problema_puntaje</Divider>

                    <Label className="!mb-10" labelFor="justificacion_problema_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="justificacion_problema_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.justificacion_problema_puntaje}
                        onChange={(e) => form.setData('justificacion_problema_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.justificacion_problema_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El justificacion_problema_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.justificacion_problema_requiere_comentario}
                            onChange={(e) => form.setData('justificacion_problema_requiere_comentario', e.target.checked)}
                        />
                        {form.data.justificacion_problema_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="justificacion_problema_comentario"
                                value={form.data.justificacion_problema_comentario}
                                error={form.errors.justificacion_problema_comentario}
                                onChange={(e) => form.setData('justificacion_problema_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">pregunta_formulacion_problema_puntaje</Divider>

                    <Label className="!mb-10" labelFor="pregunta_formulacion_problema_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="pregunta_formulacion_problema_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.pregunta_formulacion_problema_puntaje}
                        onChange={(e) => form.setData('pregunta_formulacion_problema_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.pregunta_formulacion_problema_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El pregunta_formulacion_problema_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.pregunta_formulacion_problema_requiere_comentario}
                            onChange={(e) => form.setData('pregunta_formulacion_problema_requiere_comentario', e.target.checked)}
                        />
                        {form.data.pregunta_formulacion_problema_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="pregunta_formulacion_problema_comentario"
                                value={form.data.pregunta_formulacion_problema_comentario}
                                error={form.errors.pregunta_formulacion_problema_comentario}
                                onChange={(e) => form.setData('pregunta_formulacion_problema_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">propuesta_sostenibilidad_puntaje</Divider>

                    <Label className="!mb-10" labelFor="propuesta_sostenibilidad_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="propuesta_sostenibilidad_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.propuesta_sostenibilidad_puntaje}
                        onChange={(e) => form.setData('propuesta_sostenibilidad_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.propuesta_sostenibilidad_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El propuesta_sostenibilidad_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.propuesta_sostenibilidad_requiere_comentario}
                            onChange={(e) => form.setData('propuesta_sostenibilidad_requiere_comentario', e.target.checked)}
                        />
                        {form.data.propuesta_sostenibilidad_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="propuesta_sostenibilidad_comentario"
                                value={form.data.propuesta_sostenibilidad_comentario}
                                error={form.errors.propuesta_sostenibilidad_comentario}
                                onChange={(e) => form.setData('propuesta_sostenibilidad_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">identificacion_problema_puntaje</Divider>

                    <Label className="!mb-10" labelFor="identificacion_problema_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="identificacion_problema_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.identificacion_problema_puntaje}
                        onChange={(e) => form.setData('identificacion_problema_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.identificacion_problema_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El identificacion_problema_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.identificacion_problema_requiere_comentario}
                            onChange={(e) => form.setData('identificacion_problema_requiere_comentario', e.target.checked)}
                        />
                        {form.data.identificacion_problema_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="identificacion_problema_comentario"
                                value={form.data.identificacion_problema_comentario}
                                error={form.errors.identificacion_problema_comentario}
                                onChange={(e) => form.setData('identificacion_problema_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">arbol_problemas_puntaje</Divider>

                    <Label className="!mb-10" labelFor="arbol_problemas_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="arbol_problemas_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.arbol_problemas_puntaje}
                        onChange={(e) => form.setData('arbol_problemas_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.arbol_problemas_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El arbol_problemas_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.arbol_problemas_requiere_comentario} onChange={(e) => form.setData('arbol_problemas_requiere_comentario', e.target.checked)} />
                        {form.data.arbol_problemas_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="arbol_problemas_comentario"
                                value={form.data.arbol_problemas_comentario}
                                error={form.errors.arbol_problemas_comentario}
                                onChange={(e) => form.setData('arbol_problemas_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">arbol_objetivos_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El arbol_objetivos_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.arbol_objetivos_requiere_comentario} onChange={(e) => form.setData('arbol_objetivos_requiere_comentario', e.target.checked)} />
                        {form.data.arbol_objetivos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="arbol_objetivos_comentario"
                                value={form.data.arbol_objetivos_comentario}
                                error={form.errors.arbol_objetivos_comentario}
                                onChange={(e) => form.setData('arbol_objetivos_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">impacto_ambiental_puntaje</Divider>

                    <Label className="!mb-10" labelFor="impacto_ambiental_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="impacto_ambiental_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.impacto_ambiental_puntaje}
                        onChange={(e) => form.setData('impacto_ambiental_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.impacto_ambiental_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El impacto_ambiental_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.impacto_ambiental_requiere_comentario}
                            onChange={(e) => form.setData('impacto_ambiental_requiere_comentario', e.target.checked)}
                        />
                        {form.data.impacto_ambiental_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="impacto_ambiental_comentario"
                                value={form.data.impacto_ambiental_comentario}
                                error={form.errors.impacto_ambiental_comentario}
                                onChange={(e) => form.setData('impacto_ambiental_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">impacto_social_centro_puntaje</Divider>

                    <Label className="!mb-10" labelFor="impacto_social_centro_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="impacto_social_centro_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.impacto_social_centro_puntaje}
                        onChange={(e) => form.setData('impacto_social_centro_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.impacto_social_centro_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El impacto_social_centro_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.impacto_social_centro_requiere_comentario}
                            onChange={(e) => form.setData('impacto_social_centro_requiere_comentario', e.target.checked)}
                        />
                        {form.data.impacto_social_centro_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="impacto_social_centro_comentario"
                                value={form.data.impacto_social_centro_comentario}
                                error={form.errors.impacto_social_centro_comentario}
                                onChange={(e) => form.setData('impacto_social_centro_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">impacto_social_productivo_puntaje</Divider>

                    <Label className="!mb-10" labelFor="impacto_social_productivo_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="impacto_social_productivo_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.impacto_social_productivo_puntaje}
                        onChange={(e) => form.setData('impacto_social_productivo_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.impacto_social_productivo_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El impacto_social_productivo_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.impacto_social_productivo_requiere_comentario}
                            onChange={(e) => form.setData('impacto_social_productivo_requiere_comentario', e.target.checked)}
                        />
                        {form.data.impacto_social_productivo_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="impacto_social_productivo_comentario"
                                value={form.data.impacto_social_productivo_comentario}
                                error={form.errors.impacto_social_productivo_comentario}
                                onChange={(e) => form.setData('impacto_social_productivo_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">impacto_tecnologico_puntaje</Divider>

                    <Label className="!mb-10" labelFor="impacto_tecnologico_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="impacto_tecnologico_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.impacto_tecnologico_puntaje}
                        onChange={(e) => form.setData('impacto_tecnologico_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.impacto_tecnologico_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El impacto_tecnologico_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.impacto_tecnologico_requiere_comentario}
                            onChange={(e) => form.setData('impacto_tecnologico_requiere_comentario', e.target.checked)}
                        />
                        {form.data.impacto_tecnologico_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="impacto_tecnologico_comentario"
                                value={form.data.impacto_tecnologico_comentario}
                                error={form.errors.impacto_tecnologico_comentario}
                                onChange={(e) => form.setData('impacto_tecnologico_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">riesgos_objetivo_general_puntaje</Divider>

                    <Label className="!mb-10" labelFor="riesgos_objetivo_general_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="riesgos_objetivo_general_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.riesgos_objetivo_general_puntaje}
                        onChange={(e) => form.setData('riesgos_objetivo_general_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.riesgos_objetivo_general_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El riesgos_objetivo_general_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.riesgos_objetivo_general_requiere_comentario}
                            onChange={(e) => form.setData('riesgos_objetivo_general_requiere_comentario', e.target.checked)}
                        />
                        {form.data.riesgos_objetivo_general_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="riesgos_objetivo_general_comentario"
                                value={form.data.riesgos_objetivo_general_comentario}
                                error={form.errors.riesgos_objetivo_general_comentario}
                                onChange={(e) => form.setData('riesgos_objetivo_general_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">riesgos_productos_puntaje</Divider>

                    <Label className="!mb-10" labelFor="riesgos_productos_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="riesgos_productos_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.riesgos_productos_puntaje}
                        onChange={(e) => form.setData('riesgos_productos_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.riesgos_productos_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El riesgos_productos_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.riesgos_productos_requiere_comentario}
                            onChange={(e) => form.setData('riesgos_productos_requiere_comentario', e.target.checked)}
                        />
                        {form.data.riesgos_productos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="riesgos_productos_comentario"
                                value={form.data.riesgos_productos_comentario}
                                error={form.errors.riesgos_productos_comentario}
                                onChange={(e) => form.setData('riesgos_productos_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">riesgos_actividades_puntaje</Divider>

                    <Label className="!mb-10" labelFor="riesgos_actividades_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="riesgos_actividades_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.riesgos_actividades_puntaje}
                        onChange={(e) => form.setData('riesgos_actividades_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.riesgos_actividades_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El riesgos_actividades_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.riesgos_actividades_requiere_comentario}
                            onChange={(e) => form.setData('riesgos_actividades_requiere_comentario', e.target.checked)}
                        />
                        {form.data.riesgos_actividades_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="riesgos_actividades_comentario"
                                value={form.data.riesgos_actividades_comentario}
                                error={form.errors.riesgos_actividades_comentario}
                                onChange={(e) => form.setData('riesgos_actividades_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">objetivo_general_puntaje</Divider>

                    <Label className="!mb-10" labelFor="objetivo_general_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="objetivo_general_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.objetivo_general_puntaje}
                        onChange={(e) => form.setData('objetivo_general_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.objetivo_general_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El objetivo_general_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.objetivo_general_requiere_comentario}
                            onChange={(e) => form.setData('objetivo_general_requiere_comentario', e.target.checked)}
                        />
                        {form.data.objetivo_general_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="objetivo_general_comentario"
                                value={form.data.objetivo_general_comentario}
                                error={form.errors.objetivo_general_comentario}
                                onChange={(e) => form.setData('objetivo_general_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">metodologia_puntaje</Divider>

                    <Label className="!mb-10" labelFor="metodologia_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="metodologia_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.metodologia_puntaje}
                        onChange={(e) => form.setData('metodologia_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.metodologia_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El metodologia_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.metodologia_requiere_comentario} onChange={(e) => form.setData('metodologia_requiere_comentario', e.target.checked)} />
                        {form.data.metodologia_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="metodologia_comentario"
                                value={form.data.metodologia_comentario}
                                error={form.errors.metodologia_comentario}
                                onChange={(e) => form.setData('metodologia_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">resultados_puntaje</Divider>

                    <Label className="!mb-10" labelFor="resultados_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="resultados_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.resultados_puntaje}
                        onChange={(e) => form.setData('resultados_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.resultados_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El resultados_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.resultados_requiere_comentario} onChange={(e) => form.setData('resultados_requiere_comentario', e.target.checked)} />
                        {form.data.resultados_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="resultados_comentario"
                                value={form.data.resultados_comentario}
                                error={form.errors.resultados_comentario}
                                onChange={(e) => form.setData('resultados_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">actividades_puntaje</Divider>

                    <Label className="!mb-10" labelFor="actividades_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="actividades_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.actividades_puntaje}
                        onChange={(e) => form.setData('actividades_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.actividades_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El actividades_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.actividades_requiere_comentario} onChange={(e) => form.setData('actividades_requiere_comentario', e.target.checked)} />
                        {form.data.actividades_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="actividades_comentario"
                                value={form.data.actividades_comentario}
                                error={form.errors.actividades_comentario}
                                onChange={(e) => form.setData('actividades_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">productos_puntaje</Divider>

                    <Label className="!mb-10" labelFor="productos_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="productos_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.productos_puntaje}
                        onChange={(e) => form.setData('productos_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.productos_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El productos_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.productos_requiere_comentario} onChange={(e) => form.setData('productos_requiere_comentario', e.target.checked)} />
                        {form.data.productos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="productos_comentario"
                                value={form.data.productos_comentario}
                                error={form.errors.productos_comentario}
                                onChange={(e) => form.setData('productos_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">objetivos_especificos_puntaje</Divider>

                    <Label className="!mb-10" labelFor="objetivos_especificos_puntaje" value="Puntaje (Máximo 3)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="objetivos_especificos_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 3,
                        }}
                        value={form.data.objetivos_especificos_puntaje}
                        onChange={(e) => form.setData('objetivos_especificos_puntaje', e.target.value)}
                        placeholder="Puntaje"
                        error={form.errors.objetivos_especificos_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li></li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El objetivos_especificos_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.objetivos_especificos_requiere_comentario}
                            onChange={(e) => form.setData('objetivos_especificos_requiere_comentario', e.target.checked)}
                        />
                        {form.data.objetivos_especificos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="objetivos_especificos_comentario"
                                value={form.data.objetivos_especificos_comentario}
                                error={form.errors.objetivos_especificos_comentario}
                                onChange={(e) => form.setData('objetivos_especificos_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">video_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El video_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.video_requiere_comentario} onChange={(e) => form.setData('video_requiere_comentario', e.target.checked)} />
                        {form.data.video_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="video_comentario"
                                value={form.data.video_comentario}
                                error={form.errors.video_comentario}
                                onChange={(e) => form.setData('video_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">especificaciones_area_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El especificaciones_area_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.especificaciones_area_requiere_comentario}
                            onChange={(e) => form.setData('especificaciones_area_requiere_comentario', e.target.checked)}
                        />
                        {form.data.especificaciones_area_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="especificaciones_area_comentario"
                                value={form.data.especificaciones_area_comentario}
                                error={form.errors.especificaciones_area_comentario}
                                onChange={(e) => form.setData('especificaciones_area_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">ortografia_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El ortografia_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.ortografia_requiere_comentario} onChange={(e) => form.setData('ortografia_requiere_comentario', e.target.checked)} />
                        {form.data.ortografia_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="ortografia_comentario"
                                value={form.data.ortografia_comentario}
                                error={form.errors.ortografia_comentario}
                                onChange={(e) => form.setData('ortografia_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">redaccion_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El redaccion_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.redaccion_requiere_comentario} onChange={(e) => form.setData('redaccion_requiere_comentario', e.target.checked)} />
                        {form.data.redaccion_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="redaccion_comentario"
                                value={form.data.redaccion_comentario}
                                error={form.errors.redaccion_comentario}
                                onChange={(e) => form.setData('redaccion_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">normas_apa_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El normas_apa_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.normas_apa_requiere_comentario} onChange={(e) => form.setData('normas_apa_requiere_comentario', e.target.checked)} />
                        {form.data.normas_apa_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="normas_apa_comentario"
                                value={form.data.normas_apa_comentario}
                                error={form.errors.normas_apa_comentario}
                                onChange={(e) => form.setData('normas_apa_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">anexos_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El anexos_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.anexos_requiere_comentario} onChange={(e) => form.setData('anexos_requiere_comentario', e.target.checked)} />
                        {form.data.anexos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="anexos_comentario"
                                value={form.data.anexos_comentario}
                                error={form.errors.anexos_comentario}
                                onChange={(e) => form.setData('anexos_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">bibliografia_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El bibliografia_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.bibliografia_requiere_comentario} onChange={(e) => form.setData('bibliografia_requiere_comentario', e.target.checked)} />
                        {form.data.bibliografia_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="bibliografia_comentario"
                                value={form.data.bibliografia_comentario}
                                error={form.errors.bibliografia_comentario}
                                onChange={(e) => form.setData('bibliografia_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">inventario_equipos_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El inventario_equipos_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.inventario_equipos_requiere_comentario}
                            onChange={(e) => form.setData('inventario_equipos_requiere_comentario', e.target.checked)}
                        />
                        {form.data.inventario_equipos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="inventario_equipos_comentario"
                                value={form.data.inventario_equipos_comentario}
                                error={form.errors.inventario_equipos_comentario}
                                onChange={(e) => form.setData('inventario_equipos_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">fecha_ejecucion_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El fecha_ejecucion_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.fecha_ejecucion_requiere_comentario} onChange={(e) => form.setData('fecha_ejecucion_requiere_comentario', e.target.checked)} />
                        {form.data.fecha_ejecucion_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="fecha_ejecucion_comentario"
                                value={form.data.fecha_ejecucion_comentario}
                                error={form.errors.fecha_ejecucion_comentario}
                                onChange={(e) => form.setData('fecha_ejecucion_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
            </form>

            <Divider className="!my-20 font-black">ROLES</Divider>
            <Grid container rowSpacing={2}>
                {proyecto.proyecto_roles_sennova.map((rol_sennova, i) => (
                    <Grid item md={3} key={i}>
                        <ButtonMui onClick={() => (form_evaluacion_rol.reset(), setDialogEvaluacionRolStatus(true), setEvaluacionRolSennova(rol_sennova))}>
                            Evaluar rol con código #{rol_sennova.id}
                        </ButtonMui>
                    </Grid>
                ))}
            </Grid>

            <Divider className="!my-20 font-black">RUBROS PRESUPUESTALES</Divider>
            <Grid container rowSpacing={2}>
                {proyecto.proyecto_presupuesto.map((rubro, i) => (
                    <Grid item md={3} key={i}>
                        <ButtonMui onClick={() => (form_evaluacion_rubro.reset(), setDialogEvaluacionRubroStatus(true), setEvaluacionRubro(rubro))}>
                            Evaluar rubro presupuestal con código #{rubro.id}
                        </ButtonMui>
                    </Grid>
                ))}
            </Grid>

            <DialogMui
                open={dialog_evaluacion_rol_status}
                dialogContent={
                    <form onSubmit={submitEvaluacionRol} id="test">
                        <Divider className="!mb-20 font-black">ROL - CÓDIGO #{evaluacion_rol_sennova?.id}</Divider>

                        <p>
                            ¿El rol es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form_evaluacion_rol.data.correcto} onChange={(e) => form_evaluacion_rol.setData('correcto', e.target.checked)} />
                        {form_evaluacion_rol.data.correcto == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="comentario"
                                value={form_evaluacion_rol.data.comentario}
                                error={form_evaluacion_rol.errors.comentario}
                                onChange={(e) => form_evaluacion_rol.setData('comentario', e.target.value)}
                                required
                            />
                        )}

                        <div className="mt-6 flex items-center justify-end">
                            <ButtonMui onClick={() => setDialogEvaluacionRolStatus(false)} className="!bg-transparent !text-app-700 !mr-2">
                                Cerrar
                            </ButtonMui>

                            <PrimaryButton disabled={form_evaluacion_rol.processing} type="submit">
                                Guardar
                            </PrimaryButton>
                        </div>
                    </form>
                }
            />

            <DialogMui
                open={dialog_evaluacion_rubro_status}
                dialogContent={
                    <form onSubmit={submitEvaluacionRubro} id="test">
                        <Divider className="!mb-20 font-black">RUBRO PRESUPUESTAL - CÓDIGO #{evaluacion_rubro?.id}</Divider>

                        <p>
                            ¿El rubro es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form_evaluacion_rubro.data.correcto} onChange={(e) => form_evaluacion_rubro.setData('correcto', e.target.checked)} />
                        {form_evaluacion_rubro.data.correcto == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="comentario"
                                value={form_evaluacion_rubro.data.comentario}
                                error={form_evaluacion_rubro.errors.comentario}
                                onChange={(e) => form_evaluacion_rubro.setData('comentario', e.target.value)}
                                required
                            />
                        )}

                        <div className="mt-6 flex items-center justify-end">
                            <ButtonMui onClick={() => setDialogEvaluacionRubroStatus(false)} className="!bg-transparent !text-app-700 !mr-2">
                                Cerrar
                            </ButtonMui>
                            <PrimaryButton disabled={form_evaluacion_rubro.processing} type="submit">
                                Guardar
                            </PrimaryButton>
                        </div>
                    </form>
                }
            />
        </>
    )
}

export default Evaluacion
