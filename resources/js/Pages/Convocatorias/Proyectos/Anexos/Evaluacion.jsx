import AlertMui from '@/Components/Alert'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'
import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form_evaluacion_estrategia_regional = useForm({
        anexos_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.anexos_comentario
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.anexos_comentario
            : null,
        anexos_requiere_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.anexos_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.anexos_comentario == null
                ? true
                : false
            : null,
    })
    const submitEvaluacionEstrategiaRegional = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_estrategia_regional.put(route('convocatorias.evaluaciones.anexos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_70 = useForm({
        anexos_comentario: evaluacion.evaluacion_proyecto_linea70?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea70?.anexos_comentario : '',
        anexos_requiere_comentario: evaluacion.evaluacion_proyecto_linea70?.anexos_comentario == null ? true : false,
    })
    const submitEvaluacionLinea70 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_70.put(route('convocatorias.evaluaciones.anexos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_69 = useForm({
        anexos_comentario: evaluacion.evaluacion_proyecto_linea69?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea69?.anexos_comentario : '',
        anexos_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.anexos_comentario == null ? true : false,
    })
    const submitEvaluacionLinea69 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_69.put(route('convocatorias.evaluaciones.anexos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_68 = useForm({
        anexos_comentario: evaluacion.evaluacion_proyecto_linea68?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea68?.anexos_comentario : '',
        anexos_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.anexos_comentario == null ? true : false,

        video_comentario: evaluacion.evaluacion_proyecto_linea68?.video_comentario ? evaluacion.evaluacion_proyecto_linea68?.video_comentario : '',
        video_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.video_comentario == null ? true : false,

        especificaciones_area_comentario: evaluacion.evaluacion_proyecto_linea68?.especificaciones_area_comentario ? evaluacion.evaluacion_proyecto_linea68?.especificaciones_area_comentario : '',
        especificaciones_area_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.especificaciones_area_comentario == null ? true : false,
    })
    const submitEvaluacionLinea68 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_68.put(route('convocatorias.evaluaciones.anexos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            {proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 ? (
                <>
                    <hr className="mt-10 mb-10" />
                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>
                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionEstrategiaRegional}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿Los anexos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_estrategia_regional.data.anexos_requiere_comentario}
                                    />
                                    {form_evaluacion_estrategia_regional.data.anexos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="anexos_comentario"
                                            value={form_evaluacion_estrategia_regional.data.anexos_comentario}
                                            error={form_evaluacion_estrategia_regional.errors.anexos_comentario}
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
            ) : proyecto.codigo_linea_programatica == 68 ? (
                <>
                    <hr className="mt-10 mb-10" />
                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>
                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea68}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿Los anexos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.anexos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.anexos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="anexos_comentario"
                                            value={form_evaluacion_linea_68.data.anexos_comentario}
                                            error={form_evaluacion_linea_68.errors.anexos_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <div className="mt-4">
                                    <p>¿El video es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.video_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.video_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="video_comentario"
                                            value={form_evaluacion_linea_68.data.video_comentario}
                                            error={form_evaluacion_linea_68.errors.video_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <div className="mt-4">
                                    <p>¿Las especificaciones del área son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.especificaciones_area_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.especificaciones_area_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="especificaciones_area_comentario"
                                            value={form_evaluacion_linea_68.data.especificaciones_area_comentario}
                                            error={form_evaluacion_linea_68.errors.especificaciones_area_comentario}
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
            ) : proyecto.codigo_linea_programatica == 70 ? (
                <>
                    <hr className="mt-10 mb-10" />
                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>
                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea70}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿Los anexos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_70.data.anexos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_70.data.anexos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="anexos_comentario"
                                            value={form_evaluacion_linea_70.data.anexos_comentario}
                                            error={form_evaluacion_linea_70.errors.anexos_comentario}
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
            ) : proyecto.codigo_linea_programatica == 69 ? (
                <>
                    <hr className="mt-10 mb-10" />
                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>
                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea69}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿Los anexos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_69.data.anexos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_69.data.anexos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="anexos_comentario"
                                            value={form_evaluacion_linea_69.data.anexos_comentario}
                                            error={form_evaluacion_linea_69.errors.anexos_comentario}
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
