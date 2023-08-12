import AlertMui from '@/Components/Alert'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form_evaluacion_estrategia_regional = useForm({
        cadena_valor_puntaje: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.cadena_valor_puntaje
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.cadena_valor_puntaje
            : null,
        cadena_valor_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.cadena_valor_comentario
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.cadena_valor_comentario
            : null,
        cadena_valor_requiere_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.cadena_valor_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.cadena_valor_comentario == null
                ? true
                : false
            : null,
    })
    const submitEvaluacionEstrategiaRegional = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_estrategia_regional.put(route('convocatorias.evaluaciones.cadena-valor.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const formEvaluacionLinea70 = useForm({
        cadena_valor_comentario: evaluacion.evaluacion_proyecto_linea70?.cadena_valor_comentario ? evaluacion.evaluacion_proyecto_linea70?.cadena_valor_comentario : '',
        cadena_valor_requiere_comentario: evaluacion.evaluacion_proyecto_linea70?.cadena_valor_comentario == null ? true : false,
    })
    const submitEvaluacionLinea70 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            formEvaluacionLinea70.put(route('convocatorias.evaluaciones.cadena-valor.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_69 = useForm({
        cadena_valor_comentario: evaluacion.evaluacion_proyecto_linea69?.cadena_valor_comentario ? evaluacion.evaluacion_proyecto_linea69?.cadena_valor_comentario : '',
        cadena_valor_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.cadena_valor_comentario == null ? true : false,
    })
    const submitEvaluacionLinea69 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_69.put(route('convocatorias.evaluaciones.cadena-valor.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_68 = useForm({
        propuesta_sostenibilidad_puntaje: evaluacion.evaluacion_proyecto_linea68?.propuesta_sostenibilidad_puntaje,
        propuesta_sostenibilidad_comentario: evaluacion.evaluacion_proyecto_linea68?.propuesta_sostenibilidad_comentario
            ? evaluacion.evaluacion_proyecto_linea68?.propuesta_sostenibilidad_comentario
            : '',
        propuesta_sostenibilidad_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.propuesta_sostenibilidad_comentario == null ? true : false,

        impacto_ambiental_puntaje: evaluacion.evaluacion_proyecto_linea68?.impacto_ambiental_puntaje,
        impacto_ambiental_comentario: evaluacion.evaluacion_proyecto_linea68?.impacto_ambiental_comentario ? evaluacion.evaluacion_proyecto_linea68?.impacto_ambiental_comentario : '',
        impacto_ambiental_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.impacto_ambiental_comentario == null ? true : false,

        impacto_social_centro_puntaje: evaluacion.evaluacion_proyecto_linea68?.impacto_social_centro_puntaje,
        impacto_social_centro_comentario: evaluacion.evaluacion_proyecto_linea68?.impacto_social_centro_comentario ? evaluacion.evaluacion_proyecto_linea68?.impacto_social_centro_comentario : '',
        impacto_social_centro_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.impacto_social_centro_comentario == null ? true : false,

        impacto_social_productivo_puntaje: evaluacion.evaluacion_proyecto_linea68?.impacto_social_productivo_puntaje,
        impacto_social_productivo_comentario: evaluacion.evaluacion_proyecto_linea68?.impacto_social_productivo_comentario
            ? evaluacion.evaluacion_proyecto_linea68?.impacto_social_productivo_comentario
            : '',
        impacto_social_productivo_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.impacto_social_productivo_comentario == null ? true : false,

        impacto_tecnologico_puntaje: evaluacion.evaluacion_proyecto_linea68?.impacto_tecnologico_puntaje,
        impacto_tecnologico_comentario: evaluacion.evaluacion_proyecto_linea68?.impacto_tecnologico_comentario ? evaluacion.evaluacion_proyecto_linea68?.impacto_tecnologico_comentario : '',
        impacto_tecnologico_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.impacto_tecnologico_comentario == null ? true : false,
    })
    const submitEvaluacionLinea68 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_68.put(route('convocatorias.evaluaciones.cadena-valor.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            {proyecto.tipo_formulario_convocatoria_id == 7 ||
            proyecto.tipo_formulario_convocatoria_id == 9 ||
            proyecto.tipo_formulario_convocatoria_id == 1 ||
            proyecto.tipo_formulario_convocatoria_id == 8 ||
            proyecto.tipo_formulario_convocatoria_id == 6 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionEstrategiaRegional}>
                            <AlertMui>
                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>
                                            {proyecto.tipo_formulario_convocatoria_id == 7 || proyecto.tipo_formulario_convocatoria_id == 9 || proyecto.tipo_formulario_convocatoria_id == 1
                                                ? '0 a 12'
                                                : proyecto.tipo_formulario_convocatoria_id == 8 || proyecto.tipo_formulario_convocatoria_id == 6
                                                ? '0 a 9'
                                                : ''}
                                        </strong>{' '}
                                        El presupuesto esta sobre o subdimensionado y / o no está directamente relacionado con el desarrollo de las actividades para el logro de los objetivos
                                        propuestos. Los soportes que evidencian el costo del bien a adquirir no son pertinentes y tampoco confiables
                                    </li>
                                    <li>
                                        <strong>
                                            {proyecto.tipo_formulario_convocatoria_id == 7 || proyecto.tipo_formulario_convocatoria_id == 9 || proyecto.tipo_formulario_convocatoria_id == 1
                                                ? '13 a 23'
                                                : proyecto.tipo_formulario_convocatoria_id == 8 || proyecto.tipo_formulario_convocatoria_id == 6
                                                ? '10 a 18'
                                                : ''}
                                        </strong>{' '}
                                        El presupuesto es adecuado, pero es susceptible de ajustes frente a las las actividades a desarrollar que darán cumplimiento a los objetivos propuestos. Los
                                        soportes que evidencian el costo del bien a adquirir son pertinentes y confiables.
                                    </li>
                                    <li>
                                        <strong>
                                            {proyecto.tipo_formulario_convocatoria_id == 7 || proyecto.tipo_formulario_convocatoria_id == 9 || proyecto.tipo_formulario_convocatoria_id == 1
                                                ? '24 a 25'
                                                : proyecto.tipo_formulario_convocatoria_id == 8 || proyecto.tipo_formulario_convocatoria_id == 6
                                                ? '19 a 20'
                                                : ''}
                                        </strong>{' '}
                                        El presupuesto está bien definido y se relaciona directamente con el desarrollo de las actividades y los entregables del proyecto. Los soportes que evidencian
                                        el costo del bien a adquirir son pertinentes y confiables.
                                    </li>
                                </ul>

                                <Label
                                    className="mt-4 mb-4"
                                    labelFor="cadena_valor_puntaje"
                                    value={
                                        proyecto.tipo_formulario_convocatoria_id == 7 || proyecto.tipo_formulario_convocatoria_id == 9 || proyecto.tipo_formulario_convocatoria_id == 1
                                            ? 'Puntaje (Máximo 25)'
                                            : proyecto.tipo_formulario_convocatoria_id == 8 || proyecto.tipo_formulario_convocatoria_id == 6
                                            ? 'Puntaje (Máximo 20)'
                                            : 'Puntaje (Máximo 0)'
                                    }
                                />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="cadena_valor_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max:
                                            proyecto.tipo_formulario_convocatoria_id == 7 || proyecto.tipo_formulario_convocatoria_id == 9 || proyecto.tipo_formulario_convocatoria_id == 1
                                                ? 25
                                                : proyecto.tipo_formulario_convocatoria_id == 8 || proyecto.tipo_formulario_convocatoria_id == 6
                                                ? 20
                                                : 0,
                                    }}
                                    value={form_evaluacion_estrategia_regional.data.cadena_valor_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_estrategia_regional.errors.cadena_valor_puntaje}
                                />

                                <div className="mt-4">
                                    <p>
                                        ¿La cadena de valor, propuesta de sostenibilidad, impacto social, impacto tecnológico o impacto en el centro de formación son correctos? Por favor seleccione si
                                        Cumple o No cumple.
                                    </p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_estrategia_regional.data.cadena_valor_requiere_comentario}
                                    />
                                    {form_evaluacion_estrategia_regional.data.cadena_valor_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="cadena_valor_comentario"
                                            value={form_evaluacion_estrategia_regional.data.cadena_valor_comentario}
                                            error={form_evaluacion_estrategia_regional.errors.cadena_valor_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_estrategia_regional.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : proyecto.tipo_formulario_convocatoria_id == 12 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea68}>
                            <AlertMui>
                                <h1 className="font-black">Propuesta de sostenibilidad</h1>
                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        Se deben mencionar aquellos factores que pueden comprometer la viabilidad, desarrollo de los objetivos y resultados del proyecto a través del tiempo.
                                        <br />
                                        Para definir la propuesta de sostenibilidad se deben tener en cuenta los impactos definidos en el árbol de objetivos (ambiental, social - en el centro de
                                        formación, social - en el sector productivo, tecnológico)
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="propuesta_sostenibilidad_puntaje" value="Puntaje (Máximo 3)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="propuesta_sostenibilidad_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 3,
                                    }}
                                    value={form_evaluacion_linea_68.data.propuesta_sostenibilidad_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.propuesta_sostenibilidad_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿La propuesta de sostenibilidad es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.propuesta_sostenibilidad_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.propuesta_sostenibilidad_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="propuesta_sostenibilidad_comentario"
                                            value={form_evaluacion_linea_68.data.propuesta_sostenibilidad_comentario}
                                            error={form_evaluacion_linea_68.errors.propuesta_sostenibilidad_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10 border-app-300" />
                                <h1 className="font-black">Impacto ambiental</h1>
                                <h1>Criterios de evaluacion</h1>

                                <ul className="list-disc p-4">
                                    <li>
                                        Se deben mencionar aquellos factores que pueden comprometer la viabilidad, desarrollo de los objetivos y resultados del proyecto a través del tiempo.
                                        <br />
                                        Para definir la propuesta de sostenibilidad se deben tener en cuenta los impactos definidos en el árbol de objetivos (ambiental, social - en el centro de
                                        formación, social - en el sector productivo, tecnológico)
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="impacto_ambiental_puntaje" value="Puntaje (Máximo 1)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="impacto_ambiental_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 1,
                                    }}
                                    value={form_evaluacion_linea_68.data.impacto_ambiental_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.impacto_ambiental_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿El impacto ambiental es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.impacto_ambiental_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.impacto_ambiental_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="impacto_ambiental_comentario"
                                            value={form_evaluacion_linea_68.data.impacto_ambiental_comentario}
                                            error={form_evaluacion_linea_68.errors.impacto_ambiental_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10 border-app-300" />
                                <h1 className="font-black">Impacto social en el centro de formación</h1>
                                <h1>Criterios de evaluacion</h1>

                                <ul className="list-disc p-4">
                                    <li>Se busca medir la contribución potencial del proyecto al desarrollo de la comunidad Sena (Aprendices, instructores y a la formación)</li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="impacto_social_centro_puntaje" value="Puntaje (Máximo 1)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="impacto_social_centro_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 1,
                                    }}
                                    value={form_evaluacion_linea_68.data.impacto_social_centro_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.impacto_social_centro_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿El impacto social en el centro de formación es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.impacto_social_centro_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.impacto_social_centro_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="impacto_social_centro_comentario"
                                            value={form_evaluacion_linea_68.data.impacto_social_centro_comentario}
                                            error={form_evaluacion_linea_68.errors.impacto_social_centro_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10 border-app-300" />
                                <h1 className="font-black">Impacto social en el sector productivo</h1>
                                <h1>Criterios de evaluacion</h1>

                                <ul className="list-disc p-4">
                                    <li>
                                        Se busca medir la contribución potencial del proyecto al desarrollo del sector productivo en concordancia con el sector priorizado de Colombia Productiva y a la
                                        mesa técnica a la que pertenece el proyecto.
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="impacto_social_productivo_puntaje" value="Puntaje (Máximo 1)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="impacto_social_productivo_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 1,
                                    }}
                                    value={form_evaluacion_linea_68.data.impacto_social_productivo_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.impacto_social_productivo_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿El impacto social en el sector productivo es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.impacto_social_productivo_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.impacto_social_productivo_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="impacto_social_productivo_comentario"
                                            value={form_evaluacion_linea_68.data.impacto_social_productivo_comentario}
                                            error={form_evaluacion_linea_68.errors.impacto_social_productivo_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10 border-app-300" />
                                <h1 className="font-black">Impacto tecnológico</h1>
                                <h1>Criterios de evaluacion</h1>

                                <ul className="list-disc p-4">
                                    <li>Se busca medir la contribución potencial del proyecto al desarrollo de la comunidad Sena (Aprendices, instructores y a la formación)</li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="impacto_tecnologico_puntaje" value="Puntaje (Máximo 1)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="impacto_tecnologico_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 1,
                                    }}
                                    value={form_evaluacion_linea_68.data.impacto_tecnologico_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.impacto_tecnologico_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿El impacto tecnológico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.impacto_tecnologico_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.impacto_tecnologico_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="impacto_tecnologico_comentario"
                                            value={form_evaluacion_linea_68.data.impacto_tecnologico_comentario}
                                            error={form_evaluacion_linea_68.errors.impacto_tecnologico_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea_68.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : proyecto.tipo_formulario_convocatoria_id == 4 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea70}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>
                                        ¿La cadena de valor, propuesta de sostenibilidad, impacto social, impacto tecnológico o impacto en el centro de formación son correctos? Por favor seleccione si
                                        Cumple o No cumple.
                                    </p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={formEvaluacionLinea70.data.cadena_valor_requiere_comentario}
                                    />
                                    {formEvaluacionLinea70.data.cadena_valor_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="cadena_valor_comentario"
                                            value={formEvaluacionLinea70.data.cadena_valor_comentario}
                                            error={formEvaluacionLinea70.errors.cadena_valor_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={formEvaluacionLinea70.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : proyecto.tipo_formulario_convocatoria_id == 5 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea69}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>
                                        ¿La cadena de valor, propuesta de sostenibilidad, impacto social, impacto tecnológico o impacto en el centro de formación son correctos? Por favor seleccione si
                                        Cumple o No cumple.
                                    </p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_69.data.cadena_valor_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_69.data.cadena_valor_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="cadena_valor_comentario"
                                            value={form_evaluacion_linea_69.data.cadena_valor_comentario}
                                            error={form_evaluacion_linea_69.errors.cadena_valor_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea_69.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : null}
        </>
    )
}

export default Evaluacion
