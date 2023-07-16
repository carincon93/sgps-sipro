import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Label from '@/Components/Label'
import RadioMui from '@/Components/Radio'
import Textarea from '@/Components/Textarea'
import TextInput from '@/Components/TextInput'
import ToolTipMui from '@/Components/Tooltip'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'

import { RadioGroup } from '@mui/material'
import { useEffect } from 'react'
import { monthDiff } from '@/Utils'
import { useForm } from '@inertiajs/react'
import { useState } from 'react'
import DatePicker from '@/Components/DatePicker'

const Form = ({
    submit,
    isSuperAdmin,
    evaluacion,
    idi,
    method = 'crear',
    centrosFormacion,
    lineasProgramaticas,
    gruposInvestigacion,
    mesasSectoriales,
    tecnoacademia,
    convocatoria,
    redesConocimiento,
    disciplinasSubareaConocimiento,
    actividadesEconomicas,
    tematicasEstrategicas,
    lineasTecnoacademia,
    lineasInvestigacion,
    tecnoacademias,
    municipios,
    roles,
    areasTematicasEni,
    lineasInvestigacionEni,
    programasFormacionConRegistroCalificado,
    programasFormacionSinRegistroCalificado,
    proyectoMunicipios,
    proyectoAreasTematicasEni,
    proyectoLineasInvestigacionEni,
    mesasSectorialesRelacionadas,
    lineasTecnoacademiaRelacionadas,
    programasFormacionConRegistroRelacionados,
    programasFormacionSinRegistroRelacionados,
    ...props
}) => {
    const form = useForm({
        titulo: idi?.titulo ?? '',
        fecha_inicio: idi?.fecha_inicio ?? '',
        fecha_finalizacion: idi?.fecha_finalizacion ?? '',
        max_meses_ejecucion: idi?.max_meses_ejecucion ?? '',
        centro_formacion_id: idi?.proyecto?.centro_formacion_id ?? null,
        linea_investigacion_id: idi?.linea_investigacion_id ?? null,
        linea_programatica_id: idi?.proyecto?.linea_programatica_id ?? null,
        red_conocimiento_id: idi?.red_conocimiento_id ?? null,
        area_conocimiento_id: idi?.disciplina_subarea_conocimiento.subarea_conocimiento.area_conocimiento_id ?? null,
        subarea_conocimiento_id: idi?.disciplina_subarea_conocimiento.subarea_conocimiento_id ?? null,
        disciplina_subarea_conocimiento_id: idi?.disciplina_subarea_conocimiento_id ?? null,
        tematica_estrategica_id: idi?.tematica_estrategica_id ?? null,
        actividad_economica_id: idi?.actividad_economica_id ?? null,
        grupo_investigacion_eni_id: { value: idi?.grupo_investigacion_eni_id, label: gruposInvestigacion.find((item) => item.value == idi?.grupo_investigacion_eni_id)?.label },
        video: idi?.video,
        numero_aprendices: idi?.numero_aprendices,
        municipios: proyectoMunicipios?.length > 0 ? proyectoMunicipios : null,
        area_tematica_eni_id: proyectoAreasTematicasEni?.length > 0 ? proyectoAreasTematicasEni : null,
        linea_investigacion_eni_id: proyectoLineasInvestigacionEni?.length > 0 ? proyectoLineasInvestigacionEni : null,
        programas_formacion: programasFormacionConRegistroRelacionados?.length > 0 ? programasFormacionConRegistroRelacionados : null,
        programas_formacion_articulados: programasFormacionSinRegistroRelacionados?.length > 0 ? programasFormacionSinRegistroRelacionados : null,
        muestreo: idi?.muestreo ?? '',
        actividades_muestreo: idi?.actividades_muestreo ?? '',
        objetivo_muestreo: idi?.objetivo_muestreo ?? '',
        recoleccion_especimenes: idi?.recoleccion_especimenes ?? '',
        relacionado_plan_tecnologico: idi?.relacionado_plan_tecnologico ?? '',
        relacionado_agendas_competitividad: idi?.relacionado_agendas_competitividad ?? '',
        relacionado_mesas_sectoriales: idi?.relacionado_mesas_sectoriales ?? '',
        relacionado_tecnoacademia: idi?.relacionado_tecnoacademia ?? '',
        tecnoacademia_id: tecnoacademia?.id ?? '',
        proyecto_investigacion_pedagogica: idi?.proyecto_investigacion_pedagogica ?? '',
        articulacion_eni: idi?.articulacion_eni ?? '',
        justificacion_proyecto_investigacion_pedagogica: idi?.justificacion_proyecto_investigacion_pedagogica ?? '',

        linea_tecnologica_id: lineasTecnoacademiaRelacionadas ?? '',
        mesa_sectorial_id: mesasSectorialesRelacionadas ?? '',

        resumen: idi?.resumen ?? '',
        antecedentes: idi?.antecedentes ?? '',
        marco_conceptual: idi?.marco_conceptual ?? '',
        justificacion_industria_4: idi?.justificacion_industria_4 ?? '',
        justificacion_economia_naranja: idi?.justificacion_economia_naranja ?? '',
        justificacion_politica_discapacidad: idi?.justificacion_politica_discapacidad ?? '',
        atencion_pluralista_diferencial: idi?.atencion_pluralista_diferencial ?? '',
        impacto_sector_agricola: idi?.impacto_sector_agricola ?? '',
        bibliografia: idi?.bibliografia ?? '',
        impacto_municipios: idi?.impacto_municipios ?? '',
        impacto_centro_formacion: idi?.impacto_centro_formacion ?? '',
        cantidad_meses: '',
        cantidad_horas: '',
        rol_sennova: null,
    })

    const [arrayLineasTecnoacademia, setArrayLineasTecnoacademia] = useState([])

    const selectLineasTecnoacademia = (selectedTecnoAcademia) => {
        const filteredLineasTecnoacademia = lineasTecnoacademia.filter((obj) => obj.tecnoacademia_id === selectedTecnoAcademia.value)
        setArrayLineasTecnoacademia(filteredLineasTecnoacademia)
    }
    const [tieneVideo, setTieneVideo] = useState(idi?.video !== null)
    const [requiereJustificacionIndustria4, setRequiereJustificacionIndustria4] = useState(idi?.justificacion_industria_4 !== null)
    const [requiereJustificacionEconomiaNaranja, setRequiereJustificacionEconomiaNaranja] = useState(idi?.justificacion_economia_naranja !== null)
    const [requiereJustificacionPoliticaDiscapacidad, setRequiereJustificacionPoliticaDiscapacidad] = useState(idi?.justificacion_politica_discapacidad !== null)
    const [requiereJustificacionAntencionPluralista, setRequiereJustificacionAntencionPluralista] = useState(idi?.atencion_pluralista_diferencial !== null)
    const [requiereJustificacionSectorAgricola, setRequiereJustificacionSectorAgricola] = useState(idi?.impacto_sector_agricola !== null)

    useEffect(() => {
        if (form.data.proyecto_investigacion_pedagogica === false || form.data.articulacion_eni === false) {
            form.data.grupo_investigacion_eni_id = null
            form.data.linea_investigacion_eni_id = null
            form.data.area_tematica_eni_id = null
        }
    }, [form.data.proyecto_investigacion_pedagogica, form.data.articulacion_eni])

    const [arrayLineasInvestigacion, setArrayLineasInvestigacion] = useState([])
    useEffect(() => {
        setArrayLineasInvestigacion(lineasInvestigacion.filter((obj) => obj.centro_formacion_id === form.data.centro_formacion_id))
    }, [form.data.centro_formacion_id])

    useEffect(() => {
        if (form.data.fecha_inicio && form.data.fecha_finalizacion) {
            form.setData((prevForm) => ({
                ...prevForm,
                max_meses_ejecucion: monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion),
            }))
        }
    }, [form.data.fecha_inicio, form.data.fecha_finalizacion])

    return (
        <form onSubmit={submit} id="idi-form">
            <fieldset className="space-y-20" disabled={idi?.proyecto.allowed.to_update && !isSuperAdmin}>
                <div className="py-24">
                    <Label required labelFor="titulo" className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)" />
                    <Textarea id="titulo" className={`bg-transparent block border-0 mt-1 outline-none text-4xl text-center w-full`} value={form.data.titulo} onChange={(e) => form.setData('titulo', e.target.value)} required />
                </div>

                <div className="py-24">
                    <p className="text-center">Fecha de ejecución</p>
                    <div className={`mt-4 flex`}>
                        <Label required labelFor="fecha_inicio" error={form.errors.fecha_inicio} value="Fecha de inicio" />
                        <div className="ml-4">
                            <DatePicker variant="outlined" id="fecha_inicio" name="fecha_inicio" value={form.data.fecha_inicio} className="p-4 w-full" onChange={(e) => form.setData('fecha_inicio', e.target.value)} required />
                        </div>
                    </div>
                    <div className={`mt-4 flex`}>
                        <Label required labelFor="fecha_finalizacion" error={form.errors.fecha_finalizacion} value="Fecha de finalización" />
                        <div className="ml-4">
                            <DatePicker variant="outlined" id="fecha_finalizacion" name="fecha_finalizacion" value={form.data.fecha_finalizacion} className="p-4 w-full" onChange={(e) => form.setData('fecha_finalizacion', e.target.value)} required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label required labelFor="centro_formacion_id" className="mb-4" value="Centro de formación" />
                            <small> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </small>
                        </div>
                        <div>
                            <Autocomplete id="centro_formacion_id" selectedValue={form.data.centro_formacion_id} onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)} options={centrosFormacion ?? [{ value: idi.proyecto.centro_formacion.id, label: idi.proyecto.centro_formacion.nombre }]} error={form.errors.centro_formacion_id} required />
                        </div>
                    </div>
                </div>

                {arrayLineasInvestigacion.length > 0 && (
                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="linea_investigacion_id" className="mb-4" value="Línea de investigación" />
                            </div>
                            <div>
                                <Autocomplete id="linea_investigacion_id" selectedValue={form.data.linea_investigacion_id} onChange={(event, newValue) => form.setData('linea_investigacion_id', newValue.value)} options={arrayLineasInvestigacion} error={form.errors.linea_investigacion_id} required />
                            </div>
                        </div>
                    </div>
                )}

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label required labelFor="linea_programatica_id" className="mb-4" value="Código dependencia presupuestal (SIIF)" />
                        </div>
                        <div>
                            <Autocomplete
                                id="linea_programatica_id"
                                selectedValue={form.data.linea_programatica_id}
                                onChange={(event, newValue) => form.setData('linea_programatica_id', newValue.value)}
                                options={method == 'crear' ? lineasProgramaticas : [{ value: idi.proyecto.linea_programatica.id, label: idi.proyecto.linea_programatica.nombre + ' - ' + idi.proyecto.linea_programatica.codigo }]}
                                error={form.errors.linea_programatica_id}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label required labelFor="red_conocimiento_id" className="mb-4" value="Red de conocimiento sectorial" />
                        </div>
                        <div>
                            <Autocomplete id="red_conocimiento_id" selectedValue={form.data.red_conocimiento_id} onChange={(event, newValue) => form.setData('red_conocimiento_id', newValue.value)} options={redesConocimiento} error={form.errors.red_conocimiento_id} required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label required labelFor="disciplina_subarea_conocimiento_id" className="mb-4" value="Disciplina de conocimiento" />
                        </div>
                        <div>
                            <Autocomplete id="disciplina_subarea_conocimiento_id" selectedValue={form.data.disciplina_subarea_conocimiento_id} onChange={(event, newValue) => form.setData('disciplina_subarea_conocimiento_id', newValue.value)} options={disciplinasSubareaConocimiento} error={form.errors.disciplina_subarea_conocimiento_id} required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label required labelFor="actividad_economica_id" className="mb-4" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                        </div>
                        <div>
                            <Autocomplete id="actividad_economica_id" selectedValue={form.data.actividad_economica_id} onChange={(event, newValue) => form.setData('actividad_economica_id', newValue.value)} options={actividadesEconomicas} error={form.errors.actividad_economica_id} required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label required labelFor="tematica_estrategica_id" className="mb-4" value="Temática estratégica SENA" />
                        </div>
                        <div>
                            <Autocomplete id="tematica_estrategica_id" selectedValue={form.data.tematica_estrategica_id} onChange={(event, newValue) => form.setData('tematica_estrategica_id', newValue.value)} options={tematicasEstrategicas} error={form.errors.tematica_estrategica_id} required />
                        </div>
                    </div>
                </div>

                {(form.data.linea_programatica_id?.value === 1 || form.data.linea_programatica_id?.value === 3) && (
                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="proyecto_investigacion_pedagogica" className="mb-4" value="¿El proyecto es de investigación pedagógica?" />
                            </div>
                            <div>
                                <Switch id="proyecto_investigacion_pedagogica" checked={form.data.proyecto_investigacion_pedagogica} onChange={(e) => form.setData('proyecto_investigacion_pedagogica', e.target.checked)} />
                            </div>
                        </div>

                        {form.data.proyecto_investigacion_pedagogica && convocatoria.campos_convocatoria.find((element) => element.campo === 'justificacion_proyecto_investigacion_pedagogica').convocatoriaId === convocatoria.id && (
                            <div className="mt-44 ml-8 grid grid-cols-2">
                                <div>
                                    <Label required labelFor="justificacion_proyecto_investigacion_pedagogica" className="mb-4" value="Justificación" />
                                </div>
                                <div>
                                    <Textarea maxLength="40000" id="justificacion_proyecto_investigacion_pedagogica" value={form.data.justificacion_proyecto_investigacion_pedagogica} onChange={(e) => form.setData('justificacion_proyecto_investigacion_pedagogica', e.target.value)} required={form.data.proyecto_investigacion_pedagogica ? 'required' : undefined} />
                                </div>
                            </div>
                        )}

                        <div className="ml-8 grid grid-cols-2 mt-24">
                            <div>
                                <Label required labelFor="articulacion_eni" className="mb-4" value="¿El proyecto está articulado con la ENI?" />
                            </div>
                            <div>
                                <Switch id="articulacion_eni" checked={form.data.articulacion_eni} onChange={(e) => form.setData('articulacion_eni', e.target.checked)} />
                            </div>
                        </div>

                        <div className="ml-8 grid grid-cols-2 mt-24">
                            <div>
                                <Label required labelFor="grupo_investigacion_eni_id" className="mb-4" value="Grupo de investigación ENI" />
                            </div>
                            <div>
                                <Autocomplete id="grupo_investigacion_eni_id" selectedValue={form.data.grupo_investigacion_eni_id} onChange={(event, newValue) => form.setData('grupo_investigacion_eni_id', newValue.value)} options={gruposInvestigacion} error={form.errors.grupo_investigacion_eni_id} placeholder="Seleccione un grupo de investigación" required />
                            </div>
                        </div>

                        <div className="ml-8 grid grid-cols-2 mt-24">
                            <div>
                                <Label required labelFor="linea_investigacion_eni_id" className="mb-4" value="Líneas de investigación ENI" />
                            </div>
                            <div>
                                <Autocomplete id="linea_investigacion_eni_id" selectedValue={form.data.linea_investigacion_eni_id} onChange={(event, newValue) => form.setData('linea_investigacion_eni_id', newValue.value)} options={lineasInvestigacionEni} error={form.errors.linea_investigacion_eni_id} placeholder="Seleccione una o varias opciones" required />
                            </div>
                        </div>

                        <div className="ml-8 grid grid-cols-2 mt-24">
                            <div>
                                <Label required labelFor="area_tematica_eni_id" className="mb-4" value="Áreas temáticas ENI" />
                            </div>
                            <div>
                                <Autocomplete id="area_tematica_eni_id" selectedValue={form.data.area_tematica_eni_id} onChange={(event, newValue) => form.setData('linea_investigacion_eni_id', newValue.value)} options={areasTematicasEni} error={form.errors.area_tematica_eni_id} placeholder="Seleccione una o varias opciones" required />
                            </div>
                        </div>
                    </div>
                )}

                {method == 'crear' && (
                    <>
                        <div className="py-24">
                            <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                        </div>

                        <div className="py-24">
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required labelFor="rol_sennova" className="mb-4" value="Rol SENNOVA" />
                                </div>
                                <div>
                                    <Autocomplete id="rol_sennova" selectedValue={form.data.rol_sennova} onChange={(event, newValue) => form.setData('rol_sennova', newValue.value)} options={roles} placeholder="Seleccione un rol SENNOVA" required />
                                </div>
                            </div>
                        </div>

                        {form.data.fecha_inicio && form.data.fecha_finalizacion && (
                            <div className="py-24">
                                <div className="grid grid-cols-2">
                                    <div>
                                        <Label required labelFor="cantidad_meses" className="mb-4" value="Número de meses de vinculación al proyecto" />
                                    </div>
                                    <div>
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
                                                El proyecto se ejecutará entre {form.data.fecha_inicio} y el {form.data.fecha_finalizacion}, por lo tanto el número de meses máximo es: {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion)}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="py-24">
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required labelFor="cantidad_horas" className="mb-4" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                                </div>
                                <div>
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
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {method == 'editar' && (
                    <>
                        {(idi?.proyecto.linea_programatica_id === 1 || idi?.proyecto.linea_programatica_id === 3) && (
                            <div>
                                <div className="grid grid-cols-2">
                                    <div>
                                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="proyecto_investigacion_pedagogica" value="¿El proyecto es de investigación pedagógica?" />
                                    </div>
                                    <div>
                                        <SwitchMui checked={form.data.proyecto_investigacion_pedagogica} onChange={(e) => form.setData('proyecto_investigacion_pedagogica', e.target.checked)} />
                                    </div>
                                </div>

                                {form.data.proyecto_investigacion_pedagogica && (
                                    <div className="mt-44 grid grid-cols-2">
                                        <div>
                                            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="justificacion_proyecto_investigacion_pedagogica" value="Justificación" />
                                        </div>
                                        <div>
                                            <Textarea
                                                id="justificacion_proyecto_investigacion_pedagogica"
                                                onChange={(e) => form.setData('justificacion_proyecto_investigacion_pedagogica', e.target.value)}
                                                error={form.errors.justificacion_proyecto_investigacion_pedagogica}
                                                value={form.data.justificacion_proyecto_investigacion_pedagogica}
                                                required={!form.data.proyecto_investigacion_pedagogica ? undefined : true}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 mt-24">
                                    <div>
                                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="articulacion_eni" value="¿El proyecto está articulado con la ENI?" />
                                    </div>
                                    <div>
                                        <SwitchMui checked={form.data.articulacion_eni} onChange={(e) => form.setData('articulacion_eni', e.target.checked)} />
                                    </div>
                                </div>

                                {form.data.articulacion_eni && (
                                    <>
                                        <div className="grid grid-cols-2 mt-24">
                                            <div>
                                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="grupo_investigacion_eni_id" value="Grupo de investigación ENI" />
                                            </div>
                                            <div>
                                                <Autocomplete
                                                    id="grupo_investigacion_eni_id"
                                                    options={gruposInvestigacion}
                                                    selectedValue={form.data.grupo_investigacion_eni_id}
                                                    onChange={(event, newValue) => {
                                                        form.setData('grupo_investigacion_eni_id', newValue.value)
                                                    }}
                                                    error={form.errors.grupo_investigacion_eni_id}
                                                    placeholder="Seleccione un grupo de investigación"
                                                    required
                                                    disabled={evaluacion ? 'disabled' : undefined}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 mt-24">
                                            <div>
                                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="linea_investigacion_eni_id" value="Líneas de investigación ENI" />
                                            </div>
                                            <div>
                                                <SelectMultiple
                                                    id="linea_investigacion_eni_id"
                                                    bdValues={form.data.linea_investigacion_eni_id}
                                                    options={lineasInvestigacionEni}
                                                    onChange={(event, newValue) => {
                                                        const selectedValues = newValue.map((option) => option.value)
                                                        form.setData((prevData) => ({
                                                            ...prevData,
                                                            linea_investigacion_eni_id: selectedValues,
                                                        }))
                                                    }}
                                                    error={form.errors.linea_investigacion_eni_id}
                                                    placeholder="Seleccione una o varias opciones"
                                                    required
                                                    disabled={evaluacion ? 'disabled' : undefined}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 mt-24">
                                            <div>
                                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="area_tematica_eni_id" value="Áreas temáticas" />
                                            </div>
                                            <div>
                                                <SelectMultiple
                                                    id="area_tematica_eni_id"
                                                    bdValues={form.data.area_tematica_eni_id}
                                                    options={areasTematicasEni}
                                                    onChange={(event, newValue) => {
                                                        const selectedValues = newValue.map((option) => option.value)
                                                        form.setData((prevData) => ({
                                                            ...prevData,
                                                            area_tematica_eni_id: selectedValues,
                                                        }))
                                                    }}
                                                    error={form.errors.area_tematica_eni_id}
                                                    placeholder="Seleccione una o varias opciones"
                                                    required
                                                    disabled={evaluacion ? 'disabled' : undefined}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label labelFor="video" value="¿El proyecto tiene video?" />
                                    <AlertMui hiddenIcon={true} className="mt-2 mr-4">
                                        Video de 3 minutos, en donde se presente de manera sencilla y dinámica la justificación del proyecto, la problemática, el objetivo general, los objetivos específicos, las actividades, los productos y su impacto en el marco del mecanismo de participación seleccionado como regional.
                                    </AlertMui>
                                </div>
                                <div>
                                    <SwitchMui checked={tieneVideo} onChange={() => setTieneVideo(!tieneVideo)} />
                                    {tieneVideo && (
                                        <>
                                            <TextInput label="Link del video" id="video" type="url" className="mt-1" error={form.errors.video} placeholder="Link del video del proyecto https://www.youtube.com/watch?v=gmc4tk" value={form.data.video} required={tieneVideo ? true : undefined} />
                                        </>
                                    )}
                                </div>
                            </div>
                            {tieneVideo && (
                                <>
                                    {(isSuperAdmin && !evaluacion) || (idi?.proyecto.mostrar_recomendaciones && !evaluacion) ? (
                                        <>
                                            {idi?.proyecto.evaluaciones.map((evaluacion, i) =>
                                                isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                    <ToolTipMui
                                                        key={i}
                                                        title={
                                                            <div>
                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.video_comentario ? evaluacion.idi_evaluacion.video_comentario : 'Sin recomendación'}</p>
                                                            </div>
                                                        }
                                                    >
                                                        Evaluación {i + 1}
                                                    </ToolTipMui>
                                                ) : null,
                                            )}
                                            {idi?.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                        </>
                                    ) : null}

                                    {props.video}
                                </>
                            )}
                        </div>
                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label id="justificacion_industria_4" value="¿El proyecto está relacionado con la industria 4.0?" />
                                </div>
                                <div>
                                    <div className="flex items-center mb-14">
                                        <SwitchMui checked={requiereJustificacionIndustria4} onChange={() => setRequiereJustificacionIndustria4(!requiereJustificacionIndustria4)} />
                                    </div>
                                    {requiereJustificacionIndustria4 && (
                                        <>
                                            <Textarea label="Justificación" id="justificacion_industria_4" onChange={(e) => form.setData('justificacion_industria_4', e.target.value)} error={form.errors.justificacion_industria_4} value={form.data.justificacion_industria_4} required={requiereJustificacionIndustria4 ? true : undefined} />
                                            <AlertMui hiddenIcon={true}>Si el proyecto está relacionado con la industria 4.0 por favor realice la justificación.</AlertMui>
                                        </>
                                    )}
                                </div>
                            </div>
                            {requiereJustificacionIndustria4 && (
                                <>
                                    {(isSuperAdmin && !evaluacion) || (idi?.proyecto.mostrar_recomendaciones && !evaluacion) ? (
                                        <>
                                            {idi?.proyecto.evaluaciones.map((evaluacion, i) =>
                                                isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                    <ToolTipMui
                                                        key={i}
                                                        title={
                                                            <div>
                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.justificacion_industria_4_comentario ? evaluacion.idi_evaluacion.justificacion_industria_4_comentario : 'Sin recomendación'}</p>
                                                            </div>
                                                        }
                                                    >
                                                        Evaluación {i + 1}
                                                    </ToolTipMui>
                                                ) : null,
                                            )}
                                            {idi?.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                        </>
                                    ) : null}

                                    {props.industria4}
                                </>
                            )}
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label labelFor="justificacion_economia_naranja" value="¿El proyecto está relacionado con la economía naranja?" />
                                </div>
                                <div>
                                    <div className="flex items-center mb-14">
                                        <SwitchMui checked={requiereJustificacionEconomiaNaranja} onChange={() => setRequiereJustificacionEconomiaNaranja(!requiereJustificacionEconomiaNaranja)} />
                                    </div>
                                    {requiereJustificacionEconomiaNaranja && (
                                        <>
                                            <Textarea label="Justificación" id="justificacion_economia_naranja" onChange={(e) => form.setData('justificacion_economia_naranja', e.target.value)} error={form.errors.justificacion_economia_naranja} value={form.data.justificacion_economia_naranja} required={requiereJustificacionEconomiaNaranja ? true : undefined} />
                                            <AlertMui hiddenIcon={true}>Si el proyecto está relacionado con la economía naranja por favor realice la justificación. (Ver documento de apoyo: Guía Rápida SENA es NARANJA.)</AlertMui>
                                        </>
                                    )}
                                </div>
                            </div>
                            {requiereJustificacionEconomiaNaranja && (
                                <>
                                    {(isSuperAdmin && !evaluacion) || (idi?.proyecto.mostrar_recomendaciones && !evaluacion) ? (
                                        <>
                                            {idi?.proyecto.evaluaciones.map((evaluacion, i) =>
                                                isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                    <ToolTipMui
                                                        key={i}
                                                        title={
                                                            <div>
                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.justificacion_economia_naranja_comentario ? evaluacion.idi_evaluacion.justificacion_economia_naranja_comentario : 'Sin recomendación'}</p>
                                                            </div>
                                                        }
                                                    >
                                                        Evaluación {i + 1}
                                                    </ToolTipMui>
                                                ) : null,
                                            )}
                                            {idi?.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                        </>
                                    ) : null}

                                    {props.economia_naranja}
                                </>
                            )}
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label labelFor="impacto_sector_agricola" value="¿El proyecto tendrá un impacto en el sector agrícola?" />
                                </div>
                                <div>
                                    <div className="flex items-center mb-14">
                                        <SwitchMui checked={requiereJustificacionSectorAgricola} onChange={() => setRequiereJustificacionSectorAgricola(!requiereJustificacionSectorAgricola)} />
                                    </div>
                                    {requiereJustificacionSectorAgricola && <Textarea label="Justificación" id="impacto_sector_agricola" onChange={(e) => form.setData('impacto_sector_agricola', e.target.value)} error={form.errors.impacto_sector_agricola} value={form.data.impacto_sector_agricola} required={requiereJustificacionSectorAgricola ? true : undefined} />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label labelFor="justificacion_politica_discapacidad" value="¿El proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad?" />
                                </div>
                                <div>
                                    <div className="flex items-center mb-14">
                                        <SwitchMui checked={requiereJustificacionPoliticaDiscapacidad} onChange={() => setRequiereJustificacionPoliticaDiscapacidad(!requiereJustificacionPoliticaDiscapacidad)} />
                                    </div>
                                    {requiereJustificacionPoliticaDiscapacidad && (
                                        <>
                                            <Textarea label="Justificación" id="justificacion_politica_discapacidad" onChange={(e) => form.setData('justificacion_politica_discapacidad', e.target.value)} error={form.errors.justificacion_politica_discapacidad} value={form.data.justificacion_politica_discapacidad} required={requiereJustificacionPoliticaDiscapacidad} />
                                            <AlertMui hiddenIcon={true}>Si el proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad por favor realice la justificación. RESOLUCIÓN 01726 DE 2014 - Por la cual se adopta la Política Institucional para Atención de las Personas con discapacidad.</AlertMui>
                                        </>
                                    )}
                                </div>
                            </div>
                            {requiereJustificacionPoliticaDiscapacidad && (
                                <>
                                    {(isSuperAdmin && !evaluacion) || (idi?.proyecto.mostrar_recomendaciones && !evaluacion) ? (
                                        <>
                                            {idi?.proyecto.evaluaciones.map((evaluacion, i) =>
                                                isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                    <ToolTipMui
                                                        key={i}
                                                        title={
                                                            <div>
                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.justificacion_politica_discapacidad_comentario ? evaluacion.idi_evaluacion.justificacion_politica_discapacidad_comentario : 'Sin recomendación'}</p>
                                                            </div>
                                                        }
                                                    >
                                                        Evaluación {i + 1}
                                                    </ToolTipMui>
                                                ) : null,
                                            )}
                                            {idi?.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                        </>
                                    ) : null}

                                    {props.politica_discapacidad}
                                </>
                            )}
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label labelFor="atencion_pluralista_diferencial" value="¿El proyecto aporta a la Política Institucional de Atención con Enfoque Pluralista y Diferencial (acuerdo 0010 de 2016)?" />
                                </div>
                                <div>
                                    <div className="flex items-center mb-14">
                                        <SwitchMui checked={requiereJustificacionAntencionPluralista} onChange={() => setRequiereJustificacionAntencionPluralista(!requiereJustificacionAntencionPluralista)} />
                                    </div>
                                    {requiereJustificacionAntencionPluralista && <Textarea label="Justificación" id="atencion_pluralista_diferencial" error={form.errors.atencion_pluralista_diferencial} value={form.data.atencion_pluralista_diferencial} required={requiereJustificacionAntencionPluralista} />}
                                </div>
                            </div>
                        </div>

                        {/* Especimentes */}

                        <div>
                            <p className="text-center mb-8">¿Cuál es el origen de las muestras con las que se realizarán las actividades de investigación, bioprospección y/o aprovechamiento comercial o industrial?</p>
                            <AlertMui hiddenIcon={true}>Nota: Bioprospección se define como la exploración sistemática y sostenible de la biodiversidad para identificar y obtener nuevas fuentes de compuestos químicos, genes, proteínas, microorganismos y otros productos que tienen potencial de ser aprovechados comercialmente</AlertMui>

                            <RadioGroup aria-labelledby="muestreo-radio-buttons-group-label" name="muestreo-radio-buttons-group">
                                <div className="flex mt-20 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="1" error={form.errors.muestreo} />
                                    <span>
                                        Especies Nativas. (es la especie o subespecie taxonómica o variedad de animales cuya área de disposición geográfica se extiende al territorio nacional o a aguas jurisdiccionales colombianas o forma parte de los mismos comprendidas las especies o subespecies que migran temporalmente a ellos, siempre y cuando no se encuentren en el país o migren a él como
                                        resultado voluntario o involuntario de la actividad humana. Pueden ser silvestre, domesticada o escapada de domesticación incluyendo virus, viroides y similares)
                                    </span>
                                </div>

                                {form.data.muestreo == 1 && (
                                    <>
                                        <AlertMui hiddenIcon={true}>Ha seleccionado Especies Nativas. Por favor responda las siguientes preguntas:</AlertMui>
                                        <div className="flex mb-20">
                                            <div className="bg-gray-200 flex-1 p-8">
                                                <div className="flex items-center">
                                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" id="1.1" value="¿Qué actividad pretende realizar con la especie nativa?" />
                                                </div>

                                                <RadioGroup aria-labelledby="actividades-muestreo-radio-buttons-group-label" name="actividades-muestreo-radio-buttons-group">
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('actividades_muestreo', e.target.value)} value="1.1.1" />
                                                        <span> Separación de las unidades funcionales y no funcionales del ADN y el ARN, en todas las formas que se encuentran en la naturaleza. </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('actividades_muestreo', e.target.value)} value="1.1.2" />
                                                        <span> Aislamiento de una o varias moléculas, entendidas estas como micro y macromoléculas, producidas por el metabolismo de un organismo. </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('actividades_muestreo', e.target.value)} value="1.1.3" />
                                                        <span> Solicitar patente sobre una función o propiedad identificada de una molécula, que se ha aislado y purificado. </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('actividades_muestreo', e.target.value)} value="1.1.4" />
                                                        <span> No logro identificar la actividad a desarrollar con la especie nativa </span>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            <div className="bg-gray-300 flex-1 p-8">
                                                <div className="flex items-center">
                                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" id="1.2" value="¿Cuál es la finalidad de las actividades a realizar con la especie nativa/endémica?" />
                                                </div>

                                                <RadioGroup aria-labelledby="objetivo-muestreo-radio-buttons-group-label" name="objetivo-muestreo-radio-buttons-group">
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('objetivo_muestreo', e.target.value)} value="1.2.1" />
                                                        <span> Investigación básica sin fines comerciales </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('objetivo_muestreo', e.target.value)} value="1.2.2" />
                                                        <span> Bioprospección en cualquiera de sus fases </span>
                                                    </div>
                                                    <div className="flex mt-4 items-center">
                                                        <RadioMui onChange={(e) => form.setData('objetivo_muestreo', e.target.value)} value="1.2.3" />
                                                        <span> Comercial o Industrial </span>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="2" />
                                    <span> Especies Introducidas. (son aquellas que no son nativas de Colombia y que ingresaron al país por intervención humana) </span>
                                </div>
                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="3" />
                                    <span> Recursos genéticos humanos y sus productos derivados </span>
                                </div>
                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="4" />
                                    <span> Intercambio de recursos genéticos y sus productos derivados, recursos biológicos que los contienen o los componentes asociados a estos. (son aquellas que realizan las comunidades indígenas, afroamericanas y locales de los Países Miembros de la Comunidad Andina entre sí y para su propio consumo, basadas en sus prácticas consuetudinarias) </span>
                                </div>
                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="5" />
                                    <span>
                                        Recurso biológico que involucren actividades de sistemática molecular, ecología molecular, evolución y biogeografía molecular (siempre que el recurso biológico se haya colectado en el marco de un permiso de recolección de especímenes de especies silvestres de la diversidad biológica con fines de investigación científica no comercial o provenga de una
                                        colección registrada ante el Instituto Alexander van Humboldt)
                                    </span>
                                </div>
                                <div className="flex mt-4 items-center">
                                    <RadioMui onChange={(e) => form.setData('muestreo', e.target.value)} value="6" />
                                    <span> No aplica </span>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="recoleccion_especimenes"
                                        value="En la ejecución del proyecto se requiere la recolección de especímenes de especies silvestres de la diversidad biológica con fines de elaboración de estudios ambientales (entendiendo como recolección los procesos de remoción o extracción temporal o definitiva de una especie ya sea vegetal o animal del medio natural) Nota: este permiso no se requiere cuando las actividades de recolección se limiten a investigaciones científicas o con fines industriales, comerciales o de prospección biológica."
                                    />
                                </div>
                                <div>
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
                                        disabled={evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                                <div />
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_plan_tecnologico" value="¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?" />
                                </div>
                                <div>
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
                                        disabled={evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_agendas_competitividad" value="¿El proyecto se alinea con las Agendas Departamentales de Competitividad e Innovación?" />
                                </div>
                                <div>
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
                                        disabled={evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_mesas_sectoriales" value="¿El proyecto se alinea con las Mesas Sectoriales?" />
                                </div>
                                <div>
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
                                        disabled={evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>
                            {form.data.relacionado_mesas_sectoriales == 1 && (isSuperAdmin || idi?.proyecto.allowed.to_update) && (
                                <div className="bg-app-100 p-5 mt-10">
                                    <div className="grid grid-cols-2">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5" style={{ transform: 'translateX(-50px)' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-app-600">Por favor seleccione la o las mesas sectoriales con la cual o las cuales se alinea el proyecto</p>
                                        </div>
                                        <div>
                                            <SelectMultiple
                                                id="mesa_sectorial_id"
                                                bdValues={form.data.mesa_sectorial_id}
                                                options={mesasSectoriales}
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
                                                disabled={evaluacion ? 'disabled' : undefined}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_tecnoacademia" value="¿El proyecto se formuló en conjunto con la tecnoacademia?" />
                                </div>
                                <div>
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
                                        disabled={evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>
                            {form.data.relacionado_tecnoacademia == 1 && (isSuperAdmin || idi?.proyecto.allowed.to_update) && (
                                <div className="bg-app-100 p-5 mt-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5" style={{ transform: 'translateX(-50px)' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>

                                    <div className="grid grid-cols-2">
                                        <div>
                                            <p className="text-app-600">Por favor seleccione la Tecnoacademia con la cual articuló el proyecto</p>
                                        </div>
                                        <div>
                                            <Autocomplete
                                                id="tecnoacademia_id"
                                                options={tecnoacademias}
                                                value={form.data.tecnoacademia_id}
                                                onChange={(event, newValue) => {
                                                    form.setData('tecnoacademia_id'), newValue, selectLineasTecnoacademia(newValue)
                                                }}
                                                getItemValue={(item) => item.label}
                                                required
                                                disabled={evaluacion ? 'disabled' : undefined}
                                            />
                                            <div className="mt-4">
                                                <SelectMultiple
                                                    id="linea_tecnologica_id"
                                                    bdValues={form.data.linea_tecnologica_id}
                                                    options={arrayLineasTecnoacademia}
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
                                                    disabled={evaluacion ? 'disabled' : undefined}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="resumen" value="Resumen del proyecto" />
                                    <AlertMui hiddenIcon={true}>Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.</AlertMui>
                                </div>
                                <div>
                                    <Textarea id="resumen" value={form.data.resumen} onChange={(e) => form.setData('resumen', e.target.value)} required disabled={evaluacion ? 'disabled' : undefined} />
                                </div>
                            </div>

                            {(isSuperAdmin && !evaluacion) || (idi?.proyecto.mostrar_recomendaciones && !evaluacion) ? (
                                <>
                                    {idi?.proyecto.evaluaciones.map((evaluacion, i) =>
                                        isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                            <ToolTipMui
                                                key={i}
                                                title={
                                                    <div>
                                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                        <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.resumen_comentario ? evaluacion.idi_evaluacion.resumen_comentario : 'Sin recomendación'}</p>
                                                    </div>
                                                }
                                            >
                                                Evaluación {i + 1}
                                            </ToolTipMui>
                                        ) : null,
                                    )}
                                    {idi?.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                </>
                            ) : null}

                            {props.resumen}
                        </div>

                        <div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="antecedentes" value="Antecedentes" />
                                    <AlertMui hiddenIcon={true}>Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición.</AlertMui>
                                </div>
                                <div>
                                    <Textarea id="antecedentes" error={form.errors.antecedentes} value={form.data.antecedentes} onChange={(e) => form.setData('antecedentes', e.target.value)} required disabled={evaluacion ? 'disabled' : undefined} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="marco_conceptual" value="Marco conceptual" />
                                    <AlertMui hiddenIcon={true}>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</AlertMui>
                                </div>
                                <div>
                                    <Textarea id="marco_conceptual" error={form.errors.marco_conceptual} value={form.data.marco_conceptual} onChange={(e) => form.setData('marco_conceptual', e.target.value)} required disabled={evaluacion ? 'disabled' : undefined} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="numero_aprendices" value="Número de los aprendices que se beneficiarán en la ejecución del proyecto" />
                                </div>
                                <div>
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
                                        onChange={(e) => (form.data.numero_aprendices = e.target.value)}
                                        required
                                        disabled={evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="municipios" value="Nombre de los municipios beneficiados" />
                                </div>
                                <div>
                                    <SelectMultiple
                                        id="municipios"
                                        bdValues={form.data.municipios}
                                        options={municipios}
                                        isGroupable={true}
                                        onChange={(event, newValue) => {
                                            const selectedValues = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                municipios: selectedValues,
                                            }))
                                        }}
                                        error={form.errors.municipios}
                                        placeholder="Seleccione municipios"
                                        required
                                        disabled={evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="programas_formacion" value="Nombre de los programas de formación con registro calificado a impactar" />
                                </div>
                                <div>
                                    <SelectMultiple
                                        id="programas_formacion"
                                        bdValues={form.data.programas_formacion}
                                        options={programasFormacionConRegistroCalificado}
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
                                        disabled={evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label className="mb-4" labelFor="programas_formacion_articulados" value="Nombre de los programas de formación articulados" />
                                </div>
                                <div>
                                    <SelectMultiple
                                        id="programas_formacion_articulados"
                                        bdValues={form.data.programas_formacion_articulados}
                                        options={programasFormacionSinRegistroCalificado}
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
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio en los municipios" />
                                </div>
                                <div>
                                    <Textarea id="impacto_municipios" error={form.errors.impacto_municipios} value={form.data.impacto_municipios} onChange={(e) => form.setData('impacto_municipios', e.target.value)} required disabled={evaluacion ? 'disabled' : undefined} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />
                                </div>
                                <div>
                                    <Textarea id="impacto_centro_formacion" error={form.errors.impacto_centro_formacion} value={form.data.impacto_centro_formacion} onChange={(e) => form.setData('impacto_centro_formacion', e.target.value)} required disabled={evaluacion ? 'disabled' : undefined} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="bibliografia" value="Bibliografía" />
                                    <AlertMui hiddenIcon={true}>Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).</AlertMui>
                                </div>
                                <div>
                                    <Textarea id="bibliografia" error={form.errors.bibliografia} value={form.data.bibliografia} onChange={(e) => form.setData('bibliografia', e.target.value)} required disabled={evaluacion ? 'disabled' : undefined} />
                                </div>
                            </div>
                        </div>

                        <div>
                            {(isSuperAdmin && !evaluacion) || (idi?.proyecto.mostrar_recomendaciones && !evaluacion) ? (
                                <>
                                    {idi?.proyecto.evaluaciones.map((evaluacion, i) =>
                                        isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                            <ToolTipMui
                                                key={i}
                                                title={
                                                    <div>
                                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                        <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.bibliografia_comentario ? evaluacion.idi_evaluacion.bibliografia_comentario : 'Sin recomendación'}</p>
                                                    </div>
                                                }
                                            >
                                                Evaluación {i + 1}
                                            </ToolTipMui>
                                        ) : null,
                                    )}
                                    {idi?.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                </>
                            ) : null}

                            {props.bibliografia}
                        </div>

                        <div>{props.items_finales}</div>
                    </>
                )}
            </fieldset>
            {form.isDirty && <div>There are unsaved form changes.</div>}
        </form>
    )
}

export default Form
