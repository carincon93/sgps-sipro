import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { checkPermissionByUser, monthDiff } from '@/Utils'

import { useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useEffect } from 'react'

const Form = ({ is_super_admin, auth_user, method = '', convocatoria, proyecto_hub_linea_69, nodos_tecnoparque, lineas_programaticas, roles_sennova, evaluacion, ...props }) => {
    const form = useForm({
        centro_formacion_id: proyecto_hub_linea_69?.proyecto.centro_formacion_id ?? '',
        fecha_inicio: proyecto_hub_linea_69?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_hub_linea_69?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_hub_linea_69?.max_meses_ejecucion ?? '',
        nodo_tecnoparque_id: proyecto_hub_linea_69?.nodo_tecnoparque_id ?? '',

        resumen: proyecto_hub_linea_69?.resumen ?? '',
        resumen_regional: proyecto_hub_linea_69?.resumen_regional ?? '',
        antecedentes: proyecto_hub_linea_69?.antecedentes ?? '',
        antecedentes_regional: proyecto_hub_linea_69?.antecedentes_regional ?? '',
        logros_vigencia_anterior: proyecto_hub_linea_69?.logros_vigencia_anterior ?? '',
        contexto_general: proyecto_hub_linea_69?.contexto_general ?? '',
        retos_locales_regionales: proyecto_hub_linea_69?.retos_locales_regionales ?? '',
        estado_actual_departamento: proyecto_hub_linea_69?.estado_actual_departamento ?? '',
        contribucion_desarrollo_empresas: proyecto_hub_linea_69?.contribucion_desarrollo_empresas ?? '',
        contribucion_agenda_regional_competitividad: proyecto_hub_linea_69?.contribucion_agenda_regional_competitividad ?? '',
        aportes_conpes_4011: proyecto_hub_linea_69?.aportes_conpes_4011 ?? '',
        aportes_conpes_4080: proyecto_hub_linea_69?.aportes_conpes_4080 ?? '',
        situacion_actual_produccion_agricola: proyecto_hub_linea_69?.situacion_actual_produccion_agricola ?? '',
        aportes_alternativas_generacion_electrica: proyecto_hub_linea_69?.aportes_alternativas_generacion_electrica ?? '',
        aportes_impulso_economia_popular: proyecto_hub_linea_69?.aportes_impulso_economia_popular ?? '',
        justificacion_pertinencia: proyecto_hub_linea_69?.justificacion_pertinencia ?? '',
        acciones_estrategias_campesena: proyecto_hub_linea_69?.acciones_estrategias_campesena ?? '',
        bibliografia: proyecto_hub_linea_69?.bibliografia ?? '',

        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.proyectos-hub-linea-69.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_hub_linea_69.proyecto.allowed.to_update
            ? form.put(route('convocatorias.proyectos-hub-linea-69.update', [convocatoria.id, proyecto_hub_linea_69.id]), {
                  preserveScroll: true,
              })
            : null
    }

    useEffect(() => {
        form.setData('max_meses_ejecucion', monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion))
    }, [form.data.fecha_inicio && form.data.fecha_finalizacion])

    return (
        <form onSubmit={submit}>
            <Grid container className="space-y-20">
                {nodos_tecnoparque.length > 0 ? (
                    <Grid container>
                        <Grid item md={6}>
                            <Label required labelFor="nodo_tecnoparque_id" value="Nodo Tecnoparque" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="nodo_tecnoparque_id"
                                options={nodos_tecnoparque}
                                selectedValue={form.data.nodo_tecnoparque_id}
                                onChange={(event, newValue) => form.setData('nodo_tecnoparque_id', newValue.value)}
                                error={form.errors.nodo_tecnoparque_id}
                                placeholder="Seleccione un nodo Tecnoparque"
                                disabled={is_super_admin ? false : evaluacion || method === 'editar'}
                                required
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <div className="py-24">
                        <AlertMui>Su regional no cuenta con nodos TecnoParque.</AlertMui>
                    </div>
                )}

                {method == 'PUT' && (
                    <>
                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                        </Grid>
                        <Grid item md={6}>
                            {proyecto_hub_linea_69?.proyecto.linea_programatica
                                ? proyecto_hub_linea_69?.proyecto.linea_programatica.nombre + ' - ' + proyecto_hub_linea_69?.proyecto.linea_programatica.codigo
                                : ''}
                        </Grid>

                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} labelFor="centro_formacion_id" value="Centro de formación" />
                            <small>
                                <strong>Nota:</strong> El Centro de Formación relacionado es el ejecutor del proyecto
                            </small>
                        </Grid>
                        <Grid item md={6}>
                            <p className="first-letter:uppercase">{proyecto_hub_linea_69?.proyecto.centro_formacion.nombre}</p>
                        </Grid>
                    </>
                )}

                <Grid item md={6}>
                    <Label required labelFor="fecha_inicio" error={form.errors.fecha_inicio} value="Fecha de inicio" />
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
                        onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                        required
                    />
                </Grid>
                <Grid item md={6}>
                    <Label required labelFor="fecha_finalizacion" error={form.errors.fecha_finalizacion} value="Fecha de finalización" />
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
                        onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
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
                                        placeholder="Número de meses de vinculación"
                                        required
                                    />
                                    {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion) && (
                                        <small>
                                            El proyecto se ejecutará entre {form.data.fecha_inicio} y el {form.data.fecha_finalizacion}, por lo tanto el número de meses máximo es:{' '}
                                            {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion)}
                                        </small>
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
                                placeholder="Número de horas semanales dedicadas"
                                required
                            />
                        </Grid>
                    </>
                )}
                {method == 'PUT' && (
                    <>
                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="resumen" value="Resumen del proyecto" />
                            <AlertMui>
                                Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo
                                resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                            </AlertMui>

                            <Textarea
                                id="resumen"
                                error={form.errors.resumen}
                                value={form.data.resumen}
                                onChange={(e) => form.setData('resumen', e.target.value)}
                                required
                                disabled={!is_super_admin && !checkPermissionByUser(auth_user, [24]) && !proyecto_hub_linea_69?.proyecto_base}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="resumen_regional" value="Complemento - Resumen ejecutivo regional" />

                            <Textarea
                                id="resumen_regional"
                                error={form.errors.resumen_regional}
                                value={form.data.resumen_regional}
                                onChange={(e) => form.setData('resumen_regional', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="antecedentes" value="Antecedentes" />
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
                                required
                                disabled={!is_super_admin && !checkPermissionByUser(auth_user, [24]) && !proyecto_hub_linea_69?.proyecto_base}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="antecedentes_regional" value="Complemento - Antecedentes regional" />

                            <Textarea
                                id="antecedentes_regional"
                                error={form.errors.antecedentes_regional}
                                value={form.data.antecedentes_regional}
                                onChange={(e) => form.setData('antecedentes_regional', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="logros_vigencia_anterior"
                                value={`Describa los principales logros del Tecnoparque/ Hub de Innovación en el ${convocatoria.year - 1}`}
                            />

                            <Textarea
                                id="logros_vigencia_anterior"
                                error={form.errors.logros_vigencia_anterior}
                                value={form.data.logros_vigencia_anterior}
                                onChange={(e) => form.setData('logros_vigencia_anterior', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="contexto_general" value="Contexto General de la Red Tecnoparques & Hubs de Innovación" />

                            <Textarea
                                id="contexto_general"
                                error={form.errors.contexto_general}
                                value={form.data.contexto_general}
                                onChange={(e) => form.setData('contexto_general', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <h1>PRIORIZACIÓN DE ESTRATEGIAS DEL TECNOPARQUE/HUB DE INNOVACIÓN DESDE LOS OBJETIVOS MISIONALES</h1>
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="retos_locales_regionales"
                                value={`Descripción de retos y prioridades locales y regionales identificadas para ser atendidas por el Tecnoparque/ Hub de Innovación a corto (vigencia ${convocatoria.year}), mediano y largo plazo.`}
                            />

                            <Textarea
                                id="retos_locales_regionales"
                                error={form.errors.retos_locales_regionales}
                                value={form.data.retos_locales_regionales}
                                onChange={(e) => form.setData('retos_locales_regionales', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="estado_actual_departamento"
                                value={`De acuerdo al IDIC (Indice Departamental de  Innovación para Colombia https://
AplicativoIDIC2020.ocyt.org.co/), identifique el estado actual del Departamento y plantee acciones que puedan ser ejecutadas por el Tecnoparque/Hub de Innovación en la vigencia ${convocatoria.year} para contribuir con el mejoramiento del estado actual.`}
                            />

                            <Textarea
                                id="estado_actual_departamento"
                                error={form.errors.estado_actual_departamento}
                                value={form.data.estado_actual_departamento}
                                onChange={(e) => form.setData('estado_actual_departamento', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="contribucion_desarrollo_empresas"
                                value={`¿Cómo el Tecnoparque/Hub de Innovación, contribuirá en la vigencia ${convocatoria.year} al desarrollo y fortalecimiento de las capacidades tecnológicas de las empresas, cadenas productivas y clústeres de la región`}
                            />

                            <Textarea
                                id="contribucion_desarrollo_empresas"
                                error={form.errors.contribucion_desarrollo_empresas}
                                value={form.data.contribucion_desarrollo_empresas}
                                onChange={(e) => form.setData('contribucion_desarrollo_empresas', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="contribucion_agenda_regional_competitividad"
                                value={`¿Cómo se articuló en el año ${
                                    convocatoria.year - 1
                                } y cual será la contribución del Tecnoparque/ Hub de Innovación con la Agenda de la Comisión Regional de Competitividad, en la vigencia ${convocatoria.year}?`}
                            />

                            <Textarea
                                id="contribucion_agenda_regional_competitividad"
                                error={form.errors.contribucion_agenda_regional_competitividad}
                                value={form.data.contribucion_agenda_regional_competitividad}
                                onChange={(e) => form.setData('contribucion_agenda_regional_competitividad', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <h1>ASPECTOS REGIONALES ASOCIADOS A LOS DOCUMENTOS NACIONALES Y AL PLAN DE DESARROLLO NACIONAL 2022-2026</h1>
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="aportes_conpes_4011"
                                value={`¿Cuáles serán los aportes del Tecnoparque/Hub de Innovación en el ${convocatoria.year} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos CONPES, inlcuyendo acciones articuladas con Emprendimiento (Dirección de Empleo)?`}
                            />

                            <Textarea
                                id="aportes_conpes_4011"
                                error={form.errors.aportes_conpes_4011}
                                value={form.data.aportes_conpes_4011}
                                onChange={(e) => form.setData('aportes_conpes_4011', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="aportes_conpes_4080"
                                value={`Cuáles serán los aportes del Tecnoparque/ Hub de Innovación en el ${convocatoria.year} a la Línea de acción 1 del Conpes 4080 'el SENA desde 2022 y hasta 2026, fomentará la participación de la mujer en sus programas de investigación, desarrollo tecnológico e innovación, buscando generar competitividad con enfoque de género'`}
                            />

                            <Textarea
                                id="aportes_conpes_4080"
                                error={form.errors.aportes_conpes_4080}
                                value={form.data.aportes_conpes_4080}
                                onChange={(e) => form.setData('aportes_conpes_4080', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="situacion_actual_produccion_agricola"
                                value="Describa la situación actual del Departamento relacionada con la producción en cadenas agrícolas que han sido priorizadas en la Transformación Derecho Humano a la Alimentación y oportunidades para contribuir con el fortalecimiento de proyectos asociados a este objetivo."
                            />

                            <Textarea
                                id="situacion_actual_produccion_agricola"
                                error={form.errors.situacion_actual_produccion_agricola}
                                value={form.data.situacion_actual_produccion_agricola}
                                onChange={(e) => form.setData('situacion_actual_produccion_agricola', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="aportes_alternativas_generacion_electrica"
                                value="Describa las oportunidades en el departamento y regiones de influencia del Tecnoparque Hub de Innovación para contribuir con la fortalecer proyectos de I + D + i tendientes a aportar alternativas de generación eléctrica a partir de fuentes no convencionales de energía renovable."
                            />

                            <Textarea
                                id="aportes_alternativas_generacion_electrica"
                                error={form.errors.aportes_alternativas_generacion_electrica}
                                value={form.data.aportes_alternativas_generacion_electrica}
                                onChange={(e) => form.setData('aportes_alternativas_generacion_electrica', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="aportes_impulso_economia_popular"
                                value="Describa las oportunidades en el departamento y regiones de influencia del Tecnoparque Hub de Innovación para contribuir con el impulso de la Economía Popular. Proyectos tendientes a aumentar los ingresos de los micronegocios de la economía popular."
                            />

                            <Textarea
                                id="aportes_impulso_economia_popular"
                                error={form.errors.aportes_impulso_economia_popular}
                                value={form.data.aportes_impulso_economia_popular}
                                onChange={(e) => form.setData('aportes_impulso_economia_popular', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="justificacion_pertinencia"
                                value="Justificación y pertinencia  de las acciones que desarrolla el Tecnoparque/Hub de Innovación en el territorio"
                            />

                            <Textarea
                                id="justificacion_pertinencia"
                                error={form.errors.justificacion_pertinencia}
                                value={form.data.justificacion_pertinencia}
                                onChange={(e) => form.setData('justificacion_pertinencia', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                labelFor="acciones_estrategias_campesena"
                                value={`Describa las acciones realizadas en el ${
                                    convocatoria.year - 1
                                }, integradas dentro de la Estrategia Campesena, en las que participó el Tecnoparque/Hub de Innovación`}
                            />

                            <Textarea
                                id="acciones_estrategias_campesena"
                                error={form.errors.acciones_estrategias_campesena}
                                value={form.data.acciones_estrategias_campesena}
                                onChange={(e) => form.setData('acciones_estrategias_campesena', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="bibliografia" value="Bibliografía" />
                            <AlertMui>
                                Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).
                            </AlertMui>

                            <Textarea
                                id="bibliografia"
                                error={form.errors.bibliografia}
                                value={form.data.bibliografia}
                                onChange={(e) => form.setData('bibliografia', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {method == 'POST' || proyecto_hub_linea_69?.proyecto?.allowed?.to_update ? (
                <div className="pt-8 pb-4 space-y-4">
                    <PrimaryButton type="submit" className="ml-auto" disabled={form.processing || !form.isDirty}>
                        Guardar
                    </PrimaryButton>
                </div>
            ) : null}
        </form>
    )
}

export default Form
