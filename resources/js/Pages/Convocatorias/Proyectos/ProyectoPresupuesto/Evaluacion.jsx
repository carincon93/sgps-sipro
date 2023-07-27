import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion, proyecto_presupuesto_evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form = useForm({
        comentario: proyecto_presupuesto_evaluacion ? proyecto_presupuesto_evaluacion.comentario : '',
        correcto: proyecto_presupuesto_evaluacion?.correcto == false || proyecto_presupuesto_evaluacion?.correcto == true ? true : false,
    })
    const submit = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form.put(route('convocatorias.evaluaciones.presupuesto.update', [convocatoria.id, evaluacion.id, proyectoPresupuesto.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            <form className="mt-10" onSubmit={submit} id="form-proyecto-presupuesto">
                <AlertMui>
                    <div className="mt-4">
                        <p>¿El rubro presupuestal es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <SwitchMui
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
