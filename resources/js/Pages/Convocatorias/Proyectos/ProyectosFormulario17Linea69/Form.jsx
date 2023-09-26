import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { checkPermissionByUser, checkRole, monthDiff } from '@/Utils'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useEffect } from 'react'

const Form = ({ auth_user, method = '', convocatoria, proyecto_formulario_17_linea_69, nodos_tecnoparque, roles_sennova, evaluacion, allowed_to_create, ...props }) => {
    const form = useForm({
        fecha_inicio: proyecto_formulario_17_linea_69?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_formulario_17_linea_69?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_formulario_17_linea_69?.max_meses_ejecucion ?? '',
        nodo_tecnoparque_id: proyecto_formulario_17_linea_69?.nodo_tecnoparque_id ?? '',

        resumen: proyecto_formulario_17_linea_69?.resumen ?? '',
        resumen_regional: proyecto_formulario_17_linea_69?.resumen_regional ?? '',
        antecedentes: proyecto_formulario_17_linea_69?.antecedentes ?? '',
        antecedentes_regional: proyecto_formulario_17_linea_69?.antecedentes_regional ?? '',
        logros_vigencia_anterior: proyecto_formulario_17_linea_69?.logros_vigencia_anterior ?? '',
        contexto_general: proyecto_formulario_17_linea_69?.contexto_general ?? '',
        retos_locales_regionales: proyecto_formulario_17_linea_69?.retos_locales_regionales ?? '',
        estado_actual_departamento: proyecto_formulario_17_linea_69?.estado_actual_departamento ?? '',
        contribucion_desarrollo_empresas: proyecto_formulario_17_linea_69?.contribucion_desarrollo_empresas ?? '',
        contribucion_agenda_regional_competitividad: proyecto_formulario_17_linea_69?.contribucion_agenda_regional_competitividad ?? '',
        aportes_conpes_4011: proyecto_formulario_17_linea_69?.aportes_conpes_4011 ?? '',
        aportes_conpes_4080: proyecto_formulario_17_linea_69?.aportes_conpes_4080 ?? '',
        situacion_actual_produccion_agricola: proyecto_formulario_17_linea_69?.situacion_actual_produccion_agricola ?? '',
        aportes_alternativas_generacion_electrica: proyecto_formulario_17_linea_69?.aportes_alternativas_generacion_electrica ?? '',
        aportes_impulso_economia_popular: proyecto_formulario_17_linea_69?.aportes_impulso_economia_popular ?? '',
        justificacion_pertinencia: proyecto_formulario_17_linea_69?.justificacion_pertinencia ?? '',
        acciones_estrategias_campesena: proyecto_formulario_17_linea_69?.acciones_estrategias_campesena ?? '',
        bibliografia: proyecto_formulario_17_linea_69?.bibliografia ?? '',

        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.proyectos-formulario-17-linea-69.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_formulario_17_linea_69.proyecto.allowed.to_update
            ? form.put(route('convocatorias.proyectos-formulario-17-linea-69.update', [convocatoria.id, proyecto_formulario_17_linea_69.id]), {
                  preserveScroll: true,
              })
            : null
    }

    useEffect(() => {
        form.setData('max_meses_ejecucion', monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion))
    }, [form.data.fecha_inicio && form.data.fecha_finalizacion])

    const syncColumnLong = async (column, form, dasta) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos-formulario-17-linea-69.updateLongColumn', [convocatoria.id, proyecto_formulario_17_linea_69?.proyecto?.id, column]),
                    { [column]: dasta ? dasta : form.data[column], is_array: Array.isArray(form.data[column]) },
                    {
                        onError: (resp) => console.log(resp),
                        onFinish: () => console.log('Request finished'),
                        preserveScroll: true,
                    },
                )
            } catch (error) {
                console.error('An error occurred:', error)
            }
        }
    }

    return (
        <form onSubmit={submit}>
            <Grid container rowSpacing={20}>
                <Grid item md={12} className="!mb-20">
                    <div className="flex justify-around items-center bg-indigo-50 shadow rounded p-10">
                        <figure>
                            <img src="/images/projects.png" alt="" width={350} />
                        </figure>
                        <h1 className="text-2xl">
                            {method == 'PUT' ? (
                                <>
                                    <strong>{proyecto_formulario_17_linea_69.titulo}</strong>
                                    <br />
                                    {proyecto_formulario_17_linea_69.proyecto.codigo}
                                </>
                            ) : (
                                <>Parques tecnológicos - Red tecnoparque Colombia - Línea 69</>
                            )}
                        </h1>
                    </div>
                </Grid>

                <Grid container>
                    <Grid item md={6}>
                        <Label required labelFor="nodo_tecnoparque_id" value="Nodo Tecnoparque" />
                    </Grid>
                    <Grid item md={6}>
                        {method == 'POST' ? (
                            <Autocomplete
                                id="nodo_tecnoparque_id"
                                options={nodos_tecnoparque}
                                selectedValue={form.data.nodo_tecnoparque_id}
                                onChange={(event, newValue) => form.setData('nodo_tecnoparque_id', newValue.value)}
                                disabled={!(proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update || allowed_to_create)}
                                error={form.errors.nodo_tecnoparque_id}
                                required
                                onBlur={() => syncColumnLong('nodo_tecnoparque_id', form)}
                            />
                        ) : (
                            <>{proyecto_formulario_17_linea_69?.titulo}</>
                        )}
                    </Grid>
                </Grid>

                {method == 'PUT' && (
                    <>
                        <Grid item md={6}>
                            <Label required labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                        </Grid>
                        <Grid item md={6}>
                            Parques tecnológicos - Red tecnoparque Colombia
                        </Grid>

                        <Grid item md={6}>
                            <Label required labelFor="centro_formacion_id" value="Centro de formación" />
                            <small>
                                <strong>Nota:</strong> El Centro de Formación relacionado es el ejecutor del proyecto
                            </small>
                        </Grid>
                        <Grid item md={6}>
                            <p className="first-letter:uppercase">{proyecto_formulario_17_linea_69?.proyecto.centro_formacion.nombre}</p>
                        </Grid>
                    </>
                )}

                <Grid item md={6}>
                    <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                </Grid>
                <Grid item md={6}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_inicio"
                        minDate={convocatoria.year + '-01-01'}
                        maxDate={convocatoria.year + '-12-31'}
                        name="fecha_inicio"
                        value={form.data.fecha_inicio}
                        error={form.errors.fecha_inicio}
                        className="p-4 w-full"
                        onChange={(e) => (form.setData('fecha_inicio', e.target.value), syncColumnLong('fecha_inicio', form, e.target.value))}
                        disabled={!(proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update || allowed_to_create)}
                        required
                    />
                </Grid>
                <Grid item md={6}>
                    <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                </Grid>
                <Grid item md={6}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_finalizacion"
                        minDate={convocatoria.year + '-01-01'}
                        maxDate={convocatoria.year + '-12-31'}
                        name="fecha_finalizacion"
                        value={form.data.fecha_finalizacion}
                        error={form.errors.fecha_finalizacion}
                        className="p-4 w-full"
                        onChange={(e) => (form.setData('fecha_finalizacion', e.target.value), syncColumnLong('fecha_finalizacion', form, e.target.value))}
                        disabled={!(proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update || allowed_to_create)}
                        required
                    />
                </Grid>

                {method == 'POST' && (
                    <>
                        <Grid item md={12}>
                            <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                        </Grid>

                        <Grid item md={6}>
                            <Label required labelFor="rol_sennova" value="Rol SENNOVA" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="rol_sennova"
                                selectedValue={form.data.rol_sennova}
                                onChange={(event, newValue) => form.setData('rol_sennova', newValue.value)}
                                disabled={!(proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update || allowed_to_create)}
                                options={roles_sennova}
                                placeholder="Seleccione un rol SENNOVA"
                                required
                            />
                        </Grid>

                        {form.data.fecha_inicio && form.data.fecha_finalizacion && (
                            <>
                                <Grid item md={6}>
                                    <Label required labelFor="cantidad_meses" value="Número de meses de vinculación al proyecto" />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        type="number"
                                        id="cantidad_meses"
                                        inputProps={{
                                            step: 0.1,
                                            min: 1,
                                            max: monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion),
                                        }}
                                        value={form.data.cantidad_meses}
                                        onChange={(e) => form.setData('cantidad_meses', e.target.value)}
                                        disabled={!(proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update || allowed_to_create)}
                                        label="Número de meses de vinculación"
                                        required
                                    />
                                    {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion) && (
                                        <AlertMui>
                                            El proyecto se ejecutará entre {form.data.fecha_inicio} y el {form.data.fecha_finalizacion}, por lo tanto el número de meses máximo es:{' '}
                                            {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion)}
                                        </AlertMui>
                                    )}
                                </Grid>
                            </>
                        )}

                        <Grid item md={6}>
                            <Label required labelFor="cantidad_horas" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                        </Grid>
                        <Grid item md={6}>
                            <TextInput
                                type="number"
                                id="cantidad_horas"
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                }}
                                value={form.data.cantidad_horas}
                                onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                disabled={!(proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update || allowed_to_create)}
                                placeholder="Número de horas semanales dedicadas"
                                required
                            />
                        </Grid>
                    </>
                )}
                {method == 'PUT' && (
                    <>
                        <Grid item md={12}>
                            <Label required labelFor="resumen" value="Resumen del proyecto" />
                            <AlertMui>
                                Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo
                                resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                            </AlertMui>

                            <Textarea
                                id="resumen"
                                error={form.errors.resumen}
                                value={form.data.resumen}
                                onChange={(e) => form.setData('resumen', e.target.value)}
                                disabled={!checkRole(auth_user, [1, 17]) && !checkPermissionByUser(auth_user, [24]) && !proyecto_formulario_17_linea_69?.proyecto_base}
                                required
                                onBlur={() => syncColumnLong('resumen', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="resumen_regional" value="Complemento - Resumen ejecutivo regional" />

                            <Textarea
                                id="resumen_regional"
                                error={form.errors.resumen_regional}
                                value={form.data.resumen_regional}
                                onChange={(e) => form.setData('resumen_regional', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('resumen_regional', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="antecedentes" value="Antecedentes" />
                            <AlertMui>
                                Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la
                                temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición. De igual
                                forma, relacionar los proyectos ejecutados en vigencias anteriores (incluir códigos SGPS), si el proyecto corresponde a la continuidad de proyectos SENNOVA.
                            </AlertMui>

                            <Textarea
                                id="antecedentes"
                                error={form.errors.antecedentes}
                                value={form.data.antecedentes}
                                onChange={(e) => form.setData('antecedentes', e.target.value)}
                                disabled={!checkRole(auth_user, [1, 17]) && !checkPermissionByUser(auth_user, [24]) && !proyecto_formulario_17_linea_69?.proyecto_base}
                                required
                                onBlur={() => syncColumnLong('antecedentes', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="antecedentes_regional" value="Complemento - Antecedentes regional" />

                            <Textarea
                                id="antecedentes_regional"
                                error={form.errors.antecedentes_regional}
                                value={form.data.antecedentes_regional}
                                onChange={(e) => form.setData('antecedentes_regional', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('antecedentes_regional', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="logros_vigencia_anterior" value={`Describa los principales logros del Tecnoparque en el ${convocatoria.year - 1}`} />

                            <Textarea
                                id="logros_vigencia_anterior"
                                error={form.errors.logros_vigencia_anterior}
                                value={form.data.logros_vigencia_anterior}
                                onChange={(e) => form.setData('logros_vigencia_anterior', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('logros_vigencia_anterior', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="contexto_general" value="Contexto General de la Red Tecnoparques" />

                            <Textarea
                                id="contexto_general"
                                error={form.errors.contexto_general}
                                value={form.data.contexto_general}
                                onChange={(e) => form.setData('contexto_general', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('contexto_general', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <h1>PRIORIZACIÓN DE ESTRATEGIAS DEL TECNOPARQUE DE INNOVACIÓN DESDE LOS OBJETIVOS MISIONALES</h1>
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="retos_locales_regionales"
                                value={`Descripción de retos y prioridades locales y regionales identificadas para ser atendidas por el Tecnoparque a corto (vigencia ${convocatoria.year}), mediano y largo plazo.`}
                            />

                            <Textarea
                                id="retos_locales_regionales"
                                error={form.errors.retos_locales_regionales}
                                value={form.data.retos_locales_regionales}
                                onChange={(e) => form.setData('retos_locales_regionales', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('retos_locales_regionales', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="estado_actual_departamento"
                                value={`De acuerdo al IDIC (Indice Departamental de  Innovación para Colombia https://AplicativoIDIC2020.ocyt.org.co/), identifique el estado actual del Departamento y plantee acciones que puedan ser ejecutadas por el Tecnoparque en la vigencia ${convocatoria.year} para contribuir con el mejoramiento del estado actual.`}
                            />

                            <Textarea
                                id="estado_actual_departamento"
                                error={form.errors.estado_actual_departamento}
                                value={form.data.estado_actual_departamento}
                                onChange={(e) => form.setData('estado_actual_departamento', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('estado_actual_departamento', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="contribucion_desarrollo_empresas"
                                value={`¿Cómo el Tecnoparque, contribuirá en la vigencia ${convocatoria.year} al desarrollo y fortalecimiento de las capacidades tecnológicas de las empresas, cadenas productivas y clústeres de la región`}
                            />

                            <Textarea
                                id="contribucion_desarrollo_empresas"
                                error={form.errors.contribucion_desarrollo_empresas}
                                value={form.data.contribucion_desarrollo_empresas}
                                onChange={(e) => form.setData('contribucion_desarrollo_empresas', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('contribucion_desarrollo_empresas', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="contribucion_agenda_regional_competitividad"
                                value={`¿Cómo se articuló en el año ${
                                    convocatoria.year - 1
                                } y cual será la contribución del Tecnoparque con la Agenda de la Comisión Regional de Competitividad, en la vigencia ${convocatoria.year}?`}
                            />

                            <Textarea
                                id="contribucion_agenda_regional_competitividad"
                                error={form.errors.contribucion_agenda_regional_competitividad}
                                value={form.data.contribucion_agenda_regional_competitividad}
                                onChange={(e) => form.setData('contribucion_agenda_regional_competitividad', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('contribucion_agenda_regional_competitividad', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <h1>ASPECTOS REGIONALES ASOCIADOS A LOS DOCUMENTOS NACIONALES Y AL PLAN DE DESARROLLO NACIONAL 2022-2026</h1>
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="aportes_conpes_4011"
                                value={`¿Cuáles serán los aportes del Tecnoparque en el ${convocatoria.year} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos CONPES, inlcuyendo acciones articuladas con Emprendimiento (Dirección de Empleo)?`}
                            />

                            <Textarea
                                id="aportes_conpes_4011"
                                error={form.errors.aportes_conpes_4011}
                                value={form.data.aportes_conpes_4011}
                                onChange={(e) => form.setData('aportes_conpes_4011', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('aportes_conpes_4011', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="aportes_conpes_4080"
                                value={`¿Cuáles serán los aportes del Tecnoparque en el ${convocatoria.year} a la Línea de acción 1 del Conpes 4080 'el SENA desde 2022 y hasta 2026, fomentará la participación de la mujer en sus programas de investigación, desarrollo tecnológico e innovación, buscando generar competitividad con enfoque de género'`}
                            />

                            <Textarea
                                id="aportes_conpes_4080"
                                error={form.errors.aportes_conpes_4080}
                                value={form.data.aportes_conpes_4080}
                                onChange={(e) => form.setData('aportes_conpes_4080', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('aportes_conpes_4080', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="situacion_actual_produccion_agricola"
                                value="Describa la situación actual del Departamento relacionada con la producción en cadenas agrícolas que han sido priorizadas en la Transformación Derecho Humano a la Alimentación y oportunidades para contribuir con el fortalecimiento de proyectos asociados a este objetivo."
                            />

                            <Textarea
                                id="situacion_actual_produccion_agricola"
                                error={form.errors.situacion_actual_produccion_agricola}
                                value={form.data.situacion_actual_produccion_agricola}
                                onChange={(e) => form.setData('situacion_actual_produccion_agricola', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('situacion_actual_produccion_agricola', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="aportes_alternativas_generacion_electrica"
                                value="Describa las oportunidades en el departamento y regiones de influencia del Tecnoparque para contribuir con la fortalecer proyectos de I + D + i tendientes a aportar alternativas de generación eléctrica a partir de fuentes no convencionales de energía renovable."
                            />

                            <Textarea
                                id="aportes_alternativas_generacion_electrica"
                                error={form.errors.aportes_alternativas_generacion_electrica}
                                value={form.data.aportes_alternativas_generacion_electrica}
                                onChange={(e) => form.setData('aportes_alternativas_generacion_electrica', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('aportes_alternativas_generacion_electrica', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="aportes_impulso_economia_popular"
                                value="Describa las oportunidades en el departamento y regiones de influencia del Tecnoparque para contribuir con el impulso de la Economía Popular. Proyectos tendientes a aumentar los ingresos de los micronegocios de la economía popular."
                            />

                            <Textarea
                                id="aportes_impulso_economia_popular"
                                error={form.errors.aportes_impulso_economia_popular}
                                value={form.data.aportes_impulso_economia_popular}
                                onChange={(e) => form.setData('aportes_impulso_economia_popular', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('aportes_impulso_economia_popular', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="justificacion_pertinencia" value="Justificación y pertinencia  de las acciones que desarrolla el Tecnoparque en el territorio" />

                            <Textarea
                                id="justificacion_pertinencia"
                                error={form.errors.justificacion_pertinencia}
                                value={form.data.justificacion_pertinencia}
                                onChange={(e) => form.setData('justificacion_pertinencia', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('justificacion_pertinencia', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="acciones_estrategias_campesena"
                                value={`Describa las acciones realizadas en el ${convocatoria.year - 1}, integradas dentro de la Estrategia Campesena, en las que participó el Tecnoparque`}
                            />

                            <Textarea
                                id="acciones_estrategias_campesena"
                                error={form.errors.acciones_estrategias_campesena}
                                value={form.data.acciones_estrategias_campesena}
                                onChange={(e) => form.setData('acciones_estrategias_campesena', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('acciones_estrategias_campesena', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required labelFor="bibliografia" value="Bibliografía" />
                            <AlertMui>
                                Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).
                            </AlertMui>

                            <Textarea
                                id="bibliografia"
                                error={form.errors.bibliografia}
                                value={form.data.bibliografia}
                                onChange={(e) => form.setData('bibliografia', e.target.value)}
                                disabled={!proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('bibliografia', form)}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {method == 'POST' || proyecto_formulario_17_linea_69?.proyecto?.allowed?.to_update ? (
                <div className="flex items-center justify-between p-4">
                    <PrimaryButton type="submit" className="ml-auto" disabled={form.processing || !form.isDirty}>
                        Guardar
                    </PrimaryButton>
                </div>
            ) : null}
        </form>
    )
}

export default Form
