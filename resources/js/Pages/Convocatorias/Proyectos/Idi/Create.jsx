import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useForm } from '@inertiajs/react'
import { route, checkRole, monthDiff } from '@/Utils'

import InputError from '@/Components/InputError'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import Textarea from '@/Components/Textarea'
import Switch from '@/Components/Switch'
import Autocomplete from '@/Components/Autocomplete'
import TextInput from '@/Components/TextInput'
import DatePicker from '@/Components/DatePicker'

const Create = ({ auth, convocatoria, centrosFormacion, areasConocimiento, subareasConocimiento, disciplinasSubareaConocimiento, lineasInvestigacion, lineasProgramaticas, actividadesEconomicas, tematicasEstrategicas, redesConocimiento, allowedToCreate, gruposInvestigacion, lineasInvestigacionEni, areasTematicasEni, roles }) => {
    const [authUser, setAuthUser] = useState(auth.user)
    const [isSuperAdmin, setIsSuperAdmin] = useState(checkRole(authUser, [1]))

    const { data, setData, post, processing, errors, reset } = useForm({
        centro_formacion_id: null,
        linea_investigacion_id: null,
        area_conocimiento_id: null,
        subarea_conocimiento_id: null,
        disciplina_subarea_conocimiento_id: null,
        tematica_estrategica_id: null,
        red_conocimiento_id: null,
        linea_programatica_id: null,
        actividad_economica_id: null,
        titulo: '',
        fecha_inicio: null,
        fecha_finalizacion: null,
        max_meses_ejecucion: 0,
        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
        articulacion_eni: false,
        proyecto_investigacion_pedagogica: false,
        justificacion_proyecto_investigacion_pedagogica: '',

        grupo_investigacion_eni_id: null,
        linea_investigacion_eni_id: null,
        area_tematica_eni_id: null,
    })

    const [arraySubareasConocimiento, setArraySubareasConocimiento] = useState([])
    const [arrayDisciplinasSubareaConocimiento, setArrayDisciplinasSubareaConocimiento] = useState([])
    const [arrayLineasInvestigacion, setArrayLineasInvestigacion] = useState([])

    useEffect(() => {
        setAuthUser(auth.user)
        setIsSuperAdmin(checkRole(authUser, [1]))
    }, [authUser])

    useEffect(() => {
        setArraySubareasConocimiento(subareasConocimiento.filter((obj) => obj.area_conocimiento_id === data.area_conocimiento_id?.value))
    }, [data.area_conocimiento_id])

    useEffect(() => {
        setArrayDisciplinasSubareaConocimiento(disciplinasSubareaConocimiento.filter((obj) => obj.subarea_conocimiento_id === data.subarea_conocimiento_id?.value))
    }, [data.subarea_conocimiento_id])

    useEffect(() => {
        setArrayLineasInvestigacion(lineasInvestigacion.filter((obj) => obj.centro_formacion_id === data.linea_investigacion_id?.value))
    }, [data.linea_investigacion_id])

    useEffect(() => {
        if (data.fecha_inicio && data.fecha_finalizacion) {
            setData((prevForm) => ({
                ...prevForm,
                max_meses_ejecucion: monthDiff(data.fecha_inicio, data.fecha_finalizacion),
            }))
        }
    }, [data.fecha_inicio, data.fecha_finalizacion])

    const submit = () => {
        if (allowedToCreate) {
            post(route('convocatorias.idi.store', [convocatoria.id]))
        }
    }

    return (
        <AuthenticatedLayout user={authUser} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear proyecto de I+D+i</h2>}>
            <header className="pt-[8rem]" slot="header">
                <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
                    <div>
                        <h1>
                            <a href={route('convocatorias.idi.index', [convocatoria.id])} className="text-app-400 hover:text-app-600">
                                I+D+i
                            </a>
                            <span className="text-app-400 font-medium">/</span>
                            Crear
                        </h1>
                    </div>
                </div>
            </header>

            <form onSubmit={submit}>
                <fieldset className="p-8 divide-y">
                    <div className="py-24">
                        <Label required labelFor="titulo" className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)" />
                        <Textarea id="titulo" className={`bg-transparent block border-0 mt-1 outline-none text-4xl text-center w-full`} value={data.titulo} onChange={(e) => setData('titulo', e.target.value)} required />
                    </div>

                    <div className="py-24">
                        <p className="text-center">Fecha de ejecución</p>
                        <div className={`mt-4 flex`}>
                            <Label required labelFor="fecha_inicio" error={errors.fecha_inicio} value="Fecha de inicio" />
                            <div className="ml-4">
                                <DatePicker variant="outlined" id="fecha_inicio" name="fecha_inicio" value={data.fecha_inicio} className="p-4 w-full" onChange={(e) => setData({ ...data, fecha_inicio: e.target.value })} required />
                                <InputError classes="text-center" message={errors.fecha_inicio} />
                            </div>
                        </div>
                        <div className={`mt-4 flex`}>
                            <Label required labelFor="fecha_finalizacion" error={errors.fecha_finalizacion} value="Fecha de finalización" />
                            <div className="ml-4">
                                <DatePicker variant="outlined" id="fecha_finalizacion" name="fecha_finalizacion" value={data.fecha_finalizacion} className="p-4 w-full" onChange={(e) => setData({ ...data, fecha_finalizacion: e.target.value })} required />
                                <InputError classes="text-center" message={errors.fecha_finalizacion} />
                            </div>
                        </div>
                    </div>

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="centro_formacion_id" className="mb-4" value="Centro de formación" />
                                <small> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </small>
                            </div>
                            <div>
                                <Autocomplete id="centro_formacion_id" value={data.centro_formacion_id} onChange={(event, newValue) => setData('centro_formacion_id', newValue)} options={centrosFormacion} error={errors.centro_formacion_id} autoComplete={false} required />
                            </div>
                        </div>
                    </div>

                    {data.centro_formacion_id && (
                        <div className="py-24">
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required labelFor="linea_investigacion_id" className="mb-4" value="Línea de investigación" />
                                </div>
                                <div>
                                    <Autocomplete id="linea_investigacion_id" value={data.linea_investigacion_id} onChange={(event, newValue) => setData('linea_investigacion_id', newValue)} options={arrayLineasInvestigacion} error={errors.linea_investigacion_id} autoComplete={false} required />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="linea_programatica_id" className="mb-4" value="Código dependencia presupuestal (SIIF)" />
                            </div>
                            <div>
                                <Autocomplete id="linea_programatica_id" value={data.linea_programatica_id} onChange={(event, newValue) => setData('linea_programatica_id', newValue)} options={lineasProgramaticas} error={errors.linea_programatica_id} autoComplete={false} required />
                            </div>
                        </div>
                    </div>

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="red_conocimiento_id" className="mb-4" value="Red de conocimiento sectorial" />
                            </div>
                            <div>
                                <Autocomplete id="red_conocimiento_id" value={data.red_conocimiento_id} onChange={(event, newValue) => setData('red_conocimiento_id', newValue)} options={redesConocimiento} error={errors.red_conocimiento_id} autoComplete={false} required />
                            </div>
                        </div>
                    </div>

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="area_conocimiento_id" className="mb-4" value="Área de conocimiento" />
                            </div>
                            <div>
                                <Autocomplete id="area_conocimiento_id" value={data.area_conocimiento_id} onChange={(event, newValue) => setData('area_conocimiento_id', newValue)} options={areasConocimiento} error={errors.area_conocimiento_id} autoComplete={false} required />
                            </div>
                        </div>
                    </div>

                    {data.area_conocimiento_id && (
                        <div className="py-24">
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required labelFor="subarea_conocimiento_id" className="mb-4" value="Subárea de conocimiento" />
                                </div>
                                <div>
                                    <Autocomplete id="subarea_conocimiento_id" value={data.subarea_conocimiento_id} onChange={(event, newValue) => setData('subarea_conocimiento_id', newValue)} options={arraySubareasConocimiento} error={errors.subarea_conocimiento_id} autoComplete={false} required />
                                </div>
                            </div>
                        </div>
                    )}

                    {data.subarea_conocimiento_id && (
                        <div className="py-24">
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required labelFor="disciplina_subarea_conocimiento_id" className="mb-4" value="Disciplina de la subárea de conocimiento" />
                                </div>
                                <div>
                                    <Autocomplete id="disciplina_subarea_conocimiento_id" value={data.disciplina_subarea_conocimiento_id} onChange={(event, newValue) => setData('disciplina_subarea_conocimiento_id', newValue)} options={arrayDisciplinasSubareaConocimiento} error={errors.disciplina_subarea_conocimiento_id} autoComplete={false} required />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="actividad_economica_id" className="mb-4" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                            </div>
                            <div>
                                <Autocomplete id="actividad_economica_id" value={data.actividad_economica_id} onChange={(event, newValue) => setData('actividad_economica_id', newValue)} options={actividadesEconomicas} error={errors.actividad_economica_id} autoComplete={false} required />
                            </div>
                        </div>
                    </div>

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="tematica_estrategica_id" className="mb-4" value="Temática estratégica SENA" />
                            </div>
                            <div>
                                <Autocomplete id="tematica_estrategica_id" value={data.tematica_estrategica_id} onChange={(event, newValue) => setData('tematica_estrategica_id', newValue)} options={tematicasEstrategicas} error={errors.tematica_estrategica_id} autoComplete={false} required />
                            </div>
                        </div>
                    </div>

                    {(data.linea_programatica_id?.value === 1 || data.linea_programatica_id?.value === 3) && (
                        <div className="py-24">
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required labelFor="proyecto_investigacion_pedagogica" className="mb-4" value="¿El proyecto es de investigación pedagógica?" />
                                </div>
                                <div>
                                    <Switch id="proyecto_investigacion_pedagogica" checked={data.proyecto_investigacion_pedagogica} onChange={(e) => setData('proyecto_investigacion_pedagogica', e.target.checked)} />
                                </div>
                            </div>

                            {data.proyecto_investigacion_pedagogica && convocatoria.campos_convocatoria.find((element) => element.campo === 'justificacion_proyecto_investigacion_pedagogica').convocatoriaId === convocatoria.id && (
                                <div className="mt-44 ml-8 grid grid-cols-2">
                                    <div>
                                        <Label required labelFor="justificacion_proyecto_investigacion_pedagogica" className="mb-4" value="Justificación" />
                                    </div>
                                    <div>
                                        <Textarea maxLength="40000" id="justificacion_proyecto_investigacion_pedagogica" value={data.justificacion_proyecto_investigacion_pedagogica} onChange={(e) => setData('justificacion_proyecto_investigacion_pedagogica', e.target.value)} required={data.proyecto_investigacion_pedagogica ? 'required' : undefined} />
                                    </div>
                                </div>
                            )}

                            <div className="ml-8 grid grid-cols-2 mt-24">
                                <div>
                                    <Label required labelFor="articulacion_eni" className="mb-4" value="¿El proyecto está articulado con la ENI?" />
                                </div>
                                <div>
                                    <Switch id="articulacion_eni" checked={data.articulacion_eni} onChange={(e) => setData('articulacion_eni', e.target.checked)} />
                                </div>
                            </div>

                            <div className="ml-8 grid grid-cols-2 mt-24">
                                <div>
                                    <Label required labelFor="grupo_investigacion_eni_id" className="mb-4" value="Grupo de investigación ENI" />
                                </div>
                                <div>
                                    <Autocomplete id="grupo_investigacion_eni_id" value={data.grupo_investigacion_eni_id} onChange={(event, newValue) => setData('grupo_investigacion_eni_id', newValue)} options={gruposInvestigacion} error={errors.grupo_investigacion_eni_id} autoComplete={false} placeholder="Seleccione un grupo de investigación" required />
                                </div>
                            </div>

                            <div className="ml-8 grid grid-cols-2 mt-24">
                                <div>
                                    <Label required labelFor="linea_investigacion_eni_id" className="mb-4" value="Líneas de investigación ENI" />
                                </div>
                                <div>
                                    <Autocomplete id="linea_investigacion_eni_id" selectedValue={data.linea_investigacion_eni_id || []} onChange={(event, newValue) => setData('linea_investigacion_eni_id', newValue)} options={lineasInvestigacionEni} error={errors.linea_investigacion_eni_id} placeholder="Seleccione una o varias opciones" required />
                                </div>
                            </div>

                            <div className="ml-8 grid grid-cols-2 mt-24">
                                <div>
                                    <Label required labelFor="area_tematica_eni_id" className="mb-4" value="Áreas temáticas ENI" />
                                </div>
                                <div>
                                    <Autocomplete id="area_tematica_eni_id" selectedValue={data.area_tematica_eni_id || []} onChange={(event, newValue) => setData('linea_investigacion_eni_id', newValue)} options={areasTematicasEni} error={errors.area_tematica_eni_id} placeholder="Seleccione una o varias opciones" required />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="py-24">
                        <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                    </div>

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="rol_sennova" className="mb-4" value="Rol SENNOVA" />
                            </div>
                            <div>
                                <Autocomplete id="rol_sennova" value={data.rol_sennova} onChange={(event, newValue) => setData('rol_sennova', newValue)} options={roles} autoComplete={false} placeholder="Seleccione un rol SENNOVA" required />
                            </div>
                        </div>
                    </div>

                    {data.fecha_inicio && data.fecha_finalizacion && (
                        <div className="py-24">
                            <div className="grid grid-cols-2">
                                <div>
                                    <Label required labelFor="cantidad_meses" className="mb-4" value="Número de meses de vinculación al proyecto" />
                                </div>
                                <div>
                                    <TextInput type="number" id="cantidad_meses" step="0.1" min="1" max={monthDiff(data.fecha_inicio, data.fecha_finalizacion)} className="mt-1" value={data.cantidad_meses} onChange={(e) => setData('cantidad_meses', e.target.value)} placeholder="Número de meses de vinculación" required />
                                    {monthDiff(data.fecha_inicio, data.fecha_finalizacion) && (
                                        <small>
                                            El proyecto se ejecutará entre {data.fecha_inicio} y {data.fecha_finalizacion}, por lo tanto el número de meses máximo es: {monthDiff(data.fecha_inicio, data.fecha_finalizacion)}
                                            <br />
                                            <span className="flex">
                                                Uitlice las flechas{' '}
                                                <span className="flex flex-col relative top-[-0.4rem]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                                    </svg>

                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                    </svg>
                                                </span>{' '}
                                                que aparecen dentro del campo para ajustar los decimales.
                                            </span>
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label required labelFor="cantidad_horas" className="mb-4" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                            </div>
                            <div>
                                <TextInput type="number" id="cantidad_horas" step="1" min="1" max={data.rol_sennova?.maxHoras} className="mt-1" value={data.cantidad_horas} onChange={(e) => setData('cantidad_horas', e.target.value)} placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto" required />
                                <small>Horas máximas permitidas para este rol: {data.rol_sennova?.maxHoras ? data.rol_sennova?.maxHoras : 0}.</small>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-14 px-8 py-4">
                        {allowedToCreate && (
                            <PrimaryButton type="submit" className="ml-auto">
                                Continuar
                            </PrimaryButton>
                        )}
                    </div>
                </fieldset>
            </form>
        </AuthenticatedLayout>
    )
}

export default Create
