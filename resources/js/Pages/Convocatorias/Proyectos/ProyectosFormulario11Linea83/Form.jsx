import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { monthDiff } from '@/Utils'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useEffect } from 'react'

const Form = ({ auth_user, method = '', convocatoria, proyecto_formulario_11_linea_83, centros_formacion, roles_sennova, evaluacion, allowed_to_create, ...props }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form = useForm({
        centro_formacion_id: proyecto_formulario_11_linea_83?.proyecto.centro_formacion_id ?? '',
        fecha_inicio: proyecto_formulario_11_linea_83?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_formulario_11_linea_83?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_formulario_11_linea_83?.max_meses_ejecucion ?? '',

        titulo: proyecto_formulario_11_linea_83?.titulo,
        resumen: proyecto_formulario_11_linea_83?.resumen,
        antecedentes: proyecto_formulario_11_linea_83?.antecedentes,
        retos_prioridades: proyecto_formulario_11_linea_83?.retos_prioridades,
        contribucion_agenda_regional_competitividad: proyecto_formulario_11_linea_83?.contribucion_agenda_regional_competitividad,
        aportes_conpes: proyecto_formulario_11_linea_83?.aportes_conpes,
        estado_actual_ecosistema_ctel: proyecto_formulario_11_linea_83?.estado_actual_ecosistema_ctel,
        logros_implementacion_ctel: proyecto_formulario_11_linea_83?.logros_implementacion_ctel,
        justificacion_pertinencia_territorio: proyecto_formulario_11_linea_83?.justificacion_pertinencia_territorio,
        marco_conceptual: proyecto_formulario_11_linea_83?.marco_conceptual,
        bibliografia: proyecto_formulario_11_linea_83?.bibliografia,

        aporta_fortalecimiento_cadenas_agricolas: proyecto_formulario_11_linea_83?.aporta_fortalecimiento_cadenas_agricolas,
        estrategias_generacion_electrica: proyecto_formulario_11_linea_83?.estrategias_generacion_electrica,
        estrategias_fortalecimiento_micronegocios: proyecto_formulario_11_linea_83?.estrategias_fortalecimiento_micronegocios,
        estrategias_articulacion_campesinos: proyecto_formulario_11_linea_83?.estrategias_articulacion_campesinos,

        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.proyectos-formulario-11-linea-83.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_formulario_11_linea_83.proyecto.allowed.to_update
            ? form.put(route('convocatorias.proyectos-formulario-11-linea-83.update', [convocatoria.id, proyecto_formulario_11_linea_83.id]), {
                  preserveScroll: true,
              })
            : null
    }

    useEffect(() => {
        form.setData('max_meses_ejecucion', monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion))
    }, [form.data.fecha_inicio && form.data.fecha_finalizacion])

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos-formulario-11-linea-83.updateLongColumn', [convocatoria.id, proyecto_formulario_11_linea_83?.proyecto?.id, column]),
                    { [column]: data ? data : form.data[column], is_array: Array.isArray(form.data[column]) },
                    {
                        onError: (resp) => console.log(resp),
                        onFinish: () => console.log('Request finished'),
                        preserveScroll: true,
                    },
                )
            } catch (error) {
                console.error('An error occurred:', error)
            }
        }
    }

    return (
        <form onSubmit={submit}>
            <Grid container rowSpacing={20}>
                <Grid item md={12}>
                    <div className="flex justify-around items-center bg-indigo-50 shadow rounded p-10">
                        <figure>
                            <img src="/images/projects.png" alt="" width={350} />
                        </figure>
                        <h1 className="text-2xl">
                            {method == 'PUT' ? (
                                <>
                                    <strong>{proyecto_formulario_11_linea_83.titulo}</strong>
                                    <br />
                                    {proyecto_formulario_11_linea_83.proyecto.codigo}
                                </>
                            ) : (
                                <>Asistencia técnica o extensionismo tecnológico - Línea 83</>
                            )}
                        </h1>
                    </div>
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        labelFor="titulo"
                        className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full"
                        value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)"
                    />
                    <Textarea
                        id="titulo"
                        className={`bg-transparent block border-0 mt-1 outline-none text-4xl text-center w-full`}
                        value={form.data.titulo}
                        onChange={(e) => form.setData('titulo', e.target.value)}
                        disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                        required
                        onBlur={() => syncColumnLong('titulo', form)}
                    />
                </Grid>

                {method == 'PUT' && (
                    <>
                        <Grid item md={6}>
                            <Label required labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                        </Grid>
                        <Grid item md={6}>
                            Asistencia técnica o extensionismo tecnológico
                        </Grid>

                        <Grid item md={6}>
                            <Label required labelFor="centro_formacion_id" value="Centro de formación" />
                            <small>
                                <strong>Nota:</strong> El Centro de Formación relacionado es el ejecutor del proyecto
                            </small>
                        </Grid>
                        <Grid item md={6}>
                            <p className="first-letter:uppercase">{proyecto_formulario_11_linea_83?.proyecto.centro_formacion.nombre}</p>
                        </Grid>
                    </>
                )}

                <Grid item md={6}>
                    <Label required labelFor="centro_formacion_id" className="mb-4" value="Centro de formación" />
                </Grid>
                <Grid item md={6}>
                    {method == 'POST' || is_super_admin ? (
                        <Autocomplete
                            id="centro_formacion_id"
                            selectedValue={form.data.centro_formacion_id}
                            onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                            disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                            options={
                                centros_formacion ?? [{ value: proyecto_formulario_11_linea_83.proyecto.centro_formacion.id, label: proyecto_formulario_11_linea_83.proyecto.centro_formacion.nombre }]
                            }
                            error={form.errors.centro_formacion_id}
                            onBlur={() => syncColumnLong('centro_formacion_id', form)}
                            required
                        />
                    ) : (
                        <>{proyecto_formulario_11_linea_83.proyecto.centro_formacion.nombre}</>
                    )}
                    <AlertMui> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </AlertMui>
                    {is_super_admin && (
                        <AlertMui className="mt-10" severity="error">
                            <strong className="mb-4 block">Importante:</strong>
                            Recuerde que si cambia el centro de formación y el formulador ya ha cargado soportes / anexos debe cambiar la ruta tanto en el sharepoint como en la base datos. Esta debe
                            ser la ruta asociada al proyecto:
                            <strong className=" mt-4 uppercase block">
                                /Convocatoria {convocatoria.year}/{proyecto_formulario_11_linea_83?.proyecto.centro_formacion.nombre_carpeta_sharepoint}
                            </strong>
                        </AlertMui>
                    )}
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                </Grid>
                <Grid item md={6}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_inicio"
                        minDate={convocatoria.year + '-01-01'}
                        maxDate={convocatoria.year + '-12-31'}
                        name="fecha_inicio"
                        value={form.data.fecha_inicio}
                        error={form.errors.fecha_inicio}
                        className="p-4 w-full"
                        onChange={(e) => (form.setData('fecha_inicio', e.target.value), syncColumnLong('fecha_inicio', form, e.target.value))}
                        disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                        required
                    />
                </Grid>
                <Grid item md={6}>
                    <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                </Grid>
                <Grid item md={6}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_finalizacion"
                        minDate={convocatoria.year + '-01-01'}
                        maxDate={convocatoria.year + '-12-31'}
                        name="fecha_finalizacion"
                        value={form.data.fecha_finalizacion}
                        error={form.errors.fecha_finalizacion}
                        className="p-4 w-full"
                        onChange={(e) => (form.setData('fecha_finalizacion', e.target.value), syncColumnLong('fecha_finalizacion', form, e.target.value))}
                        disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                        required
                    />
                </Grid>

                {method == 'POST' && (
                    <>
                        <Grid item md={12}>
                            <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                        </Grid>

                        <Grid item md={6}>
                            <Label required labelFor="rol_sennova" value="Rol SENNOVA" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="rol_sennova"
                                selectedValue={form.data.rol_sennova}
                                onChange={(event, newValue) => form.setData('rol_sennova', newValue.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                options={roles_sennova}
                                required
                            />
                        </Grid>

                        {form.data.fecha_inicio && form.data.fecha_finalizacion && (
                            <>
                                <Grid item md={6}>
                                    <Label required labelFor="cantidad_meses" value="Número de meses de vinculación al proyecto" />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        type="number"
                                        id="cantidad_meses"
                                        inputProps={{
                                            step: 0.1,
                                            min: 1,
                                            max: monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion),
                                        }}
                                        value={form.data.cantidad_meses}
                                        onChange={(e) => form.setData('cantidad_meses', e.target.value)}
                                        disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                        label="Número de meses de vinculación"
                                        required
                                    />
                                    {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion) && (
                                        <AlertMui>
                                            El proyecto se ejecutará entre {form.data.fecha_inicio} y el {form.data.fecha_finalizacion}, por lo tanto el número de meses máximo es:{' '}
                                            {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion)}
                                        </AlertMui>
                                    )}
                                </Grid>
                            </>
                        )}

                        <Grid item md={6}>
                            <Label required labelFor="cantidad_horas" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                        </Grid>
                        <Grid item md={6}>
                            <TextInput
                                type="number"
                                id="cantidad_horas"
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                }}
                                value={form.data.cantidad_horas}
                                onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                placeholder="Número de horas semanales dedicadas"
                                required
                            />
                        </Grid>
                    </>
                )}

                {method == 'PUT' && (
                    <>
                        <Grid item md={12}>
                            <Label required labelFor="resumen" value="Resumen del proyecto" />
                            <AlertMui>
                                Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo
                                resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                            </AlertMui>

                            <Textarea
                                id="resumen"
                                error={form.errors.resumen}
                                value={form.data.resumen}
                                onChange={(e) => form.setData('resumen', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('resumen', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="antecedentes" value="Antecedentes" />
                            <AlertMui>
                                Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la
                                temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición. De igual
                                forma, relacionar los proyectos ejecutados en vigencias anteriores (incluir códigos SGPS), si el proyecto corresponde a la continuidad de proyectos SENNOVA.
                            </AlertMui>

                            <Textarea
                                id="antecedentes"
                                error={form.errors.antecedentes}
                                value={form.data.antecedentes}
                                onChange={(e) => form.setData('antecedentes', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('antecedentes', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="retos_prioridades" value="Descripción de retos y prioridades locales y regionales en los cuales ET tiene impacto" />

                            <Textarea
                                id="retos_prioridades"
                                error={form.errors.retos_prioridades}
                                value={form.data.retos_prioridades}
                                onChange={(e) => form.setData('retos_prioridades', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('retos_prioridades', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="contribucion_agenda_regional_competitividad"
                                value="Articulación y contribución de las acciones planteadas por ET en las  Agendas de la Comisión Regional de Competitividad de los Departamentoss impactados"
                            />

                            <Textarea
                                id="contribucion_agenda_regional_competitividad"
                                error={form.errors.contribucion_agenda_regional_competitividad}
                                value={form.data.contribucion_agenda_regional_competitividad}
                                onChange={(e) => form.setData('contribucion_agenda_regional_competitividad', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('contribucion_agenda_regional_competitividad', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="aportes_conpes" value="Aportes de ET a los Conpes en los cuales tiene compromisos y acciones a desarrollar" />

                            <Textarea
                                id="aportes_conpes"
                                error={form.errors.aportes_conpes}
                                value={form.data.aportes_conpes}
                                onChange={(e) => form.setData('aportes_conpes', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('aportes_conpes', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="estado_actual_ecosistema_ctel"
                                value="Describir el estado actual del Ecosistema Territorial de CTeI en el Departamento y las oportunidades que se ofrecen desde ET  para su fortalecimiento."
                            />

                            <Textarea
                                id="estado_actual_ecosistema_ctel"
                                error={form.errors.estado_actual_ecosistema_ctel}
                                value={form.data.estado_actual_ecosistema_ctel}
                                onChange={(e) => form.setData('estado_actual_ecosistema_ctel', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('estado_actual_ecosistema_ctel', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="logros_implementacion_ctel" value={`Describa los principales logros de la implementación de la línea ET en el ${convocatoria.year - 1}`} />

                            <Textarea
                                id="logros_implementacion_ctel"
                                error={form.errors.logros_implementacion_ctel}
                                value={form.data.logros_implementacion_ctel}
                                onChange={(e) => form.setData('logros_implementacion_ctel', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('logros_implementacion_ctel', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="justificacion_pertinencia_territorio" value="Justificación y pertinencia en el territorio y en el sistema de productividad regional" />

                            <Textarea
                                id="justificacion_pertinencia_territorio"
                                error={form.errors.justificacion_pertinencia_territorio}
                                value={form.data.justificacion_pertinencia_territorio}
                                onChange={(e) => form.setData('justificacion_pertinencia_territorio', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('justificacion_pertinencia_territorio', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="marco_conceptual" value="Marco conceptual y metodológico de la Lïnea de Extensionismo Tecnológico" />

                            <Textarea
                                id="marco_conceptual"
                                error={form.errors.marco_conceptual}
                                value={form.data.marco_conceptual}
                                onChange={(e) => form.setData('marco_conceptual', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('marco_conceptual', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <h1 className="text-center">EJES TRANSVERSALES {convocatoria.year}</h1>
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="aporta_fortalecimiento_cadenas_agricolas"
                                value="¿El proyecto aporta al fortaleciminto de  Proyectos de I + D + i tendientes a aumentar la producción en cadenas agrícolas priorizadas para el Derecho Humano a la Alimentación?"
                            />

                            <Textarea
                                id="aporta_fortalecimiento_cadenas_agricolas"
                                error={form.errors.aporta_fortalecimiento_cadenas_agricolas}
                                value={form.data.aporta_fortalecimiento_cadenas_agricolas}
                                onChange={(e) => form.setData('aporta_fortalecimiento_cadenas_agricolas', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('aporta_fortalecimiento_cadenas_agricolas', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="estrategias_generacion_electrica"
                                value="Plantee como las estrategias de la Línea de Extensionismo Tecnológico contribuyen al fortalecimiento de Proyectos de I + D + i tendientes generación eléctrica a partir de fuentes no convencionales de energía renovable."
                            />

                            <Textarea
                                id="estrategias_generacion_electrica"
                                error={form.errors.estrategias_generacion_electrica}
                                value={form.data.estrategias_generacion_electrica}
                                onChange={(e) => form.setData('estrategias_generacion_electrica', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('estrategias_generacion_electrica', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="estrategias_fortalecimiento_micronegocios"
                                value="Plantee como las estrategias de la Línea de Extensionismo Tecnológico contribuyen al fortalecimiento de Proyectos tendientes a aumentar los ingresos de los micronegocios de la economía popular"
                            />

                            <Textarea
                                id="estrategias_fortalecimiento_micronegocios"
                                error={form.errors.estrategias_fortalecimiento_micronegocios}
                                value={form.data.estrategias_fortalecimiento_micronegocios}
                                onChange={(e) => form.setData('estrategias_fortalecimiento_micronegocios', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('estrategias_fortalecimiento_micronegocios', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label
                                required
                                labelFor="estrategias_articulacion_campesinos"
                                value="Plantee como las estrategias de la Línea de Extensionismo Tecnológico contribuyen al fortalecimiento de Proyectos de I + D + i tendientes a generar y articular mecanismos de atención diferencial, integral e incluyente, para los campesinos, de acuerdo con sus particularidades sociales, culturales, económicas y territoriales, que faciliten el acceso a los programas de formación y demás servicios de la Entidad."
                            />

                            <Textarea
                                id="estrategias_articulacion_campesinos"
                                error={form.errors.estrategias_articulacion_campesinos}
                                value={form.data.estrategias_articulacion_campesinos}
                                onChange={(e) => form.setData('estrategias_articulacion_campesinos', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                onBlur={() => syncColumnLong('estrategias_articulacion_campesinos', form)}
                                required
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Label required labelFor="bibliografia" value="Bibliografía" />
                            <AlertMui>
                                Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).
                            </AlertMui>

                            <Textarea
                                id="bibliografia"
                                error={form.errors.bibliografia}
                                value={form.data.bibliografia}
                                onChange={(e) => form.setData('bibliografia', e.target.value)}
                                disabled={!(proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update || allowed_to_create)}
                                required
                                onBlur={() => syncColumnLong('bibliografia', form)}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {method == 'POST' || proyecto_formulario_11_linea_83?.proyecto?.allowed?.to_update ? (
                <div className="flex items-center justify-between p-4">
                    <PrimaryButton type="submit" className="ml-auto" disabled={form.processing || !form.isDirty}>
                        Guardar
                    </PrimaryButton>
                </div>
            ) : null}
        </form>
    )
}

export default Form
