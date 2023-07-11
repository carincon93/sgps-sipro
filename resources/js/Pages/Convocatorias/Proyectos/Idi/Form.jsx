import { useState } from 'react'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Label from '@/Components/Label'
import Textarea from '@/Components/Textarea'
import SwitchMui from '@/Components/Switch'

import { RadioGroup, Tooltip, Typography } from '@mui/material'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import InputError from '@/Components/InputError'
import RadioMui from '@/Components/Radio'

const Form = ({ data, setData, errors, ...props }) => {
    const [arrayLineasTecnoacademia, setArrayLineasTecnoacademia] = useState([])

    const selectLineasTecnoacademia = (event) => {
        const filteredLineasTecnoacademia = props.lineasTecnoacademia.filter((obj) => obj.tecnoacademia_id === event.detail?.value)
        setArrayLineasTecnoacademia(filteredLineasTecnoacademia)
    }

    return (
        <>
            <div>
                <Label required disabled={props.evaluacion ? 'disabled' : undefined} labelFor="titulo" className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)" />
                <Textarea label="Título" id="titulo" value={data.titulo} onChange={(e) => setData('titulo', e.target.value)} error={errors.titulo} className={`bg-transparent block border-0 ${errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full`} required disabled={props.evaluacion ? 'disabled' : undefined} />
                {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                    <>
                        {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                            props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <Tooltip
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.titulo_comentario ? evaluacion.idi_evaluacion.titulo_comentario : 'Sin recomendación'}</p>
                                        </div>
                                    }
                                >
                                    <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                </Tooltip>
                            ) : null,
                        )}
                        {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {props.titulo}
            </div>

            <div>
                {props.idi.proyecto.allowed.to_update && <p className="text-center">Fecha de ejecución</p>}

                <div className="mt-4 flex items-start justify-around">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} labelFor="fecha_inicio" className={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                        <div className="ml-4">
                            <input id="fecha_inicio" type="date" className="mt-1 block w-full p-4" value={data.fecha_inicio} onChange={(e) => setData('fecha_inicio', e.target.value)} required disabled={props.evaluacion ? 'disabled' : undefined} />
                        </div>
                    </div>
                    <div className={`mt-4 flex ${errors.fecha_finalizacion ? '' : 'items-center'}`}>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} labelFor="fecha_finalizacion" className={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                        <div className="ml-4">
                            <input id="fecha_finalizacion" type="date" className="mt-1 block w-full p-4" value={data.fecha_finalizacion} onChange={(e) => setData('fecha_finalizacion', e.target.value)} required disabled={props.evaluacion ? 'disabled' : undefined} />
                        </div>
                    </div>
                </div>
                {(errors.fecha_inicio || errors.fecha_finalizacion || errors.max_meses_ejecucion) && (
                    <div className="mb-20 flex justify-center mt-4">
                        <InputError classes="text-center" message={errors.fecha_inicio} />
                        <InputError classes="text-center" message={errors.fecha_finalizacion} />
                        <InputError classes="text-center" message={errors.max_meses_ejecucion} />
                    </div>
                )}

                {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                    <>
                        {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                            props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <Tooltip
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.fechas_comentario ? evaluacion.idi_evaluacion.fechas_comentario : 'Sin recomendación'}</p>
                                        </div>
                                    }
                                >
                                    <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                </Tooltip>
                            ) : null,
                        )}
                        {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {props.fechas}
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
                        <AlertMui hiddenIcon={true} className="mt-2 mr-8">
                            Nota: El Centro de Formación relacionado es el ejecutor del proyecto.
                        </AlertMui>
                    </div>
                    <div>{props.idi.proyecto.centro_formacion.nombre + ' - Código: ' + props.idi.proyecto.centro_formacion.codigo}</div>
                </div>

                {data.centro_formacion_id && (
                    <div className="mt-44 grid grid-cols-2">
                        <div>
                            <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="linea_investigacion_id" value="Línea de investigación" />
                        </div>
                        <div>
                            <Autocomplete
                                id="linea_investigacion_id"
                                options={props.lineasInvestigacion}
                                selectedValue={data.linea_investigacion_id}
                                error={errors.linea_investigacion_id}
                                onChange={(event, newValue) => {
                                    setData('linea_investigacion_id', newValue.value)
                                }}
                                placeholder="Seleccione la línea de investigación"
                                required
                                disabled={props.evaluacion ? 'disabled' : undefined}
                            />
                        </div>
                    </div>
                )}
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                    </div>
                    <div>
                        <Autocomplete
                            id="linea_programatica_id"
                            options={props.lineasProgramaticas}
                            selectedValue={data.linea_programatica_id}
                            error={errors.linea_programatica_id}
                            onChange={(event, newValue) => {
                                setData('linea_programatica_id', newValue.value)
                            }}
                            placeholder="Seleccione la línea programática"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="red_conocimiento_id" value="Red de conocimiento sectorial" />
                    </div>
                    <div>
                        <Autocomplete
                            id="red_conocimiento_id"
                            options={props.redesConocimiento}
                            selectedValue={data.red_conocimiento_id}
                            onChange={(event, newValue) => {
                                setData('red_conocimiento_id', newValue.value)
                            }}
                            error={errors.red_conocimiento_id}
                            placeholder="Seleccione la red de conocimiento"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>

                {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                    <>
                        {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                            props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <Tooltip
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.red_conocimiento_comentario ? evaluacion.idi_evaluacion.red_conocimiento_comentario : 'Sin recomendación'}</p>
                                        </div>
                                    }
                                >
                                    <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                </Tooltip>
                            ) : null,
                        )}
                        {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {props.red_conocimiento}
            </div>

            <div>
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de conocimiento" />
                    </div>
                    <div>
                        <Autocomplete
                            id="disciplina_subarea_conocimiento_id"
                            options={props.disciplinasSubareaConocimiento}
                            selectedValue={data.disciplina_subarea_conocimiento_id}
                            error={errors.disciplina_subarea_conocimiento_id}
                            onChange={(event, newValue) => {
                                setData('disciplina_subarea_conocimiento_id', newValue.value)
                            }}
                            placeholder="Seleccione la disciplina de conocimiento"
                        />
                    </div>
                </div>

                {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                    <>
                        {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                            props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <Tooltip
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.disciplina_subarea_conocimiento_comentario ? evaluacion.idi_evaluacion.disciplina_subarea_conocimiento_comentario : 'Sin recomendación'}</p>
                                        </div>
                                    }
                                >
                                    <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                </Tooltip>
                            ) : null,
                        )}
                        {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {props.disciplina_subarea_conocimiento}
            </div>
            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="actividad_economica_id" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                    </div>
                    <div>
                        <Autocomplete
                            id="actividad_economica_id"
                            options={props.actividadesEconomicas}
                            selectedValue={data.actividad_economica_id}
                            error={errors.actividad_economica_id}
                            onChange={(event, newValue) => {
                                setData('actividad_economica_id', newValue.value)
                            }}
                            placeholder="Seleccione la actividad económica"
                        />
                    </div>
                </div>

                {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                    <>
                        {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                            props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <Tooltip
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.actividad_economica_comentario ? evaluacion.idi_evaluacion.actividad_economica_comentario : 'Sin recomendación'}</p>
                                        </div>
                                    }
                                >
                                    <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                </Tooltip>
                            ) : null,
                        )}
                        {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {props.actividad_economica}
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="tematica_estrategica_id" value="Temática estratégica SENA" />
                    </div>
                    <div>
                        <Autocomplete
                            id="tematica_estrategica_id"
                            options={props.tematicasEstrategicas}
                            selectedValue={data.tematica_estrategica_id}
                            error={errors.actividad_economica_id}
                            onChange={(event, newValue) => {
                                setData('tematica_estrategica_id', newValue.value)
                            }}
                            placeholder="Seleccione la temática estratégica"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>

                {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                    <>
                        {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                            props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <Tooltip
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.tematica_estrategica_comentario ? evaluacion.idi_evaluacion.tematica_estrategica_comentario : 'Sin recomendación'}</p>
                                        </div>
                                    }
                                >
                                    <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                </Tooltip>
                            ) : null,
                        )}
                        {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {props.tematica_estrategica}
            </div>

            {(props.idi.proyecto.linea_programatica_id === 1 || props.idi.proyecto.linea_programatica_id === 3) && (
                <div>
                    <div className="grid grid-cols-2">
                        <div>
                            <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="proyecto_investigacion_pedagogica" value="¿El proyecto es de investigación pedagógica?" />
                        </div>
                        <div>
                            <SwitchMui checked={data.proyecto_investigacion_pedagogica} onChange={(e) => setData('proyecto_investigacion_pedagogica', e.target.checked)} />
                        </div>
                    </div>

                    {data.proyecto_investigacion_pedagogica && (
                        <div className="mt-44 grid grid-cols-2">
                            <div>
                                <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="justificacion_proyecto_investigacion_pedagogica" value="Justificación" />
                            </div>
                            <div>
                                <Textarea id="justificacion_proyecto_investigacion_pedagogica" onChange={(e) => setData('justificacion_proyecto_investigacion_pedagogica', e.target.value)} error={errors.justificacion_proyecto_investigacion_pedagogica} value={data.justificacion_proyecto_investigacion_pedagogica} required={!data.proyecto_investigacion_pedagogica ? undefined : true} />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 mt-24">
                        <div>
                            <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="articulacion_eni" value="¿El proyecto está articulado con la ENI?" />
                        </div>
                        <div>
                            <SwitchMui checked={data.articulacion_eni} onChange={(e) => setData('articulacion_eni', e.target.checked)} />
                        </div>
                    </div>

                    {data.articulacion_eni && (
                        <>
                            <div className="grid grid-cols-2 mt-24">
                                <div>
                                    <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="grupo_investigacion_eni_id" value="Grupo de investigación ENI" />
                                </div>
                                <div>
                                    <Autocomplete
                                        id="grupo_investigacion_eni_id"
                                        options={props.gruposInvestigacion}
                                        selectedValue={data.grupo_investigacion_eni_id}
                                        onChange={(event, newValue) => {
                                            setData('grupo_investigacion_eni_id', newValue.value)
                                        }}
                                        error={errors.grupo_investigacion_eni_id}
                                        placeholder="Seleccione un grupo de investigación"
                                        required
                                        disabled={props.evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 mt-24">
                                <div>
                                    <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="linea_investigacion_eni_id" value="Líneas de investigación ENI" />
                                </div>
                                <div>
                                    <SelectMultiple
                                        id="linea_investigacion_eni_id"
                                        bdValues={data.linea_investigacion_eni_id}
                                        options={props.lineasInvestigacionEni}
                                        onChange={(event, newValue) => {
                                            const selectedValues = newValue.map((option) => option.value)
                                            setData((prevData) => ({
                                                ...prevData,
                                                linea_investigacion_eni_id: selectedValues,
                                            }))
                                        }}
                                        error={errors.linea_investigacion_eni_id}
                                        placeholder="Seleccione una o varias opciones"
                                        required
                                        disabled={props.evaluacion ? 'disabled' : undefined}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 mt-24">
                                <div>
                                    <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="area_tematica_eni_id" value="Áreas temáticas" />
                                </div>
                                <div>
                                    <SelectMultiple
                                        id="area_tematica_eni_id"
                                        bdValues={data.area_tematica_eni_id}
                                        options={props.areasTematicasEni}
                                        onChange={(event, newValue) => {
                                            const selectedValues = newValue.map((option) => option.value)
                                            setData((prevData) => ({
                                                ...prevData,
                                                area_tematica_eni_id: selectedValues,
                                            }))
                                        }}
                                        error={errors.area_tematica_eni_id}
                                        placeholder="Seleccione una o varias opciones"
                                        required
                                        disabled={props.evaluacion ? 'disabled' : undefined}
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
                        <SwitchMui checked={props.tieneVideo} onChange={() => props.setTieneVideo(!props.tieneVideo)} />
                        {props.tieneVideo && (
                            <>
                                <TextInput label="Link del video" id="video" type="url" className="mt-1" error={errors.video} placeholder="Link del video del proyecto https://www.youtube.com/watch?v=gmc4tk" value={data.video} required={props.tieneVideo ? true : undefined} />
                            </>
                        )}
                    </div>
                </div>
                {props.tieneVideo && (
                    <>
                        {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                            <>
                                {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                                    props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                        <Tooltip
                                            key={i}
                                            title={
                                                <div>
                                                    <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                    <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.video_comentario ? evaluacion.idi_evaluacion.video_comentario : 'Sin recomendación'}</p>
                                                </div>
                                            }
                                        >
                                            <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                        </Tooltip>
                                    ) : null,
                                )}
                                {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
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
                            <SwitchMui checked={props.requiereJustificacionIndustria4} onChange={() => props.setRequiereJustificacionIndustria4(!props.requiereJustificacionIndustria4)} />
                        </div>
                        {props.requiereJustificacionIndustria4 && (
                            <>
                                <Textarea label="Justificación" id="justificacion_industria_4" onChange={(e) => setData('justificacion_industria_4', e.target.value)} error={errors.justificacion_industria_4} value={data.justificacion_industria_4} required={props.requiereJustificacionIndustria4 ? true : undefined} />
                                <AlertMui hiddenIcon={true}>Si el proyecto está relacionado con la industria 4.0 por favor realice la justificación.</AlertMui>
                            </>
                        )}
                    </div>
                </div>
                {props.requiereJustificacionIndustria4 && (
                    <>
                        {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                            <>
                                {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                                    props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                        <Tooltip
                                            key={i}
                                            title={
                                                <div>
                                                    <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                    <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.justificacion_industria_4_comentario ? evaluacion.idi_evaluacion.justificacion_industria_4_comentario : 'Sin recomendación'}</p>
                                                </div>
                                            }
                                        >
                                            <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                        </Tooltip>
                                    ) : null,
                                )}
                                {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
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
                            <SwitchMui checked={props.requiereJustificacionEconomiaNaranja} onChange={() => props.setRequiereJustificacionEconomiaNaranja(!props.requiereJustificacionEconomiaNaranja)} />
                        </div>
                        {props.requiereJustificacionEconomiaNaranja && (
                            <>
                                <Textarea label="Justificación" id="justificacion_economia_naranja" onChange={(e) => setData('justificacion_economia_naranja', e.target.value)} error={errors.justificacion_economia_naranja} value={data.justificacion_economia_naranja} required={props.requiereJustificacionEconomiaNaranja ? true : undefined} />
                                <AlertMui hiddenIcon={true}>Si el proyecto está relacionado con la economía naranja por favor realice la justificación. (Ver documento de apoyo: Guía Rápida SENA es NARANJA.)</AlertMui>
                            </>
                        )}
                    </div>
                </div>
                {props.requiereJustificacionEconomiaNaranja && (
                    <>
                        {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                            <>
                                {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                                    props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                        <Tooltip
                                            key={i}
                                            title={
                                                <div>
                                                    <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                    <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.justificacion_economia_naranja_comentario ? evaluacion.idi_evaluacion.justificacion_economia_naranja_comentario : 'Sin recomendación'}</p>
                                                </div>
                                            }
                                        >
                                            <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                        </Tooltip>
                                    ) : null,
                                )}
                                {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
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
                            <SwitchMui checked={props.requiereJustificacionSectorAgricola} onChange={() => props.setRequiereJustificacionSectorAgricola(!props.requiereJustificacionSectorAgricola)} />
                        </div>
                        {props.requiereJustificacionSectorAgricola && (
                            <Textarea label="Justificación" id="impacto_sector_agricola" onChange={(e) => setData('impacto_sector_agricola', e.target.value)} error={errors.impacto_sector_agricola} value={data.impacto_sector_agricola} required={props.requiereJustificacionSectorAgricola ? true : undefined} />
                        )}
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
                            <SwitchMui checked={props.requiereJustificacionPoliticaDiscapacidad} onChange={() => props.setRequiereJustificacionPoliticaDiscapacidad(!props.requiereJustificacionPoliticaDiscapacidad)} />
                        </div>
                        {props.requiereJustificacionPoliticaDiscapacidad && (
                            <>
                                <Textarea label="Justificación" id="justificacion_politica_discapacidad" onChange={(e) => setData('justificacion_politica_discapacidad', e.target.value)} error={errors.justificacion_politica_discapacidad} value={data.justificacion_politica_discapacidad} required={props.requiereJustificacionPoliticaDiscapacidad} />
                                <AlertMui hiddenIcon={true}>Si el proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad por favor realice la justificación. RESOLUCIÓN 01726 DE 2014 - Por la cual se adopta la Política Institucional para Atención de las Personas con discapacidad.</AlertMui>
                            </>
                        )}
                    </div>
                </div>
                {props.requiereJustificacionPoliticaDiscapacidad && (
                    <>
                        {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                            <>
                                {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                                    props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                        <Tooltip
                                            key={i}
                                            title={
                                                <div>
                                                    <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                    <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.justificacion_politica_discapacidad_comentario ? evaluacion.idi_evaluacion.justificacion_politica_discapacidad_comentario : 'Sin recomendación'}</p>
                                                </div>
                                            }
                                        >
                                            <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                        </Tooltip>
                                    ) : null,
                                )}
                                {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
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
                            <SwitchMui checked={props.requiereJustificacionAntencionPluralista} onChange={() => props.setRequiereJustificacionAntencionPluralista(!props.requiereJustificacionAntencionPluralista)} />
                        </div>
                        {props.requiereJustificacionAntencionPluralista && <Textarea label="Justificación" id="atencion_pluralista_diferencial" error={errors.atencion_pluralista_diferencial} value={data.atencion_pluralista_diferencial} required={props.requiereJustificacionAntencionPluralista} />}
                    </div>
                </div>
            </div>

            {/* Especimentes */}

            <div>
                <p className="text-center mb-8">¿Cuál es el origen de las muestras con las que se realizarán las actividades de investigación, bioprospección y/o aprovechamiento comercial o industrial?</p>
                <AlertMui hiddenIcon={true}>Nota: Bioprospección se define como la exploración sistemática y sostenible de la biodiversidad para identificar y obtener nuevas fuentes de compuestos químicos, genes, proteínas, microorganismos y otros productos que tienen potencial de ser aprovechados comercialmente</AlertMui>

                <RadioGroup aria-labelledby="muestreo-radio-buttons-group-label" name="muestreo-radio-buttons-group">
                    <div className="flex mt-20 items-center">
                        <RadioMui onChange={(e) => setData('muestreo', e.target.value)} value="1" error={errors.muestreo} />
                        <span>
                            Especies Nativas. (es la especie o subespecie taxonómica o variedad de animales cuya área de disposición geográfica se extiende al territorio nacional o a aguas jurisdiccionales colombianas o forma parte de los mismos comprendidas las especies o subespecies que migran temporalmente a ellos, siempre y cuando no se encuentren en el país o migren a él como resultado
                            voluntario o involuntario de la actividad humana. Pueden ser silvestre, domesticada o escapada de domesticación incluyendo virus, viroides y similares)
                        </span>
                    </div>

                    {data.muestreo == 1 && (
                        <>
                            <AlertMui hiddenIcon={true}>Ha seleccionado Especies Nativas. Por favor responda las siguientes preguntas:</AlertMui>
                            <div className="flex mb-20">
                                <div className="bg-gray-200 flex-1 p-8">
                                    <div className="flex items-center">
                                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" id="1.1" value="¿Qué actividad pretende realizar con la especie nativa?" />
                                    </div>

                                    <RadioGroup aria-labelledby="actividades-muestreo-radio-buttons-group-label" name="actividades-muestreo-radio-buttons-group">
                                        <div className="flex mt-4 items-center">
                                            <RadioMui onChange={(e) => setData('actividades_muestreo', e.target.value)} value="1.1.1" />
                                            <span> Separación de las unidades funcionales y no funcionales del ADN y el ARN, en todas las formas que se encuentran en la naturaleza. </span>
                                        </div>
                                        <div className="flex mt-4 items-center">
                                            <RadioMui onChange={(e) => setData('actividades_muestreo', e.target.value)} value="1.1.2" />
                                            <span> Aislamiento de una o varias moléculas, entendidas estas como micro y macromoléculas, producidas por el metabolismo de un organismo. </span>
                                        </div>
                                        <div className="flex mt-4 items-center">
                                            <RadioMui onChange={(e) => setData('actividades_muestreo', e.target.value)} value="1.1.3" />
                                            <span> Solicitar patente sobre una función o propiedad identificada de una molécula, que se ha aislado y purificado. </span>
                                        </div>
                                        <div className="flex mt-4 items-center">
                                            <RadioMui onChange={(e) => setData('actividades_muestreo', e.target.value)} value="1.1.4" />
                                            <span> No logro identificar la actividad a desarrollar con la especie nativa </span>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="bg-gray-300 flex-1 p-8">
                                    <div className="flex items-center">
                                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" id="1.2" value="¿Cuál es la finalidad de las actividades a realizar con la especie nativa/endémica?" />
                                    </div>

                                    <RadioGroup aria-labelledby="objetivo-muestreo-radio-buttons-group-label" name="objetivo-muestreo-radio-buttons-group">
                                        <div className="flex mt-4 items-center">
                                            <RadioMui onChange={(e) => setData('objetivo_muestreo', e.target.value)} value="1.2.1" />
                                            <span> Investigación básica sin fines comerciales </span>
                                        </div>
                                        <div className="flex mt-4 items-center">
                                            <RadioMui onChange={(e) => setData('objetivo_muestreo', e.target.value)} value="1.2.2" />
                                            <span> Bioprospección en cualquiera de sus fases </span>
                                        </div>
                                        <div className="flex mt-4 items-center">
                                            <RadioMui onChange={(e) => setData('objetivo_muestreo', e.target.value)} value="1.2.3" />
                                            <span> Comercial o Industrial </span>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex mt-4 items-center">
                        <RadioMui onChange={(e) => setData('muestreo', e.target.value)} value="2" />
                        <span> Especies Introducidas. (son aquellas que no son nativas de Colombia y que ingresaron al país por intervención humana) </span>
                    </div>
                    <div className="flex mt-4 items-center">
                        <RadioMui onChange={(e) => setData('muestreo', e.target.value)} value="3" />
                        <span> Recursos genéticos humanos y sus productos derivados </span>
                    </div>
                    <div className="flex mt-4 items-center">
                        <RadioMui onChange={(e) => setData('muestreo', e.target.value)} value="4" />
                        <span> Intercambio de recursos genéticos y sus productos derivados, recursos biológicos que los contienen o los componentes asociados a estos. (son aquellas que realizan las comunidades indígenas, afroamericanas y locales de los Países Miembros de la Comunidad Andina entre sí y para su propio consumo, basadas en sus prácticas consuetudinarias) </span>
                    </div>
                    <div className="flex mt-4 items-center">
                        <RadioMui onChange={(e) => setData('muestreo', e.target.value)} value="5" />
                        <span>
                            Recurso biológico que involucren actividades de sistemática molecular, ecología molecular, evolución y biogeografía molecular (siempre que el recurso biológico se haya colectado en el marco de un permiso de recolección de especímenes de especies silvestres de la diversidad biológica con fines de investigación científica no comercial o provenga de una colección
                            registrada ante el Instituto Alexander van Humboldt)
                        </span>
                    </div>
                    <div className="flex mt-4 items-center">
                        <RadioMui onChange={(e) => setData('muestreo', e.target.value)} value="6" />
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
                            selectedValue={data.recoleccion_especimenes}
                            error={errors.recoleccion_especimenes}
                            onChange={(event, newValue) => {
                                setData('recoleccion_especimenes', newValue.value)
                            }}
                            placeholder="Seleccione una opción"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                    <div />
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_plan_tecnologico" value="¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?" />
                    </div>
                    <div>
                        <Autocomplete
                            id="relacionado_plan_tecnologico"
                            options={[
                                { value: 1, label: 'Si' },
                                { value: 2, label: 'No' },
                            ]}
                            selectedValue={data.relacionado_plan_tecnologico}
                            error={errors.relacionado_plan_tecnologico}
                            onChange={(event, newValue) => {
                                setData('relacionado_plan_tecnologico', newValue.value)
                            }}
                            placeholder="Seleccione una opción"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_agendas_competitividad" value="¿El proyecto se alinea con las Agendas Departamentales de Competitividad e Innovación?" />
                    </div>
                    <div>
                        <Autocomplete
                            id="relacionado_agendas_competitividad"
                            options={[
                                { value: 1, label: 'Si' },
                                { value: 2, label: 'No' },
                            ]}
                            selectedValue={data.relacionado_agendas_competitividad}
                            error={errors.relacionado_agendas_competitividad}
                            onChange={(event, newValue) => {
                                setData('relacionado_agendas_competitividad', newValue.value)
                            }}
                            placeholder="Seleccione una opción"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_mesas_sectoriales" value="¿El proyecto se alinea con las Mesas Sectoriales?" />
                    </div>
                    <div>
                        <Autocomplete
                            id="relacionado_mesas_sectoriales"
                            options={[
                                { value: 1, label: 'Si' },
                                { value: 2, label: 'No' },
                            ]}
                            selectedValue={data.relacionado_mesas_sectoriales}
                            error={errors.relacionado_mesas_sectoriales}
                            onChange={(event, newValue) => {
                                setData('relacionado_mesas_sectoriales', newValue.value)
                            }}
                            placeholder="Seleccione una opción"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>
                {data.relacionado_mesas_sectoriales?.value === 1 && (props.isSuperAdmin || props.idi.proyecto.allowed.to_update) && (
                    <div className="bg-app-100 p-5 mt-10">
                        <InputError message={errors.mesa_sectorial_id} />
                        <div className="grid grid-cols-2">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5" style={{ transform: 'translateX(-50px)' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-app-600">Por favor seleccione la o las mesas sectoriales con la cual o las cuales se alinea el proyecto</p>
                            </div>
                            <div className="bg-white grid grid-cols-2 max-w-xl overflow-y-scroll shadow-2xl mt-4 h-80">
                                {props.mesasSectoriales.map(({ id, nombre }, i) => (
                                    <></>
                                    // <React.Fragment key={id}>
                                    //     <Checkbox
                                    //         name="mesa_sectorial_id"
                                    //         value={id}
                                    //         checked={data.mesa_sectorial_id?.includes(id)}
                                    //         onChange={(e) => {
                                    //             if (e.target.checked) {
                                    //                 data.mesa_sectorial_id = [...(data.mesa_sectorial_id || []), id]
                                    //             } else {
                                    //                 data = (data.mesa_sectorial_id || []).filter((value) => value !== id)
                                    //             }
                                    //         }}
                                    //     />
                                    //     <span>{nombre}</span>
                                    // </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_tecnoacademia" value="¿El proyecto se formuló en conjunto con la tecnoacademia?" />
                    </div>
                    <div>
                        <Autocomplete
                            id="relacionado_tecnoacademia"
                            options={[
                                { value: 1, label: 'Si' },
                                { value: 2, label: 'No' },
                            ]}
                            selectedValue={data.relacionado_tecnoacademia}
                            error={errors.relacionado_tecnoacademia}
                            onChange={(event, newValue) => {
                                setData('relacionado_tecnoacademia', newValue.value)
                            }}
                            placeholder="Seleccione una opción"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>
                {data.relacionado_tecnoacademia?.value === 1 && (props.isSuperAdmin || props.idi.proyecto.allowed.to_update) && (
                    <div className="bg-app-100 p-5 mt-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5" style={{ transform: 'translateX(-50px)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        <div className="grid grid-cols-2">
                            <div>
                                <p className="text-app-600">Por favor seleccione la Tecnoacademia con la cual articuló el proyecto</p>
                            </div>
                            <div>
                                <Autocomplete id="tecnoacademia_id" options={props.tecnoacademias} value={data.tecnoacademia_id} onChange={(e) => (data.tecnoacademia_id = e.target.value)} getItemValue={(item) => item.label} required disabled={props.evaluacion ? 'disabled' : undefined} />
                                {arrayLineasTecnoacademia?.length > 0 && (
                                    <div className="bg-white grid grid-cols-2 max-w-xl overflow-y-scroll shadow-2xl mt-4 h-80">
                                        {arrayLineasTecnoacademia.map(({ value, label }) => (
                                            <></>
                                            // <React.Fragment key={value}>
                                            //     <Label className="p-3 border-t border-b flex items-center text-sm" labelFor={`linea-tecnologica-${value}`} value={label} />
                                            //     <div className="border-b border-t flex items-center justify-center">
                                            //         <input
                                            //             type="checkbox"
                                            //             name="linea_tecnologica_id"
                                            //             value={value}
                                            //             checked={data.linea_tecnologica_id?.includes(value)}
                                            //             onChange={(e) => {
                                            //                 if (e.target.checked) {
                                            //                     data = [...(data.linea_tecnologica_id || []), value]
                                            //                 } else {
                                            //                     data = (data.linea_tecnologica_id || []).filter((v) => v !== value)
                                            //                 }
                                            //             }}
                                            //             className="rounded text-app-500"
                                            //         />
                                            //     </div>
                                            // </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <InputError message={errors.linea_tecnologica_id} />
                    </div>
                )}
            </div>

            <div>
                <div className="grid grid-cols-1">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="resumen" value="Resumen del proyecto" />
                        <AlertMui hiddenIcon={true}>Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.</AlertMui>
                    </div>
                    <div>
                        <Textarea id="resumen" value={data.resumen} onChange={(e) => setData('resumen', e.target.value)} required disabled={props.evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>

                {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                    <>
                        {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                            props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <Tooltip
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.resumen_comentario ? evaluacion.idi_evaluacion.resumen_comentario : 'Sin recomendación'}</p>
                                        </div>
                                    }
                                >
                                    <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                </Tooltip>
                            ) : null,
                        )}
                        {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {props.resumen}
            </div>

            <div>
                <div className="grid grid-cols-1">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="antecedentes" value="Antecedentes" />
                        <AlertMui hiddenIcon={true}>Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición.</AlertMui>
                    </div>
                    <div>
                        <Textarea id="antecedentes" error={errors.antecedentes} value={data.antecedentes} onChange={(e) => setData('antecedentes', e.target.value)} required disabled={props.evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-1">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="marco_conceptual" value="Marco conceptual" />
                        <AlertMui hiddenIcon={true}>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</AlertMui>
                    </div>
                    <div>
                        <Textarea id="marco_conceptual" error={errors.marco_conceptual} value={data.marco_conceptual} onChange={(e) => setData('marco_conceptual', e.target.value)} required disabled={props.evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="numero_aprendices" value="Número de los aprendices que se beneficiarán en la ejecución del proyecto" />
                    </div>
                    <div>
                        <TextInput
                            label="Número de aprendices"
                            id="numero_aprendices"
                            type="number"
                            min="0"
                            max="9999"
                            className="mt-1"
                            error={errors.numero_aprendices}
                            placeholder="Escriba el número de aprendices que se beneficiarán en la ejecución del proyecto"
                            value={data.numero_aprendices}
                            onChange={(e) => (data.numero_aprendices = e.target.value)}
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="municipios" value="Nombre de los municipios beneficiados" />
                    </div>
                    <div>
                        <SelectMultiple
                            id="municipios"
                            bdValues={data.municipios}
                            options={props.municipios}
                            isGroupable={true}
                            onChange={(event, newValue) => {
                                const selectedValues = newValue.map((option) => option.value)
                                setData((prevData) => ({
                                    ...prevData,
                                    municipios: selectedValues,
                                }))
                            }}
                            error={errors.municipios}
                            placeholder="Seleccione municipios"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="programas_formacion" value="Nombre de los programas de formación con registro calificado a impactar" />
                    </div>
                    <div>
                        <SelectMultiple
                            id="programas_formacion"
                            bdValues={data.programas_formacion}
                            options={props.programasFormacionConRegistroCalificado}
                            onChange={(event, newValue) => {
                                const selectedValues = newValue.map((option) => option.value)
                                setData((prevData) => ({
                                    ...prevData,
                                    programas_formacion: selectedValues,
                                }))
                            }}
                            error={errors.programas_formacion}
                            placeholder="Seleccione los programas de formación"
                            required
                            disabled={props.evaluacion ? 'disabled' : undefined}
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
                            bdValues={data.programas_formacion_articulados}
                            options={props.programasFormacionSinRegistroCalificado}
                            onChange={(event, newValue) => {
                                const selectedValues = newValue.map((option) => option.value)
                                setData((prevData) => ({
                                    ...prevData,
                                    programas_formacion_articulados: selectedValues,
                                }))
                            }}
                            error={errors.programas_formacion_articulados}
                            placeholder="Seleccione los programas de formación"
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-1">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio en los municipios" />
                    </div>
                    <div>
                        <Textarea id="impacto_municipios" error={errors.impacto_municipios} value={data.impacto_municipios} onChange={(e) => setData('impacto_municipios', e.target.value)} required disabled={props.evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-1">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />
                    </div>
                    <div>
                        <Textarea id="impacto_centro_formacion" error={errors.impacto_centro_formacion} value={data.impacto_centro_formacion} onChange={(e) => setData('impacto_centro_formacion', e.target.value)} required disabled={props.evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-1">
                    <div>
                        <Label required disabled={props.evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="bibliografia" value="Bibliografía" />
                        <AlertMui hiddenIcon={true}>Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).</AlertMui>
                    </div>
                    <div>
                        <Textarea id="bibliografia" error={errors.bibliografia} value={data.bibliografia} onChange={(e) => setData('bibliografia', e.target.value)} required disabled={props.evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>
            </div>

            <div>
                {(props.isSuperAdmin && !props.evaluacion) || (props.idi.proyecto.mostrar_recomendaciones && !props.evaluacion) ? (
                    <>
                        {props.idi.proyecto.evaluaciones.map((evaluacion, i) =>
                            props.isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <Tooltip
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            <p className="whitespace-pre-line text-xs text-justify">{evaluacion.idi_evaluacion.bibliografia_comentario ? evaluacion.idi_evaluacion.bibliografia_comentario : 'Sin recomendación'}</p>
                                        </div>
                                    }
                                >
                                    <Typography className="inline-block">Evaluación {i + 1}</Typography>
                                </Tooltip>
                            ) : null,
                        )}
                        {props.idi.proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {props.bibliografia}
            </div>

            <div>{props.items_finales}</div>
        </>
    )
}

export default Form
