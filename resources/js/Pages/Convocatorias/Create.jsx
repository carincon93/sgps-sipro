import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Label from '@/Components/Label'
import InputError from '@/Components/InputError'
import PrimaryButton from '@/Components/PrimaryButton'
import Textarea from '@/Components/Textarea'
import SwitchMui from '@/Components/Switch'
import MultipleSelect from '@/Components/SelectMultiple'
import Autocomplete from '@/Components/Autocomplete'
import { useForm } from '@inertiajs/react'
import { route, checkRole } from '@/Utils'
import DatePicker from '@/Components/DatePicker'

const CreateConvocatoria = ({ auth, convocatorias, lineasProgramaticas, tiposConvocatoria }) => {
    // Validar si el usuario autenticado es SuperAdmin
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const { data, setData, post, processing, errors, reset } = useForm({
        descripcion: '',
        esta_activa: false,
        lineas_programaticas_activas: null,
        visible: false,
        fecha_finalizacion_fase: '',
        hora_finalizacion_fase: '',
        convocatoria_id: null,
        tipo_convocatoria: null,
    })

    const submit = (e) => {
        e.preventDefault()
        if (isSuperAdmin) {
            post(route('convocatorias.store'))
        }
    }

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}>
            <header className="pt-[8rem]" slot="header">
                <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
                    <div>
                        <h1>
                            <a href={route('convocatorias.index')} className="text-app-400 hover:text-app-600">
                                Convocatorias
                            </a>
                            <span className="text-app-400 font-medium">/</span>
                            Crear
                        </h1>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-3">
                <div>
                    <h1 className="font-black text-4xl sticky top-0 uppercase">Nueva convocatoria</h1>
                </div>
                <div className="bg-white rounded shadow col-span-2">
                    <form onSubmit={submit}>
                        <fieldset className="p-8" disabled={isSuperAdmin ? undefined : true}>
                            <div className="mt-4 mb-20">
                                {data.fase && <p className="text-center">Fecha de finalización de la fase: {data.fase.label.toLowerCase()}</p>}
                                <div className="mt-4">
                                    <Label required labelFor="fecha_finalizacion_fase" value="Fecha límite de la fase de formulación" />
                                    <DatePicker variant="outlined" id="fecha_finalizacion_fase" className="w-full" value={data.fecha_finalizacion_fase} onChange={(e) => setData('fecha_finalizacion_fase', e.target.value)} required />
                                </div>
                            </div>
                            {errors.fecha_finalizacion_fase && <InputError error={errors.fecha_finalizacion_fase} />}

                            <div className="mt-4 mb-20">
                                <div className="mt-4">
                                    <Label required labelFor="hora_finalizacion_fase" value="Hora límite de la fase de formulación" />
                                    <input id="hora_finalizacion_fase" type="time" step="1" className="mt-1 p-2 border rounded border-gray-300" value={data.hora_finalizacion_fase} onChange={(e) => setData('hora_finalizacion_fase', e.target.value)} required />
                                    {errors.hora_finalizacion_fase && <InputError message={errors.hora_finalizacion_fase} />}
                                </div>
                            </div>

                            <div className="mt-44 mb-20 grid grid-cols-2">
                                <div>
                                    <Label required className="mb-4" labelFor="tipo_convocatoria" value="Seleccione un tipo de convocatoria (Proyectos de convocatoria para habilitar la formulación de proyectos de todas las líneas - Proyectos demo I+D+i para permitir el ejercicio de formulación)" />
                                </div>
                                <div>
                                    <Autocomplete id="tipo_convocatoria" items={tiposConvocatoria} value={data.tipo_convocatoria} onChange={(e) => setData('tipo_convocatoria', e.target.value)} error={errors.tipo_convocatoria} autoComplete={false} placeholder="Seleccione un tipo de convocatoria" required />
                                </div>
                            </div>

                            <div className="mt-44 mb-20 grid grid-cols-2">
                                <div>
                                    <Label className="mb-4" labelFor="fase" value="Fase" />
                                </div>
                                <div>Formulación</div>
                            </div>

                            <div className="mt-44 mb-20 grid grid-cols-2">
                                <div>
                                    <Label required className="mb-4" labelFor="convocatoria_id" value="Seleccione una convocatoria de la cual desee copiar los presupuestos y roles SENNOVA" />
                                </div>
                                <div>
                                    <Autocomplete id="convocatoria_id" items={convocatorias} value={data.convocatoria_id} onChange={(e) => setData('convocatoria_id', e.target.value)} error={errors.convocatoria_id} autoComplete={false} placeholder="Seleccione una convocatoria" required />
                                </div>
                            </div>

                            <div className="mt-8">
                                <Textarea label="Descripción" maxlength="40000" id="descripcion" error={errors.descripcion} value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} required />
                            </div>

                            <div className="mt-10 mb-20">
                                <Label required labelFor="esta_activa" value="¿Desea activar esta convocatoria? (Si la opción está habilitada permite a los usuarios formular proyectos. Tenga en cuenta que solo puede activar una convocatoria por tipo --Proyectos de convocatoria - Proyectos de ejecicio DEMO)" className="inline-block mb-4" />
                                <br />
                                <SwitchMui checked={data.esta_activa} onChange={(e) => setData('esta_activa', e.target.checked)} />
                                {errors.esta_activa && <InputError message={errors.esta_activa} />}
                            </div>

                            <div className="mt-10 mb-20">
                                <Label required labelFor="visible" value="Defina la visibilidad de la convocatoria. (Si la opción está habilitada permite a los usuarios visualizar la convocatoria)" className="inline-block mb-4" />
                                <br />
                                <SwitchMui checked={data.visible} onChange={(e) => setData('visible', e.target.checked)} onMessage="Visible" offMessage="Oculta" />
                                {errors.visible && <InputError message={errors.visible} />}
                            </div>

                            <hr />

                            <div>
                                <div className="mt-10 mb-20">
                                    <Label required labelFor="lineas_programaticas_activas" className="mb-4" value="Seleccione las líneas programáticas las cuales quiere activar" />
                                    <MultipleSelect id="lineas_programaticas_activas" selectedValues={data.lineas_programaticas_activas} items={lineasProgramaticas} error={errors.lineas_programaticas_activas} placeholder="Seleccione las líneas programáticas" required />
                                </div>
                            </div>
                        </fieldset>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {isSuperAdmin && (
                                <PrimaryButton disabled={processing} className="ml-auto" type="submit">
                                    Crear convocatoria
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default CreateConvocatoria
