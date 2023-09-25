import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import Textarea from '@/Components/Textarea'
import TextInput from '@/Components/TextInput'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'

import { Grid } from '@mui/material'

import { router, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

import { checkRole, monthDiff } from '@/Utils'
import PrimaryButton from '@/Components/PrimaryButton'

const Form = ({
    auth_user,
    proyecto_formulario_3_linea_61,
    convocatoria,
    evaluacion,
    method = 'POST',
    centros_formacion,
    mesas_sectoriales,
    areas_conocimiento,
    lineas_investigacion,
    lineas_estrategicas_sena,
    lineas_tecnoacademia,
    actividades_economicas,
    tematicas_estrategicas,
    tecnoacademia,
    tecnoacademias,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    municipios,
    tipos_eventos,
    roles_sennova,
    allowed_to_create,
    ...props
}) => {
    const is_super_admin = checkRole(auth_user, [1])

    const [array_lineas_tecnoacademia, setArrayLineasTecnoacademia] = useState([])

    const [tiene_video, setTieneVideo] = useState(proyecto_formulario_3_linea_61?.video !== null)
    const [requiere_justificacion_politica_discapacidad, setRequiereJustificacionPoliticaDiscapacidad] = useState(proyecto_formulario_3_linea_61?.justificacion_politica_discapacidad !== null)
    const [requiere_justificacion_atencion_pluralista, setRequiereJustificacionAntencionPluralista] = useState(proyecto_formulario_3_linea_61?.atencion_pluralista_diferencial !== null)

    const [requiere_justificacion_aportes_campesena, setRequiereJustificacionAportesCampesena] = useState(proyecto_formulario_3_linea_61?.aportacion_linea_transeversal_campesena != null)
    const [requiere_justificacion_aportes_produccion_agricola, setRequiereJustificacionAportesProduccionAgricola] = useState(proyecto_formulario_3_linea_61?.aportacion_produccion_agricola != null)
    const [requiere_justificacion_aportes_transicion_energetica, setRequiereJustificacionAportesTransicionEnergetica] = useState(
        proyecto_formulario_3_linea_61?.aportacion_transicion_energetica != null,
    )

    const [array_lineas_investigacion, setArrayLineasInvestigacion] = useState([])

    const form = useForm({
        titulo: proyecto_formulario_3_linea_61?.titulo ?? '',
        fecha_inicio: proyecto_formulario_3_linea_61?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_formulario_3_linea_61?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_formulario_3_linea_61?.max_meses_ejecucion ?? '',
        centro_formacion_id: proyecto_formulario_3_linea_61?.proyecto?.centro_formacion_id ?? null,
        linea_investigacion_id: proyecto_formulario_3_linea_61?.linea_investigacion_id ?? null,

        tematica_estrategica_id: proyecto_formulario_3_linea_61?.tematica_estrategica_id ?? null,
        actividad_economica_id: proyecto_formulario_3_linea_61?.actividad_economica_id ?? null,
        tipo_evento: proyecto_formulario_3_linea_61?.tipo_evento ?? null,

        video: proyecto_formulario_3_linea_61?.video,
        numero_aprendices: proyecto_formulario_3_linea_61?.numero_aprendices,
        municipios: proyecto_formulario_3_linea_61?.proyecto.municipios?.map((item) => item.id),

        programas_formacion: proyecto_formulario_3_linea_61?.proyecto.programas_formacion.map((item) => item.id),

        relacionado_plan_tecnologico: proyecto_formulario_3_linea_61?.relacionado_plan_tecnologico ?? '',
        relacionado_agendas_competitividad: proyecto_formulario_3_linea_61?.relacionado_agendas_competitividad ?? '',
        relacionado_mesas_sectoriales: proyecto_formulario_3_linea_61?.relacionado_mesas_sectoriales ?? '',
        relacionado_tecnoacademia: proyecto_formulario_3_linea_61?.relacionado_tecnoacademia ?? '',

        tecnoacademia_id: tecnoacademia?.id ?? '',
        linea_tecnologica_id: proyecto_formulario_3_linea_61?.proyecto.tecnoacademia_lineas_tecnoacademia?.map((item) => item.id),
        mesa_sectorial_id: proyecto_formulario_3_linea_61?.proyecto.mesas_sectoriales?.map((item) => item.id),

        resumen: proyecto_formulario_3_linea_61?.resumen ?? '',
        antecedentes: proyecto_formulario_3_linea_61?.antecedentes ?? '',
        marco_conceptual: proyecto_formulario_3_linea_61?.marco_conceptual ?? '',
        justificacion_politica_discapacidad: proyecto_formulario_3_linea_61?.justificacion_politica_discapacidad ?? '',
        atencion_pluralista_diferencial: proyecto_formulario_3_linea_61?.atencion_pluralista_diferencial ?? '',
        bibliografia: proyecto_formulario_3_linea_61?.bibliografia ?? '',
        impacto_municipios: proyecto_formulario_3_linea_61?.impacto_municipios ?? '',
        impacto_centro_formacion: proyecto_formulario_3_linea_61?.impacto_centro_formacion ?? '',

        aportacion_linea_transeversal_campesena: proyecto_formulario_3_linea_61?.aportacion_linea_transeversal_campesena,
        aportacion_produccion_agricola: proyecto_formulario_3_linea_61?.aportacion_produccion_agricola,
        aportacion_transicion_energetica: proyecto_formulario_3_linea_61?.aportacion_transicion_energetica,

        alcance_evento: proyecto_formulario_3_linea_61?.alcance_evento,
        centros_formacion: proyecto_formulario_3_linea_61?.centros_formacion,

        cantidad_meses: '',
        cantidad_horas: '',
        rol_sennova: null,
    })

    useEffect(() => {
        const filtered_lineas_tecnoacademia = lineas_tecnoacademia?.filter((obj) => obj.tecnoacademia_id === form.data.tecnoacademia_id)
        setArrayLineasTecnoacademia(filtered_lineas_tecnoacademia)
    }, [form.data.tecnoacademia_id])

    useEffect(() => {
        setArrayLineasInvestigacion([])

        setTimeout(() => {
            setArrayLineasInvestigacion(lineas_investigacion.filter((obj) => obj.centro_formacion_id === form.data.centro_formacion_id))
        }, 500)
    }, [form.data.centro_formacion_id])

    useEffect(() => {
        if (form.data.fecha_inicio && form.data.fecha_finalizacion) {
            form.setData((prevForm) => ({
                ...prevForm,
                max_meses_ejecucion: monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion),
            }))
        }
    }, [form.data.fecha_inicio, form.data.fecha_finalizacion])

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.proyectos-formulario-3-linea-61.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_formulario_3_linea_61.proyecto.allowed.to_update
            ? form.put(route('convocatorias.proyectos-formulario-3-linea-61.update', [convocatoria.id, proyecto_formulario_3_linea_61.id]), {
                  preserveScroll: true,
              })
            : null
    }

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos-formulario-3-linea-61.updateLongColumn', [convocatoria.id, proyecto_formulario_3_linea_61?.proyecto?.id, column]),
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
                <Grid item md={12}>
                    <div className="flex justify-around items-center bg-indigo-50 shadow rounded p-10">
                        <figure>
                            <img src="/images/projects.png" alt="" width={350} />
                        </figure>
                        <h1>
                            {method == 'PUT' ? (
                                <>
                                    <strong>{proyecto_formulario_3_linea_61.titulo}</strong>
                                    <br />
                                    {proyecto_formulario_3_linea_61.proyecto.codigo}
                                </>
                            ) : (
                                <>Formulario 3: Gestión del conocimiento - Línea 61</>
                            )}
                        </h1>
                    </div>
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        labelFor="titulo"
                        className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full"
                        value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)"
                    />
                    <Textarea
                        id="titulo"
                        className={`bg-transparent block border-0 mt-1 outline-none text-4xl text-center w-full`}
                        value={form.data.titulo}
                        onChange={(e) => form.setData('titulo', e.target.value)}
                        disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                        onBlur={() => syncColumnLong('titulo', form)}
                        required
                    />
                </Grid>

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
                        disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
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
                        disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="centro_formacion_id" className="mb-4" value="Centro de formación" />
                </Grid>
                <Grid item md={6}>
                    {method == 'POST' || is_super_admin ? (
                        <Autocomplete
                            id="centro_formacion_id"
                            selectedValue={form.data.centro_formacion_id}
                            onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                            options={
                                centros_formacion ?? [
                                    {
                                        value: proyecto_formulario_3_linea_61?.proyecto.centro_formacion.id,
                                        label: proyecto_formulario_3_linea_61?.proyecto.centro_formacion.nombre,
                                    },
                                ]
                            }
                            disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                            error={form.errors.centro_formacion_id}
                            required
                            onBlur={() => syncColumnLong('centro_formacion_id', form)}
                        />
                    ) : (
                        <>{proyecto_formulario_3_linea_61?.proyecto.centro_formacion.nombre}</>
                    )}
                    <AlertMui> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </AlertMui>
                </Grid>

                {array_lineas_investigacion.length > 0 && (
                    <>
                        <Grid item md={6}>
                            <Label required labelFor="linea_investigacion_id" className="mb-4" value="Línea de investigación" />
                        </Grid>

                        <Grid item md={6}>
                            <Autocomplete
                                id="linea_investigacion_id"
                                selectedValue={form.data.linea_investigacion_id}
                                onChange={(event, newValue) => form.setData('linea_investigacion_id', newValue.value)}
                                disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                                options={array_lineas_investigacion}
                                error={form.errors.linea_investigacion_id}
                                required
                                onBlur={() => syncColumnLong('linea_investigacion_id', form)}
                            />
                        </Grid>
                    </>
                )}

                <Grid item md={6}>
                    <Label required labelFor="linea_programatica_id" className="mb-4" value="Código dependencia presupuestal (SIIF)" />
                </Grid>
                <Grid item md={6}>
                    Gestión del conocimiento
                </Grid>

                {/* <Grid item md={6}>
                    <Label required className="mb-4" labelFor="tipo_evento" value="Tipo de evento" />
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="tipo_evento"
                        options={tipos_eventos}
                        selectedValue={form.data.tipo_evento}
                        onChange={(event, newValue) => form.setData('tipo_evento', newValue.value)}
                        disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                        error={form.errors.tipo_evento}
                        placeholder="Seleccione un tipo de evento"
                        required
                        onBlur={() => syncColumnLong('tipo_evento', form)}
                    />
                </Grid> */}

                <Grid item md={6}>
                    <Label required labelFor="disciplinas_conocimiento" className="mb-4" value="Disciplinas de conocimiento" />
                </Grid>
                <Grid item md={6}>
                    Aplica para todas las disciplinas de conocimiento
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="actividad_economica_id" className="mb-4" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="actividad_economica_id"
                        selectedValue={form.data.actividad_economica_id}
                        onChange={(event, newValue) => form.setData('actividad_economica_id', newValue.value)}
                        disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                        options={actividades_economicas}
                        error={form.errors.actividad_economica_id}
                        required
                        onBlur={() => syncColumnLong('actividad_economica_id', form)}
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="tematica_estrategica_id" className="mb-4" value="Temática estratégica SENA" />
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="tematica_estrategica_id"
                        selectedValue={form.data.tematica_estrategica_id}
                        onChange={(event, newValue) => form.setData('tematica_estrategica_id', newValue.value)}
                        disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                        options={tematicas_estrategicas}
                        error={form.errors.tematica_estrategica_id}
                        required
                        onBlur={() => syncColumnLong('tematica_estrategica_id', form)}
                    />
                </Grid>

                {method == 'POST' && (
                    <>
                        <Grid item md={12}>
                            <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                        </Grid>

                        <Grid item md={6}>
                            <Label required labelFor="rol_sennova" className="mb-4" value="Rol SENNOVA" />
                        </Grid>

                        <Grid item md={6}>
                            <Autocomplete
                                id="rol_sennova"
                                selectedValue={form.data.rol_sennova}
                                onChange={(event, newValue) => form.setData('rol_sennova', newValue.value)}
                                disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                                options={roles_sennova}
                                placeholder="Seleccione un rol SENNOVA"
                                required
                            />
                        </Grid>

                        {form.data.fecha_inicio && form.data.fecha_finalizacion && (
                            <>
                                <Grid item md={6}>
                                    <Label required labelFor="cantidad_meses" className="mb-4" value="Número de meses de vinculación al proyecto" />
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
                                        className="mt-1"
                                        value={form.data.cantidad_meses}
                                        onChange={(e) => form.setData('cantidad_meses', e.target.value)}
                                        disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                                        placeholder="Número de meses de vinculación"
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
                            <Label required labelFor="cantidad_horas" className="mb-4" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                        </Grid>

                        <Grid item md={6}>
                            <TextInput
                                type="number"
                                id="cantidad_horas"
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                }}
                                className="mt-1"
                                value={form.data.cantidad_horas}
                                onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                disabled={!(proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update || allowed_to_create)}
                                placeholder="Número de horas semanales dedicadas"
                                required
                            />
                        </Grid>
                    </>
                )}

                {method == 'PUT' && (
                    <>
                        <Grid item md={6}>
                            <Label labelFor="video" value="¿El proyecto tiene video?" />
                            <AlertMui className="mt-2 mr-4">
                                Video de 3 minutos, en donde se presente de manera sencilla y dinámica la justificación del proyecto, la problemática, el objetivo general, los objetivos específicos,
                                las actividades, los productos y su impacto en el marco del mecanismo de participación seleccionado como regional.
                            </AlertMui>
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui className="mb-4" checked={tiene_video} disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update} onChange={() => setTieneVideo(!tiene_video)} />
                            {tiene_video && (
                                <TextInput
                                    label="Link del video"
                                    id="video"
                                    type="url"
                                    className="mt-1"
                                    error={form.errors.video}
                                    placeholder="Link del video del proyecto https://www.youtube.com/watch?v=gmc4tk"
                                    value={form.data.video}
                                    onChange={(e) => form.setData('video', e.target.value)}
                                    disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                    onBlur={() => syncColumnLong('video', form)}
                                />
                            )}
                        </Grid>
                        <Grid item md={6}>
                            <Label
                                id="aportacion_linea_transeversal_campesena"
                                value="¿El proyecto aporta a la divulgación y apropiación del conocimiento relacionado con los retos que incorpora la línea estratégica transversal de campesena, tendientes a generar y articular mecanismos de atención diferencial, integral e incluyente, para los campesinos, de acuerdo con sus particularidades sociales, culturales, económicas y territoriales?"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui
                                className="mb-4"
                                checked={requiere_justificacion_aportes_campesena}
                                onChange={() => setRequiereJustificacionAportesCampesena(!requiere_justificacion_aportes_campesena)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                            />
                            {requiere_justificacion_aportes_campesena && (
                                <>
                                    <Textarea
                                        label="Justificación"
                                        id="aportacion_linea_transeversal_campesena"
                                        onChange={(e) => form.setData('aportacion_linea_transeversal_campesena', e.target.value)}
                                        disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                        error={form.errors.aportacion_linea_transeversal_campesena}
                                        value={form.data.aportacion_linea_transeversal_campesena}
                                        onBlur={() => syncColumnLong('aportacion_linea_transeversal_campesena', form)}
                                    />
                                </>
                            )}
                        </Grid>
                        <Grid item md={6}>
                            <Label
                                id="aportacion_produccion_agricola"
                                value="¿El proyecto aporta a la divulgación y apropiación del conocimiento relacionado con los retos que incorpora la línea estratégica de producción para la vida: tendientes a aumentar la producción en cadenas agrícolas priorizadas para el Derecho Humano a la Alimentación?"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui
                                className="mb-4"
                                checked={requiere_justificacion_aportes_produccion_agricola}
                                onChange={() => setRequiereJustificacionAportesProduccionAgricola(!requiere_justificacion_aportes_produccion_agricola)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                            />
                            {requiere_justificacion_aportes_produccion_agricola && (
                                <>
                                    <Textarea
                                        label="Justificación"
                                        id="aportacion_produccion_agricola"
                                        onChange={(e) => form.setData('aportacion_produccion_agricola', e.target.value)}
                                        disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                        error={form.errors.aportacion_produccion_agricola}
                                        value={form.data.aportacion_produccion_agricola}
                                        onBlur={() => syncColumnLong('aportacion_produccion_agricola', form)}
                                    />
                                </>
                            )}
                        </Grid>
                        <Grid item md={6}>
                            <Label
                                id="aportacion_transicion_energetica"
                                value="¿El proyecto aporta a la divulgación y apropiación del conocimiento relacionado con los retos que incorpora la línea estratégica de transición energética para la vida relacionados con la generación de energía?"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui
                                className="mb-4"
                                checked={requiere_justificacion_aportes_transicion_energetica}
                                onChange={() => setRequiereJustificacionAportesTransicionEnergetica(!requiere_justificacion_aportes_transicion_energetica)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                            />
                            {requiere_justificacion_aportes_transicion_energetica && (
                                <>
                                    <Textarea
                                        label="Justificación"
                                        id="aportacion_transicion_energetica"
                                        onChange={(e) => form.setData('aportacion_transicion_energetica', e.target.value)}
                                        disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                        error={form.errors.aportacion_transicion_energetica}
                                        value={form.data.aportacion_transicion_energetica}
                                        onBlur={() => syncColumnLong('aportacion_transicion_energetica', form)}
                                    />
                                </>
                            )}
                        </Grid>

                        <Grid item md={6}>
                            <Label labelFor="justificacion_politica_discapacidad" value="¿El proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad?" />
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui
                                className="mb-4"
                                checked={requiere_justificacion_politica_discapacidad}
                                onChange={() => setRequiereJustificacionPoliticaDiscapacidad(!requiere_justificacion_politica_discapacidad)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                            />

                            {requiere_justificacion_politica_discapacidad && (
                                <>
                                    <Textarea
                                        label="Justificación"
                                        id="justificacion_politica_discapacidad"
                                        onChange={(e) => form.setData('justificacion_politica_discapacidad', e.target.value)}
                                        disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                        error={form.errors.justificacion_politica_discapacidad}
                                        value={form.data.justificacion_politica_discapacidad}
                                        onBlur={() => syncColumnLong('justificacion_politica_discapacidad', form)}
                                    />
                                    <AlertMui>
                                        Si el proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad por favor realice la justificación. RESOLUCIÓN 01726 DE 2014 -
                                        Por la cual se adopta la Política Institucional para Atención de las Personas con discapacidad.
                                    </AlertMui>
                                </>
                            )}
                        </Grid>
                        <Grid item md={6}>
                            <Label
                                labelFor="atencion_pluralista_diferencial"
                                value="¿El proyecto aporta a la Política Institucional de Atención con Enfoque Pluralista y Diferencial (acuerdo 0010 de 2016)?"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui
                                className="mb-4"
                                checked={requiere_justificacion_atencion_pluralista}
                                onChange={() => setRequiereJustificacionAntencionPluralista(!requiere_justificacion_atencion_pluralista)}
                            />

                            {requiere_justificacion_atencion_pluralista && (
                                <Textarea
                                    label="Justificación"
                                    id="atencion_pluralista_diferencial"
                                    error={form.errors.atencion_pluralista_diferencial}
                                    value={form.data.atencion_pluralista_diferencial}
                                    onChange={(e) => form.setData('atencion_pluralista_diferencial', e.target.value)}
                                    disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                    onBlur={() => syncColumnLong('atencion_pluralista_diferencial', form)}
                                />
                            )}
                        </Grid>
                        <Grid item md={6}>
                            <Label required className="mb-4" labelFor="relacionado_plan_tecnologico" value="¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="relacionado_plan_tecnologico"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.relacionado_plan_tecnologico}
                                error={form.errors.relacionado_plan_tecnologico}
                                onChange={(event, newValue) => {
                                    form.setData('relacionado_plan_tecnologico', newValue.value)
                                }}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                placeholder="Seleccione una opción"
                                required
                                onBlur={() => syncColumnLong('relacionado_plan_tecnologico', form)}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <Label
                                required
                                className="mb-4"
                                labelFor="relacionado_agendas_competitividad"
                                value="¿El proyecto se alinea con las Agendas Departamentales de Competitividad e Innovación?"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="relacionado_agendas_competitividad"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.relacionado_agendas_competitividad}
                                error={form.errors.relacionado_agendas_competitividad}
                                onChange={(event, newValue) => {
                                    form.setData('relacionado_agendas_competitividad', newValue.value)
                                }}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                placeholder="Seleccione una opción"
                                required
                                onBlur={() => syncColumnLong('relacionado_agendas_competitividad', form)}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <Label required className="mb-4" labelFor="relacionado_mesas_sectoriales" value="¿El proyecto se alinea con las Mesas Sectoriales?" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="relacionado_mesas_sectoriales"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.relacionado_mesas_sectoriales}
                                error={form.errors.relacionado_mesas_sectoriales}
                                onChange={(event, newValue) => {
                                    form.setData('relacionado_mesas_sectoriales', newValue.value)
                                }}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                placeholder="Seleccione una opción"
                                required
                                onBlur={() => syncColumnLong('relacionado_mesas_sectoriales', form)}
                            />
                        </Grid>
                        {form.data.relacionado_mesas_sectoriales == 1 && (
                            <>
                                <Grid item md={6}>
                                    <p className="text-app-600">Por favor seleccione la o las mesas sectoriales con la cual o las cuales se alinea el proyecto</p>
                                </Grid>
                                <Grid item md={6}>
                                    <SelectMultiple
                                        id="mesa_sectorial_id"
                                        bdValues={form.data.mesa_sectorial_id}
                                        options={mesas_sectoriales}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                mesa_sectorial_id: selected_values,
                                            }))
                                        }}
                                        disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                        error={form.errors.mesa_sectorial_id}
                                        placeholder="Seleccione las mesas sectoriales"
                                        required
                                        onBlur={() => syncColumnLong('mesa_sectorial_id', form)}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item md={6}>
                            <Label required className="mb-4" labelFor="relacionado_tecnoacademia" value="¿El proyecto se formuló en conjunto con la tecnoacademia?" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="relacionado_tecnoacademia"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.relacionado_tecnoacademia}
                                error={form.errors.relacionado_tecnoacademia}
                                onChange={(event, newValue) => {
                                    form.setData('relacionado_tecnoacademia', newValue.value)
                                }}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                placeholder="Seleccione una opción"
                                required
                                onBlur={() => syncColumnLong('relacionado_tecnoacademia', form)}
                            />
                        </Grid>
                        {form.data.relacionado_tecnoacademia == 1 && (
                            <>
                                <Grid item md={6}>
                                    <p className="text-app-600">Por favor seleccione la Tecnoacademia con la cual articuló el proyecto</p>
                                </Grid>

                                <Grid item md={6}>
                                    <Autocomplete
                                        id="tecnoacademia_id"
                                        options={tecnoacademias}
                                        selectedValue={form.data.tecnoacademia_id}
                                        onChange={(event, newValue) => {
                                            form.setData('tecnoacademia_id', newValue.value)
                                        }}
                                        disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                        required
                                    />
                                    <SelectMultiple
                                        className="mt-10"
                                        id="linea_tecnologica_id"
                                        bdValues={form.data.linea_tecnologica_id}
                                        options={array_lineas_tecnoacademia}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                linea_tecnologica_id: selected_values,
                                            }))
                                        }}
                                        disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                        error={form.errors.linea_tecnologica_id}
                                        label="Seleccione las líneas tecnológicas"
                                        required
                                        onBlur={() => syncColumnLong('linea_tecnologica_id', form)}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item md={12}>
                            <Label required className="mb-4" labelFor="resumen" value="Resumen del proyecto" />
                            <AlertMui>
                                Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo
                                resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                            </AlertMui>

                            <Textarea
                                id="resumen"
                                value={form.data.resumen}
                                onChange={(e) => form.setData('resumen', e.target.value)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('resumen', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required className="mb-4" labelFor="antecedentes" value="Antecedentes" />
                            <AlertMui>
                                Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la
                                temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición.
                            </AlertMui>

                            <Textarea
                                id="antecedentes"
                                error={form.errors.antecedentes}
                                value={form.data.antecedentes}
                                onChange={(e) => form.setData('antecedentes', e.target.value)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('antecedentes', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required className="mb-4" labelFor="marco_conceptual" value="Marco conceptual" />
                            <AlertMui>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</AlertMui>

                            <Textarea
                                id="marco_conceptual"
                                error={form.errors.marco_conceptual}
                                value={form.data.marco_conceptual}
                                onChange={(e) => form.setData('marco_conceptual', e.target.value)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('marco_conceptual', form)}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <Label required className="mb-4" labelFor="numero_aprendices" value="Número de los aprendices que se beneficiarán en la ejecución del proyecto" />
                        </Grid>
                        <Grid item md={6}>
                            <TextInput
                                label="Número de aprendices"
                                id="numero_aprendices"
                                type="number"
                                inputProps={{
                                    min: 0,
                                    max: 9999,
                                }}
                                className="mt-1"
                                error={form.errors.numero_aprendices}
                                placeholder="Escriba el número de aprendices que se beneficiarán en la ejecución del proyecto"
                                value={form.data.numero_aprendices}
                                onChange={(e) => form.setData('numero_aprendices', e.target.value)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('numero_aprendices', form)}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <Label required className="mb-4" labelFor="municipios" value="Nombre de los municipios beneficiados" />
                        </Grid>
                        <Grid item md={6}>
                            <SelectMultiple
                                id="municipios"
                                bdValues={form.data.municipios}
                                options={municipios}
                                isGroupable={true}
                                groupBy={(option) => option.group}
                                onChange={(event, newValue) => {
                                    const selected_values = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        municipios: selected_values,
                                    }))
                                }}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                error={form.errors.municipios}
                                placeholder="Seleccionar municipios"
                                required
                                onBlur={() => syncColumnLong('municipios', form)}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <Label required className="mb-4" labelFor="programas_formacion" value="Nombre de los programas de formación con registro calificado a impactar" />
                        </Grid>
                        <Grid item md={6}>
                            <SelectMultiple
                                id="programas_formacion"
                                bdValues={form.data.programas_formacion}
                                options={programas_formacion_con_registro_calificado}
                                onChange={(event, newValue) => {
                                    const selected_values = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        programas_formacion: selected_values,
                                    }))
                                }}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                error={form.errors.programas_formacion}
                                placeholder="Seleccione los programas de formación"
                                required
                                onBlur={() => syncColumnLong('programas_formacion', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio en los municipios" />

                            <Textarea
                                id="impacto_municipios"
                                error={form.errors.impacto_municipios}
                                value={form.data.impacto_municipios}
                                onChange={(e) => form.setData('impacto_municipios', e.target.value)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('impacto_municipios', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />

                            <Textarea
                                id="impacto_centro_formacion"
                                error={form.errors.impacto_centro_formacion}
                                value={form.data.impacto_centro_formacion}
                                onChange={(e) => form.setData('impacto_centro_formacion', e.target.value)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('impacto_centro_formacion', form)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required className="mb-4" labelFor="bibliografia" value="Bibliografía" />
                            <AlertMui>
                                Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).
                            </AlertMui>

                            <Textarea
                                id="bibliografia"
                                error={form.errors.bibliografia}
                                value={form.data.bibliografia}
                                onChange={(e) => form.setData('bibliografia', e.target.value)}
                                disabled={!proyecto_formulario_3_linea_61?.proyecto?.allowed?.to_update}
                                required
                                onBlur={() => syncColumnLong('bibliografia', form)}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {method == 'POST' || proyecto_formulario_3_linea_61.proyecto?.allowed?.to_update ? (
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
