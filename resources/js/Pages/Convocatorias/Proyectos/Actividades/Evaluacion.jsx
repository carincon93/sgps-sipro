import AlertMui from '@/Components/Alert'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, convocatoria, proyecto, evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form_evaluacion_estrategia_regional = useForm({
        metodologia_puntaje: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.metodologia_puntaje
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.metodologia_puntaje
            : null,
        metodologia_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.metodologia_comentario
                ? evaluacion.evaluacion_proyecto_linea66?.metodologia_comentario
                : ''
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.metodologia_comentario
                ? evaluacion.evaluacion_proyecto_linea65.metodologia_comentario
                : ''
            : '',
        metodologia_requiere_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.metodologia_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.metodologia_comentario == null
                ? true
                : false
            : null,
    })
    const submitEvaluacionEstrategiaRegional = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_estrategia_regional.put(route('convocatorias.evaluaciones.actividades.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_70 = useForm({
        metodologia_comentario: evaluacion.evaluacion_proyecto_linea70?.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea70?.metodologia_comentario : '',
        metodologia_requiere_comentario: evaluacion.evaluacion_proyecto_linea70 ? (evaluacion.evaluacion_proyecto_linea70?.metodologia_comentario == null ? true : false) : null,

        municipios_requiere_comentario: evaluacion.evaluacion_proyecto_linea70?.municipios_comentario == null ? true : false,
        municipios_comentario: evaluacion.evaluacion_proyecto_linea70?.municipios_comentario ? evaluacion.evaluacion_proyecto_linea70?.municipios_comentario : '',

        instituciones_comentario: evaluacion.evaluacion_proyecto_linea70?.instituciones_comentario ? evaluacion.evaluacion_proyecto_linea70?.instituciones_comentario : '',
        instituciones_requiere_comentario: evaluacion.evaluacion_proyecto_linea70 ? (evaluacion.evaluacion_proyecto_linea70?.instituciones_comentario == null ? true : false) : null,

        proyectos_macro_comentario: evaluacion.evaluacion_proyecto_linea70?.proyectos_macro_comentario ? evaluacion.evaluacion_proyecto_linea70?.proyectos_macro_comentario : '',
        proyectos_macro_requiere_comentario: evaluacion.evaluacion_proyecto_linea70 ? (evaluacion.evaluacion_proyecto_linea70?.proyectos_macro_comentario == null ? true : false) : null,
    })

    const submitEvaluacionLinea70 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_70.put(route('convocatorias.evaluaciones.actividades.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea69 = useForm({
        metodologia_comentario: evaluacion.evaluacion_proyecto_linea69?.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea69?.metodologia_comentario : '',
        metodologia_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.metodologia_comentario == null ? true : false,
        municipios_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.municipios_comentario == null ? true : false,
        municipios_comentario: evaluacion.evaluacion_proyecto_linea69?.municipios_comentario ? evaluacion.evaluacion_proyecto_linea69?.municipios_comentario : '',
    })
    const submiEvaluacionLinea69 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea69.put(route('convocatorias.evaluaciones.actividades.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_68 = useForm({
        metodologia_puntaje: evaluacion.evaluacion_proyecto_linea68?.metodologia_puntaje,
        metodologia_comentario: evaluacion.evaluacion_proyecto_linea68?.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea68?.metodologia_comentario : '',
        metodologia_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.metodologia_comentario == null ? true : false,

        actividades_primer_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.actividades_primer_obj_puntaje,
        actividades_primer_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.actividades_primer_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.actividades_primer_obj_comentario : '',
        actividades_primer_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.actividades_primer_obj_comentario == null ? true : false,

        actividades_segundo_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.actividades_segundo_obj_puntaje,
        actividades_segundo_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.actividades_segundo_obj_comentario
            ? evaluacion.evaluacion_proyecto_linea68?.actividades_segundo_obj_comentario
            : '',
        actividades_segundo_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.actividades_segundo_obj_comentario == null ? true : false,

        actividades_tercer_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.actividades_tercer_obj_puntaje,
        actividades_tercer_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.actividades_tercer_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.actividades_tercer_obj_comentario : '',
        actividades_tercer_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.actividades_tercer_obj_comentario == null ? true : false,

        actividades_cuarto_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.actividades_cuarto_obj_puntaje,
        actividades_cuarto_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.actividades_cuarto_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.actividades_cuarto_obj_comentario : '',
        actividades_cuarto_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.actividades_cuarto_obj_comentario == null ? true : false,
    })
    const submitEvaluacionLinea68 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_68.put(route('convocatorias.evaluaciones.actividades.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
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
                                        <strong>Puntaje: 0 a 7</strong> La selección y descripción de la metodología o metodologías no son claras para el contexto y desarrollo del proyecto. Las
                                        actividades no estan descritas de forma secuencial, tampoco muestran como se lograrán los objetivos específicos, generarán los resultados y/o productos y no
                                        estan formuladas en el marco de la vigencia del proyecto. Algunas de las actividades no se desarrollarán durante la vigencia {convocatoria.year}.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 8 a 13</strong> La selección y descripción de la metodología o metodologías son claras para el contexto y desarrollo del proyecto. Las
                                        actividades están descritas de forma secuencial; sin embargo, son susceptibles de mejora en cuanto a como se lograrán los objetivos específicos, generarán los
                                        resultados y/o productos y estan formuladas en el marco de la vigencia del proyecto. Todas las actividades se desarrollarán durante la vigencia{' '}
                                        {convocatoria.year} y el tiempo dispuesto para ello es suficiente para garantizar su ejecución.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 14 a 15</strong> La selección y descripción de la metodología o metodologías son precisas para el contexto y desarrollo del proyecto. Las
                                        actividades están descritas de forma secuencial, evidencian de forma clara como se lograrán los objetivos específicos, generarán los resultados, productos y
                                        están formuladas en el marco de la vigencia del proyecto. Todas las actividades se desarrollarán durante la vigencia {convocatoria.year} y el tiempo dispuesto
                                        para ello es suficiente para garantizar su ejecución.
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="metodologia_puntaje" value="Puntaje (Máximo 15)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="metodologia_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 15,
                                    }}
                                    value={form_evaluacion_estrategia_regional.data.metodologia_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_estrategia_regional.errors.metodologia_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿La metodología o las actividades son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_estrategia_regional.data.metodologia_requiere_comentario}
                                    />
                                    {form_evaluacion_estrategia_regional.data.metodologia_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="metodologia_comentario"
                                            value={form_evaluacion_estrategia_regional.data.metodologia_comentario}
                                            error={form_evaluacion_estrategia_regional.errors.metodologia_comentario}
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
                                <h1 className="text-2xl text-center mb-10">Metodología</h1>

                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0 a 4</strong> Se debe evidenciar que la metodología se presente de forma organizada y de manera secuencial, de acuerdo con el ciclo P-H-V-A
                                        “Planificar – Hacer – Verificar - Actuar” para alcanzar el objetivo general y cada uno de los objetivos específicos.
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="metodologia_puntaje" value="Puntaje (Máximo 4)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="metodologia_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 4,
                                    }}
                                    value={form_evaluacion_linea_68.data.metodologia_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.metodologia_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿La metodología es correcta? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.metodologia_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.metodologia_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="metodologia_comentario"
                                            value={form_evaluacion_linea_68.data.metodologia_comentario}
                                            error={form_evaluacion_linea_68.errors.metodologia_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10 border-app-300" />
                                <h1 className="text-2xl text-center mb-10">Actividades</h1>

                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0 a {(16 / proyecto.cantidad_objetivos).toFixed(2)}</strong> Se debe evidenciar la descripción de las actividades de manera secuencial para
                                        alcanzar el logro de cada uno de los objetivos específicos y deben ser coherentes con los productos a las cuales están asociadas; una misma actividad podrá ser
                                        necesaria para generar diferentes productos de un mismo proyecto.
                                    </li>
                                </ul>

                                {[...Array(proyecto.cantidad_objetivos)].map((_, j) => (
                                    <>
                                        {j == 0 ? (
                                            <>
                                                <h1 className="text-black">Actividades del primer objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="actividades_primer_obj_puntaje" value="Puntaje (Máximo {(16 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="actividades_primer_obj_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (16 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.actividades_primer_obj_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.actividades_primer_obj_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿Las actividades del primer objetivo específico son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.actividades_primer_obj_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.actividades_primer_obj_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="actividades_primer_obj_comentario"
                                                            value={form_evaluacion_linea_68.data.actividades_primer_obj_comentario}
                                                            error={form_evaluacion_linea_68.errors.actividades_primer_obj_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : j == 1 ? (
                                            <>
                                                <hr className="mt-10 mb-10 border-app-300" />

                                                <h1 className="text-black">Actividades del segundo objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="actividades_segundo_obj_puntaje" value="Puntaje (Máximo {(16 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="actividades_segundo_obj_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (16 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.actividades_segundo_obj_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.actividades_segundo_obj_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿Las actividades del segundo objetivo específico son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.actividades_segundo_obj_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.actividades_segundo_obj_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="actividades_segundo_obj_comentario"
                                                            value={form_evaluacion_linea_68.data.actividades_segundo_obj_comentario}
                                                            error={form_evaluacion_linea_68.errors.actividades_segundo_obj_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : j == 2 ? (
                                            <>
                                                <hr className="mt-10 mb-10 border-app-300" />

                                                <h1 className="text-black">Actividades del tercer objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="actividades_tercer_obj_puntaje" value="Puntaje (Máximo {(16 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="actividades_tercer_obj_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (16 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.actividades_tercer_obj_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.actividades_tercer_obj_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿Las actividades del tercer objetivo específico son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.actividades_tercer_obj_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.actividades_tercer_obj_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="actividades_tercer_obj_comentario"
                                                            value={form_evaluacion_linea_68.data.actividades_tercer_obj_comentario}
                                                            error={form_evaluacion_linea_68.errors.actividades_tercer_obj_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : j == 3 ? (
                                            <>
                                                <hr className="mt-10 mb-10 border-app-300" />

                                                <h1 className="text-black">Actividades del cuarto objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="actividades_cuarto_obj_puntaje" value="Puntaje (Máximo {(16 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="actividades_cuarto_obj_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (16 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.actividades_cuarto_obj_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.actividades_cuarto_obj_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿Las actividades del cuarto objetivo específico son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.actividades_cuarto_obj_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.actividades_cuarto_obj_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="actividades_cuarto_obj_comentario"
                                                            value={form_evaluacion_linea_68.data.actividades_cuarto_obj_comentario}
                                                            error={form_evaluacion_linea_68.errors.actividades_cuarto_obj_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : null}
                                    </>
                                ))}
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
                                    <p>¿La metodología y las actividades están definidas correctamente? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_70.data.metodologia_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_70.data.metodologia_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="metodologia_comentario"
                                            value={form_evaluacion_linea_70.data.metodologia_comentario}
                                            error={form_evaluacion_linea_70.errors.metodologia_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>

                            <AlertMui>
                                <div className="mt-10">
                                    <p>¿Los municipios y la descripción del beneficio son correctos? Por favor seleccione si Cumple o No cumple</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_70.data.municipios_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_70.data.municipios_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="municipios_comentario"
                                            value={form_evaluacion_linea_70.data.municipios_comentario}
                                            error={form_evaluacion_linea_70.errors.municipios_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>

                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿La información relacionada con las instituciones es correcta? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_70.data.instituciones_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_70.data.instituciones_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="instituciones_comentario"
                                            value={form_evaluacion_linea_70.data.instituciones_comentario}
                                            error={form_evaluacion_linea_70.errors.instituciones_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>

                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿La información es correcta? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_70.data.proyectos_macro_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_70.data.proyectos_macro_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="proyectos_macro_comentario"
                                            value={form_evaluacion_linea_70.data.proyectos_macro_comentario}
                                            error={form_evaluacion_linea_70.errors.proyectos_macro_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea_70.processing} className="ml-auto" type="submit">
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
                        <form onSubmit={submiEvaluacionLinea69}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿La metodología y las actividades están definidas correctamente? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea69.data.metodologia_requiere_comentario}
                                    />
                                    {form_evaluacion_linea69.data.metodologia_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="metodologia_comentario"
                                            value={form_evaluacion_linea69.data.metodologia_comentario}
                                            error={form_evaluacion_linea69.errors.metodologia_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>

                            <AlertMui>
                                <div className="mt-10">
                                    <p>¿Los municipios y la descripción del beneficio son correctos? Por favor seleccione si Cumple o No cumple</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea69.data.municipios_requiere_comentario}
                                    />
                                    {form_evaluacion_linea69.data.municipios_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="municipios_comentario"
                                            value={form_evaluacion_linea69.data.municipios_comentario}
                                            error={form_evaluacion_linea69.errors.municipios_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea69.processing} className="ml-auto" type="submit">
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
