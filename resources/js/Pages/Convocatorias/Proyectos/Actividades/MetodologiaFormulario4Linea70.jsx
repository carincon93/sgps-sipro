import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import ToolTipMui from '@/Components/Tooltip'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'

const MetodologiaFormulario4Linea70 = ({ convocatoria, proyecto, municipios, regionales, programas_formacion, disenos_curriculares }) => {
    const form_metodologia_proyecto_formulario_4_linea_70 = useForm({
        metodologia: proyecto.proyecto_formulario4_linea70?.metodologia,
        metodologia_local: proyecto.proyecto_formulario4_linea70?.metodologia_local,
        municipios: proyecto.municipios?.map((item) => item.id),
        municipios_impactar: proyecto.municipios_a_impactar?.map((item) => item.id),
        otras_nuevas_instituciones: proyecto.proyecto_formulario4_linea70?.otras_nuevas_instituciones,
        otras_nombre_instituciones_programas: proyecto.proyecto_formulario4_linea70?.otras_nombre_instituciones_programas,
        otras_nombre_instituciones: proyecto.proyecto_formulario4_linea70?.otras_nombre_instituciones,
        impacto_municipios: proyecto.proyecto_formulario4_linea70?.impacto_municipios,
        nombre_instituciones: proyecto.proyecto_formulario4_linea70?.nombre_instituciones,
        nombre_instituciones_programas: proyecto.proyecto_formulario4_linea70?.nombre_instituciones_programas,
        nuevas_instituciones: proyecto.proyecto_formulario4_linea70?.nuevas_instituciones,
        proyeccion_nuevas_instituciones: proyecto.proyecto_formulario4_linea70?.proyeccion_nuevas_instituciones,
        proyeccion_articulacion_media: proyecto.proyecto_formulario4_linea70?.proyeccion_articulacion_media,
        proyectos_macro: proyecto.proyecto_formulario4_linea70?.proyectos_macro,
        implementacion_modelo_pedagogico: proyecto.proyecto_formulario4_linea70?.implementacion_modelo_pedagogico,
        articulacion_plan_educacion: proyecto.proyecto_formulario4_linea70?.articulacion_plan_educacion,
        articulacion_territorios_stem: proyecto.proyecto_formulario4_linea70?.articulacion_territorios_stem,
        programas_formacion_articulados: proyecto.programas_formacion?.map((item) => item.id),
        diseno_curricular_id: proyecto.disenos_curriculares?.map((item) => item.id),
        estrategia_articulacion_prox_vigencia: proyecto.proyecto_formulario4_linea70?.estrategia_articulacion_prox_vigencia,
        alianzas_estrategicas: proyecto.proyecto_formulario4_linea70?.alianzas_estrategicas,
        estrategia_divulgacion: proyecto.proyecto_formulario4_linea70?.estrategia_divulgacion,
        promover_productividad: proyecto.proyecto_formulario4_linea70?.promover_productividad,
        estrategia_atencion_talentos: proyecto.proyecto_formulario4_linea70?.estrategia_atencion_talentos,
    })

    const submitMetodologiaProyectoFormulario4Linea70 = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_metodologia_proyecto_formulario_4_linea_70.put(route('convocatorias.proyectos.metodologia-proyecto-formulario-4-linea-70', [convocatoria.id, proyecto.id]), {
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
        <form onSubmit={submitMetodologiaProyectoFormulario4Linea70} className="!mt-20">
            <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                <Grid container rowSpacing={20}>
                    <Grid item md={12}>
                        <Label required className="mb-4" labelFor="metodologia" value="Metodología" />
                        <Textarea
                            id="metodologia"
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.metodologia}
                            name="metodologia"
                            value={form_metodologia_proyecto_formulario_4_linea_70.data.metodologia}
                            onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('metodologia', e.target.value)}
                            onBlur={() => syncColumnLong('metodologia', form_metodologia_proyecto_formulario_4_linea_70)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label required className="mb-4" labelFor="metodologia_local" value="Descripcion de la metodología aplicada a nivel local" />
                        <Textarea
                            id="metodologia_local"
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.metodologia_local}
                            name="metodologia_local"
                            value={form_metodologia_proyecto_formulario_4_linea_70.data.metodologia_local}
                            onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('metodologia_local', e.target.value)}
                            onBlur={() => syncColumnLong('metodologia_local', form_metodologia_proyecto_formulario_4_linea_70)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="implementacion_modelo_pedagogico"
                            value="Implementación del Modelo Pedagógico de las TecnoAcademia en el contexto regional de la TecnoAcademia"
                        />

                        <Textarea
                            id="implementacion_modelo_pedagogico"
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.implementacion_modelo_pedagogico}
                            name="implementacion_modelo_pedagogico"
                            value={form_metodologia_proyecto_formulario_4_linea_70.data.implementacion_modelo_pedagogico}
                            onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('implementacion_modelo_pedagogico', e.target.value)}
                            onBlur={() => syncColumnLong('implementacion_modelo_pedagogico', form_metodologia_proyecto_formulario_4_linea_70)}
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
                            bdValues={form_metodologia_proyecto_formulario_4_linea_70.data.municipios}
                            options={municipios}
                            isGroupable={true}
                            groupBy={(option) => option.group}
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.municipios}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form_metodologia_proyecto_formulario_4_linea_70.setData((prevData) => ({
                                    ...prevData,
                                    municipios: selected_values,
                                }))
                            }}
                            onBlur={() => syncColumnLong('municipios', form_metodologia_proyecto_formulario_4_linea_70)}
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="municipios_impactar" value="Defina los municipios a impactar en la vigencia el proyecto:" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="municipios_impactar"
                            name="municipios_impactar"
                            bdValues={form_metodologia_proyecto_formulario_4_linea_70.data.municipios_impactar}
                            options={municipios}
                            isGroupable={true}
                            groupBy={(option) => option.group}
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.municipios_impactar}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form_metodologia_proyecto_formulario_4_linea_70.setData((prevData) => ({
                                    ...prevData,
                                    municipios_impactar: selected_values,
                                }))
                            }}
                            onBlur={() => syncColumnLong('municipios_impactar', form_metodologia_proyecto_formulario_4_linea_70)}
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label required className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio o impacto generado por la TecnoAcademia en los municipios" />

                        <Textarea
                            id="impacto_municipios"
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.impacto_municipios}
                            name="impacto_municipios"
                            value={form_metodologia_proyecto_formulario_4_linea_70.data.impacto_municipios}
                            onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('impacto_municipios', e.target.value)}
                            onBlur={() => syncColumnLong('impacto_municipios', form_metodologia_proyecto_formulario_4_linea_70)}
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
                            required={form_metodologia_proyecto_formulario_4_linea_70.data.otras_nombre_instituciones_programas ? false : true}
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
                            tags={form_metodologia_proyecto_formulario_4_linea_70.data.nombre_instituciones_programas}
                            value={form_metodologia_proyecto_formulario_4_linea_70.data.nombre_instituciones_programas}
                            onChange={(e) => (
                                form_metodologia_proyecto_formulario_4_linea_70.setData('nombre_instituciones_programas', e.target.value),
                                syncColumnLong('nombre_instituciones_programas', form, e.target.value)
                            )}
                            placeholder="Nombre(s) de la(s) IE"
                            error={
                                whitelist_instituciones_educativas_articular.length == 0
                                    ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                    : form_metodologia_proyecto_formulario_4_linea_70.errors.nombre_instituciones_programas
                            }
                        />
                        <div className="mt-10">
                            <AlertMui>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto</AlertMui>
                            <Textarea
                                label="Instituciones"
                                id="otras_nombre_instituciones_programas"
                                error={form_metodologia_proyecto_formulario_4_linea_70.errors.otras_nombre_instituciones_programas}
                                value={form_metodologia_proyecto_formulario_4_linea_70.data.otras_nombre_instituciones_programas}
                                onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('otras_nombre_instituciones_programas', e.target.value)}
                                onBlur={() => syncColumnLong('otras_nombre_instituciones_programas', form_metodologia_proyecto_formulario_4_linea_70)}
                            />
                        </div>
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="proyeccion_nuevas_instituciones" value="¿Se proyecta incluir nuevas Instituciones Educativas en la nueva vigencia?" />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            options={[
                                { value: 1, label: 'Si' },
                                { value: 2, label: 'No' },
                            ]}
                            id="proyeccion_nuevas_instituciones"
                            selectedValue={form_metodologia_proyecto_formulario_4_linea_70.data.proyeccion_nuevas_instituciones}
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.proyeccion_nuevas_instituciones}
                            onChange={(event, newValue) => form_metodologia_proyecto_formulario_4_linea_70.setData('proyeccion_nuevas_instituciones', newValue.value)}
                            onBlur={() => syncColumnLong('proyeccion_nuevas_instituciones', form_metodologia_proyecto_formulario_4_linea_70)}
                            required
                        />
                    </Grid>

                    {form_metodologia_proyecto_formulario_4_linea_70.data.proyeccion_nuevas_instituciones == 1 && (
                        <>
                            <Grid item md={6}>
                                <Label
                                    required={form_metodologia_proyecto_formulario_4_linea_70.data.otras_nuevas_instituciones ? false : true}
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
                                    tags={form_metodologia_proyecto_formulario_4_linea_70.data.nuevas_instituciones}
                                    value={form_metodologia_proyecto_formulario_4_linea_70.data.nuevas_instituciones}
                                    onChange={(e) => (
                                        form_metodologia_proyecto_formulario_4_linea_70.setData('nuevas_instituciones', e.target.value), syncColumnLong('nuevas_instituciones', form, e.target.value)
                                    )}
                                    placeholder="Nombre(s) de la(s) IE"
                                    error={
                                        whitelist_instituciones_educativas_ejecutar.length == 0
                                            ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                            : form_metodologia_proyecto_formulario_4_linea_70.errors.nuevas_instituciones
                                    }
                                />
                                <div className="mt-10">
                                    <AlertMui>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto</AlertMui>
                                    <Textarea
                                        label="Instituciones"
                                        id="otras_nuevas_instituciones"
                                        error={form_metodologia_proyecto_formulario_4_linea_70.errors.otras_nuevas_instituciones}
                                        value={form_metodologia_proyecto_formulario_4_linea_70.data.otras_nuevas_instituciones}
                                        onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('otras_nuevas_instituciones', e.target.value)}
                                        onBlur={() => syncColumnLong('otras_nuevas_instituciones', form_metodologia_proyecto_formulario_4_linea_70)}
                                    />
                                </div>
                            </Grid>
                        </>
                    )}

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="proyeccion_articulacion_media" value="¿Se proyecta incluir Instituciones Educativas en articulación con la media?" />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            options={[
                                { value: 1, label: 'Si' },
                                { value: 2, label: 'No' },
                            ]}
                            id="proyeccion_articulacion_media"
                            selectedValue={form_metodologia_proyecto_formulario_4_linea_70.data.proyeccion_articulacion_media}
                            onChange={(event, newValue) => form_metodologia_proyecto_formulario_4_linea_70.setData('proyeccion_articulacion_media', newValue.value)}
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.proyeccion_articulacion_media}
                            onBlur={() => syncColumnLong('proyeccion_articulacion_media', form_metodologia_proyecto_formulario_4_linea_70)}
                            required
                        />
                    </Grid>

                    {form_metodologia_proyecto_formulario_4_linea_70.data.proyeccion_articulacion_media == 1 && (
                        <>
                            <Grid item md={6}>
                                <Label
                                    required={form_metodologia_proyecto_formulario_4_linea_70.data.otras_nombre_instituciones ? false : true}
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
                                    tags={form_metodologia_proyecto_formulario_4_linea_70.data.nombre_instituciones}
                                    value={form_metodologia_proyecto_formulario_4_linea_70.data.nombre_instituciones}
                                    onChange={(e) => (
                                        form_metodologia_proyecto_formulario_4_linea_70.setData('nombre_instituciones', e.target.value), syncColumnLong('nombre_instituciones', form, e.target.value)
                                    )}
                                    placeholder="Nombre(s) de la(s) IE"
                                    error={
                                        whitelist_instituciones_educativas_ejecutar.length == 0
                                            ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                            : form_metodologia_proyecto_formulario_4_linea_70.errors.nombre_instituciones
                                    }
                                />

                                <div className="mt-10">
                                    <AlertMui>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto</AlertMui>
                                    <Textarea
                                        label="Instituciones"
                                        id="otras_nombre_instituciones"
                                        error={form_metodologia_proyecto_formulario_4_linea_70.errors.otras_nombre_instituciones}
                                        value={form_metodologia_proyecto_formulario_4_linea_70.data.otras_nombre_instituciones}
                                        onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('otras_nombre_instituciones', e.target.value)}
                                        onBlur={() => syncColumnLong('otras_nombre_instituciones', form_metodologia_proyecto_formulario_4_linea_70)}
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
                    {/*
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
                            bdValues={form_metodologia_proyecto_formulario_4_linea_70.data.programas_formacion_articulados}
                            options={programas_formacion}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form_metodologia_proyecto_formulario_4_linea_70.setData((prevData) => ({
                                    ...prevData,
                                    programas_formacion_articulados: selected_values,
                                }))
                            }}
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.programas_formacion_articulados}
                            onBlur={() => syncColumnLong('programas_formacion_articulados', form_metodologia_proyecto_formulario_4_linea_70)}
                        />
                    </Grid> */}

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="diseno_curricular_id" value="Programas a ejecutar en la vigencia del proyecto:" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="diseno_curricular_id"
                            bdValues={form_metodologia_proyecto_formulario_4_linea_70.data.diseno_curricular_id}
                            options={disenos_curriculares}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form_metodologia_proyecto_formulario_4_linea_70.setData((prevData) => ({
                                    ...prevData,
                                    diseno_curricular_id: selected_values,
                                }))
                            }}
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.diseno_curricular_id}
                            required
                            onBlur={() => syncColumnLong('diseno_curricular_id', form_metodologia_proyecto_formulario_4_linea_70)}
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
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.proyectos_macro}
                            value={form_metodologia_proyecto_formulario_4_linea_70.data.proyectos_macro}
                            onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('proyectos_macro', e.target.value)}
                            onBlur={() => syncColumnLong('proyectos_macro', form_metodologia_proyecto_formulario_4_linea_70)}
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
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.articulacion_plan_educacion}
                            value={form_metodologia_proyecto_formulario_4_linea_70.data.articulacion_plan_educacion}
                            onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('articulacion_plan_educacion', e.target.value)}
                            onBlur={() => syncColumnLong('articulacion_plan_educacion', form_metodologia_proyecto_formulario_4_linea_70)}
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
                            error={form_metodologia_proyecto_formulario_4_linea_70.errors.articulacion_territorios_stem}
                            value={form_metodologia_proyecto_formulario_4_linea_70.data.articulacion_territorios_stem}
                            onChange={(e) => form_metodologia_proyecto_formulario_4_linea_70.setData('articulacion_territorios_stem', e.target.value)}
                            onBlur={() => syncColumnLong('articulacion_territorios_stem', form_metodologia_proyecto_formulario_4_linea_70)}
                            required
                        />
                    </Grid>
                </Grid>
            </fieldset>
            <div className=" flex items-center justify-between py-4">
                {proyecto.allowed.to_update && (
                    <PrimaryButton disabled={form_metodologia_proyecto_formulario_4_linea_70.processing} className="ml-auto" type="submit">
                        Guardar información de la metodología
                    </PrimaryButton>
                )}
            </div>
        </form>
    )
}

export default MetodologiaFormulario4Linea70
