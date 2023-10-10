import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import Label from '@/Components/Label'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Divider } from '@mui/material'

const Evaluacion = ({ convocatoria, evaluacion, allowed, ...props }) => {
    const form = useForm({
        clausula_confidencialidad: evaluacion?.clausula_confidencialidad,
        titulo_puntaje: evaluacion?.titulo_puntaje,
        titulo_comentario: evaluacion?.titulo_comentario ? evaluacion?.titulo_comentario : '',
        titulo_requiere_comentario: evaluacion?.titulo_comentario == null ? true : false,
        video_puntaje: evaluacion?.video_puntaje,
        video_comentario: evaluacion?.video_comentario ? evaluacion?.video_comentario : '',
        video_requiere_comentario: evaluacion?.video_comentario == null ? true : false,
        resumen_puntaje: evaluacion?.resumen_puntaje,
        resumen_comentario: evaluacion?.resumen_comentario ? evaluacion?.resumen_comentario : '',
        resumen_requiere_comentario: evaluacion?.resumen_comentario == null ? true : false,
        problema_central_puntaje: evaluacion?.problema_central_puntaje,
        problema_central_comentario: evaluacion?.problema_central_comentario ? evaluacion?.problema_central_comentario : '',
        problema_central_requiere_comentario: evaluacion?.problema_central_comentario == null ? true : false,
        ortografia_puntaje: evaluacion?.ortografia_puntaje,
        ortografia_comentario: evaluacion?.ortografia_comentario ? evaluacion?.ortografia_comentario : '',
        ortografia_requiere_comentario: evaluacion?.ortografia_comentario == null ? true : false,
        redaccion_puntaje: evaluacion?.redaccion_puntaje,
        redaccion_comentario: evaluacion?.redaccion_comentario ? evaluacion?.redaccion_comentario : '',
        redaccion_requiere_comentario: evaluacion?.redaccion_comentario == null ? true : false,
        normas_apa_puntaje: evaluacion?.normas_apa_puntaje,
        normas_apa_comentario: evaluacion?.normas_apa_comentario ? evaluacion?.normas_apa_comentario : '',
        normas_apa_requiere_comentario: evaluacion?.normas_apa_comentario == null ? true : false,

        justificacion_economia_naranja_requiere_comentario: evaluacion?.justificacion_economia_naranja_comentario == null ? true : false,
        justificacion_economia_naranja_comentario: evaluacion?.justificacion_economia_naranja_comentario ? evaluacion?.justificacion_economia_naranja_comentario : '',

        justificacion_industria_4_requiere_comentario: evaluacion?.justificacion_industria_4_comentario == null ? true : false,
        justificacion_industria_4_comentario: evaluacion?.justificacion_industria_4_comentario ? evaluacion?.justificacion_industria_4_comentario : '',

        bibliografia_requiere_comentario: evaluacion?.bibliografia_comentario == null ? true : false,
        bibliografia_comentario: evaluacion?.bibliografia_comentario ? evaluacion?.bibliografia_comentario : '',

        fechas_requiere_comentario: evaluacion?.fechas_comentario == null ? true : false,
        fechas_comentario: evaluacion?.fechas_comentario ? evaluacion?.fechas_comentario : '',

        justificacion_politica_discapacidad_requiere_comentario: evaluacion?.justificacion_politica_discapacidad_comentario == null ? true : false,
        justificacion_politica_discapacidad_comentario: evaluacion?.justificacion_politica_discapacidad_comentario ? evaluacion?.justificacion_politica_discapacidad_comentario : '',

        actividad_economica_requiere_comentario: evaluacion?.actividad_economica_comentario == null ? true : false,
        actividad_economica_comentario: evaluacion?.actividad_economica_comentario ? evaluacion?.actividad_economica_comentario : '',

        disciplina_subarea_conocimiento_requiere_comentario: evaluacion?.disciplina_subarea_conocimiento_comentario == null ? true : false,
        disciplina_subarea_conocimiento_comentario: evaluacion?.disciplina_subarea_conocimiento_comentario ? evaluacion?.disciplina_subarea_conocimiento_comentario : '',

        red_conocimiento_requiere_comentario: evaluacion?.red_conocimiento_comentario == null ? true : false,
        red_conocimiento_comentario: evaluacion?.red_conocimiento_comentario ? evaluacion?.red_conocimiento_comentario : '',

        tematica_estrategica_requiere_comentario: evaluacion?.tematica_estrategica_comentario == null ? true : false,
        tematica_estrategica_comentario: evaluacion?.tematica_estrategica_comentario ? evaluacion?.tematica_estrategica_comentario : '',
    })

    const submit = (e) => {
        e.preventDefault()

        if (allowed.to_update) {
            form.put(route('convocatorias.evaluaciones-proyecto-linea-66.update', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <form onSubmit={submit} className="space-y-10">
            <div>
                <Divider className="!my-20 font-black">TÍTULO</Divider>

                <Label className="!mb-10" labelFor="titulo_puntaje" value="Puntaje (Máximo 1)" />
                <TextInput
                    label="Diligencie el puntaje"
                    id="titulo_puntaje"
                    type="number"
                    inputBackground="#fff"
                    inputProps={{
                        step: 0.1,
                        min: 0,
                        max: 1,
                    }}
                    value={form.data.titulo_puntaje}
                    onChange={(e) => form.setData('titulo_puntaje', e.target.value)}
                    placeholder="Puntaje"
                    error={form.errors.titulo_puntaje}
                />
                <AlertMui>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0,0 a 0,5</strong> El título orienta el enfoque del proyecto
                        </li>
                        <li>
                            <strong>Puntaje: 0,6 a 1,0</strong> El título orienta el enfoque del proyecto e indica el cómo y el para qué
                        </li>
                    </ul>
                </AlertMui>

                <div className="mt-10">
                    <p>
                        ¿El título es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui className="!ml-0" checked={form.data.titulo_requiere_comentario} onChange={(e) => form.setData('titulo_requiere_comentario', e.target.checked)} />
                    {form.data.titulo_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="titulo_comentario"
                            value={form.data.titulo_comentario}
                            error={form.errors.titulo_comentario}
                            onChange={(e) => form.setData('titulo_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
            </div>

            <div>
                <Divider className="!my-20 font-black">RESUMEN</Divider>

                <Label className="!mb-10" labelFor="resumen_puntaje" value="Puntaje (Máximo 2)" />
                <TextInput
                    label="Diligencie el puntaje"
                    id="resumen_puntaje"
                    type="number"
                    inputBackground="#fff"
                    inputProps={{
                        step: 0.1,
                        min: 0,
                        max: 2,
                    }}
                    value={form.data.resumen_puntaje}
                    placeholder="Puntaje"
                    error={form.errors.resumen_puntaje}
                    onChange={(e) => form.setData('resumen_puntaje', e.target.value)}
                />
                <AlertMui>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0,0 a 1,0</strong> El resumen no presenta de forma clara la pertinencia y calidad del proyecto, en términos de cuál es el problema central, cómo se le dará
                            solución y cuáles serán las herramientas que se utilizarán para ello, entre otros.
                        </li>
                        <li>
                            <strong>Puntaje: 1,1 a 2,0</strong> El resumen presenta de forma clara la pertinencia y calidad del proyecto e incluye todos los elementos en términos de cuál es el
                            problema central, cómo se le dará solución y cuáles serán las herramientas que se utilizarán para ello, entre otros.
                        </li>
                    </ul>
                </AlertMui>

                <div className="mt-10">
                    <p>
                        ¿El resumen es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui className="!ml-0" checked={form.data.resumen_requiere_comentario} onChange={(e) => form.setData('resumen_requiere_comentario', e.target.checked)} />
                    {form.data.resumen_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="resumen_comentario"
                            value={form.data.resumen_comentario}
                            error={form.errors.resumen_comentario}
                            onChange={(e) => form.setData('resumen_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
            </div>

            <div>
                <Divider className="!my-20 font-black">VIDEO</Divider>

                <Label className="!mb-10" labelFor="video_puntaje" value="Puntaje (Máximo 1)" />
                <TextInput
                    label="Diligencie el puntaje"
                    id="video_puntaje"
                    type="number"
                    inputBackground="#fff"
                    inputProps={{
                        step: 0.1,
                        min: 0,
                        max: 1,
                    }}
                    value={form.data.video_puntaje}
                    placeholder="Puntaje"
                    error={form.errors.video_puntaje}
                    onChange={(e) => form.setData('video_puntaje', e.target.value)}
                />
                <AlertMui>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0,0 a 0,5</strong> El video no cumple los 3 minutos establecidos y no presenta de forma clara la justificación, la problemática, el objetivo general, los
                            objetivos específicos, las actividades, los productos y/o su impacto de acuerdo con los lineamientos de la convocatoria
                        </li>
                        <li>
                            <strong>Puntaje: 0,6 a 1,0</strong> El video cumple los 3 minutos establecidos y presenta la justificación, la problemática, el objetivo general, los objetivos específicos,
                            las actividades, los productos y su impacto de acuerdo con los lineamientos de la convocatoria
                        </li>
                    </ul>
                </AlertMui>

                <div className="mt-10">
                    <p>
                        ¿El video es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui className="!ml-0" checked={form.data.video_requiere_comentario} onChange={(e) => form.setData('video_requiere_comentario', e.target.checked)} />
                    {form.data.video_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="video_comentario"
                            value={form.data.video_comentario}
                            error={form.errors.video_comentario}
                            onChange={(e) => form.setData('video_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
            </div>

            <div>
                <Divider className="!my-20 font-black">ORTOGRAFÍA</Divider>

                <Label className="!mb-10" labelFor="ortografia_puntaje" value="Puntaje (Máximo 1)" />
                <TextInput
                    label="Diligencie el puntaje"
                    id="ortografia_puntaje"
                    type="number"
                    inputBackground="#fff"
                    inputProps={{
                        step: 1,
                        min: 0,
                        max: 1,
                    }}
                    value={form.data.ortografia_puntaje}
                    placeholder="Puntaje"
                    error={form.errors.ortografia_puntaje}
                    onChange={(e) => form.setData('ortografia_puntaje', e.target.value)}
                />
                <AlertMui>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 1.</strong> Todo el documento respeta y aplica las reglas ortográficas
                        </li>
                    </ul>
                </AlertMui>

                <div className="mt-10">
                    <p>
                        ¿La ortografía es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui className="!ml-0" checked={form.data.ortografia_requiere_comentario} onChange={(e) => form.setData('ortografia_requiere_comentario', e.target.checked)} />
                    {form.data.ortografia_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="ortografia_comentario"
                            value={form.data.ortografia_comentario}
                            error={form.errors.ortografia_comentario}
                            onChange={(e) => form.setData('ortografia_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>

                <Divider className="!my-20 font-black">REDACCIÓN</Divider>

                <Label className="!mb-10" labelFor="redaccion_puntaje" value="Puntaje (Máximo 1)" />
                <TextInput
                    label="Diligencie el puntaje"
                    id="redaccion_puntaje"
                    type="number"
                    inputBackground="#fff"
                    inputProps={{
                        step: 1,
                        min: 0,
                        max: 1,
                    }}
                    value={form.data.redaccion_puntaje}
                    placeholder="Puntaje"
                    error={form.errors.redaccion_puntaje}
                    onChange={(e) => form.setData('redaccion_puntaje', e.target.value)}
                />
                <AlertMui>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 1.</strong> Todo el documento respeta y aplica las reglas gramaticales
                        </li>
                    </ul>
                </AlertMui>

                <div className="mt-10">
                    <p>
                        ¿La redacción es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui className="!ml-0" checked={form.data.redaccion_requiere_comentario} onChange={(e) => form.setData('redaccion_requiere_comentario', e.target.checked)} />
                    {form.data.redaccion_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="redaccion_comentario"
                            value={form.data.redaccion_comentario}
                            error={form.errors.redaccion_comentario}
                            onChange={(e) => form.setData('redaccion_comentario', e.target.value)}
                        />
                    )}
                </div>

                <Divider className="!my-20 font-black">NORMAS APA</Divider>

                <Label className="!mb-10" labelFor="normas_apa_puntaje" value="Puntaje (Máximo 1)" />
                <TextInput
                    label="Diligencie el puntaje"
                    id="normas_apa_puntaje"
                    type="number"
                    inputBackground="#fff"
                    inputProps={{
                        step: 1,
                        min: 0,
                        max: 1,
                    }}
                    value={form.data.normas_apa_puntaje}
                    placeholder="Puntaje"
                    error={form.errors.normas_apa_puntaje}
                    onChange={(e) => form.setData('normas_apa_puntaje', e.target.value)}
                />
                <AlertMui>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 1.</strong> Las normas APA han sido aplicadas en todo el documento para referenciar y citar otros autores
                        </li>
                    </ul>
                </AlertMui>

                <div className="mt-10">
                    <p>
                        ¿Las normas APA son correctas? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                    </p>
                    <SwitchMui className="!ml-0" checked={form.data.normas_apa_requiere_comentario} onChange={(e) => form.setData('normas_apa_requiere_comentario', e.target.checked)} />
                    {form.data.normas_apa_requiere_comentario == false && (
                        <Textarea
                            label="Comentario"
                            className="mt-4"
                            inputBackground="#fff"
                            id="normas_apa_comentario"
                            value={form.data.normas_apa_comentario}
                            error={form.errors.normas_apa_comentario}
                            onChange={(e) => form.setData('normas_apa_comentario', e.target.value)}
                            required
                        />
                    )}
                </div>
            </div>

            <div>
                <Divider className="!my-20 font-black">FECHAS DE EJECUCIÓN</Divider>

                <p>
                    ¿Las fechas son correctas? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación
                </p>
                <SwitchMui className="!ml-0" checked={form.data.fechas_requiere_comentario} onChange={(e) => form.setData('fechas_requiere_comentario', e.target.checked)} />
                {form.data.fechas_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="fechas_comentario"
                        value={form.data.fechas_comentario}
                        error={form.errors.fechas_comentario}
                        onChange={(e) => form.setData('fechas_comentario', e.target.value)}
                        required
                    />
                )}
            </div>
            <div>
                <Divider className="!my-20 font-black">RED DE CONOCIMIENTO</Divider>

                <p>
                    ¿La red de conocimiento sectorial es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                </p>
                <SwitchMui className="!ml-0" checked={form.data.red_conocimiento_requiere_comentario} onChange={(e) => form.setData('red_conocimiento_requiere_comentario', e.target.checked)} />
                {form.data.red_conocimiento_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="red_conocimiento_comentario"
                        value={form.data.red_conocimiento_comentario}
                        error={form.errors.red_conocimiento_comentario}
                        onChange={(e) => form.setData('red_conocimiento_comentario', e.target.value)}
                        required
                    />
                )}
            </div>
            <div>
                <Divider className="!my-20 font-black">DISCIPLINA DE CONOCIMIENTO</Divider>

                <p>
                    ¿La disciplina de la subárea de conocimiento es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva
                    recomendación.
                </p>
                <SwitchMui
                    className="!ml-0"
                    checked={form.data.disciplina_subarea_conocimiento_requiere_comentario}
                    onChange={(e) => form.setData('disciplina_subarea_conocimiento_requiere_comentario', e.target.checked)}
                />
                {form.data.disciplina_subarea_conocimiento_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="disciplina_subarea_conocimiento_comentario"
                        value={form.data.disciplina_subarea_conocimiento_comentario}
                        error={form.errors.disciplina_subarea_conocimiento_comentario}
                        onChange={(e) => form.setData('disciplina_subarea_conocimiento_comentario', e.target.value)}
                        required
                    />
                )}
            </div>
            <div>
                <Divider className="!my-20 font-black">ACTIVIDAD ECONÓMICA</Divider>

                <p>
                    ¿La actividad económica es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                </p>
                <SwitchMui className="!ml-0" checked={form.data.actividad_economica_requiere_comentario} onChange={(e) => form.setData('actividad_economica_requiere_comentario', e.target.checked)} />
                {form.data.actividad_economica_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="actividad_economica_comentario"
                        value={form.data.actividad_economica_comentario}
                        error={form.errors.actividad_economica_comentario}
                        onChange={(e) => form.setData('actividad_economica_comentario', e.target.value)}
                        required
                    />
                )}
            </div>
            <div>
                <Divider className="!my-20 font-black">TEMÁTICA ESTRATÉGICA</Divider>

                <p>
                    ¿La temática estratégica es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                </p>
                <SwitchMui
                    className="!ml-0"
                    checked={form.data.tematica_estrategica_requiere_comentario}
                    onChange={(e) => form.setData('tematica_estrategica_requiere_comentario', e.target.checked)}
                />
                {form.data.tematica_estrategica_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="tematica_estrategica_comentario"
                        value={form.data.tematica_estrategica_comentario}
                        error={form.errors.tematica_estrategica_comentario}
                        onChange={(e) => form.setData('tematica_estrategica_comentario', e.target.value)}
                        required
                    />
                )}
            </div>

            <div>
                <Divider className="!my-20 font-black">INDUSTRIA 4.0</Divider>

                <p>
                    ¿El ítem es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                </p>
                <SwitchMui
                    className="!ml-0"
                    checked={form.data.justificacion_industria_4_requiere_comentario}
                    onChange={(e) => form.setData('justificacion_industria_4_requiere_comentario', e.target.checked)}
                />
                {form.data.justificacion_industria_4_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="justificacion_industria_4_comentario"
                        value={form.data.justificacion_industria_4_comentario}
                        error={form.errors.justificacion_industria_4_comentario}
                        onChange={(e) => form.setData('justificacion_industria_4_comentario', e.target.value)}
                        required
                    />
                )}
            </div>
            <div>
                <Divider className="!my-20 font-black">ECONOMÍA NARANJA</Divider>

                <p>
                    ¿El ítem es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                </p>
                <SwitchMui
                    className="!ml-0"
                    checked={form.data.justificacion_economia_naranja_requiere_comentario}
                    onChange={(e) => form.setData('justificacion_economia_naranja_requiere_comentario', e.target.checked)}
                />
                {form.data.justificacion_economia_naranja_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="justificacion_economia_naranja_comentario"
                        value={form.data.justificacion_economia_naranja_comentario}
                        error={form.errors.justificacion_economia_naranja_comentario}
                        onChange={(e) => form.setData('justificacion_economia_naranja_comentario', e.target.value)}
                        required
                    />
                )}
            </div>
            <div>
                <Divider className="!my-20 font-black">POLÍTICA DE DISCAPACIDAD</Divider>

                <p>
                    ¿El ítem es correcto? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                </p>
                <SwitchMui
                    className="!ml-0"
                    checked={form.data.justificacion_politica_discapacidad_requiere_comentario}
                    onChange={(e) => form.setData('justificacion_politica_discapacidad_requiere_comentario', e.target.checked)}
                />
                {form.data.justificacion_politica_discapacidad_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="justificacion_politica_discapacidad_comentario"
                        value={form.data.justificacion_politica_discapacidad_comentario}
                        error={form.errors.justificacion_politica_discapacidad_comentario}
                        onChange={(e) => form.setData('justificacion_politica_discapacidad_comentario', e.target.value)}
                        required
                    />
                )}
            </div>

            <div>
                <Divider className="!my-20 font-black">BIBLIOGRAFÍA</Divider>

                <p>
                    ¿La bibliografía es correcta? Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                </p>
                <SwitchMui className="!ml-0" checked={form.data.bibliografia_requiere_comentario} onChange={(e) => form.setData('bibliografia_requiere_comentario', e.target.checked)} />
                {form.data.bibliografia_requiere_comentario == false && (
                    <Textarea
                        label="Comentario"
                        className="mt-4"
                        inputBackground="#fff"
                        id="bibliografia_comentario"
                        value={form.data.bibliografia_comentario}
                        error={form.errors.bibliografia_comentario}
                        onChange={(e) => form.setData('bibliografia_comentario', e.target.value)}
                        required
                    />
                )}
            </div>

            <div className="flex items-center justify-between mt-14 px-8 py-4">
                {/* {evaluacion?.allowed_to_update && ( */}
                <>
                    {form.data.clausula_confidencialidad ? (
                        <span className="text-green-500">Ha aceptado la cláusula de confidencialidad</span>
                    ) : (
                        <span className="text-red-500">No ha aceptado la cláusula de confidencialidad</span>
                    )}

                    <ButtonMui disabled={form.processing} className="ml-auto" type="submit">
                        Guardar
                    </ButtonMui>
                </>
                {/* )} */}
            </div>
        </form>
    )
}

export default Evaluacion
