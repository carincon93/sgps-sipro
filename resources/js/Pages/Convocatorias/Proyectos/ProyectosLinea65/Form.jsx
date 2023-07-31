import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import RadioMui from '@/Components/Radio'
import Textarea from '@/Components/Textarea'
import TextInput from '@/Components/TextInput'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'

import { Grid, RadioGroup, TableCell, TableRow } from '@mui/material'

import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

import { monthDiff } from '@/Utils'
import PrimaryButton from '@/Components/PrimaryButton'

const Form = ({
    is_super_admin,
    proyecto_linea_65,
    convocatoria,
    evaluacion,
    method = 'crear',
    centros_formacion,
    mesas_sectoriales,
    areas_conocimiento,
    lineas_investigacion,
    lineas_programaticas,
    lineas_tecnoacademia,
    actividades_economicas,
    tematicas_estrategicas,
    tecnoacademia,
    tecnoacademias,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    municipios,
    tipos_proyectos,
    tipos_eventos,
    roles_sennova,
    ...props
}) => {
    const [array_lineas_tecnoacademia, setArrayLineasTecnoacademia] = useState([])

    const [tiene_video, setTieneVideo] = useState(proyecto_linea_65?.video !== null)
    const [requiere_justificacion_industria4, setRequiereJustificacionIndustria4] = useState(proyecto_linea_65?.justificacion_industria_4 !== null)
    const [requiere_justificacion_economia_naranja, setRequiereJustificacionEconomiaNaranja] = useState(proyecto_linea_65?.justificacion_economia_naranja !== null)
    const [requiere_justificacion_politica_discapacidad, setRequiereJustificacionPoliticaDiscapacidad] = useState(proyecto_linea_65?.justificacion_politica_discapacidad !== null)
    const [requiere_justificacion_atencion_pluralista, setRequiereJustificacionAntencionPluralista] = useState(proyecto_linea_65?.atencion_pluralista_diferencial !== null)
    const [requiere_justificacion_sector_agricola, setRequiereJustificacionSectorAgricola] = useState(proyecto_linea_65?.impacto_sector_agricola !== null)

    const [array_lineas_investigacion, setArrayLineasInvestigacion] = useState([])

    const form = useForm({
        titulo: proyecto_linea_65?.titulo ?? '',
        fecha_inicio: proyecto_linea_65?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_linea_65?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_linea_65?.max_meses_ejecucion ?? '',
        centro_formacion_id: proyecto_linea_65?.proyecto?.centro_formacion_id ?? null,
        linea_investigacion_id: proyecto_linea_65?.linea_investigacion_id ?? null,
        linea_programatica_id: proyecto_linea_65?.proyecto?.linea_programatica_id ?? null,
        area_conocimiento_id: proyecto_linea_65?.area_conocimiento_id ?? null,
        tematica_estrategica_id: proyecto_linea_65?.tematica_estrategica_id ?? null,
        actividad_economica_id: proyecto_linea_65?.actividad_economica_id ?? null,
        tipo_proyecto: proyecto_linea_65?.tipo_proyecto ?? null,

        video: proyecto_linea_65?.video,
        numero_aprendices: proyecto_linea_65?.numero_aprendices,
        municipios: proyecto_linea_65?.proyecto.municipios?.map((item) => item.id),

        programas_formacion: proyecto_linea_65?.proyecto.programas_formacion.map((item) => item.id),
        programas_formacion_articulados: proyecto_linea_65?.proyecto.programas_formacion.map((item) => item.id),

        muestreo: proyecto_linea_65?.muestreo ?? '',
        actividades_muestreo: proyecto_linea_65?.actividades_muestreo ?? '',
        objetivo_muestreo: proyecto_linea_65?.objetivo_muestreo ?? '',
        recoleccion_especimenes: proyecto_linea_65?.recoleccion_especimenes ?? '',
        relacionado_plan_tecnologico: proyecto_linea_65?.relacionado_plan_tecnologico ?? '',
        relacionado_agendas_competitividad: proyecto_linea_65?.relacionado_agendas_competitividad ?? '',
        relacionado_mesas_sectoriales: proyecto_linea_65?.relacionado_mesas_sectoriales ?? '',
        relacionado_tecnoacademia: proyecto_linea_65?.relacionado_tecnoacademia ?? '',

        tecnoacademia_id: tecnoacademia?.id ?? '',
        linea_tecnologica_id: proyecto_linea_65?.tecnoacademia_lineas_tecnoacademia?.map((item) => item.id),
        mesa_sectorial_id: proyecto_linea_65?.mesas_sectoriales?.map((item) => item.id),

        resumen: proyecto_linea_65?.resumen ?? '',
        antecedentes: proyecto_linea_65?.antecedentes ?? '',
        marco_conceptual: proyecto_linea_65?.marco_conceptual ?? '',
        justificacion_industria_4: proyecto_linea_65?.justificacion_industria_4 ?? '',
        justificacion_economia_naranja: proyecto_linea_65?.justificacion_economia_naranja ?? '',
        justificacion_politica_discapacidad: proyecto_linea_65?.justificacion_politica_discapacidad ?? '',
        atencion_pluralista_diferencial: proyecto_linea_65?.atencion_pluralista_diferencial ?? '',
        impacto_sector_agricola: proyecto_linea_65?.impacto_sector_agricola ?? '',
        bibliografia: proyecto_linea_65?.bibliografia ?? '',
        impacto_municipios: proyecto_linea_65?.impacto_municipios ?? '',
        impacto_centro_formacion: proyecto_linea_65?.impacto_centro_formacion ?? '',

        cantidad_meses: '',
        cantidad_horas: '',
        rol_sennova: null,
    })

    useEffect(() => {
        const filtered_lineas_tecnoacademia = lineas_tecnoacademia?.filter((obj) => obj.tecnoacademia_id === form.data.tecnoacademia_id)
        setArrayLineasTecnoacademia(filtered_lineas_tecnoacademia)
    }, [form.data.tecnoacademia_id])

    useEffect(() => {
        setArrayLineasInvestigacion(lineas_investigacion.filter((obj) => obj.centro_formacion_id === form.data.centro_formacion_id))
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
        method == 'crear'
            ? form.post(route('convocatorias.proyectos-linea-65.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_linea_65.proyecto.allowed.to_update
            ? form.put(route('convocatorias.proyectos-linea-65.update', [convocatoria.id, proyecto_linea_65.id]), {
                  preserveScroll: true,
              })
            : null
    }

    return (
        <form onSubmit={submit}>
            <Grid container className="space-y-36">
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
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="fecha_inicio" error={form.errors.fecha_inicio} value="Fecha de inicio" />
                </Grid>
                <Grid item md={6}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_inicio"
                        name="fecha_inicio"
                        value={form.data.fecha_inicio}
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
                        name="fecha_finalizacion"
                        value={form.data.fecha_finalizacion}
                        className="p-4 w-full"
                        onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="centro_formacion_id" className="mb-4" value="Centro de formación" />
                    <br />
                    <small> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </small>
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="centro_formacion_id"
                        selectedValue={form.data.centro_formacion_id}
                        onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                        options={
                            centros_formacion ?? [
                                {
                                    value: proyecto_linea_65?.proyecto.centro_formacion.id,
                                    label: proyecto_linea_65?.proyecto.centro_formacion.nombre,
                                },
                            ]
                        }
                        error={form.errors.centro_formacion_id}
                        required
                    />
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
                                options={array_lineas_investigacion}
                                error={form.errors.linea_investigacion_id}
                                required
                            />
                        </Grid>
                    </>
                )}

                <Grid item md={6}>
                    <Label required labelFor="linea_programatica_id" className="mb-4" value="Código dependencia presupuestal (SIIF)" />
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="linea_programatica_id"
                        selectedValue={form.data.linea_programatica_id}
                        onChange={(event, newValue) => form.setData('linea_programatica_id', newValue.value)}
                        options={
                            method == 'crear'
                                ? lineas_programaticas
                                : [
                                      {
                                          value: proyecto_linea_65?.proyecto.linea_programatica.id,
                                          label: proyecto_linea_65?.proyecto.linea_programatica.nombre + ' - ' + proyecto_linea_65?.proyecto.linea_programatica.codigo,
                                      },
                                  ]
                        }
                        error={form.errors.linea_programatica_id}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="tipo_proyecto" value="Tipo de proyecto" />
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="tipo_proyecto"
                        options={tipos_proyectos}
                        selectedValue={form.data.tipo_proyecto}
                        onChange={(event, newValue) => form.setData('tipo_proyecto', newValue.value)}
                        error={form.errors.tipo_proyecto}
                        placeholder="Seleccione un tipo de proyecto"
                        required
                        disabled={evaluacion ? true : false}
                    />
                </Grid>

                {form.data.tipo_proyecto == 2 && (
                    <>
                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="tipo_evento" value="Tipo de evento" />
                        </Grid>

                        <Grid item md={6}>
                            <Autocomplete
                                id="tipo_evento"
                                options={tipos_eventos}
                                selectedValue={form.data.tipo_evento}
                                onChange={(event, newValue) => form.setData('tipo_evento', newValue.value)}
                                error={form.errors.tipo_evento}
                                placeholder="Seleccione un tipo de evento"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                    </>
                )}

                <Grid item md={6}>
                    <Label required labelFor="area_conocimiento_id" className="mb-4" value="Área de conocimiento" />
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="area_conocimiento_id"
                        selectedValue={form.data.area_conocimiento_id}
                        onChange={(event, newValue) => form.setData('area_conocimiento_id', newValue.value)}
                        options={areas_conocimiento}
                        error={form.errors.area_conocimiento_id}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="actividad_economica_id" className="mb-4" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="actividad_economica_id"
                        selectedValue={form.data.actividad_economica_id}
                        onChange={(event, newValue) => form.setData('actividad_economica_id', newValue.value)}
                        options={actividades_economicas}
                        error={form.errors.actividad_economica_id}
                        required
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
                        options={tematicas_estrategicas}
                        error={form.errors.tematica_estrategica_id}
                        required
                    />
                </Grid>

                {method == 'crear' && (
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
                            <Label required labelFor="cantidad_horas" className="mb-4" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                        </Grid>

                        <Grid item md={6}>
                            <TextInput
                                type="number"
                                id="cantidad_horas"
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                    max: form.data.rol_sennova?.maxHoras,
                                }}
                                className="mt-1"
                                value={form.data.cantidad_horas}
                                onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                placeholder="Número de horas semanales dedicadas"
                                required
                            />
                        </Grid>
                    </>
                )}

                {method == 'editar' && (
                    <>
                        <Grid item md={6}>
                            <Label labelFor="video" value="¿El proyecto tiene video?" />
                            <AlertMui className="mt-2 mr-4">
                                Video de 3 minutos, en donde se presente de manera sencilla y dinámica la justificación del proyecto, la problemática, el objetivo general, los objetivos específicos,
                                las actividades, los productos y su impacto en el marco del mecanismo de participación seleccionado como regional.
                            </AlertMui>
                        </Grid>

                        <Grid item md={6}>
                            <SwitchMui checked={tiene_video} onChange={() => setTieneVideo(!tiene_video)} />
                            {tiene_video && (
                                <>
                                    <TextInput
                                        label="Link del video"
                                        id="video"
                                        type="url"
                                        className="mt-1"
                                        error={form.errors.video}
                                        placeholder="Link del video del proyecto https://www.youtube.com/watch?v=gmc4tk"
                                        value={form.data.video}
                                        onChange={(e) => form.setData('video', e.target.value)}
                                        required={tiene_video ? true : undefined}
                                    />
                                </>
                            )}
                        </Grid>

                        <Grid item md={6}>
                            <Label id="justificacion_industria_4" value="¿El proyecto está relacionado con la industria 4.0?" />
                        </Grid>

                        <Grid item md={6}>
                            <SwitchMui checked={requiere_justificacion_industria4} onChange={() => setRequiereJustificacionIndustria4(!requiere_justificacion_industria4)} />
                            {requiere_justificacion_industria4 && (
                                <>
                                    <Textarea
                                        label="Justificación"
                                        id="justificacion_industria_4"
                                        onChange={(e) => form.setData('justificacion_industria_4', e.target.value)}
                                        error={form.errors.justificacion_industria_4}
                                        value={form.data.justificacion_industria_4}
                                        required={requiere_justificacion_industria4 ? true : undefined}
                                    />
                                    <AlertMui>Si el proyecto está relacionado con la industria 4.0 por favor realice la justificación.</AlertMui>
                                </>
                            )}
                        </Grid>

                        <Grid item md={6}>
                            <Label labelFor="justificacion_economia_naranja" value="¿El proyecto está relacionado con la economía naranja?" />
                        </Grid>

                        <Grid item md={6}>
                            <SwitchMui checked={requiere_justificacion_economia_naranja} onChange={() => setRequiereJustificacionEconomiaNaranja(!requiere_justificacion_economia_naranja)} />
                            {requiere_justificacion_economia_naranja && (
                                <>
                                    <Textarea
                                        label="Justificación"
                                        id="justificacion_economia_naranja"
                                        onChange={(e) => form.setData('justificacion_economia_naranja', e.target.value)}
                                        error={form.errors.justificacion_economia_naranja}
                                        value={form.data.justificacion_economia_naranja}
                                        required={requiere_justificacion_economia_naranja ? true : undefined}
                                    />
                                    <AlertMui>
                                        Si el proyecto está relacionado con la economía naranja por favor realice la justificación. (Ver documento de apoyo: Guía Rápida SENA es NARANJA.)
                                    </AlertMui>
                                </>
                            )}
                        </Grid>

                        <Grid item md={6}>
                            <Label labelFor="impacto_sector_agricola" value="¿El proyecto tendrá un impacto en el sector agrícola?" />
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui checked={requiere_justificacion_sector_agricola} onChange={() => setRequiereJustificacionSectorAgricola(!requiere_justificacion_sector_agricola)} />
                            {requiere_justificacion_sector_agricola && (
                                <Textarea
                                    label="Justificación"
                                    id="impacto_sector_agricola"
                                    onChange={(e) => form.setData('impacto_sector_agricola', e.target.value)}
                                    error={form.errors.impacto_sector_agricola}
                                    value={form.data.impacto_sector_agricola}
                                    required={requiere_justificacion_sector_agricola ? true : undefined}
                                />
                            )}
                        </Grid>

                        <Grid item md={6}>
                            <Label labelFor="justificacion_politica_discapacidad" value="¿El proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad?" />
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui
                                checked={requiere_justificacion_politica_discapacidad}
                                onChange={() => setRequiereJustificacionPoliticaDiscapacidad(!requiere_justificacion_politica_discapacidad)}
                            />

                            {requiere_justificacion_politica_discapacidad && (
                                <>
                                    <Textarea
                                        label="Justificación"
                                        id="justificacion_politica_discapacidad"
                                        onChange={(e) => form.setData('justificacion_politica_discapacidad', e.target.value)}
                                        error={form.errors.justificacion_politica_discapacidad}
                                        value={form.data.justificacion_politica_discapacidad}
                                        required={requiere_justificacion_politica_discapacidad}
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
                            <SwitchMui checked={requiere_justificacion_atencion_pluralista} onChange={() => setRequiereJustificacionAntencionPluralista(!requiere_justificacion_atencion_pluralista)} />

                            {requiere_justificacion_atencion_pluralista && (
                                <Textarea
                                    label="Justificación"
                                    id="atencion_pluralista_diferencial"
                                    error={form.errors.atencion_pluralista_diferencial}
                                    value={form.data.atencion_pluralista_diferencial}
                                    onChange={(e) => form.setData('atencion_pluralista_diferencial', e.target.value)}
                                    required={requiere_justificacion_atencion_pluralista}
                                />
                            )}
                        </Grid>

                        <Grid item md={12}>
                            <p className="text-center mb-8">
                                ¿Cuál es el origen de las muestras con las que se realizarán las actividades de investigación, bioprospección y/o aprovechamiento comercial o industrial?
                            </p>
                            <AlertMui>
                                Nota: Bioprospección se define como la exploración sistemática y sostenible de la biodiversidad para identificar y obtener nuevas fuentes de compuestos químicos, genes,
                                proteínas, microorganismos y otros productos que tienen potencial de ser aprovechados comercialmente
                            </AlertMui>

                            <RadioGroup aria-labelledby="muestreo-radio-buttons-group-label" name="muestreo-radio-buttons-group">
                                <div className="flex mt-20 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="1" checked={form.data.muestreo == 1} error={form.errors.muestreo} />
                                    <span>
                                        Especies Nativas. (es la especie o subespecie taxonómica o variedad de animales cuya área de disposición geográfica se extiende al territorio nacional o a aguas
                                        jurisdiccionales colombianas o forma parte de los mismos comprendidas las especies o subespecies que migran temporalmente a ellos, siempre y cuando no se
                                        encuentren en el país o migren a él como resultado voluntario o involuntario de la actividad humana. Pueden ser silvestre, domesticada o escapada de
                                        domesticación incluyendo virus, viroides y similares)
                                    </span>
                                </div>

                                {form.data.muestreo == 1 && (
                                    <>
                                        <AlertMui>Ha seleccionado Especies Nativas. Por favor responda las siguientes preguntas:</AlertMui>
                                        <div className="flex mb-20">
                                            <div className="bg-gray-200 flex-1 p-8">
                                                <div className="flex items-center">
                                                    <Label required disabled={evaluacion ? true : false} className="mb-4" id="1.1" value="¿Qué actividad pretende realizar con la especie nativa?" />
                                                </div>

                                                <RadioGroup aria-labelledby="actividades-muestreo-radio-buttons-group-label" name="actividades-muestreo-radio-buttons-group">
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui
                                                            onChange={(e) => form.setData('actividades_muestreo', e.target.value)}
                                                            value="1.1.1"
                                                            checked={form.data.actividades_muestreo == '1.1.1'}
                                                        />
                                                        <span>Separación de las unidades funcionales y no funcionales del ADN y el ARN, en todas las formas que se encuentran en la naturaleza. </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui
                                                            onChange={(e) => form.setData('actividades_muestreo', e.target.value)}
                                                            value="1.1.2"
                                                            checked={form.data.actividades_muestreo == '1.1.2'}
                                                        />
                                                        <span>
                                                            Aislamiento de una o varias moléculas, entendidas estas como micro y macromoléculas, producidas por el metabolismo de un organismo.{' '}
                                                        </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui
                                                            onChange={(e) => form.setData('actividades_muestreo', e.target.value)}
                                                            value="1.1.3"
                                                            checked={form.data.actividades_muestreo == '1.1.3'}
                                                        />
                                                        <span> Solicitar patente sobre una función o propiedad identificada de una molécula, que se ha aislado y purificado. </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui
                                                            onChange={(e) => form.setData('actividades_muestreo', e.target.value)}
                                                            value="1.1.4"
                                                            checked={form.data.actividades_muestreo == '1.1.4'}
                                                        />
                                                        <span> No logro identificar la actividad a desarrollar con la especie nativa </span>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            <div className="bg-gray-300 flex-1 p-8">
                                                <div className="flex items-center">
                                                    <Label
                                                        required
                                                        disabled={evaluacion ? true : false}
                                                        className="mb-4"
                                                        id="1.2"
                                                        value="¿Cuál es la finalidad de las actividades a realizar con la especie nativa/endémica?"
                                                    />
                                                </div>

                                                <RadioGroup aria-labelledby="objetivo-muestreo-radio-buttons-group-label" name="objetivo-muestreo-radio-buttons-group">
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('objetivo_muestreo', e.target.value)} value="1.2.1" checked={form.data.objetivo_muestreo == '1.2.1'} />
                                                        <span> Investigación básica sin fines comerciales </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('objetivo_muestreo', e.target.value)} value="1.2.2" checked={form.data.objetivo_muestreo == '1.2.2'} />
                                                        <span> Bioprospección en cualquiera de sus fases </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('objetivo_muestreo', e.target.value)} value="1.2.3" checked={form.data.objetivo_muestreo == '1.2.3'} />
                                                        <span> Comercial o Industrial </span>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="2" checked={form.data.muestreo == 2} />
                                    <span> Especies Introducidas. (son aquellas que no son nativas de Colombia y que ingresaron al país por intervención humana) </span>
                                </div>
                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="3" checked={form.data.muestreo == 3} />
                                    <span> Recursos genéticos humanos y sus productos derivados </span>
                                </div>
                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="4" checked={form.data.muestreo == 4} />
                                    <span>
                                        Intercambio de recursos genéticos y sus productos derivados, recursos biológicos que los contienen o los componentes asociados a estos. (son aquellas que
                                        realizan las comunidades indígenas, afroamericanas y locales de los Países Miembros de la Comunidad Andina entre sí y para su propio consumo, basadas en sus
                                        prácticas consuetudinarias){' '}
                                    </span>
                                </div>
                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="5" checked={form.data.muestreo == 5} />
                                    <span>
                                        Recurso biológico que involucren actividades de sistemática molecular, ecología molecular, evolución y biogeografía molecular (siempre que el recurso biológico
                                        se haya colectado en el marco de un permiso de recolección de especímenes de especies silvestres de la diversidad biológica con fines de investigación
                                        científica no comercial o provenga de una colección registrada ante el Instituto Alexander van Humboldt)
                                    </span>
                                </div>
                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="6" checked={form.data.muestreo == 6} />
                                    <span> No aplica </span>
                                </div>
                            </RadioGroup>
                        </Grid>

                        <Grid item md={6}>
                            <Label
                                required
                                className="mb-4"
                                labelFor="recoleccion_especimenes"
                                value="En la ejecución del proyecto se requiere la recolección de especímenes de especies silvestres de la diversidad biológica con fines de elaboración de estudios ambientales (entendiendo como recolección los procesos de remoción o extracción temporal o definitiva de una especie ya sea vegetal o animal del medio natural) Nota: este permiso no se requiere cuando las actividades de recolección se limiten a investigaciones científicas o con fines industriales, comerciales o de prospección biológica."
                            />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="recoleccion_especimenes"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.recoleccion_especimenes}
                                error={form.errors.recoleccion_especimenes}
                                onChange={(event, newValue) => {
                                    form.setData('recoleccion_especimenes', newValue.value)
                                }}
                                placeholder="Seleccione una opción"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="relacionado_plan_tecnologico"
                                value="¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?"
                            />
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
                                placeholder="Seleccione una opción"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
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
                                placeholder="Seleccione una opción"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="relacionado_mesas_sectoriales" value="¿El proyecto se alinea con las Mesas Sectoriales?" />
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
                                placeholder="Seleccione una opción"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        {form.data.relacionado_mesas_sectoriales == 1 && (is_super_admin || proyecto_linea_65?.proyecto.allowed.to_update) && (
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
                                            const selectedValues = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                mesa_sectorial_id: selectedValues,
                                            }))
                                        }}
                                        error={form.errors.mesa_sectorial_id}
                                        placeholder="Seleccione las mesas sectoriales"
                                        required
                                        disabled={evaluacion ? true : false}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item md={6}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="relacionado_tecnoacademia"
                                value="¿El proyecto se formuló en conjunto con la tecnoacademia?"
                            />
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
                                placeholder="Seleccione una opción"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        {form.data.relacionado_tecnoacademia == 1 && (is_super_admin || proyecto_linea_65?.proyecto.allowed.to_update) && (
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
                                        required
                                        disabled={evaluacion ? true : false}
                                    />
                                    <SelectMultiple
                                        className="mt-10"
                                        id="linea_tecnologica_id"
                                        bdValues={form.data.linea_tecnologica_id}
                                        options={array_lineas_tecnoacademia}
                                        onChange={(event, newValue) => {
                                            const selectedValues = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                linea_tecnologica_id: selectedValues,
                                            }))
                                        }}
                                        error={form.errors.linea_tecnologica_id}
                                        label="Seleccione las líneas tecnológicas"
                                        required
                                        disabled={evaluacion ? true : false}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="resumen" value="Resumen del proyecto" />
                            <AlertMui>
                                Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo
                                resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                            </AlertMui>

                            <Textarea id="resumen" value={form.data.resumen} onChange={(e) => form.setData('resumen', e.target.value)} required disabled={evaluacion ? true : false} />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="antecedentes" value="Antecedentes" />
                            <AlertMui>
                                Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la
                                temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición.
                            </AlertMui>

                            <Textarea
                                id="antecedentes"
                                error={form.errors.antecedentes}
                                value={form.data.antecedentes}
                                onChange={(e) => form.setData('antecedentes', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="marco_conceptual" value="Marco conceptual" />
                            <AlertMui>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</AlertMui>

                            <Textarea
                                id="marco_conceptual"
                                error={form.errors.marco_conceptual}
                                value={form.data.marco_conceptual}
                                onChange={(e) => form.setData('marco_conceptual', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="numero_aprendices"
                                value="Número de los aprendices que se beneficiarán en la ejecución del proyecto"
                            />
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
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="municipios" value="Nombre de los municipios beneficiados" />
                        </Grid>
                        <Grid item md={6}>
                            <SelectMultiple
                                id="municipios"
                                bdValues={form.data.municipios}
                                options={municipios}
                                isGroupable={true}
                                groupBy={(option) => option.group}
                                onChange={(event, newValue) => {
                                    const selectedValues = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        municipios: selectedValues,
                                    }))
                                }}
                                error={form.errors.municipios}
                                placeholder="Seleccionar municipios"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="programas_formacion"
                                value="Nombre de los programas de formación con registro calificado a impactar"
                            />
                        </Grid>

                        <Grid item md={6}>
                            <SelectMultiple
                                id="programas_formacion"
                                bdValues={form.data.programas_formacion}
                                options={programas_formacion_con_registro_calificado}
                                onChange={(event, newValue) => {
                                    const selectedValues = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        programas_formacion: selectedValues,
                                    }))
                                }}
                                error={form.errors.programas_formacion}
                                placeholder="Seleccione los programas de formación"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label className="mb-4" labelFor="programas_formacion_articulados" value="Nombre de los programas de formación articulados" />
                        </Grid>
                        <Grid item md={6}>
                            <SelectMultiple
                                id="programas_formacion_articulados"
                                bdValues={form.data.programas_formacion_articulados}
                                options={programas_formacion_sin_registro_calificado}
                                onChange={(event, newValue) => {
                                    const selectedValues = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        programas_formacion_articulados: selectedValues,
                                    }))
                                }}
                                error={form.errors.programas_formacion_articulados}
                                placeholder="Seleccione los programas de formación"
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio en los municipios" />

                            <Textarea
                                id="impacto_municipios"
                                error={form.errors.impacto_municipios}
                                value={form.data.impacto_municipios}
                                onChange={(e) => form.setData('impacto_municipios', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />

                            <Textarea
                                id="impacto_centro_formacion"
                                error={form.errors.impacto_centro_formacion}
                                value={form.data.impacto_centro_formacion}
                                onChange={(e) => form.setData('impacto_centro_formacion', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="bibliografia" value="Bibliografía" />
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

            {method == 'crear' || proyecto_linea_65.proyecto?.allowed?.to_update ? (
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
