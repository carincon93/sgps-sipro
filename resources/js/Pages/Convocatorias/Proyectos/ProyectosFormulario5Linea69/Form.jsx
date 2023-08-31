import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { monthDiff } from '@/Utils'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useEffect } from 'react'

const Form = ({ auth_user, method = '', convocatoria, proyecto_formulario_5_linea_69, nodos_tecnoparque, lineas_programaticas, roles_sennova, evaluacion, ...props }) => {
    const form = useForm({
        _method: method,
        centro_formacion_id: proyecto_formulario_5_linea_69?.proyecto.centro_formacion_id ?? '',
        fecha_inicio: proyecto_formulario_5_linea_69?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_formulario_5_linea_69?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_formulario_5_linea_69?.max_meses_ejecucion ?? '',
        nodo_tecnoparque_id: proyecto_formulario_5_linea_69?.nodo_tecnoparque_id ?? '',
        articulacion_agenda_competitividad: proyecto_formulario_5_linea_69?.articulacion_agenda_competitividad ?? '',
        aportes_linea_ocho_conpes: proyecto_formulario_5_linea_69?.aportes_linea_ocho_conpes ?? '',
        estado_ecosistema_ctel: proyecto_formulario_5_linea_69?.estado_ecosistema_ctel ?? '',
        logros_vigencia_anterior: proyecto_formulario_5_linea_69?.logros_vigencia_anterior ?? '',

        resumen: proyecto_formulario_5_linea_69?.resumen ?? '',
        resumen_regional: proyecto_formulario_5_linea_69?.resumen_regional ?? '',
        antecedentes: proyecto_formulario_5_linea_69?.antecedentes ?? '',
        antecedentes_regional: proyecto_formulario_5_linea_69?.antecedentes_regional ?? '',
        marco_conceptual: proyecto_formulario_5_linea_69?.marco_conceptual ?? '',
        bibliografia: proyecto_formulario_5_linea_69?.bibliografia ?? '',
        retos_oportunidades: proyecto_formulario_5_linea_69?.retos_oportunidades ?? '',
        pertinencia_territorio: proyecto_formulario_5_linea_69?.pertinencia_territorio ?? '',

        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.proyectos-formulario-5-linea-69.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_formulario_5_linea_69.proyecto.allowed.to_update
            ? form.post(route('convocatorias.proyectos-formulario-5-linea-69.update', [convocatoria.id, proyecto_formulario_5_linea_69.id]), {
                  preserveScroll: true,
              })
            : null
    }

    useEffect(() => {
        form.setData('max_meses_ejecucion', monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion))
    }, [form.data.fecha_inicio && form.data.fecha_finalizacion])

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos-formulario-5-linea-69.updateLongColumn', [convocatoria.id, proyecto_formulario_5_linea_69?.proyecto?.id, column]),
                    { [column]: data ? data : form.data[column], is_array: Array.isArray(form.data[column]) },
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
                                    <strong>{proyecto_formulario_5_linea_69.titulo}</strong>
                                    <br />
                                    {proyecto_formulario_5_linea_69.proyecto.codigo}
                                </>
                            ) : (
                                <>Parques tecnológicos - Red tecnoparque Colombia - Línea 69</>
                            )}
                        </h1>
                    </div>
                </Grid>

                {nodos_tecnoparque.length > 0 ? (
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
                                    error={form.errors.nodo_tecnoparque_id}
                                    disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                    required
                                    onBlur={() => syncColumnLong('nodo_tecnoparque_id', form)}
                                />
                            ) : (
                                <>{proyecto_formulario_5_linea_69?.titulo}</>
                            )}
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
                            <p className="first-letter:uppercase">{proyecto_formulario_5_linea_69?.proyecto.centro_formacion.nombre}</p>
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
                        onChange={(e) => (form.setData('fecha_inicio', e.target.value), syncColumnLong('fecha_inicio', form, e.target.value))}
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
                        onChange={(e) => (form.setData('fecha_finalizacion', e.target.value), syncColumnLong('fecha_finalizacion', form, e.target.value))}
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
                                error={form.errors.rol_sennova}
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
                                        error={form.errors.cantidad_meses}
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
                                error={form.errors.cantidad_horas}
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
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('resumen', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Textarea
                                id="resumen_regional"
                                label="Complemento - Resumen ejecutivo regional"
                                error={form.errors.resumen_regional}
                                value={form.data.resumen_regional}
                                onChange={(e) => form.setData('resumen_regional', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
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
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => {
                                    syncColumnLong('antecedentes', form)
                                }}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Textarea
                                id="antecedentes_regional"
                                label="Complemento - Antecedentes regional"
                                error={form.errors.antecedentes_regional}
                                value={form.data.antecedentes_regional}
                                onChange={(e) => form.setData('antecedentes_regional', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('antecedentes_regional', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Textarea
                                id="retos_oportunidades"
                                label="Descripción de retos y prioridades locales y regionales en los cuales el Tecnoparque tiene impacto"
                                error={form.errors.retos_oportunidades}
                                value={form.data.retos_oportunidades}
                                onChange={(e) => form.setData('retos_oportunidades', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('retos_oportunidades', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Textarea
                                id="articulacion_agenda_competitividad"
                                label="Articulación y contribución del Tecnoparque con la Agenda de la Comisión Regional de Competitividad"
                                error={form.errors.articulacion_agenda_competitividad}
                                value={form.data.articulacion_agenda_competitividad}
                                onChange={(e) => form.setData('articulacion_agenda_competitividad', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('articulacion_agenda_competitividad', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Textarea
                                id="aportes_linea_ocho_conpes"
                                label={`Aportes del Tecnoparque en el ${convocatoria.year} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos CONPES'`}
                                error={form.errors.aportes_linea_ocho_conpes}
                                value={form.data.aportes_linea_ocho_conpes}
                                onChange={(e) => form.setData('aportes_linea_ocho_conpes', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('aportes_linea_ocho_conpes', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Textarea
                                id="estado_ecosistema_ctel"
                                label="Describir el estado actual del Ecosistema Territorial de CTeI en el Departamento y las oportunidades de articulación con el Tecnoparque"
                                error={form.errors.estado_ecosistema_ctel}
                                value={form.data.estado_ecosistema_ctel}
                                onChange={(e) => form.setData('estado_ecosistema_ctel', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('estado_ecosistema_ctel', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Textarea
                                id="logros_vigencia_anterior"
                                label={`Describa los principales logros del Tecnoparque en el ${convocatoria.year - 1}`}
                                error={form.errors.logros_vigencia_anterior}
                                value={form.data.logros_vigencia_anterior}
                                onChange={(e) => form.setData('logros_vigencia_anterior', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('logros_vigencia_anterior', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Textarea
                                id="pertinencia_territorio"
                                label="Justificación y pertinencia en el territorio"
                                error={form.errors.pertinencia_territorio}
                                value={form.data.pertinencia_territorio}
                                onChange={(e) => form.setData('pertinencia_territorio', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('pertinencia_territorio', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required labelFor="marco_conceptual" value="Marco conceptual" />
                            <AlertMui>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</AlertMui>

                            <Textarea
                                id="marco_conceptual"
                                error={form.errors.marco_conceptual}
                                value={form.data.marco_conceptual}
                                onChange={(e) => form.setData('marco_conceptual', e.target.value)}
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('marco_conceptual', form)}
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
                                required
                                disabled={!proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update}
                                onBlur={() => syncColumnLong('bibliografia', form)}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {method == 'POST' || proyecto_formulario_5_linea_69?.proyecto?.allowed?.to_update ? (
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
