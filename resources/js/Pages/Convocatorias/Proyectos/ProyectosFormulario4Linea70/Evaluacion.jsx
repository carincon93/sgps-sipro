import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import Checkbox from '@/Components/Checkbox'
import DialogMui from '@/Components/Dialog'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Divider, Grid } from '@mui/material'

import React, { useEffect, useState } from 'react'

const Evaluacion = ({ convocatoria, evaluacion, allowed, proyecto, setDialogEvaluacionStatus, ...props }) => {
    const evaluacion_proyecto_formulario4_linea70 = evaluacion.evaluacion_proyecto_formulario4_linea70 ?? evaluacion

    const form = useForm({
        evaluacion_id: evaluacion?.id,
        clausula_confidencialidad: evaluacion?.clausula_confidencialidad ?? evaluacion?.evaluacion?.clausula_confidencialidad,

        resumen_regional_comentario: evaluacion_proyecto_formulario4_linea70?.resumen_regional_comentario ? evaluacion_proyecto_formulario4_linea70?.resumen_regional_comentario : '',
        resumen_regional_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.resumen_regional_comentario == null ? true : false,
        antecedentes_tecnoacademia_comentario: evaluacion_proyecto_formulario4_linea70?.antecedentes_tecnoacademia_comentario
            ? evaluacion_proyecto_formulario4_linea70?.antecedentes_tecnoacademia_comentario
            : '',
        antecedentes_tecnoacademia_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.antecedentes_tecnoacademia_comentario == null ? true : false,
        retos_oportunidades_comentario: evaluacion_proyecto_formulario4_linea70?.retos_oportunidades_comentario ? evaluacion_proyecto_formulario4_linea70?.retos_oportunidades_comentario : '',
        retos_oportunidades_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.retos_oportunidades_comentario == null ? true : false,
        metodologia_comentario: evaluacion_proyecto_formulario4_linea70?.metodologia_comentario ? evaluacion_proyecto_formulario4_linea70?.metodologia_comentario : '',
        metodologia_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.metodologia_comentario == null ? true : false,
        lineas_medulares_centro_comentario: evaluacion_proyecto_formulario4_linea70?.lineas_medulares_centro_comentario
            ? evaluacion_proyecto_formulario4_linea70?.lineas_medulares_centro_comentario
            : '',
        lineas_medulares_centro_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.lineas_medulares_centro_comentario == null ? true : false,
        lineas_tecnologicas_centro_comentario: evaluacion_proyecto_formulario4_linea70?.lineas_tecnologicas_centro_comentario
            ? evaluacion_proyecto_formulario4_linea70?.lineas_tecnologicas_centro_comentario
            : '',
        lineas_tecnologicas_centro_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.lineas_tecnologicas_centro_comentario == null ? true : false,
        articulacion_sennova_comentario: evaluacion_proyecto_formulario4_linea70?.articulacion_sennova_comentario ? evaluacion_proyecto_formulario4_linea70?.articulacion_sennova_comentario : '',
        articulacion_sennova_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.articulacion_sennova_comentario == null ? true : false,
        municipios_comentario: evaluacion_proyecto_formulario4_linea70?.municipios_comentario ? evaluacion_proyecto_formulario4_linea70?.municipios_comentario : '',
        municipios_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.municipios_comentario == null ? true : false,
        instituciones_comentario: evaluacion_proyecto_formulario4_linea70?.instituciones_comentario ? evaluacion_proyecto_formulario4_linea70?.instituciones_comentario : '',
        instituciones_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.instituciones_comentario == null ? true : false,
        fecha_ejecucion_comentario: evaluacion_proyecto_formulario4_linea70?.fecha_ejecucion_comentario ? evaluacion_proyecto_formulario4_linea70?.fecha_ejecucion_comentario : '',
        fecha_ejecucion_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.fecha_ejecucion_comentario == null ? true : false,
        cadena_valor_comentario: evaluacion_proyecto_formulario4_linea70?.cadena_valor_comentario ? evaluacion_proyecto_formulario4_linea70?.cadena_valor_comentario : '',
        cadena_valor_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.cadena_valor_comentario == null ? true : false,
        analisis_riesgos_comentario: evaluacion_proyecto_formulario4_linea70?.analisis_riesgos_comentario ? evaluacion_proyecto_formulario4_linea70?.analisis_riesgos_comentario : '',
        analisis_riesgos_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.analisis_riesgos_comentario == null ? true : false,
        anexos_comentario: evaluacion_proyecto_formulario4_linea70?.anexos_comentario ? evaluacion_proyecto_formulario4_linea70?.anexos_comentario : '',
        anexos_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.anexos_comentario == null ? true : false,
        proyectos_macro_comentario: evaluacion_proyecto_formulario4_linea70?.proyectos_macro_comentario ? evaluacion_proyecto_formulario4_linea70?.proyectos_macro_comentario : '',
        proyectos_macro_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.proyectos_macro_comentario == null ? true : false,
        bibliografia_comentario: evaluacion_proyecto_formulario4_linea70?.bibliografia_comentario ? evaluacion_proyecto_formulario4_linea70?.bibliografia_comentario : '',
        bibliografia_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.bibliografia_comentario == null ? true : false,
        productos_comentario: evaluacion_proyecto_formulario4_linea70?.productos_comentario ? evaluacion_proyecto_formulario4_linea70?.productos_comentario : '',
        productos_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.productos_comentario == null ? true : false,
        entidad_aliada_comentario: evaluacion_proyecto_formulario4_linea70?.entidad_aliada_comentario ? evaluacion_proyecto_formulario4_linea70?.entidad_aliada_comentario : '',
        entidad_aliada_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.entidad_aliada_comentario == null ? true : false,
        edt_comentario: evaluacion_proyecto_formulario4_linea70?.edt_comentario ? evaluacion_proyecto_formulario4_linea70?.edt_comentario : '',
        edt_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.edt_comentario == null ? true : false,
        articulacion_centro_formacion_comentario: evaluacion_proyecto_formulario4_linea70?.articulacion_centro_formacion_comentario
            ? evaluacion_proyecto_formulario4_linea70?.articulacion_centro_formacion_comentario
            : '',
        articulacion_centro_formacion_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.articulacion_centro_formacion_comentario == null ? true : false,
        proyecto_presupuesto_comentario: evaluacion_proyecto_formulario4_linea70?.proyecto_presupuesto_comentario ? evaluacion_proyecto_formulario4_linea70?.proyecto_presupuesto_comentario : '',
        proyecto_presupuesto_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.proyecto_presupuesto_comentario == null ? true : false,
        impacto_centro_formacion_comentario: evaluacion_proyecto_formulario4_linea70?.impacto_centro_formacion_comentario
            ? evaluacion_proyecto_formulario4_linea70?.impacto_centro_formacion_comentario
            : '',
        impacto_centro_formacion_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.impacto_centro_formacion_comentario == null ? true : false,
        ortografia_comentario: evaluacion_proyecto_formulario4_linea70?.ortografia_comentario ? evaluacion_proyecto_formulario4_linea70?.ortografia_comentario : '',
        ortografia_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.ortografia_comentario == null ? true : false,
        redaccion_comentario: evaluacion_proyecto_formulario4_linea70?.redaccion_comentario ? evaluacion_proyecto_formulario4_linea70?.redaccion_comentario : '',
        redaccion_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.redaccion_comentario == null ? true : false,
        normas_apa_comentario: evaluacion_proyecto_formulario4_linea70?.normas_apa_comentario ? evaluacion_proyecto_formulario4_linea70?.normas_apa_comentario : '',
        normas_apa_requiere_comentario: evaluacion_proyecto_formulario4_linea70?.normas_apa_comentario == null ? true : false,
    })

    const submit = (e) => {
        e.preventDefault()

        if (allowed.to_update) {
            form.put(route('convocatorias.evaluaciones-formulario-4-linea-70.update', [convocatoria.id, evaluacion.id]), {
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
            const evaluacion_rol_sennova_seleccionado = evaluacion_rol_sennova.proyecto_roles_evaluaciones?.find((evaluacion_rol) => evaluacion_rol.evaluacion_id == evaluacion.id)
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
            const evaluacion_rubro_seleccionado = evaluacion_rubro.proyecto_presupuestos_evaluaciones?.find((evaluacion_rubro) => evaluacion_rubro.evaluacion_id == evaluacion.id)
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
                    <Divider className="!my-20 font-black">resumen_regional_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El resumen_regional_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.resumen_regional_requiere_comentario}
                            onChange={(e) => form.setData('resumen_regional_requiere_comentario', e.target.checked)}
                        />
                        {form.data.resumen_regional_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="resumen_regional_comentario"
                                value={form.data.resumen_regional_comentario}
                                error={form.errors.resumen_regional_comentario}
                                onChange={(e) => form.setData('resumen_regional_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">antecedentes_tecnoacademia_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El antecedentes_tecnoacademia_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.antecedentes_tecnoacademia_requiere_comentario}
                            onChange={(e) => form.setData('antecedentes_tecnoacademia_requiere_comentario', e.target.checked)}
                        />
                        {form.data.antecedentes_tecnoacademia_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="antecedentes_tecnoacademia_comentario"
                                value={form.data.antecedentes_tecnoacademia_comentario}
                                error={form.errors.antecedentes_tecnoacademia_comentario}
                                onChange={(e) => form.setData('antecedentes_tecnoacademia_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">retos_oportunidades_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El retos_oportunidades_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.retos_oportunidades_requiere_comentario}
                            onChange={(e) => form.setData('retos_oportunidades_requiere_comentario', e.target.checked)}
                        />
                        {form.data.retos_oportunidades_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="retos_oportunidades_comentario"
                                value={form.data.retos_oportunidades_comentario}
                                error={form.errors.retos_oportunidades_comentario}
                                onChange={(e) => form.setData('retos_oportunidades_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">metodologia_comentario</Divider>

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
                    <Divider className="!my-20 font-black">lineas_medulares_centro_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El lineas_medulares_centro_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.lineas_medulares_centro_requiere_comentario}
                            onChange={(e) => form.setData('lineas_medulares_centro_requiere_comentario', e.target.checked)}
                        />
                        {form.data.lineas_medulares_centro_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="lineas_medulares_centro_comentario"
                                value={form.data.lineas_medulares_centro_comentario}
                                error={form.errors.lineas_medulares_centro_comentario}
                                onChange={(e) => form.setData('lineas_medulares_centro_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">lineas_tecnologicas_centro_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El lineas_tecnologicas_centro_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.lineas_tecnologicas_centro_requiere_comentario}
                            onChange={(e) => form.setData('lineas_tecnologicas_centro_requiere_comentario', e.target.checked)}
                        />
                        {form.data.lineas_tecnologicas_centro_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="lineas_tecnologicas_centro_comentario"
                                value={form.data.lineas_tecnologicas_centro_comentario}
                                error={form.errors.lineas_tecnologicas_centro_comentario}
                                onChange={(e) => form.setData('lineas_tecnologicas_centro_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">articulacion_sennova_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El articulacion_sennova_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.articulacion_sennova_requiere_comentario}
                            onChange={(e) => form.setData('articulacion_sennova_requiere_comentario', e.target.checked)}
                        />
                        {form.data.articulacion_sennova_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="articulacion_sennova_comentario"
                                value={form.data.articulacion_sennova_comentario}
                                error={form.errors.articulacion_sennova_comentario}
                                onChange={(e) => form.setData('articulacion_sennova_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">articulacion_sennova_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El articulacion_sennova_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.articulacion_sennova_requiere_comentario}
                            onChange={(e) => form.setData('articulacion_sennova_requiere_comentario', e.target.checked)}
                        />
                        {form.data.articulacion_sennova_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="articulacion_sennova_comentario"
                                value={form.data.articulacion_sennova_comentario}
                                error={form.errors.articulacion_sennova_comentario}
                                onChange={(e) => form.setData('articulacion_sennova_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">municipios_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El municipios_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.municipios_requiere_comentario} onChange={(e) => form.setData('municipios_requiere_comentario', e.target.checked)} />
                        {form.data.municipios_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="municipios_comentario"
                                value={form.data.municipios_comentario}
                                error={form.errors.municipios_comentario}
                                onChange={(e) => form.setData('municipios_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">instituciones_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El instituciones_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.instituciones_requiere_comentario} onChange={(e) => form.setData('instituciones_requiere_comentario', e.target.checked)} />
                        {form.data.instituciones_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="instituciones_comentario"
                                value={form.data.instituciones_comentario}
                                error={form.errors.instituciones_comentario}
                                onChange={(e) => form.setData('instituciones_comentario', e.target.value)}
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
                <div>
                    <Divider className="!my-20 font-black">cadena_valor_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El cadena_valor_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.cadena_valor_requiere_comentario} onChange={(e) => form.setData('cadena_valor_requiere_comentario', e.target.checked)} />
                        {form.data.cadena_valor_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="cadena_valor_comentario"
                                value={form.data.cadena_valor_comentario}
                                error={form.errors.cadena_valor_comentario}
                                onChange={(e) => form.setData('cadena_valor_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">analisis_riesgos_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El analisis_riesgos_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.analisis_riesgos_requiere_comentario}
                            onChange={(e) => form.setData('analisis_riesgos_requiere_comentario', e.target.checked)}
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
                    <Divider className="!my-20 font-black">proyectos_macro_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El proyectos_macro_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.proyectos_macro_requiere_comentario} onChange={(e) => form.setData('proyectos_macro_requiere_comentario', e.target.checked)} />
                        {form.data.proyectos_macro_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="proyectos_macro_comentario"
                                value={form.data.proyectos_macro_comentario}
                                error={form.errors.proyectos_macro_comentario}
                                onChange={(e) => form.setData('proyectos_macro_comentario', e.target.value)}
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
                    <Divider className="!my-20 font-black">productos_comentario</Divider>

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
                    <Divider className="!my-20 font-black">entidad_aliada_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El entidad_aliada_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.entidad_aliada_requiere_comentario} onChange={(e) => form.setData('entidad_aliada_requiere_comentario', e.target.checked)} />
                        {form.data.entidad_aliada_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="entidad_aliada_comentario"
                                value={form.data.entidad_aliada_comentario}
                                error={form.errors.entidad_aliada_comentario}
                                onChange={(e) => form.setData('entidad_aliada_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">edt_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El edt_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                        </p>
                        <SwitchMui className="!my-6" checked={form.data.edt_requiere_comentario} onChange={(e) => form.setData('edt_requiere_comentario', e.target.checked)} />
                        {form.data.edt_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="edt_comentario"
                                value={form.data.edt_comentario}
                                error={form.errors.edt_comentario}
                                onChange={(e) => form.setData('edt_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">articulacion_centro_formacion_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El articulacion_centro_formacion_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.articulacion_centro_formacion_requiere_comentario}
                            onChange={(e) => form.setData('articulacion_centro_formacion_requiere_comentario', e.target.checked)}
                        />
                        {form.data.articulacion_centro_formacion_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="articulacion_centro_formacion_comentario"
                                value={form.data.articulacion_centro_formacion_comentario}
                                error={form.errors.articulacion_centro_formacion_comentario}
                                onChange={(e) => form.setData('articulacion_centro_formacion_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Divider className="!my-20 font-black">proyecto_presupuesto_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El proyecto_presupuesto_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.proyecto_presupuesto_requiere_comentario}
                            onChange={(e) => form.setData('proyecto_presupuesto_requiere_comentario', e.target.checked)}
                        />
                        {form.data.proyecto_presupuesto_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="proyecto_presupuesto_comentario"
                                value={form.data.proyecto_presupuesto_comentario}
                                error={form.errors.proyecto_presupuesto_comentario}
                                onChange={(e) => form.setData('proyecto_presupuesto_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">impacto_centro_formacion_comentario</Divider>

                    <div className="mt-10">
                        <p>
                            ¿El impacto_centro_formacion_comentario es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                            recomendación.
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form.data.impacto_centro_formacion_requiere_comentario}
                            onChange={(e) => form.setData('impacto_centro_formacion_requiere_comentario', e.target.checked)}
                        />
                        {form.data.impacto_centro_formacion_requiere_comentario == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="impacto_centro_formacion_comentario"
                                value={form.data.impacto_centro_formacion_comentario}
                                error={form.errors.impacto_centro_formacion_comentario}
                                onChange={(e) => form.setData('impacto_centro_formacion_comentario', e.target.value)}
                                required
                            />
                        )}
                    </div>
                </div>

                <div>
                    <Divider className="!my-20 font-black">ORTOGRAFÍA</Divider>

                    <div className="mt-10">
                        <p>
                            ¿La ortografía es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
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

                    <Divider className="!my-20 font-black">REDACCIÓN</Divider>

                    <div className="mt-10">
                        <p>
                            ¿La redacción es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
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
                            />
                        )}
                    </div>

                    <Divider className="!my-20 font-black">NORMAS APA</Divider>

                    <div className="mt-10">
                        <p>
                            ¿Las normas APA son correctas? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
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
