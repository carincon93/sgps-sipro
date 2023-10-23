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
    const evaluacion_proyecto_formulario7_linea23 = evaluacion.evaluacion_proyecto_formulario7_linea23 ?? evaluacion

    const form = useForm({
        evaluacion_id: evaluacion?.id,
        clausula_confidencialidad: evaluacion?.clausula_confidencialidad ?? evaluacion?.evaluacion?.clausula_confidencialidad,
        titulo_puntaje: evaluacion_proyecto_formulario7_linea23?.titulo_puntaje,
        titulo_comentario: evaluacion_proyecto_formulario7_linea23?.titulo_comentario ? evaluacion_proyecto_formulario7_linea23?.titulo_comentario : '',
        titulo_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.titulo_comentario == null ? true : false,
        entidad_aliada_puntaje: evaluacion_proyecto_formulario7_linea23?.entidad_aliada_puntaje,
        video_puntaje: evaluacion_proyecto_formulario7_linea23?.video_puntaje,
        video_comentario: evaluacion_proyecto_formulario7_linea23?.video_comentario ? evaluacion_proyecto_formulario7_linea23?.video_comentario : '',
        video_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.video_comentario == null ? true : false,

        entidad_aliada_comentario: evaluacion_proyecto_formulario7_linea23?.entidad_aliada_comentario ? evaluacion_proyecto_formulario7_linea23?.entidad_aliada_comentario : '',
        entidad_aliada_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.entidad_aliada_comentario == null ? true : false,

        resumen_puntaje: evaluacion_proyecto_formulario7_linea23?.resumen_puntaje,
        resumen_comentario: evaluacion_proyecto_formulario7_linea23?.resumen_comentario ? evaluacion_proyecto_formulario7_linea23?.resumen_comentario : '',
        resumen_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.resumen_comentario == null ? true : false,
        problema_central_puntaje: evaluacion_proyecto_formulario7_linea23?.problema_central_puntaje,
        problema_central_comentario: evaluacion_proyecto_formulario7_linea23?.problema_central_comentario ? evaluacion_proyecto_formulario7_linea23?.problema_central_comentario : '',
        problema_central_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.problema_central_comentario == null ? true : false,
        resultados_puntaje: evaluacion_proyecto_formulario7_linea23?.resultados_puntaje,
        resultados_comentario: evaluacion_proyecto_formulario7_linea23?.resultados_comentario ? evaluacion_proyecto_formulario7_linea23?.resultados_comentario : '',
        resultados_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.resultados_comentario == null ? true : false,
        objetivos_puntaje: evaluacion_proyecto_formulario7_linea23?.objetivos_puntaje,
        objetivos_comentario: evaluacion_proyecto_formulario7_linea23?.objetivos_comentario ? evaluacion_proyecto_formulario7_linea23?.objetivos_comentario : '',
        objetivos_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.objetivos_comentario == null ? true : false,
        metodologia_puntaje: evaluacion_proyecto_formulario7_linea23?.metodologia_puntaje,
        metodologia_comentario: evaluacion_proyecto_formulario7_linea23?.metodologia_comentario ? evaluacion_proyecto_formulario7_linea23?.metodologia_comentario : '',
        metodologia_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.metodologia_comentario == null ? true : false,
        productos_puntaje: evaluacion_proyecto_formulario7_linea23?.productos_puntaje,
        productos_comentario: evaluacion_proyecto_formulario7_linea23?.productos_comentario ? evaluacion_proyecto_formulario7_linea23?.productos_comentario : '',
        productos_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.productos_comentario == null ? true : false,
        cadena_valor_puntaje: evaluacion_proyecto_formulario7_linea23?.cadena_valor_puntaje,
        cadena_valor_comentario: evaluacion_proyecto_formulario7_linea23?.cadena_valor_comentario ? evaluacion_proyecto_formulario7_linea23?.cadena_valor_comentario : '',
        cadena_valor_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.cadena_valor_comentario == null ? true : false,
        analisis_riesgos_puntaje: evaluacion_proyecto_formulario7_linea23?.analisis_riesgos_puntaje,
        analisis_riesgos_comentario: evaluacion_proyecto_formulario7_linea23?.analisis_riesgos_comentario ? evaluacion_proyecto_formulario7_linea23?.analisis_riesgos_comentario : '',
        analisis_riesgos_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.analisis_riesgos_comentario == null ? true : false,

        ortografia_puntaje: evaluacion_proyecto_formulario7_linea23?.ortografia_puntaje,
        ortografia_comentario: evaluacion_proyecto_formulario7_linea23?.ortografia_comentario ? evaluacion_proyecto_formulario7_linea23?.ortografia_comentario : '',
        ortografia_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.ortografia_comentario == null ? true : false,
        redaccion_puntaje: evaluacion_proyecto_formulario7_linea23?.redaccion_puntaje,
        redaccion_comentario: evaluacion_proyecto_formulario7_linea23?.redaccion_comentario ? evaluacion_proyecto_formulario7_linea23?.redaccion_comentario : '',
        redaccion_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.redaccion_comentario == null ? true : false,
        normas_apa_puntaje: evaluacion_proyecto_formulario7_linea23?.normas_apa_puntaje,
        normas_apa_comentario: evaluacion_proyecto_formulario7_linea23?.normas_apa_comentario ? evaluacion_proyecto_formulario7_linea23?.normas_apa_comentario : '',
        normas_apa_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.normas_apa_comentario == null ? true : false,

        justificacion_economia_naranja_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.justificacion_economia_naranja_comentario == null ? true : false,
        justificacion_economia_naranja_comentario: evaluacion_proyecto_formulario7_linea23?.justificacion_economia_naranja_comentario
            ? evaluacion_proyecto_formulario7_linea23?.justificacion_economia_naranja_comentario
            : '',

        justificacion_industria_4_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.justificacion_industria_4_comentario == null ? true : false,
        justificacion_industria_4_comentario: evaluacion_proyecto_formulario7_linea23?.justificacion_industria_4_comentario
            ? evaluacion_proyecto_formulario7_linea23?.justificacion_industria_4_comentario
            : '',

        bibliografia_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.bibliografia_comentario == null ? true : false,
        bibliografia_comentario: evaluacion_proyecto_formulario7_linea23?.bibliografia_comentario ? evaluacion_proyecto_formulario7_linea23?.bibliografia_comentario : '',

        fechas_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.fechas_comentario == null ? true : false,
        fechas_comentario: evaluacion_proyecto_formulario7_linea23?.fechas_comentario ? evaluacion_proyecto_formulario7_linea23?.fechas_comentario : '',

        justificacion_politica_discapacidad_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.justificacion_politica_discapacidad_comentario == null ? true : false,
        justificacion_politica_discapacidad_comentario: evaluacion_proyecto_formulario7_linea23?.justificacion_politica_discapacidad_comentario
            ? evaluacion_proyecto_formulario7_linea23?.justificacion_politica_discapacidad_comentario
            : '',

        actividad_economica_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.actividad_economica_comentario == null ? true : false,
        actividad_economica_comentario: evaluacion_proyecto_formulario7_linea23?.actividad_economica_comentario ? evaluacion_proyecto_formulario7_linea23?.actividad_economica_comentario : '',

        disciplina_subarea_conocimiento_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.disciplina_subarea_conocimiento_comentario == null ? true : false,
        disciplina_subarea_conocimiento_comentario: evaluacion_proyecto_formulario7_linea23?.disciplina_subarea_conocimiento_comentario
            ? evaluacion_proyecto_formulario7_linea23?.disciplina_subarea_conocimiento_comentario
            : '',

        red_conocimiento_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.red_conocimiento_comentario == null ? true : false,
        red_conocimiento_comentario: evaluacion_proyecto_formulario7_linea23?.red_conocimiento_comentario ? evaluacion_proyecto_formulario7_linea23?.red_conocimiento_comentario : '',

        tematica_estrategica_requiere_comentario: evaluacion_proyecto_formulario7_linea23?.tematica_estrategica_comentario == null ? true : false,
        tematica_estrategica_comentario: evaluacion_proyecto_formulario7_linea23?.tematica_estrategica_comentario ? evaluacion_proyecto_formulario7_linea23?.tematica_estrategica_comentario : '',
    })

    const submit = (e) => {
        e.preventDefault()

        if (allowed.to_update) {
            form.put(route('convocatorias.evaluaciones-formulario-7-linea-23.update', [convocatoria.id, evaluacion.id]), {
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
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                            label={form.data.clausula_confidencialidad ? 'He aceptado la cláusula de confidencialidad' : 'Acepto la cláusula de confidencialidad-'}
                        />
                    </AlertMui>
                </div>

                <div>
                    <Divider className="!my-20 font-black">TÍTULO</Divider>

                    <Label className="!mb-10" labelFor="titulo_puntaje" value="Puntaje (Máximo 1)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="titulo_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 1,
                        }}
                        value={form.data.titulo_puntaje}
                        onChange={(e) => form.setData('titulo_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        placeholder="Puntaje"
                        error={form.errors.titulo_puntaje}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0,0 a 0,5</strong> El título orienta el enfoque del proyecto
                            </li>
                            <li>
                                <strong>Puntaje: 0,6 a 1,0</strong> El título orienta el enfoque del proyecto e indica el cómo y el para qué
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El título es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.titulo_requiere_comentario}
                            onChange={(e) => form.setData('titulo_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.titulo_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="titulo_comentario"
                                value={form.data.titulo_comentario}
                                error={form.errors.titulo_comentario}
                                onChange={(e) => form.setData('titulo_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">RESUMEN</Divider>

                    <Label className="!mb-10" labelFor="resumen_puntaje" value="Puntaje (Máximo 2)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="resumen_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 2,
                        }}
                        value={form.data.resumen_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.resumen_puntaje}
                        onChange={(e) => form.setData('resumen_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0,0 a 1,0</strong> El resumen no presenta de forma clara la pertinencia y calidad del proyecto, en términos de cuál es el problema central, cómo se le
                                dará solución y cuáles serán las herramientas que se utilizarán para ello, entre otros.
                            </li>
                            <li>
                                <strong>Puntaje: 1,1 a 2,0</strong> El resumen presenta de forma clara la pertinencia y calidad del proyecto e incluye todos los elementos en términos de cuál es el
                                problema central, cómo se le dará solución y cuáles serán las herramientas que se utilizarán para ello, entre otros.
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El resumen es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.resumen_requiere_comentario}
                            onChange={(e) => form.setData('resumen_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.resumen_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="resumen_comentario"
                                value={form.data.resumen_comentario}
                                error={form.errors.resumen_comentario}
                                onChange={(e) => form.setData('resumen_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">VIDEO</Divider>

                    <Label className="!mb-10" labelFor="video_puntaje" value="Puntaje (Máximo 1)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="video_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 1,
                        }}
                        value={form.data.video_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.video_puntaje}
                        onChange={(e) => form.setData('video_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0,0 a 0,5</strong> El video no cumple los 3 minutos establecidos y no presenta de forma clara la justificación, la problemática, el objetivo general,
                                los objetivos específicos, las actividades, los productos y/o su impacto de acuerdo con los lineamientos de la convocatoria
                            </li>
                            <li>
                                <strong>Puntaje: 0,6 a 1,0</strong> El video cumple los 3 minutos establecidos y presenta la justificación, la problemática, el objetivo general, los objetivos
                                específicos, las actividades, los productos y su impacto de acuerdo con los lineamientos de la convocatoria
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El video es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.video_requiere_comentario}
                            onChange={(e) => form.setData('video_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.video_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="video_comentario"
                                value={form.data.video_comentario}
                                error={form.errors.video_comentario}
                                onChange={(e) => form.setData('video_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">ENTIDADES ALIADAS</Divider>

                    <p>Puntaje: {form.data.entidad_aliada_puntaje}</p>
                    <AlertMui>
                        <p>El puntaje se asigna automáticamente una vez se validen las entidades. El valor se da según el tipo de entidad relacionada. Revisar valores en lineamientos.</p>
                    </AlertMui>

                    <div className="mt-10">
                        <p className="mt-4">¿Valida las entidades aliadas?</p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.entidad_aliada_requiere_comentario}
                            onChange={(e) => form.setData('entidad_aliada_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.entidad_aliada_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="entidad_aliada_comentario"
                                value={form.data.entidad_aliada_comentario}
                                error={form.errors.entidad_aliada_comentario}
                                onChange={(e) => form.setData('entidad_aliada_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">DEFINICIÓN DEL PROBLEMA</Divider>

                    <Label className="!mb-10" labelFor="problema_central_puntaje" value="Puntaje (Máximo 15)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="problema_central_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 15,
                        }}
                        value={form.data.problema_central_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.problema_central_puntaje}
                        onChange={(e) => form.setData('problema_central_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0 a 7</strong> El problema no ha sido identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes
                                tecnológicos y no se encuentra coherencia con los antecedentes, la justificación y el marco conceptual.
                            </li>
                            <li>
                                <strong>Puntaje: 8 a 13</strong> El problema se ha identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes
                                tecnológicos y se encuentra coherencia entre los antecedentes, la justificación y el marco conceptual. Sin embargo, es susceptible de ajustes en términos de coherencia
                                en la propuesta
                            </li>
                            <li>
                                <strong>Puntaje: 14 a 15</strong> El problema se ha identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes
                                tecnológicos y guarda una coherencia global entre los antecedentes, la justificación y el marco conceptual.
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿Los antecedentes, justificación, marco conceptual y la definición del problema son correctos? Si considera que la información puede mejorarse, por favor seleccione{' '}
                            <strong>NO</strong> y haga la respectiva recomendación.
                        </p>

                        <SwitchMui
                            className="!my-6"
                            checked={form.data.problema_central_requiere_comentario}
                            onChange={(e) => form.setData('problema_central_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.problema_central_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="problema_central_comentario"
                                value={form.data.problema_central_comentario}
                                error={form.errors.problema_central_comentario}
                                onChange={(e) => form.setData('problema_central_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">RESULTADOS</Divider>

                    <Label className="!mb-10" labelFor="resultados_puntaje" value="Puntaje (Máximo 9)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="resultados_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 9,
                        }}
                        value={form.data.resultados_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.resultados_puntaje}
                        onChange={(e) => form.setData('resultados_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0 a 4</strong> No son claros los beneficios y ventajas de los resultados en el marco del proyecto, no se generan por el desarrollo de las actividades y
                                tampoco evidencian la materialización de la solución propuesta para resolver el problema del proyecto.
                            </li>
                            <li>
                                <strong>Puntaje: 5 a 7</strong> Los resultados se generan por el desarrollo de las actividades y se identifican sus ventajas y beneficios para dar solución al problema
                                identificado. Son susceptibles de mejora para evidenciar de forma clara la materialización de la solución propuesta.
                            </li>
                            <li>
                                <strong>Puntaje: 8 a 9</strong> Los resultados se generan por el desarrollo de las actividades, sus beneficios y ventajas sobresalen en pro de dar una solución
                                contundente al problema identificado y evidencian de forma clara la materialización de la solución propuesta.
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿Los resultados son correctos? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>

                        <SwitchMui
                            className="!my-6"
                            checked={form.data.resultados_requiere_comentario}
                            onChange={(e) => form.setData('resultados_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.resultados_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="resultados_comentario"
                                value={form.data.resultados_comentario}
                                error={form.errors.resultados_comentario}
                                onChange={(e) => form.setData('resultados_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">OBJETIVO GENERAL Y OBJETIVOS ESPECÍFICOS</Divider>

                    <Label className="!mb-10" labelFor="objetivos_puntaje" value="Puntaje (Máximo 15)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="objetivos_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 15,
                        }}
                        value={form.data.objetivos_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.objetivos_puntaje}
                        onChange={(e) => form.setData('objetivos_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0 a 7</strong> El objetivo general y los objetivos específicos (solución identificada) no dan respuesta al problema, tampo estan relacionados entre
                                ellos, y los objetivos específicos no presentan una secuencia lógica para alcanzar el objetivo general.
                            </li>
                            <li>
                                <strong>Puntaje: 8 a 13</strong> El objetivo general y los objetivos específicos (solución identificada) dan respuesta parcial al problema; hay relación entre ellos y
                                los objetivos específicos están formulados como una secuencia lógica para alcanzar el objetivo general, pero susceptibles de ajustes y mejoras.
                            </li>
                            <li>
                                <strong>Puntaje: 14 a 15</strong> El objetivo general y los objetivos específicos (solución identificada) dan respuesta integral al problema; hay relación entre ellos y
                                los objetivos específicos están formulados como una secuencia lógica para alcanzar el objetivo general.
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿El objetivo general y/o los objetivos específicos son correctos? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la
                            respectiva recomendación.
                        </p>

                        <SwitchMui
                            className="!my-6"
                            checked={form.data.objetivos_requiere_comentario}
                            onChange={(e) => form.setData('objetivos_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.objetivos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="objetivos_comentario"
                                value={form.data.objetivos_comentario}
                                error={form.errors.objetivos_comentario}
                                onChange={(e) => form.setData('objetivos_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">METODOLOGÍA Y ACTIVIDADES</Divider>

                    <Label className="!mb-10" labelFor="metodologia_puntaje" value="Puntaje (Máximo 15)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="metodologia_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 15,
                        }}
                        value={form.data.metodologia_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.metodologia_puntaje}
                        onChange={(e) => form.setData('metodologia_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0 a 7</strong> La selección y descripción de la metodología o metodologías no son claras para el contexto y desarrollo del proyecto. Las actividades no
                                estan descritas de forma secuencial, tampoco muestran como se lograrán los objetivos específicos, generarán los resultados y/o productos y no estan formuladas en el
                                marco de la vigencia del proyecto. Algunas de las actividades no se desarrollarán durante la vigencia {convocatoria.year}.
                            </li>
                            <li>
                                <strong>Puntaje: 8 a 13</strong> La selección y descripción de la metodología o metodologías son claras para el contexto y desarrollo del proyecto. Las actividades
                                están descritas de forma secuencial; sin embargo, son susceptibles de mejora en cuanto a como se lograrán los objetivos específicos, generarán los resultados y/o
                                productos y estan formuladas en el marco de la vigencia del proyecto. Todas las actividades se desarrollarán durante la vigencia {convocatoria.year} y el tiempo
                                dispuesto para ello es suficiente para garantizar su ejecución.
                            </li>
                            <li>
                                <strong>Puntaje: 14 a 15</strong> La selección y descripción de la metodología o metodologías son precisas para el contexto y desarrollo del proyecto. Las actividades
                                están descritas de forma secuencial, evidencian de forma clara como se lograrán los objetivos específicos, generarán los resultados, productos y están formuladas en el
                                marco de la vigencia del proyecto. Todas las actividades se desarrollarán durante la vigencia {convocatoria.year} y el tiempo dispuesto para ello es suficiente para
                                garantizar su ejecución.
                            </li>
                        </ul>
                    </AlertMui>
                    <div className="mt-10">
                        <p>
                            ¿La metodología y/o actividades son correctos? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>

                        <SwitchMui
                            className="!my-6"
                            checked={form.data.metodologia_requiere_comentario}
                            onChange={(e) => form.setData('metodologia_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.metodologia_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="metodologia_comentario"
                                value={form.data.metodologia_comentario}
                                error={form.errors.metodologia_comentario}
                                onChange={(e) => form.setData('metodologia_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">PRODUCTOS</Divider>

                    <Label className="!mb-10" labelFor="productos_puntaje" value="Puntaje (Máximo 9)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="productos_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 9,
                        }}
                        value={form.data.productos_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.productos_puntaje}
                        onChange={(e) => form.setData('productos_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0 a 4</strong> Los productos esperados no son pertinentes para atender la problemática identificada en un corto o mediano plazo (correlación con el
                                cronograma de actividades) y la formulación de los indicadores dificulta su medición.
                            </li>
                            <li>
                                <strong>Puntaje: 5 a 7</strong> La mayoría de productos esperados son pertinentes para atender la problemática identificada en un corto o mediano plazo (correlación con
                                el cronograma de actividades) y son susceptibles de mejora en cuanto a su alcance, así como lo es la formulación de los indicadores para realizar mediciones precisas en
                                el tiempo.
                            </li>
                            <li>
                                <strong>Puntaje: 8 a 9</strong> Todos los productos esperados son pertinentes para atender la problemática identificada en un corto o mediano plazo (correlación con el
                                cronograma de actividades) y la formulación de los indicadores permitirá realizar mediciones precisas en el tiempo.
                            </li>
                        </ul>
                    </AlertMui>
                    <div className="mt-10">
                        <p>
                            ¿Los productos son correctos? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>

                        <SwitchMui
                            className="!my-6"
                            checked={form.data.productos_requiere_comentario}
                            onChange={(e) => form.setData('productos_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.productos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="productos_comentario"
                                value={form.data.productos_comentario}
                                error={form.errors.productos_comentario}
                                onChange={(e) => form.setData('productos_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">CADENA DE VALOR</Divider>

                    <Label className="!mb-10" labelFor="cadena_valor_puntaje" value={`Puntaje (Máximo 25)`} />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="cadena_valor_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 25,
                        }}
                        value={form.data.cadena_valor_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.cadena_valor_puntaje}
                        onChange={(e) => form.setData('cadena_valor_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>0 a 12</strong> El presupuesto esta sobre o subdimensionado y / o no está directamente relacionado con el desarrollo de las actividades para el logro de los
                                objetivos propuestos. Los soportes que evidencian el costo del bien a adquirir no son pertinentes y tampoco confiables
                            </li>
                            <li>
                                <strong>13 a 23</strong> El presupuesto es adecuado, pero es susceptible de ajustes frente a las las actividades a desarrollar que darán cumplimiento a los objetivos
                                propuestos. Los soportes que evidencian el costo del bien a adquirir son pertinentes y confiables.
                            </li>
                            <li>
                                <strong>24 a 25</strong> El presupuesto está bien definido y se relaciona directamente con el desarrollo de las actividades y los entregables del proyecto. Los soportes
                                que evidencian el costo del bien a adquirir son pertinentes y confiables.
                            </li>
                        </ul>
                    </AlertMui>
                    <div className="mt-10">
                        <p>
                            ¿La cadena de valor es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>

                        <SwitchMui
                            className="!my-6"
                            checked={form.data.cadena_valor_requiere_comentario}
                            onChange={(e) => form.setData('cadena_valor_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.cadena_valor_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="cadena_valor_comentario"
                                value={form.data.cadena_valor_comentario}
                                error={form.errors.cadena_valor_comentario}
                                onChange={(e) => form.setData('cadena_valor_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">ANÁLISIS DE RIESGOS</Divider>

                    <Label className="!mb-10" labelFor="analisis_riesgos_puntaje" value="Puntaje (Máximo 5)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="analisis_riesgos_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 5,
                        }}
                        value={form.data.analisis_riesgos_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.analisis_riesgos_puntaje}
                        onChange={(e) => form.setData('analisis_riesgos_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 0,0 a 2,0</strong> Los riesgos descritos en los tres niveles de análisis no son coherentes con las situaciones que se presentarán en el desarrollo del
                                proyecto y las medidas de mitigación son insuficientes para darles solución.
                            </li>
                            <li>
                                <strong>Puntaje: 2,1 a 3,9</strong> Los riesgos descritos en los tres niveles de análisis son coherentes con las situaciones que se presentarán en el desarrollo del
                                proyecto y las medidas de mitigación son susceptibles de mejora para dar un tratamiento más acertado a los riesgos.
                            </li>
                            <li>
                                <strong>Puntaje: 4,0 a 5,0</strong> Los riesgos descritos en los tres niveles de análisis son coherentes con las situaciones que se presentarán en el desarrollo del
                                proyecto y las medidas de mitigación son suficientes para dar tratamiento a los riesgos.
                            </li>
                        </ul>
                    </AlertMui>
                    <div className="mt-10">
                        <p>
                            ¿Los análisis de riesgos son correctos? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>

                        <SwitchMui
                            className="!my-6"
                            checked={form.data.analisis_riesgos_requiere_comentario}
                            onChange={(e) => form.setData('analisis_riesgos_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.analisis_riesgos_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="analisis_riesgos_comentario"
                                value={form.data.analisis_riesgos_comentario}
                                error={form.errors.analisis_riesgos_comentario}
                                onChange={(e) => form.setData('analisis_riesgos_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">ORTOGRAFÍA</Divider>

                    <Label className="!mb-10" labelFor="ortografia_puntaje" value="Puntaje (Máximo 1)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="ortografia_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 1,
                        }}
                        value={form.data.ortografia_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.ortografia_puntaje}
                        onChange={(e) => form.setData('ortografia_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 1</strong> Todo el documento respeta y aplica las reglas ortográficas
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿La ortografía es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.ortografia_requiere_comentario}
                            onChange={(e) => form.setData('ortografia_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.ortografia_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="ortografia_comentario"
                                value={form.data.ortografia_comentario}
                                error={form.errors.ortografia_comentario}
                                onChange={(e) => form.setData('ortografia_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>

                    <Divider className="!my-20 font-black">REDACCIÓN</Divider>

                    <Label className="!mb-10" labelFor="redaccion_puntaje" value="Puntaje (Máximo 1)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="redaccion_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 1,
                        }}
                        value={form.data.redaccion_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.redaccion_puntaje}
                        onChange={(e) => form.setData('redaccion_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 1</strong> Todo el documento respeta y aplica las reglas gramaticales
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿La redacción es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.redaccion_requiere_comentario}
                            onChange={(e) => form.setData('redaccion_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.redaccion_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="redaccion_comentario"
                                value={form.data.redaccion_comentario}
                                error={form.errors.redaccion_comentario}
                                onChange={(e) => form.setData('redaccion_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                            />
                        )}
                    </div>

                    <Divider className="!my-20 font-black">NORMAS APA</Divider>

                    <Label className="!mb-10" labelFor="normas_apa_puntaje" value="Puntaje (Máximo 1)" />
                    <TextInput
                        label="Diligencie el puntaje"
                        id="normas_apa_puntaje"
                        type="number"
                        inputBackground="#fff"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 1,
                        }}
                        value={form.data.normas_apa_puntaje}
                        placeholder="Puntaje"
                        error={form.errors.normas_apa_puntaje}
                        onChange={(e) => form.setData('normas_apa_puntaje', e.target.value)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    <AlertMui>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li>
                                <strong>Puntaje: 1</strong> Las normas APA han sido aplicadas en todo el documento para referenciar y citar otros autores
                            </li>
                        </ul>
                    </AlertMui>

                    <div className="mt-10">
                        <p>
                            ¿Las normas APA son correctas? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.normas_apa_requiere_comentario}
                            onChange={(e) => form.setData('normas_apa_requiere_comentario', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form.data.normas_apa_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="normas_apa_comentario"
                                value={form.data.normas_apa_comentario}
                                error={form.errors.normas_apa_comentario}
                                onChange={(e) => form.setData('normas_apa_comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">FECHAS DE EJECUCIÓN</Divider>

                    <p>
                        ¿Las fechas son correctas? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.fechas_requiere_comentario}
                        onChange={(e) => form.setData('fechas_requiere_comentario', e.target.checked)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    {form.data.fechas_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="fechas_comentario"
                            value={form.data.fechas_comentario}
                            error={form.errors.fechas_comentario}
                            onChange={(e) => form.setData('fechas_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
                <div>
                    <Divider className="!my-20 font-black">RED DE CONOCIMIENTO</Divider>

                    <p>
                        ¿La red de conocimiento sectorial es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.red_conocimiento_requiere_comentario}
                        onChange={(e) => form.setData('red_conocimiento_requiere_comentario', e.target.checked)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
                    {form.data.red_conocimiento_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="red_conocimiento_comentario"
                            value={form.data.red_conocimiento_comentario}
                            error={form.errors.red_conocimiento_comentario}
                            onChange={(e) => form.setData('red_conocimiento_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
                <div>
                    <Divider className="!my-20 font-black">DISCIPLINA DE CONOCIMIENTO</Divider>

                    <p>
                        ¿La disciplina de la subárea de conocimiento es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                        recomendación.
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.disciplina_subarea_conocimiento_requiere_comentario}
                        onChange={(e) => form.setData('disciplina_subarea_conocimiento_requiere_comentario', e.target.checked)}
                    />
                    {form.data.disciplina_subarea_conocimiento_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="disciplina_subarea_conocimiento_comentario"
                            value={form.data.disciplina_subarea_conocimiento_comentario}
                            error={form.errors.disciplina_subarea_conocimiento_comentario}
                            onChange={(e) => form.setData('disciplina_subarea_conocimiento_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
                <div>
                    <Divider className="!my-20 font-black">ACTIVIDAD ECONÓMICA</Divider>

                    <p>
                        ¿La actividad económica es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.actividad_economica_requiere_comentario}
                        onChange={(e) => form.setData('actividad_economica_requiere_comentario', e.target.checked)}
                    />
                    {form.data.actividad_economica_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="actividad_economica_comentario"
                            value={form.data.actividad_economica_comentario}
                            error={form.errors.actividad_economica_comentario}
                            onChange={(e) => form.setData('actividad_economica_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
                <div>
                    <Divider className="!my-20 font-black">TEMÁTICA ESTRATÉGICA</Divider>

                    <p>
                        ¿La temática estratégica es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.tematica_estrategica_requiere_comentario}
                        onChange={(e) => form.setData('tematica_estrategica_requiere_comentario', e.target.checked)}
                    />
                    {form.data.tematica_estrategica_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="tematica_estrategica_comentario"
                            value={form.data.tematica_estrategica_comentario}
                            error={form.errors.tematica_estrategica_comentario}
                            onChange={(e) => form.setData('tematica_estrategica_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>

                <div>
                    <Divider className="!my-20 font-black">INDUSTRIA 4.0</Divider>

                    <p>
                        ¿El ítem es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.justificacion_industria_4_requiere_comentario}
                        onChange={(e) => form.setData('justificacion_industria_4_requiere_comentario', e.target.checked)}
                    />
                    {form.data.justificacion_industria_4_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="justificacion_industria_4_comentario"
                            value={form.data.justificacion_industria_4_comentario}
                            error={form.errors.justificacion_industria_4_comentario}
                            onChange={(e) => form.setData('justificacion_industria_4_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
                <div>
                    <Divider className="!my-20 font-black">ECONOMÍA NARANJA</Divider>

                    <p>
                        ¿El ítem es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.justificacion_economia_naranja_requiere_comentario}
                        onChange={(e) => form.setData('justificacion_economia_naranja_requiere_comentario', e.target.checked)}
                    />
                    {form.data.justificacion_economia_naranja_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="justificacion_economia_naranja_comentario"
                            value={form.data.justificacion_economia_naranja_comentario}
                            error={form.errors.justificacion_economia_naranja_comentario}
                            onChange={(e) => form.setData('justificacion_economia_naranja_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
                <div>
                    <Divider className="!my-20 font-black">POLÍTICA DE DISCAPACIDAD</Divider>

                    <p>
                        ¿El ítem es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.justificacion_politica_discapacidad_requiere_comentario}
                        onChange={(e) => form.setData('justificacion_politica_discapacidad_requiere_comentario', e.target.checked)}
                    />
                    {form.data.justificacion_politica_discapacidad_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="justificacion_politica_discapacidad_comentario"
                            value={form.data.justificacion_politica_discapacidad_comentario}
                            error={form.errors.justificacion_politica_discapacidad_comentario}
                            onChange={(e) => form.setData('justificacion_politica_discapacidad_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>

                <div>
                    <Divider className="!my-20 font-black">BIBLIOGRAFÍA</Divider>

                    <p>
                        ¿La bibliografía es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui
                        className="!my-6"
                        checked={form.data.bibliografia_requiere_comentario}
                        onChange={(e) => form.setData('bibliografia_requiere_comentario', e.target.checked)}
                        disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                    />
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
                        <SwitchMui
                            className="!my-6"
                            checked={form_evaluacion_rol.data.correcto}
                            onChange={(e) => form_evaluacion_rol.setData('correcto', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form_evaluacion_rol.data.correcto == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="comentario"
                                value={form_evaluacion_rol.data.comentario}
                                error={form_evaluacion_rol.errors.comentario}
                                onChange={(e) => form_evaluacion_rol.setData('comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}

                        <div className="mt-6 flex items-center justify-end">
                            <ButtonMui onClick={() => setDialogEvaluacionRolStatus(false)} className="!bg-transparent !text-app-700 !mr-2">
                                Cerrar
                            </ButtonMui>

                            <PrimaryButton disabled={form_evaluacion_rol.processing || evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado} type="submit">
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
                        <SwitchMui
                            className="!my-6"
                            checked={form_evaluacion_rubro.data.correcto}
                            onChange={(e) => form_evaluacion_rubro.setData('correcto', e.target.checked)}
                            disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                        />
                        {form_evaluacion_rubro.data.correcto == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="comentario"
                                value={form_evaluacion_rubro.data.comentario}
                                error={form_evaluacion_rubro.errors.comentario}
                                onChange={(e) => form_evaluacion_rubro.setData('comentario', e.target.value)}
                                disabled={evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado}
                                required
                            />
                        )}

                        <div className="mt-6 flex items-center justify-end">
                            <ButtonMui onClick={() => setDialogEvaluacionRubroStatus(false)} className="!bg-transparent !text-app-700 !mr-2">
                                Cerrar
                            </ButtonMui>
                            <PrimaryButton disabled={form_evaluacion_rubro.processing || evaluacion_proyecto_formulario7_linea23.evaluacion.finalizado} type="submit">
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
