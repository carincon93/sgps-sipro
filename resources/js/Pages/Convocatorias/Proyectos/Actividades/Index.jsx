import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import Label from '@/Components/Label'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TableMui from '@/Components/Table'
import TabsMui from '@/Components/TabsMui'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import Evaluacion from './Evaluacion'
import Form from './Form'

import axios from 'axios'

import { route, checkRole } from '@/Utils'

import { useState, useEffect } from 'react'
import { router, useForm } from '@inertiajs/react'
import TextInput from '@/Components/TextInput'

const Actividades = ({
    auth,
    convocatoria,
    proyecto,
    evaluacion,
    actividades,
    municipios,
    regionales,
    programas_formacion,
    disenos_curriculares,
    areas_cualificacion_mnc,
    proyecto_presupuesto,
    proyecto_roles,
    productos,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [actividad_to_destroy, setActividadToDestroy] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [actividad, setActividad] = useState(null)

    const form = useForm({
        metodologia: proyecto.metodologia,
        metodologia_local: proyecto.metodologia_local,
        municipios: proyecto.municipios?.map((item) => item.id),
        municipios_impactar: proyecto.municipios_a_impactar?.map((item) => item.id),
        otras_nuevas_instituciones: proyecto.otras_nuevas_instituciones,
        otras_nombre_instituciones_programas: proyecto.otras_nombre_instituciones_programas,
        otras_nombre_instituciones: proyecto.otras_nombre_instituciones,
        impacto_municipios: proyecto.impacto_municipios,
        nombre_instituciones: proyecto.nombre_instituciones,
        nombre_instituciones_programas: proyecto.nombre_instituciones_programas,
        nuevas_instituciones: proyecto.nuevas_instituciones,
        proyeccion_nuevas_instituciones: proyecto.proyeccion_nuevas_instituciones,
        proyeccion_articulacion_media: proyecto.proyeccion_articulacion_media,
        proyectos_macro: proyecto.proyectos_macro,
        implementacion_modelo_pedagogico: proyecto.implementacion_modelo_pedagogico,
        articulacion_plan_educacion: proyecto.articulacion_plan_educacion,
        articulacion_territorios_stem: proyecto.articulacion_territorios_stem,
        programas_formacion_articulados: proyecto.programas_formacion?.map((item) => item.id),
        diseno_curricular_id: proyecto.disenos_curriculares?.map((item) => item.id),
        estrategia_articulacion_prox_vigencia: proyecto.estrategia_articulacion_prox_vigencia,
        alianzas_estrategicas: proyecto.alianzas_estrategicas,
        estrategia_divulgacion: proyecto.estrategia_divulgacion,
        promover_productividad: proyecto.promover_productividad,
        estrategia_atencion_talentos: proyecto.estrategia_atencion_talentos,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.metodologia', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_metodologia_proyecto_hub = useForm({
        metodologia: proyecto.proyecto_hub_linea69?.metodologia,
        metodologia_local: proyecto.proyecto_hub_linea69?.metodologia_local,
        areas_cualificacion_mnc: proyecto.proyecto_hub_linea69?.areas_cualificacion_mnc,
        talentos_otros_departamentos: proyecto.proyecto_hub_linea69?.talentos_otros_departamentos,
        estrategia_atencion_talentos: proyecto.proyecto_hub_linea69?.estrategia_atencion_talentos,
        acciones_mejoramiento_idic: proyecto.proyecto_hub_linea69?.acciones_mejoramiento_idic,
        municipios_beneficiados_vigencia_anterior: proyecto.proyecto_hub_linea69?.municipios_beneficiados_vigencia_anterior,
        beneficio_municipios_vigencia_anterior: proyecto.proyecto_hub_linea69?.beneficio_municipios_vigencia_anterior,
        municipios_beneficiados_vigencia_actual: proyecto.proyecto_hub_linea69?.municipios_beneficiados_vigencia_actual,
        estrategia_articulacion_pbts: proyecto.proyecto_hub_linea69?.estrategia_articulacion_pbts,
        numero_empresas_atendidas: proyecto.proyecto_hub_linea69?.numero_empresas_atendidas,
        analisis_impacto_sector_empresarial: proyecto.proyecto_hub_linea69?.analisis_impacto_sector_empresarial,
        numero_emprendedores_atendidos: proyecto.proyecto_hub_linea69?.numero_emprendedores_atendidos,
        analisis_impacto_regional: proyecto.proyecto_hub_linea69?.analisis_impacto_regional,
        gestion_alianzas_estrategicas: proyecto.proyecto_hub_linea69?.gestion_alianzas_estrategicas,
        estrategias_visibilizacion: proyecto.proyecto_hub_linea69?.estrategias_visibilizacion,
        integracion_plan_tecnologico: proyecto.proyecto_hub_linea69?.integracion_plan_tecnologico,
        estrategias_productividad_agropecuaria: proyecto.proyecto_hub_linea69?.estrategias_productividad_agropecuaria,
        acciones_estrategia_campesena: proyecto.proyecto_hub_linea69?.acciones_estrategia_campesena,
        estrategia_campesena_campesinos: proyecto.proyecto_hub_linea69?.estrategia_campesena_campesinos,
        acciones_fortalecimiento_economia_popular: proyecto.proyecto_hub_linea69?.acciones_fortalecimiento_economia_popular,
        acciones_fortalecimiento_idi: proyecto.proyecto_hub_linea69?.acciones_fortalecimiento_idi,
    })

    const submitMetodologiaProyectoHub = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_metodologia_proyecto_hub.put(route('convocatorias.proyectos.metodologia-proyecto-hub', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const formMetdologiaProyectoFormulario11Linea83 = useForm({
        metodologia: proyecto.proyecto_linea83?.metodologia,
        departamentos_a_impactar: proyecto.proyecto_linea83?.departamentos_a_impactar,
        estrategias_atencion_empresas_municipios: proyecto.proyecto_linea83?.estrategias_atencion_empresas_municipios,
        estrategias_promover_logros: proyecto.proyecto_linea83?.estrategias_promover_logros,
        estrategias_visibilizacion: proyecto.proyecto_linea83?.estrategias_visibilizacion,
        estrategias_productividad_agropecuaria_agroindustrial: proyecto.proyecto_linea83?.estrategias_productividad_agropecuaria_agroindustrial,
    })

    const submitMetodologiaProyectoFormulario11Linea83 = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formMetdologiaProyectoFormulario11Linea83.put(route('convocatorias.proyectos.metodologia-proyecto-linea-83', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const [regional_ie_articulacion, setRegionalIEArticulacion] = useState(null)
    const [whitelist_instituciones_educativas_articular, setWhitelistInstitucionesEducativasArticular] = useState([])
    const getInstitucionesEducationArticular = (regional_seleccionada) => {
        setRegionalIEArticulacion(regional_seleccionada)
        if (regional_seleccionada) {
            axios
                .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + regionales.find((item) => item.value == regional_seleccionada)?.codigo)
                .then(function (response) {
                    const data = response.data.map((item) => item.nombre_establecimiento)
                    setWhitelistInstitucionesEducativasArticular(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    const [regional_ie_ejecucion, setMunicipioIEEjecucion] = useState(null)
    const [whitelist_instituciones_educativas_ejecutar, setWhitelistInstitucionesEducativasEjecutar] = useState([])
    const getInstitucionesEducationEjecutar = (regional_seleccionada) => {
        setMunicipioIEEjecucion(regional_seleccionada)
        if (regional_seleccionada) {
            axios
                .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + regionales.find((item) => item.value == regional_seleccionada)?.codigo)
                .then(function (response) {
                    const data = response.data.map((item) => item.nombre_establecimiento)
                    setWhitelistInstitucionesEducativasEjecutar(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    const tabs =
        proyecto.tipo_formulario_convocatoria_id == 7 ||
        proyecto.tipo_formulario_convocatoria_id == 9 ||
        proyecto.tipo_formulario_convocatoria_id == 8 ||
        proyecto.tipo_formulario_convocatoria_id == 1 ||
        proyecto.tipo_formulario_convocatoria_id == 12 ||
        proyecto.tipo_formulario_convocatoria_id == 6 ||
        proyecto.tipo_formulario_convocatoria_id == 5 ||
        proyecto.proyectoFormulario10Linea69 ||
        proyecto.tipo_formulario_convocatoria_id == 4 ||
        proyecto.tipo_formulario_convocatoria_id == 11
            ? [{ label: 'Metodología' }, { label: 'Actividades' }]
            : [{ label: 'Actividades' }]

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos.metodologia.updateLongColumn', [convocatoria.id, proyecto?.id, column]),
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
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            {/* <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={evaluacion_dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion auth_user={auth.user} convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
            </Grid> */}

            {/* {is_super_admin || proyecto.mostrar_recomendaciones ? (
                <>
                    {proyecto.evaluaciones.map((evaluacion, i) =>
                        is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                            <ToolTipMui
                                key={i}
                                title={
                                    <div>
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        {evaluacion.evaluacion_proyecto_linea66 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea66.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea66.metodologia_comentario : 'Sin recomendación'}
                                            </p>
                                        )}
                                        {!evaluacion.evaluacion_proyecto_linea66 && evaluacion.evaluacion_proyecto_linea65 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea65.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea65.metodologia_comentario : 'Sin recomendación'}
                                            </p>
                                        )}
                                        {!evaluacion.evaluacion_proyecto_linea66 && !evaluacion.evaluacion_proyecto_linea65 && evaluacion.evaluacion_proyecto_linea70 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea70.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea70.metodologia_comentario : 'Sin recomendación'}
                                            </p>
                                        )}
                                        {!evaluacion.evaluacion_proyecto_linea66 &&
                                            !evaluacion.evaluacion_proyecto_linea65 &&
                                            !evaluacion.evaluacion_proyecto_linea70 &&
                                            evaluacion.evaluacion_proyecto_linea69 && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.evaluacion_proyecto_linea69.metodologia_comentario
                                                        ? evaluacion.evaluacion_proyecto_linea69.metodologia_comentario
                                                        : 'Sin recomendación'}
                                                </p>
                                            )}
                                        {!evaluacion.evaluacion_proyecto_linea66 &&
                                            !evaluacion.evaluacion_proyecto_linea65 &&
                                            !evaluacion.evaluacion_proyecto_linea70 &&
                                            !evaluacion.evaluacion_proyecto_linea69 &&
                                            evaluacion.evaluacion_proyecto_linea68 && (
                                                <div>
                                                    <h1 className="font-black mt-10">Metodología</h1>
                                                    <p className="whitespace-pre-line text-xs">
                                                        {evaluacion.evaluacion_proyecto_linea68.metodologia_comentario
                                                            ? evaluacion.evaluacion_proyecto_linea68.metodologia_comentario
                                                            : 'Sin recomendación'}
                                                    </p>
                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Actividades</h1>
                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68.actividades_primer_obj_comentario
                                                                ? 'Recomendación actividades del primer objetivo específico: ' +
                                                                  evaluacion.evaluacion_proyecto_linea68.actividades_primer_obj_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68.actividades_segundo_obj_comentario
                                                                ? 'Recomendación actividades del segundo objetivo específico: ' +
                                                                  evaluacion.evaluacion_proyecto_linea68.actividades_segundo_obj_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68.actividades_tercer_obj_comentario
                                                                ? 'Recomendación actividades del tercer objetivo específico: ' +
                                                                  evaluacion.evaluacion_proyecto_linea68.actividades_tercer_obj_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68.actividades_cuarto_obj_comentario
                                                                ? 'Recomendación actividades del cuarto objetivo específico: ' +
                                                                  evaluacion.evaluacion_proyecto_linea68.actividades_cuarto_obj_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                    </ul>
                                                </div>
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

            <TabsMui tabs={tabs}>
                <div>
                    <Grid item md={12}>
                        <AlertMui>
                            <h1 className="text-3xl text-center">Metodología</h1>
                            <p className="my-8">
                                Se debe evidenciar que la metodología se presente de forma organizada y de manera secuencial, de acuerdo con el ciclo P-H-V-A “Planificar – Hacer – Verificar - Actuar”
                                para alcanzar el objetivo general y cada uno de los objetivos específicos.
                            </p>
                        </AlertMui>
                    </Grid>
                    {(proyecto.tipo_formulario_convocatoria_id == 5 && !proyecto.proyecto_hub_linea69) || proyecto.tipo_formulario_convocatoria_id == 4 ? (
                        <Grid item md={12}>
                            <form onSubmit={submit} className="!mt-20">
                                <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                                    <Grid container rowSpacing={20}>
                                        <Grid item md={12}>
                                            <Label required className="mb-4" labelFor="metodologia" value="Metodología" />
                                            <Textarea
                                                id="metodologia"
                                                error={form.errors.metodologia}
                                                name="metodologia"
                                                value={form.data.metodologia}
                                                onChange={(e) => form.setData('metodologia', e.target.value)}
                                                onBlur={() => syncColumnLong('metodologia', form)}
                                                required
                                            />
                                        </Grid>

                                        {(proyecto.tipo_formulario_convocatoria_id == 5 && !proyecto.proyecto_hub_linea69) || proyecto.tipo_formulario_convocatoria_id == 4 ? (
                                            <Grid item md={12}>
                                                <Label
                                                    required
                                                    className="mb-4"
                                                    labelFor="metodologia_local"
                                                    value={
                                                        proyecto.tipo_formulario_convocatoria_id == 5
                                                            ? 'A continuación, describa la metodología que será implementada en el ' +
                                                              convocatoria.year +
                                                              ' en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Tecnoparques:'
                                                            : 'Descripcion de la metodología aplicada a nivel local'
                                                    }
                                                />
                                                <Textarea
                                                    id="metodologia_local"
                                                    error={form.errors.metodologia_local}
                                                    name="metodologia_local"
                                                    value={form.data.metodologia_local}
                                                    onChange={(e) => form.setData('metodologia_local', e.target.value)}
                                                    onBlur={() => syncColumnLong('metodologia_local', form)}
                                                    required
                                                />
                                            </Grid>
                                        ) : null}

                                        {proyecto.tipo_formulario_convocatoria_id == 4 && (
                                            <>
                                                <Grid item md={12}>
                                                    <Label
                                                        required
                                                        className="mb-4"
                                                        labelFor="implementacion_modelo_pedagogico"
                                                        value="Implementación del Modelo Pedagógico de las TecnoAcademia en el contexto regional de la TecnoAcademia"
                                                    />

                                                    <Textarea
                                                        id="implementacion_modelo_pedagogico"
                                                        error={form.errors.implementacion_modelo_pedagogico}
                                                        name="implementacion_modelo_pedagogico"
                                                        value={form.data.implementacion_modelo_pedagogico}
                                                        onChange={(e) => form.setData('implementacion_modelo_pedagogico', e.target.value)}
                                                        onBlur={() => syncColumnLong('implementacion_modelo_pedagogico', form)}
                                                        required
                                                    />
                                                </Grid>

                                                <Grid item md={6}>
                                                    <Label required className="mb-4" labelFor="municipios" value="Nombre los municipios impactados en la vigencia anterior por la TecnoAcademia" />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <SelectMultiple
                                                        id="municipios"
                                                        name="municipios"
                                                        bdValues={form.data.municipios}
                                                        options={municipios}
                                                        isGroupable={true}
                                                        groupBy={(option) => option.group}
                                                        error={form.errors.municipios}
                                                        onChange={(event, newValue) => {
                                                            const selected_values = newValue.map((option) => option.value)
                                                            form.setData((prevData) => ({
                                                                ...prevData,
                                                                municipios: selected_values,
                                                            }))
                                                        }}
                                                        onBlur={() => syncColumnLong('municipios', form)}
                                                        required
                                                    />
                                                </Grid>

                                                <Grid item md={6}>
                                                    <Label required className="mb-4" labelFor="municipios_impactar" value="Defina los municipios a impactar en la vigencia el proyecto:" />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <SelectMultiple
                                                        id="municipios_impactar"
                                                        name="municipios_impactar"
                                                        bdValues={form.data.municipios_impactar}
                                                        options={municipios}
                                                        isGroupable={true}
                                                        groupBy={(option) => option.group}
                                                        error={form.errors.municipios_impactar}
                                                        onChange={(event, newValue) => {
                                                            const selected_values = newValue.map((option) => option.value)
                                                            form.setData((prevData) => ({
                                                                ...prevData,
                                                                municipios_impactar: selected_values,
                                                            }))
                                                        }}
                                                        onBlur={() => syncColumnLong('municipios_impactar', form)}
                                                        required
                                                    />
                                                </Grid>

                                                <Grid item md={12}>
                                                    <Label
                                                        required
                                                        className="mb-4"
                                                        labelFor="impacto_municipios"
                                                        value="Descripción del beneficio o impacto generado por la TecnoAcademia en los municipios"
                                                    />

                                                    <Textarea
                                                        id="impacto_municipios"
                                                        error={form.errors.impacto_municipios}
                                                        name="impacto_municipios"
                                                        value={form.data.impacto_municipios}
                                                        onChange={(e) => form.setData('impacto_municipios', e.target.value)}
                                                        onBlur={() => syncColumnLong('impacto_municipios', form)}
                                                        required
                                                    />
                                                </Grid>

                                                {/* <Grid item md={12}>
                                                    {(is_super_admin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0) ? (
                                                        <>
                                                            {proyecto.evaluaciones.map((evaluacion, i) =>
                                                                is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                                    <ToolTipMui
                                                                        key={i}
                                                                        title={
                                                                            <div>
                                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                                <p className="whitespace-pre-line text-xs text-justify">
                                                                                    {evaluacion.evaluacion_proyecto_linea70.municipios_comentario
                                                                                        ? evaluacion.evaluacion_proyecto_linea70.municipios_comentario
                                                                                        : 'Sin recomendación'}
                                                                                </p>
                                                                            </div>
                                                                        }>
                                                                        Evaluación {i + 1}
                                                                    </ToolTipMui>
                                                                ) : null,
                                                            )}
                                                            {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                                        </>
                                                    ) : null}
                                                </Grid> */}

                                                <Grid item md={6}>
                                                    <Label
                                                        required={form.data.otras_nombre_instituciones_programas ? false : true}
                                                        className="mb-4"
                                                        labelFor="nombre_instituciones_programas"
                                                        value="Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias"
                                                    />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <Autocomplete
                                                        id="departamento_instituciones_programas"
                                                        selectedValue={regional_ie_articulacion}
                                                        onChange={(event, newValue) => {
                                                            getInstitucionesEducationArticular(newValue.value)
                                                        }}
                                                        options={regionales}
                                                    />

                                                    <Tags
                                                        id="nombre_instituciones_programas"
                                                        className="mt-4"
                                                        whitelist={whitelist_instituciones_educativas_articular}
                                                        tags={form.data.nombre_instituciones_programas}
                                                        value={form.data.nombre_instituciones_programas}
                                                        onChange={(e) => (
                                                            form.setData('nombre_instituciones_programas', e.target.value), syncColumnLong('nombre_instituciones_programas', form, e.target.value)
                                                        )}
                                                        placeholder="Nombre(s) de la(s) IE"
                                                        error={
                                                            whitelist_instituciones_educativas_articular.length == 0
                                                                ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                                                : form.errors.nombre_instituciones_programas
                                                        }
                                                        required={form.data.nombre_instituciones_programas ? false : true}
                                                    />
                                                    <div className="mt-10">
                                                        <AlertMui>
                                                            Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto
                                                        </AlertMui>
                                                        <Textarea
                                                            label="Instituciones"
                                                            id="otras_nombre_instituciones_programas"
                                                            error={form.errors.otras_nombre_instituciones_programas}
                                                            value={form.data.otras_nombre_instituciones_programas}
                                                            onChange={(e) => form.setData('otras_nombre_instituciones_programas', e.target.value)}
                                                            onBlur={() => syncColumnLong('otras_nombre_instituciones_programas', form)}
                                                        />
                                                    </div>
                                                </Grid>

                                                <Grid item md={6}>
                                                    <Label
                                                        required
                                                        className="mb-4"
                                                        labelFor="proyeccion_nuevas_instituciones"
                                                        value="¿Se proyecta incluir nuevas Instituciones Educativas en la nueva vigencia?"
                                                    />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <Autocomplete
                                                        options={[
                                                            { value: 1, label: 'Si' },
                                                            { value: 2, label: 'No' },
                                                        ]}
                                                        id="proyeccion_nuevas_instituciones"
                                                        selectedValue={form.data.proyeccion_nuevas_instituciones}
                                                        error={form.errors.proyeccion_nuevas_instituciones}
                                                        onChange={(event, newValue) => form.setData('proyeccion_nuevas_instituciones', newValue.value)}
                                                        onBlur={() => syncColumnLong('proyeccion_nuevas_instituciones', form)}
                                                        required
                                                    />
                                                </Grid>

                                                {form.data.proyeccion_nuevas_instituciones == 1 && (
                                                    <>
                                                        <Grid item md={6}>
                                                            <Label
                                                                required={form.data.otras_nuevas_instituciones ? false : true}
                                                                className="mb-4"
                                                                labelFor="nuevas_instituciones"
                                                                value="Nuevas instituciones educativas que se vincularán con el proyecto de TecnoAcademia"
                                                            />
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <Autocomplete
                                                                id="departamento_nuevas_instituciones"
                                                                selectedValue={regional_ie_ejecucion}
                                                                onChange={(event, newValue) => {
                                                                    getInstitucionesEducationEjecutar(newValue.value)
                                                                }}
                                                                options={regionales}
                                                            />

                                                            <Tags
                                                                id="nuevas_instituciones"
                                                                className="mt-4"
                                                                whitelist={whitelist_instituciones_educativas_ejecutar}
                                                                tags={form.data.nuevas_instituciones}
                                                                value={form.data.nuevas_instituciones}
                                                                onChange={(e) => (form.setData('nuevas_instituciones', e.target.value), syncColumnLong('nuevas_instituciones', form, e.target.value))}
                                                                placeholder="Nombre(s) de la(s) IE"
                                                                error={
                                                                    whitelist_instituciones_educativas_ejecutar.length == 0
                                                                        ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                                                        : form.errors.nuevas_instituciones
                                                                }
                                                                required={form.data.nuevas_instituciones ? false : true}
                                                            />
                                                            <div className="mt-10">
                                                                <AlertMui>
                                                                    Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto
                                                                </AlertMui>
                                                                <Textarea
                                                                    label="Instituciones"
                                                                    id="otras_nuevas_instituciones"
                                                                    error={form.errors.otras_nuevas_instituciones}
                                                                    value={form.data.otras_nuevas_instituciones}
                                                                    onChange={(e) => form.setData('otras_nuevas_instituciones', e.target.value)}
                                                                    onBlur={() => syncColumnLong('otras_nuevas_instituciones', form)}
                                                                />
                                                            </div>
                                                        </Grid>
                                                    </>
                                                )}

                                                <Grid item md={6}>
                                                    <Label
                                                        required
                                                        className="mb-4"
                                                        labelFor="proyeccion_articulacion_media"
                                                        value="¿Se proyecta incluir Instituciones Educativas en articulación con la media?"
                                                    />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <Autocomplete
                                                        options={[
                                                            { value: 1, label: 'Si' },
                                                            { value: 2, label: 'No' },
                                                        ]}
                                                        id="proyeccion_articulacion_media"
                                                        selectedValue={form.data.proyeccion_articulacion_media}
                                                        onChange={(event, newValue) => form.setData('proyeccion_articulacion_media', newValue.value)}
                                                        error={form.errors.proyeccion_articulacion_media}
                                                        onBlur={() => syncColumnLong('proyeccion_articulacion_media', form)}
                                                        required
                                                    />
                                                </Grid>

                                                {form.data.proyeccion_articulacion_media == 1 && (
                                                    <>
                                                        <Grid item md={6}>
                                                            <Label
                                                                required={form.data.otras_nombre_instituciones ? false : true}
                                                                className="mb-4"
                                                                labelFor="nombre_instituciones"
                                                                value="Instituciones donde se implementará el programa que tienen articulación con la Media"
                                                            />
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <Autocomplete
                                                                id="departamento_instituciones_media"
                                                                selectedValue={regional_ie_ejecucion}
                                                                onChange={(event, newValue) => {
                                                                    getInstitucionesEducationEjecutar(newValue.value)
                                                                }}
                                                                options={regionales}
                                                            />

                                                            <Tags
                                                                id="nombre_instituciones"
                                                                className="mt-4"
                                                                whitelist={whitelist_instituciones_educativas_ejecutar}
                                                                tags={form.data.nombre_instituciones}
                                                                value={form.data.nombre_instituciones}
                                                                onChange={(e) => (form.setData('nombre_instituciones', e.target.value), syncColumnLong('nombre_instituciones', form, e.target.value))}
                                                                placeholder="Nombre(s) de la(s) IE"
                                                                error={
                                                                    whitelist_instituciones_educativas_ejecutar.length == 0
                                                                        ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                                                        : form.errors.nombre_instituciones
                                                                }
                                                                required={form.data.nombre_instituciones ? false : true}
                                                            />

                                                            <div className="mt-10">
                                                                <AlertMui>
                                                                    Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto
                                                                </AlertMui>
                                                                <Textarea
                                                                    label="Instituciones"
                                                                    id="otras_nombre_instituciones"
                                                                    error={form.errors.otras_nombre_instituciones}
                                                                    value={form.data.otras_nombre_instituciones}
                                                                    onChange={(e) => form.setData('otras_nombre_instituciones', e.target.value)}
                                                                    onBlur={() => syncColumnLong('otras_nombre_instituciones', form)}
                                                                />
                                                            </div>
                                                        </Grid>
                                                    </>
                                                )}

                                                {/* <Grid item md={12}>
                                                    {(is_super_admin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0) ? (
                                                        <>
                                                            {proyecto.evaluaciones.map((evaluacion, i) =>
                                                                is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                                    <ToolTipMui
                                                                        key={i}
                                                                        title={
                                                                            <div>
                                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                                <p className="whitespace-pre-line text-xs text-justify">
                                                                                    {evaluacion.evaluacion_proyecto_linea70.instituciones_comentario
                                                                                        ? evaluacion.evaluacion_proyecto_linea70.instituciones_comentario
                                                                                        : 'Sin recomendación'}
                                                                                </p>
                                                                            </div>
                                                                        }>
                                                                        Evaluación {i + 1}
                                                                    </ToolTipMui>
                                                                ) : null,
                                                            )}
                                                            {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                                        </>
                                                    ) : null}
                                                </Grid> */}

                                                <Grid item md={6}>
                                                    <Label
                                                        required
                                                        className="mb-4"
                                                        labelFor="programas_formacion_articulados"
                                                        value="Programas de articulación con la Media con los cuales se espera dar continuidad a la ruta de formación de los aprendices de la TecnoAcademia"
                                                    />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <SelectMultiple
                                                        id="programas_formacion_articulados"
                                                        bdValues={form.data.programas_formacion_articulados}
                                                        options={programas_formacion}
                                                        onChange={(event, newValue) => {
                                                            const selected_values = newValue.map((option) => option.value)
                                                            form.setData((prevData) => ({
                                                                ...prevData,
                                                                programas_formacion_articulados: selected_values,
                                                            }))
                                                        }}
                                                        error={form.errors.programas_formacion_articulados}
                                                        required
                                                        onBlur={() => syncColumnLong('programas_formacion_articulados', form)}
                                                    />
                                                </Grid>

                                                <Grid item md={6}>
                                                    <Label required className="mb-4" labelFor="diseno_curricular_id" value="Programas a ejecutar en la vigencia del proyecto:" />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <SelectMultiple
                                                        id="diseno_curricular_id"
                                                        bdValues={form.data.diseno_curricular_id}
                                                        options={disenos_curriculares}
                                                        onChange={(event, newValue) => {
                                                            const selected_values = newValue.map((option) => option.value)
                                                            form.setData((prevData) => ({
                                                                ...prevData,
                                                                diseno_curricular_id: selected_values,
                                                            }))
                                                        }}
                                                        error={form.errors.diseno_curricular_id}
                                                        required
                                                        onBlur={() => syncColumnLong('diseno_curricular_id', form)}
                                                    />
                                                </Grid>

                                                <Grid item md={12}>
                                                    <Label
                                                        required
                                                        className="mb-4"
                                                        labelFor="proyectos_macro"
                                                        value={`Proyectos Macro o líneas de proyecto de investigación formativa y aplicada de la TecnoAcademia para la vigencia ${convocatoria.year}`}
                                                    />

                                                    <Textarea
                                                        id="proyectos_macro"
                                                        error={form.errors.proyectos_macro}
                                                        value={form.data.proyectos_macro}
                                                        onChange={(e) => form.setData('proyectos_macro', e.target.value)}
                                                        onBlur={() => syncColumnLong('proyectos_macro', form)}
                                                        required
                                                    />
                                                </Grid>

                                                {/* <Grid item md={12}>
                                                    {(is_super_admin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0) ? (
                                                        <>
                                                            {proyecto.evaluaciones.map((evaluacion, i) =>
                                                                is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                                    <ToolTipMui
                                                                        key={i}
                                                                        title={
                                                                            <div>
                                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                                <p className="whitespace-pre-line text-xs text-justify">
                                                                                    {evaluacion.evaluacion_proyecto_linea70.proyectos_macro_comentario
                                                                                        ? evaluacion.evaluacion_proyecto_linea70.proyectos_macro_comentario
                                                                                        : 'Sin recomendación'}
                                                                                </p>
                                                                            </div>
                                                                        }>
                                                                        Evaluación {i + 1}
                                                                    </ToolTipMui>
                                                                ) : null,
                                                            )}
                                                            {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                                                        </>
                                                    ) : null}
                                                </Grid> */}

                                                <Grid item md={12}>
                                                    <Label
                                                        required
                                                        className="mb-4"
                                                        labelFor="articulacion_plan_educacion"
                                                        value={`Articulación de la TecnoAcademia con el Plan Decenal de Educación y su regionalización en el territorio: mencionar logros de la vigencia ${
                                                            convocatoria.year - 1
                                                        } y ${convocatoria.year}`}
                                                    />

                                                    <Textarea
                                                        id="articulacion_plan_educacion"
                                                        error={form.errors.articulacion_plan_educacion}
                                                        value={form.data.articulacion_plan_educacion}
                                                        onChange={(e) => form.setData('articulacion_plan_educacion', e.target.value)}
                                                        onBlur={() => syncColumnLong('articulacion_plan_educacion', form)}
                                                        required
                                                    />
                                                </Grid>

                                                <Grid item md={12}>
                                                    <Label
                                                        required
                                                        className="mb-4"
                                                        labelFor="articulacion_territorios_stem"
                                                        value="Artifculación de la TecnoAcademia con la Iniciativa de Territorios STEM+ del Ministerio de Educación en el Territorio"
                                                    />

                                                    <Textarea
                                                        id="articulacion_territorios_stem"
                                                        error={form.errors.articulacion_territorios_stem}
                                                        value={form.data.articulacion_territorios_stem}
                                                        onChange={(e) => form.setData('articulacion_territorios_stem', e.target.value)}
                                                        onBlur={() => syncColumnLong('articulacion_territorios_stem', form)}
                                                        required
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </fieldset>
                                <div className=" flex items-center justify-between py-4">
                                    {proyecto.allowed.to_update && (
                                        <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                            Guardar información de la metodología
                                        </PrimaryButton>
                                    )}
                                </div>
                            </form>
                        </Grid>
                    ) : null}
                    {proyecto.proyecto_hub_linea69 && (
                        <form onSubmit={submitMetodologiaProyectoHub} className="!mt-20">
                            <Grid container rowSpacing={20}>
                                <Grid item md={12}>
                                    <Label required className="mb-4" labelFor="metodologia" value="Metodología General implemetnada por el Tecnoparque/Hub de Innovación" />

                                    <Textarea
                                        id="metodologia"
                                        error={form_metodologia_proyecto_hub.errors.metodologia}
                                        value={form_metodologia_proyecto_hub.data.metodologia}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('metodologia', e.target.value)}
                                        onBlur={() => syncColumnLong('metodologia', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="metodologia_local"
                                        value={`A continuación, describa la metodología que será implementada en el ${convocatoria.year} en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Tecnoparques/ Hubs de Innovación:`}
                                    />

                                    <Textarea
                                        id="metodologia_local"
                                        error={form_metodologia_proyecto_hub.errors.metodologia_local}
                                        value={form_metodologia_proyecto_hub.data.metodologia_local}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('metodologia_local', e.target.value)}
                                        onBlur={() => syncColumnLong('metodologia_local', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <Label required className="mb-4" labelFor="areas_cualificacion_mnc" value="Temáticas según el Marco Nacional de Cualificación de los proyectos a acompañar:" />
                                </Grid>
                                <Grid item md={6}>
                                    <SelectMultiple
                                        id="areas_cualificacion_mnc"
                                        bdValues={form_metodologia_proyecto_hub.data.areas_cualificacion_mnc}
                                        options={areas_cualificacion_mnc}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form_metodologia_proyecto_hub.setData((prevData) => ({
                                                ...prevData,
                                                areas_cualificacion_mnc: selected_values,
                                            }))
                                        }}
                                        error={form_metodologia_proyecto_hub.errors.areas_cualificacion_mnc}
                                        label="Seleccione una o varias opciones"
                                        required
                                        disabled={evaluacion ? true : false}
                                        onBlur={() => syncColumnLong('areas_cualificacion_mnc', form_metodologia_proyecto_hub)}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="talentos_otros_departamentos"
                                        value={`¿Planea en el ${convocatoria.year} realizar acciones que beneficien talentos en otros departamentos?`}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <SelectMultiple
                                        id="talentos_otros_departamentos"
                                        bdValues={form_metodologia_proyecto_hub.data.talentos_otros_departamentos}
                                        options={regionales}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form_metodologia_proyecto_hub.setData((prevData) => ({
                                                ...prevData,
                                                talentos_otros_departamentos: selected_values,
                                            }))
                                        }}
                                        error={form_metodologia_proyecto_hub.errors.talentos_otros_departamentos}
                                        label="Seleccione una o varias opciones"
                                        required
                                        disabled={evaluacion ? true : false}
                                        onBlur={() => syncColumnLong('talentos_otros_departamentos', form_metodologia_proyecto_hub)}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategia_atencion_talentos"
                                        value="Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados"
                                    />

                                    <Textarea
                                        id="estrategia_atencion_talentos"
                                        error={form_metodologia_proyecto_hub.errors.estrategia_atencion_talentos}
                                        value={form_metodologia_proyecto_hub.data.estrategia_atencion_talentos}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('estrategia_atencion_talentos', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategia_atencion_talentos', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="acciones_mejoramiento_idic"
                                        value={`Describa las acciones que serán realizadas en el ${convocatoria.year} para cotriuir al mejoramiento del IDIC del Departamento, desde el Tecnoparque/ Hub de Innovación`}
                                    />

                                    <Textarea
                                        id="acciones_mejoramiento_idic"
                                        error={form_metodologia_proyecto_hub.errors.acciones_mejoramiento_idic}
                                        value={form_metodologia_proyecto_hub.data.acciones_mejoramiento_idic}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('acciones_mejoramiento_idic', e.target.value)}
                                        onBlur={() => syncColumnLong('acciones_mejoramiento_idic', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="municipios_beneficiados_vigencia_anterior"
                                        value={`¿Planea en el ${convocatoria.year} realizar acciones que beneficien talentos en otros departamentos?`}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <SelectMultiple
                                        id="municipios_beneficiados_vigencia_anterior"
                                        bdValues={form_metodologia_proyecto_hub.data.municipios_beneficiados_vigencia_anterior}
                                        options={municipios}
                                        isGroupable={true}
                                        groupBy={(option) => option.group}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form_metodologia_proyecto_hub.setData((prevData) => ({
                                                ...prevData,
                                                municipios_beneficiados_vigencia_anterior: selected_values,
                                            }))
                                        }}
                                        error={form_metodologia_proyecto_hub.errors.municipios_beneficiados_vigencia_anterior}
                                        label="Seleccione una o varias opciones"
                                        required
                                        disabled={evaluacion ? true : false}
                                        onBlur={() => syncColumnLong('municipios_beneficiados_vigencia_anterior', form_metodologia_proyecto_hub)}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="beneficio_municipios_vigencia_anterior"
                                        value="Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados"
                                    />

                                    <Textarea
                                        id="beneficio_municipios_vigencia_anterior"
                                        error={form_metodologia_proyecto_hub.errors.beneficio_municipios_vigencia_anterior}
                                        value={form_metodologia_proyecto_hub.data.beneficio_municipios_vigencia_anterior}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('beneficio_municipios_vigencia_anterior', e.target.value)}
                                        onBlur={() => syncColumnLong('beneficio_municipios_vigencia_anterior', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={6}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="municipios_beneficiados_vigencia_actual"
                                        value={`Nombre de los municipios que planea serán beneficiados en el ${convocatoria.year}`}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <SelectMultiple
                                        id="municipios_beneficiados_vigencia_actual"
                                        bdValues={form_metodologia_proyecto_hub.data.municipios_beneficiados_vigencia_actual}
                                        options={municipios}
                                        isGroupable={true}
                                        groupBy={(option) => option.group}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form_metodologia_proyecto_hub.setData((prevData) => ({
                                                ...prevData,
                                                municipios_beneficiados_vigencia_actual: selected_values,
                                            }))
                                        }}
                                        error={form_metodologia_proyecto_hub.errors.municipios_beneficiados_vigencia_actual}
                                        label="Seleccione una o varias opciones"
                                        required
                                        disabled={evaluacion ? true : false}
                                        onBlur={() => syncColumnLong('municipios_beneficiados_vigencia_actual', form_metodologia_proyecto_hub)}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategia_articulacion_pbts"
                                        value={`De aceurdo a los resultados obtenidos, comparta la estrategia de Articulación de PBTs y Talentos para el ${convocatoria.year}`}
                                    />

                                    <Textarea
                                        id="estrategia_articulacion_pbts"
                                        error={form_metodologia_proyecto_hub.errors.estrategia_articulacion_pbts}
                                        value={form_metodologia_proyecto_hub.data.estrategia_articulacion_pbts}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('estrategia_articulacion_pbts', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategia_articulacion_pbts', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={6}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="numero_empresas_atendidas"
                                        value={`Número de Empresas atendidas en el ${convocatoria.year - 1}, por el Tecnoparque/Hub?`}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        id="numero_empresas_atendidas"
                                        type="number"
                                        error={form_metodologia_proyecto_hub.errors.numero_empresas_atendidas}
                                        value={form_metodologia_proyecto_hub.data.numero_empresas_atendidas}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('numero_empresas_atendidas', e.target.value)}
                                        onBlur={() => syncColumnLong('numero_empresas_atendidas', form_metodologia_proyecto_hub)}
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="analisis_impacto_sector_empresarial"
                                        value={`Analice los impactos en el ${convocatoria.year - 1} en el sector empresarial regional y determine acciones y estrategias a realizar en el ${
                                            convocatoria.year
                                        } para continuar con el fortalecimiento.`}
                                    />

                                    <Textarea
                                        id="analisis_impacto_sector_empresarial"
                                        error={form_metodologia_proyecto_hub.errors.analisis_impacto_sector_empresarial}
                                        value={form_metodologia_proyecto_hub.data.analisis_impacto_sector_empresarial}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('analisis_impacto_sector_empresarial', e.target.value)}
                                        onBlur={() => syncColumnLong('analisis_impacto_sector_empresarial', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={6}>
                                    <Label required className="mb-4" labelFor="numero_emprendedores_atendidos" value={`Número de Emprendedores atendidos en el ${convocatoria.year - 1}`} />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        id="numero_emprendedores_atendidos"
                                        type="number"
                                        error={form_metodologia_proyecto_hub.errors.numero_emprendedores_atendidos}
                                        value={form_metodologia_proyecto_hub.data.numero_emprendedores_atendidos}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('numero_emprendedores_atendidos', e.target.value)}
                                        onBlur={() => syncColumnLong('numero_emprendedores_atendidos', form_metodologia_proyecto_hub)}
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="analisis_impacto_regional"
                                        value={`Analice los impactos en el ${convocatoria.year - 1} en el emprendimiento regional y determine acciones y estrategias a realizar en el ${
                                            convocatoria.year
                                        } para continuar con el fortalecimiento.`}
                                    />

                                    <Textarea
                                        id="analisis_impacto_regional"
                                        error={form_metodologia_proyecto_hub.errors.analisis_impacto_regional}
                                        value={form_metodologia_proyecto_hub.data.analisis_impacto_regional}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('analisis_impacto_regional', e.target.value)}
                                        onBlur={() => syncColumnLong('analisis_impacto_regional', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="gestion_alianzas_estrategicas"
                                        value={`Comparta las alianzas estratégicas a gestionar en el ${convocatoria.year} para promover el logro de las metas del Tecnoparque/ Hub de Innovación`}
                                    />

                                    <Textarea
                                        id="gestion_alianzas_estrategicas"
                                        error={form_metodologia_proyecto_hub.errors.gestion_alianzas_estrategicas}
                                        value={form_metodologia_proyecto_hub.data.gestion_alianzas_estrategicas}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('gestion_alianzas_estrategicas', e.target.value)}
                                        onBlur={() => syncColumnLong('gestion_alianzas_estrategicas', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategias_visibilizacion"
                                        value={`Comparta la estrategia de divulgación y visibilización de acciones del Tecnoparque/Hub de Innovación para el ${convocatoria.year}`}
                                    />

                                    <Textarea
                                        id="estrategias_visibilizacion"
                                        error={form_metodologia_proyecto_hub.errors.estrategias_visibilizacion}
                                        value={form_metodologia_proyecto_hub.data.estrategias_visibilizacion}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('estrategias_visibilizacion', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategias_visibilizacion', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="integracion_plan_tecnologico"
                                        value="¿Cómo está integrado el Tecnoparque/Hub de Innovación en el Plan Tecnológico del Centro?"
                                    />

                                    <Textarea
                                        id="integracion_plan_tecnologico"
                                        error={form_metodologia_proyecto_hub.errors.integracion_plan_tecnologico}
                                        value={form_metodologia_proyecto_hub.data.integracion_plan_tecnologico}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('integracion_plan_tecnologico', e.target.value)}
                                        onBlur={() => syncColumnLong('integracion_plan_tecnologico', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <h1 className="text-center">
                                        PLANEACIÓN METODOLÓGICA PARA LA IMPLEMENTACIÓN DE ESTRATEGIAS Y ACCIONES QUE CONTRIBUYAN A LOS EJES PRIORIZADOS PARA LA VIGENCIA {convocatoria.year}
                                    </h1>
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategias_productividad_agropecuaria"
                                        value={`Proponga las estrategias para el ${
                                            convocatoria.year - 1
                                        } con el fin de que el Tecnoparque contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial en los territorios que impacta el Tecnoparque/Hub de Innovación`}
                                    />

                                    <Textarea
                                        id="estrategias_productividad_agropecuaria"
                                        error={form_metodologia_proyecto_hub.errors.estrategias_productividad_agropecuaria}
                                        value={form_metodologia_proyecto_hub.data.estrategias_productividad_agropecuaria}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('estrategias_productividad_agropecuaria', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategias_productividad_agropecuaria', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="acciones_estrategia_campesena"
                                        value={`A partir de las necesidades y retos territoriales, plantee cuales serán las acciones a realizar en el ${convocatoria.year}, integradas dentro de la Estrategia Campesena, en las que participará el Tecnoparque/Hub de Innovación`}
                                    />

                                    <Textarea
                                        id="acciones_estrategia_campesena"
                                        error={form_metodologia_proyecto_hub.errors.acciones_estrategia_campesena}
                                        value={form_metodologia_proyecto_hub.data.acciones_estrategia_campesena}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('acciones_estrategia_campesena', e.target.value)}
                                        onBlur={() => syncColumnLong('acciones_estrategia_campesena', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategia_campesena_campesinos"
                                        value={`Describa las acciones del Tecnoparque/Hub de Innovación a  realizar en el ${convocatoria.year}, que estarán integradas dentro de la Estrategia Campesena, para beneficiar Campesinos y agremiaciones campesinas y especialmente al acompañamiento de Proyectos de I + D + i tendientes a generar y articular mecanismos de atención diferencial, integral e incluyente, para los campesinos, de acuerdo con sus particularidades sociales, culturales, económicas y territoriales, que faciliten el acceso a los programas de formación y demás servicios de la Entidad`}
                                    />

                                    <Textarea
                                        id="estrategia_campesena_campesinos"
                                        error={form_metodologia_proyecto_hub.errors.estrategia_campesena_campesinos}
                                        value={form_metodologia_proyecto_hub.data.estrategia_campesena_campesinos}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('estrategia_campesena_campesinos', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategia_campesena_campesinos', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="acciones_fortalecimiento_economia_popular"
                                        value={`Describa las acciones del  Tecnoparque/Hub de Innovación a  realizar en el ${convocatoria.year}, que estarán direccionadas a fortalecer la Economía Popular`}
                                    />

                                    <Textarea
                                        id="acciones_fortalecimiento_economia_popular"
                                        error={form_metodologia_proyecto_hub.errors.acciones_fortalecimiento_economia_popular}
                                        value={form_metodologia_proyecto_hub.data.acciones_fortalecimiento_economia_popular}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('acciones_fortalecimiento_economia_popular', e.target.value)}
                                        onBlur={() => syncColumnLong('acciones_fortalecimiento_economia_popular', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="acciones_fortalecimiento_idi"
                                        value={`Describa las acciones del  Tecnoparque/Hub de Innovación a  realizar en el ${convocatoria.year}, que estarán direccionadas a fortalecer Proyectos de I + D + i tendientes generación eléctrica a partir de fuentes no convencionales de energía renovable`}
                                    />

                                    <Textarea
                                        id="acciones_fortalecimiento_idi"
                                        error={form_metodologia_proyecto_hub.errors.acciones_fortalecimiento_idi}
                                        value={form_metodologia_proyecto_hub.data.acciones_fortalecimiento_idi}
                                        onChange={(e) => form_metodologia_proyecto_hub.setData('acciones_fortalecimiento_idi', e.target.value)}
                                        onBlur={() => syncColumnLong('acciones_fortalecimiento_idi', form_metodologia_proyecto_hub)}
                                        required
                                    />
                                </Grid>
                            </Grid>

                            <div className=" flex items-center justify-between py-4">
                                {proyecto.allowed.to_update && (
                                    <PrimaryButton disabled={form_metodologia_proyecto_hub.processing} className="ml-auto" type="submit">
                                        Guardar información de la metodología
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    )}
                    {proyecto.tipo_formulario_convocatoria_id == 11 && (
                        <form onSubmit={submitMetodologiaProyectoFormulario11Linea83} className="!mt-20">
                            <Grid container rowSpacing={20}>
                                <Grid item md={12}>
                                    <Label required className="mb-4" labelFor="metodologia" value={`Metodología (¿Cómo se implementará la línea en el ${convocatoria.year}?)`} />

                                    <Textarea
                                        id="metodologia"
                                        error={formMetdologiaProyectoFormulario11Linea83.errors.metodologia}
                                        value={formMetdologiaProyectoFormulario11Linea83.data.metodologia}
                                        onChange={(e) => formMetdologiaProyectoFormulario11Linea83.setData('metodologia', e.target.value)}
                                        onBlur={() => syncColumnLong('metodologia', formMetdologiaProyectoFormulario11Linea83)}
                                        required
                                    />
                                </Grid>

                                <Grid item md={6}>
                                    <Label required className="mb-4" labelFor="departamentos_a_impactar" value="Departamentos a impactar" />
                                </Grid>
                                <Grid item md={6}>
                                    <SelectMultiple
                                        id="departamentos_a_impactar"
                                        bdValues={formMetdologiaProyectoFormulario11Linea83.data.departamentos_a_impactar}
                                        options={regionales}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            formMetdologiaProyectoFormulario11Linea83.setData((prevData) => ({
                                                ...prevData,
                                                departamentos_a_impactar: selected_values,
                                            }))
                                        }}
                                        error={formMetdologiaProyectoFormulario11Linea83.errors.departamentos_a_impactar}
                                        label="Seleccione una o varias opciones"
                                        required
                                        disabled={evaluacion ? true : false}
                                        onBlur={() => syncColumnLong('departamentos_a_impactar', formMetdologiaProyectoFormulario11Linea83)}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategias_atencion_empresas_municipios"
                                        value="Comparta la estrategia para la atención de Empresas en los departamentos mencionados"
                                    />

                                    <Textarea
                                        id="estrategias_atencion_empresas_municipios"
                                        error={formMetdologiaProyectoFormulario11Linea83.errors.estrategias_atencion_empresas_municipios}
                                        value={formMetdologiaProyectoFormulario11Linea83.data.estrategias_atencion_empresas_municipios}
                                        onChange={(e) => formMetdologiaProyectoFormulario11Linea83.setData('estrategias_atencion_empresas_municipios', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategias_atencion_empresas_municipios', formMetdologiaProyectoFormulario11Linea83)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategias_promover_logros"
                                        value={`Comparta las alianzas estratégicas a gestionar en el ${convocatoria.year} para promover el logro de las metas de Extensionismo Tecnológico`}
                                    />

                                    <Textarea
                                        id="estrategias_promover_logros"
                                        error={formMetdologiaProyectoFormulario11Linea83.errors.estrategias_promover_logros}
                                        value={formMetdologiaProyectoFormulario11Linea83.data.estrategias_promover_logros}
                                        onChange={(e) => formMetdologiaProyectoFormulario11Linea83.setData('estrategias_promover_logros', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategias_promover_logros', formMetdologiaProyectoFormulario11Linea83)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategias_visibilizacion"
                                        value={`Comparta la estrategia de divulgación y visibilización de acciones de las acciones de la línea ET para el ${convocatoria.year}`}
                                    />

                                    <Textarea
                                        id="estrategias_visibilizacion"
                                        error={formMetdologiaProyectoFormulario11Linea83.errors.estrategias_visibilizacion}
                                        value={formMetdologiaProyectoFormulario11Linea83.data.estrategias_visibilizacion}
                                        onChange={(e) => formMetdologiaProyectoFormulario11Linea83.setData('estrategias_visibilizacion', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategias_visibilizacion', formMetdologiaProyectoFormulario11Linea83)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="estrategias_productividad_agropecuaria_agroindustrial"
                                        value={`Proponga las estrategias para el ${convocatoria.year} con el fin de que las estrategias de la lïnea de Extensionismo Tecnológico contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial`}
                                    />

                                    <Textarea
                                        id="estrategias_productividad_agropecuaria_agroindustrial"
                                        error={formMetdologiaProyectoFormulario11Linea83.errors.estrategias_productividad_agropecuaria_agroindustrial}
                                        value={formMetdologiaProyectoFormulario11Linea83.data.estrategias_productividad_agropecuaria_agroindustrial}
                                        onChange={(e) => formMetdologiaProyectoFormulario11Linea83.setData('estrategias_productividad_agropecuaria_agroindustrial', e.target.value)}
                                        onBlur={() => syncColumnLong('estrategias_productividad_agropecuaria_agroindustrial', formMetdologiaProyectoFormulario11Linea83)}
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <div className=" flex items-center justify-between py-4">
                                {proyecto.allowed.to_update && (
                                    <PrimaryButton disabled={formMetdologiaProyectoFormulario11Linea83.processing} className="ml-auto" type="submit">
                                        Guardar información de la metodología
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    )}
                    {proyecto.tipo_formulario_convocatoria_id == 7 ||
                    proyecto.tipo_formulario_convocatoria_id == 9 ||
                    proyecto.tipo_formulario_convocatoria_id == 8 ||
                    proyecto.tipo_formulario_convocatoria_id == 6 ||
                    proyecto.tipo_formulario_convocatoria_id == 12 ||
                    proyecto.tipo_formulario_convocatoria_id == 1 ? (
                        <form onSubmit={submit} className="mt-10">
                            <Grid container rowSpacing={20}>
                                <Grid item md={12}>
                                    <Label required className="mb-4" labelFor="metodologia" value={`Metodología (¿Cómo se implementará la línea en el ${convocatoria.year}?)`} />

                                    <Textarea
                                        id="metodologia"
                                        error={form.errors.metodologia}
                                        value={form.data.metodologia}
                                        onChange={(e) => form.setData('metodologia', e.target.value)}
                                        onBlur={() => syncColumnLong('metodologia', form)}
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <div className=" flex items-center justify-between py-4">
                                {proyecto.allowed.to_update && (
                                    <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                        Guardar información de la metodología
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    ) : null}
                </div>

                <div>
                    <Grid item md={12}>
                        <AlertMui>
                            <h1 className="text-3xl text-center">Actividades</h1>
                        </AlertMui>
                        <TableMui className="mt-20 mb-8" rows={['Descripción', 'Fechas', 'Objetivo específico', 'Acciones']} sxCellThead={{ width: '320px' }}>
                            {actividades.data.map((actividad, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <p className="line-clamp-3">{actividad.descripcion}</p>
                                    </TableCell>
                                    <TableCell>
                                        {actividad.fecha_inicio ? (
                                            <p>
                                                Del {actividad.fecha_inicio} al {actividad.fecha_finalizacion}
                                            </p>
                                        ) : (
                                            <Chip className="!bg-red-100 !text-red-400 !hover:bg-red-200 px-2 py-1 my-2" label="Sin fechas definidas" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <p className="line-clamp-3">{actividad.objetivo_especifico != null ? actividad.objetivo_especifico.descripcion : 'Aún no ha registrado la descripción'}</p>
                                    </TableCell>

                                    <TableCell>
                                        <MenuMui text={<MoreVertIcon />}>
                                            {actividad.id !== actividad_to_destroy ? (
                                                <div>
                                                    <MenuItem
                                                        onClick={() => (setDialogStatus(true), setMethod('PUT'), setActividad(actividad))}
                                                        disabled={!proyecto.allowed.to_update}
                                                        className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                        Editar
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            setActividadToDestroy(actividad.id)
                                                        }}>
                                                        Eliminar
                                                    </MenuItem>
                                                </div>
                                            ) : (
                                                <div>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            setActividadToDestroy(null)
                                                        }}>
                                                        Cancelar
                                                    </MenuItem>
                                                    <MenuItem
                                                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if (proyecto.allowed.to_update) {
                                                                router.delete(route('convocatorias.proyectos.actividad.destroy', [convocatoria.id, proyecto.id, actividad.id]), {
                                                                    preserveScroll: true,
                                                                })
                                                            }
                                                        }}>
                                                        Confirmar
                                                    </MenuItem>
                                                </div>
                                            )}
                                        </MenuMui>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableMui>

                        <DialogMui
                            open={dialog_status}
                            fullWidth={true}
                            maxWidth="lg"
                            blurEnabled={true}
                            dialogContent={
                                <Form
                                    is_super_admin={is_super_admin}
                                    setDialogStatus={setDialogStatus}
                                    method={method}
                                    proyecto={proyecto}
                                    convocatoria={convocatoria}
                                    actividad={actividad}
                                    proyecto_presupuesto={proyecto_presupuesto}
                                    proyecto_roles={proyecto_roles}
                                    productos={productos}
                                />
                            }
                        />
                    </Grid>
                </div>
            </TabsMui>
        </AuthenticatedLayout>
    )
}

export default Actividades
