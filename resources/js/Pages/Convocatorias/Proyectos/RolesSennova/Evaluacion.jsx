import AlertMui from '@/Components/Alert'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion, proyecto_rol_evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form = useForm({
        comentario: proyecto_rol_evaluacion ? proyecto_rol_evaluacion.comentario : '',
        correcto: proyecto_rol_evaluacion?.correcto == false || proyecto_rol_evaluacion?.correcto == true ? true : false,
    })
    const submit = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form.put(route('convocatorias.evaluaciones.proyecto-rol-sennova.update', [convocatoria.id, evaluacion.id, proyectoRolSennova.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            <form className="mt-10" on:Submit={submit}>
                <AlertMui>
                    <div className="mt-4">
                        <p>¿El rol es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <SwitchMui
                            onMessage="Cumple"
                            offMessage="No cumple"
                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                            checked={form.data.correcto}
                        />
                        {form.data.correcto == false && (
                            <Textarea
                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                label="Comentario"
                                className="mt-4"
                                id="comentario"
                                value={form.data.comentario}
                                error={form.errors.comentario}
                                required
                            />
                        )}
                    </div>
                </AlertMui>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                        <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                            Evaluar
                        </PrimaryButton>
                    ) : (
                        <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                    )}
                </div>
            </form>
        </>
    )
}

export default Evaluacion
