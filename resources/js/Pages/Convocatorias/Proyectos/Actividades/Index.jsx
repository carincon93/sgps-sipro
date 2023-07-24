import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DialogMui from '@/Components/Dialog'
import Label from '@/Components/Label'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import ToolTipMui from '@/Components/Tooltip'
import TableMui from '@/Components/Table'
import StepperMui from '@/Components/Stepper'

import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import AulaMovil from './AulasMoviles/Index'
import Form from './Form'

import axios from 'axios'

import { route, checkRole } from '@/Utils'

import { useState, useEffect } from 'react'
import { router, useForm } from '@inertiajs/react'

import MoreVertIcon from '@mui/icons-material/MoreVert'

const Actividades = ({
    auth,
    convocatoria,
    proyecto,
    actividades,
    proyectoMunicipios,
    proyectoMunicipiosImpactar,
    municipios,
    regionales,
    programasFormacion,
    disenosCurriculares,
    proyectoProgramasFormacionArticulados,
    proyectoDisenosCurriculares,
    tecnoacademiaRelacionada,
    aulasMoviles,
    talentosOtrosDepartamentos,
    proyectoPresupuesto,
    proyectoRoles,
    productos,
}) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [actividadToDestroy, setActividadToDestroy] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [actividad, setActividad] = useState(null)

    const form = useForm({
        metodologia: proyecto.metodologia,
        metodologia_local: proyecto.metodologia_local,
        municipios: proyectoMunicipios?.length > 0 ? proyectoMunicipios : null,
        municipios_impactar: proyectoMunicipiosImpactar?.length > 0 ? proyectoMunicipiosImpactar : null,
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
        programas_formacion_articulados: proyectoProgramasFormacionArticulados?.length > 0 ? proyectoProgramasFormacionArticulados : null,
        diseno_curricular_id: proyectoDisenosCurriculares?.length > 0 ? proyectoDisenosCurriculares : null,
        estrategia_articulacion_prox_vigencia: proyecto.estrategia_articulacion_prox_vigencia,
        alianzas_estrategicas: proyecto.alianzas_estrategicas,
        estrategia_divulgacion: proyecto.estrategia_divulgacion,
        promover_productividad: proyecto.promover_productividad,
        // departamentos_atencion_talentos: proyecto.departamentos_atencion_talentos,
        estrategia_atencion_talentos: proyecto.estrategia_atencion_talentos,
        talento_otros_departamentos: talentosOtrosDepartamentos?.length > 0 ? talentosOtrosDepartamentos : null,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.metodologia', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const [municipioIEArticulacion, setMunicipioIEArticulacion] = useState(null)
    const [whitelistInstitucionesEducativasArticular, setWhitelistInstitucionesEducativasArticular] = useState([])
    useEffect(() => {
        if (municipioIEArticulacion) {
            axios
                .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?municipio=' + municipios.find((municipio) => municipio.value == municipioIEArticulacion)?.label.toUpperCase())
                .then(function (response) {
                    const data = response.data.map((item) => item.nombre_establecimiento)
                    setWhitelistInstitucionesEducativasArticular(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }, [municipioIEArticulacion])

    const [municipioIEEjecucion, setMunicipioIEEjecucion] = useState(null)
    const [whitelistInstitucionesEducativasEjecutar, setWhitelistInstitucionesEducativasEjecutar] = useState([])
    useEffect(() => {
        axios
            .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?municipio=' + municipios.find((municipio) => municipio.value == municipioIEEjecucion)?.label.toUpperCase())
            .then(function (response) {
                const data = response.data.map((item) => item.nombre_establecimiento)

                setWhitelistInstitucionesEducativasEjecutar(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [municipioIEEjecucion])

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>

            <Grid item md={12}>
                <AlertMui hiddenIcon={true}>
                    <span className="text-5xl font-black">1.</span>
                    <h1 className="text-3xl text-center">Metodología</h1>
                    <p className="my-8">
                        Se debe evidenciar que la metodología se presente de forma organizada y de manera secuencial, de acuerdo con el ciclo P-H-V-A “Planificar – Hacer – Verificar - Actuar” para
                        alcanzar el objetivo general y cada uno de los objetivos específicos.
                    </p>
                </AlertMui>

                {isSuperAdmin || proyecto.mostrar_recomendaciones ? (
                    <>
                        {proyecto.evaluaciones.map((evaluacion, i) =>
                            isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <ToolTipMui
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            {evaluacion.idi_evaluacion && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.idi_evaluacion.metodologia_comentario ? evaluacion.idi_evaluacion.metodologia_comentario : 'Sin recomendación'}
                                                </p>
                                            )}
                                            {!evaluacion.idi_evaluacion && evaluacion.cultura_innovacion_evaluacion && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.cultura_innovacion_evaluacion.metodologia_comentario
                                                        ? evaluacion.cultura_innovacion_evaluacion.metodologia_comentario
                                                        : 'Sin recomendación'}
                                                </p>
                                            )}
                                            {!evaluacion.idi_evaluacion && !evaluacion.cultura_innovacion_evaluacion && evaluacion.ta_evaluacion && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.ta_evaluacion.metodologia_comentario ? evaluacion.ta_evaluacion.metodologia_comentario : 'Sin recomendación'}
                                                </p>
                                            )}
                                            {!evaluacion.idi_evaluacion && !evaluacion.cultura_innovacion_evaluacion && !evaluacion.ta_evaluacion && evaluacion.tp_evaluacion && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.tp_evaluacion.metodologia_comentario ? evaluacion.tp_evaluacion.metodologia_comentario : 'Sin recomendación'}
                                                </p>
                                            )}
                                            {!evaluacion.idi_evaluacion &&
                                                !evaluacion.cultura_innovacion_evaluacion &&
                                                !evaluacion.ta_evaluacion &&
                                                !evaluacion.tp_evaluacion &&
                                                evaluacion.servicio_tecnologico_evaluacion && (
                                                    <div>
                                                        <h1 className="font-black mt-10">Metodología</h1>
                                                        <p className="whitespace-pre-line text-xs">
                                                            {evaluacion.servicio_tecnologico_evaluacion.metodologia_comentario
                                                                ? evaluacion.servicio_tecnologico_evaluacion.metodologia_comentario
                                                                : 'Sin recomendación'}
                                                        </p>
                                                        <hr className="mt-10 mb-10 border-black-200" />
                                                        <h1 className="font-black">Actividades</h1>
                                                        <ul className="list-disc pl-4">
                                                            <li className="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion.actividades_primer_obj_comentario
                                                                    ? 'Recomendación actividades del primer objetivo específico: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.actividades_primer_obj_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                            <li className="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion.actividades_segundo_obj_comentario
                                                                    ? 'Recomendación actividades del segundo objetivo específico: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.actividades_segundo_obj_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                            <li className="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion.actividades_tercer_obj_comentario
                                                                    ? 'Recomendación actividades del tercer objetivo específico: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.actividades_tercer_obj_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                            <li className="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion.actividades_cuarto_obj_comentario
                                                                    ? 'Recomendación actividades del cuarto objetivo específico: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.actividades_cuarto_obj_comentario
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
                ) : null}
            </Grid>

            <Grid item md={12}>
                <form onSubmit={submit}>
                    <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                        <div className="py-24">
                            <div>
                                <Label required className="mb-4" labelFor="metodologia" value="Metodología" />
                                <Textarea
                                    id="metodologia"
                                    error={form.errors.metodologia}
                                    name="metodologia"
                                    value={form.data.metodologia}
                                    onChange={(e) => form.setData('', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {proyecto.codigo_linea_programatica == 69 ||
                            (proyecto.codigo_linea_programatica == 70 && (
                                <div className="py-24">
                                    <div>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="metodologia_local"
                                            value={
                                                proyecto.codigo_linea_programatica == 69
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
                                            onChange={(e) => form.setData('', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}

                        {proyecto.codigo_linea_programatica == 70 && (
                            <>
                                <div>
                                    <div className="py-24 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                required
                                                className="mb-4"
                                                labelFor="implementacion_modelo_pedagogico"
                                                value="Implementación del Modelo Pedagógico de las TecnoAcademia en el contexto regional de la TecnoAcademia"
                                            />
                                        </div>
                                        <div>
                                            <Textarea
                                                id="implementacion_modelo_pedagogico"
                                                error={form.errors.implementacion_modelo_pedagogico}
                                                name="implementacion_modelo_pedagogico"
                                                value={form.data.implementacion_modelo_pedagogico}
                                                onChange={(e) => form.setData('', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="py-24">
                                    <div>
                                        <Label required className="mb-4" labelFor="municipios" value="Nombre los municipios impactados en la vigencia anterior por la TecnoAcademia" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="municipios"
                                            name="municipios"
                                            bdValues={form.data.municipios}
                                            options={municipios}
                                            error={form.errors.municipios}
                                            placeholder="Seleccionar municipios"
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    municipios: selectedValues,
                                                }))
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="py-24">
                                    <div>
                                        <Label required className="mb-4" labelFor="municipios_impactar" value="Defina los municipios a impactar en la vigencia el proyecto:" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="municipios_impactar"
                                            name="municipios_impactar"
                                            bdValues={form.data.municipios_impactar}
                                            options={municipios}
                                            error={form.errors.municipios_impactar}
                                            placeholder="Seleccionar municipios"
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    municipios_impactar: selectedValues,
                                                }))
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="py-24">
                                    <div>
                                        <Label required className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio o impacto generado por la TecnoAcademia en los municipios" />
                                    </div>
                                    <div>
                                        <Textarea
                                            id="impacto_municipios"
                                            error={form.errors.impacto_municipios}
                                            name="impacto_municipios"
                                            value={form.data.impacto_municipios}
                                            onChange={(e) => form.setData('', e.target.value)}
                                            required
                                        />
                                    </div>

                                    {(isSuperAdmin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0) ? (
                                        <>
                                            {proyecto.evaluaciones.map((evaluacion, i) =>
                                                isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                    <ToolTipMui
                                                        key={i}
                                                        title={
                                                            <div>
                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                <p className="whitespace-pre-line text-xs text-justify">
                                                                    {evaluacion.ta_evaluacion.municipios_comentario ? evaluacion.ta_evaluacion.municipios_comentario : 'Sin recomendación'}
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
                                </div>

                                <div className="py-24 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label
                                            required={form.otras_nombre_instituciones_programas ? false : true}
                                            className="mb-4"
                                            labelFor="nombre_instituciones_programas"
                                            value="Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias"
                                        />
                                    </div>
                                    <div>
                                        <Autocomplete
                                            id="departamento_instituciones_programas"
                                            selectedValue={municipioIEArticulacion}
                                            onChange={(event, newValue) => {
                                                setMunicipioIEArticulacion(newValue.value)
                                            }}
                                            options={regionales}
                                            placeholder="Seleccione un departamento"
                                        />

                                        <Tags
                                            id="nombre_instituciones_programas"
                                            className="mt-4"
                                            whitelist={whitelistInstitucionesEducativasArticular}
                                            tags={form.data.nombre_instituciones_programas}
                                            value={form.data.nombre_instituciones_programas}
                                            onChange={(e) => form.setData('nombre_instituciones_programas', e.target.value)}
                                            placeholder="Nombre(s) de la(s) IE"
                                            error={
                                                whitelistInstitucionesEducativasArticular.length == 0
                                                    ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                                    : form.errors.nombre_instituciones_programas
                                            }
                                            required={form.data.nombre_instituciones_programas ? false : true}
                                        />
                                        <div className="mt-10">
                                            <AlertMui hiddenIcon={true}>
                                                Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto
                                            </AlertMui>
                                            <Textarea
                                                label="Instituciones"
                                                id="otras_nombre_instituciones_programas"
                                                error={form.errors.otras_nombre_instituciones_programas}
                                                value={form.data.otras_nombre_instituciones_programas}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="py-24">
                                    <div>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="proyeccion_nuevas_instituciones"
                                            value="¿Se proyecta incluir nuevas Instituciones Educativas en la nueva vigencia?"
                                        />
                                    </div>
                                    <div>
                                        <Autocomplete
                                            options={[
                                                { value: 1, label: 'Si' },
                                                { value: 2, label: 'No' },
                                            ]}
                                            id="proyeccion_nuevas_instituciones"
                                            selectedValue={form.proyeccion_nuevas_instituciones}
                                            error={form.errors.proyeccion_nuevas_instituciones}
                                            placeholder="Seleccione una opción"
                                            required
                                        />
                                    </div>
                                </div>

                                {form.proyeccion_nuevas_instituciones === 1 && (
                                    <div className="py-24 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                required={form.otras_nuevas_instituciones ? false : true}
                                                className="mb-4"
                                                labelFor="nuevas_instituciones"
                                                value="Nuevas instituciones educativas que se vincularán con el proyecto de TecnoAcademia"
                                            />
                                        </div>
                                        <div>
                                            <Autocomplete
                                                id="departamento_nuevas_instituciones"
                                                selectedValue={municipioIEEjecucion}
                                                onChange={(event, newValue) => {
                                                    setMunicipioIEEjecucion(newValue.value)
                                                }}
                                                options={municipios}
                                                isGroupable={true}
                                                groupBy={(option) => option.group}
                                                placeholder="Seleccione un municipio"
                                            />

                                            <Tags
                                                id="nuevas_instituciones"
                                                className="mt-4"
                                                whitelist={whitelistInstitucionesEducativasEjecutar}
                                                tags={form.data.nuevas_instituciones}
                                                value={form.data.nuevas_instituciones}
                                                onChange={(e) => form.setData('nuevas_instituciones', e.target.value)}
                                                placeholder="Nombre(s) de la(s) IE"
                                                error={
                                                    whitelistInstitucionesEducativasEjecutar.length == 0
                                                        ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                                        : form.errors.nuevas_instituciones
                                                }
                                                required={form.data.nuevas_instituciones ? false : true}
                                            />
                                            <div className="mt-10">
                                                <AlertMui hiddenIcon={true}>
                                                    Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto
                                                </AlertMui>
                                                <Textarea
                                                    label="Instituciones"
                                                    id="otras_nuevas_instituciones"
                                                    error={form.errors.otras_nuevas_instituciones}
                                                    value={form.data.otras_nuevas_instituciones}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="py-24">
                                    <div>
                                        <Label required className="mb-4" labelFor="proyeccion_articulacion_media" value="¿Se proyecta incluir Instituciones Educativas en articulación con la media?" />
                                    </div>
                                    <div>
                                        <Autocomplete
                                            options={[
                                                { value: 1, label: 'Si' },
                                                { value: 2, label: 'No' },
                                            ]}
                                            id="proyeccion_articulacion_media"
                                            selectedValue={form.proyeccion_articulacion_media}
                                            error={form.errors.proyeccion_articulacion_media}
                                            placeholder="Seleccione una opción"
                                            required
                                        />
                                    </div>
                                </div>

                                {form.proyeccion_articulacion_media === 1 && (
                                    <div className="py-24 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                required={form.otras_nombre_instituciones ? false : true}
                                                className="mb-4"
                                                labelFor="nombre_instituciones"
                                                value="Instituciones donde se implementará el programa que tienen <strong>articulación con la Media</strong>"
                                            />
                                        </div>
                                        <div>
                                            <Autocomplete
                                                id="departamento_instituciones_media"
                                                selectedValue={municipioIEArticulacion}
                                                onChange={(event, newValue) => {
                                                    setMunicipioIEEjecucion(newValue.value)
                                                }}
                                                options={municipios}
                                                isGroupable={true}
                                                groupBy={(option) => option.group}
                                                placeholder="Seleccione un municipio"
                                            />

                                            <Tags
                                                id="nombre_instituciones"
                                                className="mt-4"
                                                whitelist={whitelistInstitucionesEducativasEjecutar}
                                                tags={form.data.nombre_instituciones}
                                                value={form.data.nombre_instituciones}
                                                onChange={(e) => form.setData('nombre_instituciones', e.target.value)}
                                                placeholder="Nombre(s) de la(s) IE"
                                                error={
                                                    whitelistInstitucionesEducativasEjecutar.length == 0
                                                        ? 'No hay instituciones educativas registradas para el municipio seleccionado'
                                                        : form.errors.nombre_instituciones
                                                }
                                                required={form.data.nombre_instituciones ? false : true}
                                            />

                                            <div className="mt-10">
                                                <AlertMui hiddenIcon={true}>
                                                    Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto
                                                </AlertMui>
                                                <Textarea
                                                    label="Instituciones"
                                                    id="otras_nombre_instituciones"
                                                    error={form.errors.otras_nombre_instituciones}
                                                    value={form.data.otras_nombre_instituciones}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(isSuperAdmin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0) ? (
                                    <>
                                        {proyecto.evaluaciones.map((evaluacion, i) =>
                                            isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                <ToolTipMui
                                                    key={i}
                                                    title={
                                                        <div>
                                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                            <p className="whitespace-pre-line text-xs text-justify">
                                                                {evaluacion.ta_evaluacion.instituciones_comentario ? evaluacion.ta_evaluacion.instituciones_comentario : 'Sin recomendación'}
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

                                <div className="py-24 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="programas_formacion_articulados"
                                            value="Programas de articulación con la Media con los cuales se espera dar continuidad a la ruta de formación de los aprendices de la TecnoAcademia"
                                        />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="programas_formacion_articulados"
                                            bdValues={form.data.programas_formacion_articulados}
                                            options={programasFormacion}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    programas_formacion_articulados: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.programas_formacion_articulados}
                                            placeholder="Buscar por el nombre del programa de formación"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="py-24 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label required className="mb-4" labelFor="diseno_curricular_id" value="Programas a ejecutar en la vigencia del proyecto:" />
                                    </div>

                                    <div>
                                        <SelectMultiple
                                            id="diseno_curricular_id"
                                            bdValues={form.data.diseno_curricular_id}
                                            options={disenosCurriculares}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    diseno_curricular_id: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.diseno_curricular_id}
                                            placeholder="Buscar por el nombre del programa de formación"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="py-24 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                required
                                                className="mb-4"
                                                labelFor="proyectos_macro"
                                                value="Proyectos Macro o líneas de proyecto de investigación formativa y aplicada de la TecnoAcademia para la vigencia {convocatoria.year}"
                                            />
                                        </div>
                                        <div>
                                            <Textarea id="proyectos_macro" error={form.errors.proyectos_macro} value={form.data.proyectos_macro} required />
                                        </div>
                                    </div>

                                    {(isSuperAdmin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0) ? (
                                        <>
                                            {proyecto.evaluaciones.map((evaluacion, i) =>
                                                isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                    <ToolTipMui
                                                        key={i}
                                                        title={
                                                            <div>
                                                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                                <p className="whitespace-pre-line text-xs text-justify">
                                                                    {evaluacion.ta_evaluacion.proyectos_macro_comentario ? evaluacion.ta_evaluacion.proyectos_macro_comentario : 'Sin recomendación'}
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
                                </div>

                                <div>
                                    <div className="py-24 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                required
                                                className="mb-4"
                                                labelFor="articulacion_plan_educacion"
                                                value="Articulación de la TecnoAcademia con el Plan Decenal de Educación y su regionalización en el territorio: mencionar logros de la vigencia {convocatoria.year - 1} y {convocatoria.year}"
                                            />
                                        </div>
                                        <div>
                                            <Textarea id="articulacion_plan_educacion" error={form.errors.articulacion_plan_educacion} value={form.data.articulacion_plan_educacion} required />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="py-24 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                required
                                                className="mb-4"
                                                labelFor="articulacion_territorios_stem"
                                                value="Artifculación de la TecnoAcademia con la Iniciativa de Territorios STEM+ del Ministerio de Educación en el Territorio"
                                            />
                                        </div>
                                        <div>
                                            <Textarea id="articulacion_territorios_stem" error={form.errors.articulacion_territorios_stem} value={form.data.articulacion_territorios_stem} required />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
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

            {tecnoacademiaRelacionada?.modalidad == 2 && (
                <Grid item md={12}>
                    <AulaMovil auth={auth} convocatoria={convocatoria} proyecto={proyecto} aulasMoviles={aulasMoviles} />
                </Grid>
            )}

            <Grid item md={12}>
                <TableMui className="mt-20" rows={['Descripción', 'Fechas', 'Objetivo específico', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {actividades.data.map((actividad, i) => (
                        <TableRow key={i}>
                            <TableCell>{actividad.descripcion}</TableCell>
                            <TableCell>
                                {actividad.fecha_inicio ? (
                                    <p>
                                        Del {actividad.fecha_inicio} al {actividad.fecha_finalizacion}
                                    </p>
                                ) : (
                                    <Chip className="!bg-red-100 !text-red-400 !hover:bg-red-200 px-2 py-1 my-2" label="Sin fechas definidas" />
                                )}
                            </TableCell>
                            <TableCell>{actividad.objetivo_especifico.descripcion}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {actividad.id !== actividadToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setActividad(actividad))}
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
                    open={dialogStatus}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            isSuperAdmin={isSuperAdmin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            actividad={actividad}
                            proyectoPresupuesto={proyectoPresupuesto}
                            proyectoRoles={proyectoRoles}
                            productos={productos}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Actividades
