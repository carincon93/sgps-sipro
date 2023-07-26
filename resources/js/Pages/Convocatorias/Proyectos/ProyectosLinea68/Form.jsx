import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { monthDiff } from '@/Utils'
import { useForm } from '@inertiajs/react'

import { Grid } from '@mui/material'
import { useEffect } from 'react'

const Form = ({
    is_super_admin,
    method = '',
    convocatoria,
    proyecto_linea_68,
    lineas_programaticas,
    tipos_proyecto_st,
    sectores_productivos,
    estados_sistema_gestion,
    programas_formacion_con_registro_calificado,
    roles_sennova,
    evaluacion,
    ...props
}) => {
    const form = useForm({
        tipo_proyecto_st_id: proyecto_linea_68?.tipo_proyecto_st_id ?? '',
        linea_programatica_id: proyecto_linea_68?.proyecto?.linea_programatica_id ?? '',
        titulo: proyecto_linea_68?.titulo ?? '',
        fecha_inicio: proyecto_linea_68?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_linea_68?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_linea_68?.max_meses_ejecucion ?? '',
        pregunta_formulacion_problema: proyecto_linea_68?.pregunta_formulacion_problema ?? '',

        programas_formacion: null,

        estado_sistema_gestion_id: proyecto_linea_68?.estado_sistema_gestion_id ?? '',
        sector_productivo: proyecto_linea_68?.sector_productivo ?? '',

        resumen: proyecto_linea_68?.resumen ?? '',
        antecedentes: proyecto_linea_68?.antecedentes ?? '',
        identificacion_problema: proyecto_linea_68?.identificacion_problema ?? '',
        justificacion_problema: proyecto_linea_68?.justificacion_problema ?? '',
        bibliografia: proyecto_linea_68?.bibliografia ?? '',
        zona_influencia: proyecto_linea_68?.zona_influencia ?? '',
        nombre_area_tecnica: proyecto_linea_68?.nombre_area_tecnica ?? '',

        resumen: proyecto_linea_68?.resumen ?? '',
        antecedentes: proyecto_linea_68?.antecedentes ?? '',
        identificacion_problema: proyecto_linea_68?.identificacion_problema ?? '',
        justificacion_problema: proyecto_linea_68?.justificacion_problema ?? '',
        bibliografia: proyecto_linea_68?.bibliografia ?? '',

        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'crear'
            ? form.post(route('convocatorias.servicios-tecnologicos.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_linea_68.proyecto.allowed.to_update
            ? form.put(route('convocatorias.servicios-tecnologicos.update', [convocatoria.id, proyecto_linea_68.id]), {
                  preserveScroll: true,
              })
            : null
    }

    useEffect(() => {
        if (form.data.fecha_inicio && form.data.fecha_finalizacion) {
            form.setData((prevForm) => ({
                ...prevForm,
                max_meses_ejecucion: monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion),
            }))
        }
    }, [form.data.fecha_inicio, form.data.fecha_finalizacion])

    return (
        <form onSubmit={submit}>
            <fieldset disabled={proyecto_linea_68?.proyecto.allowed.to_update && !is_super_admin}>
                <Grid container className="space-y-20">
                    <div className="py-24">
                        <Label
                            required
                            labelFor="titulo"
                            className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full"
                            value="Debe corresponder al contenido del proyecto y responder a los siguientes interrogantes: ¿Qué se va a hacer?, ¿Sobre qué o quiénes se hará?, ¿Cómo?, ¿Dónde se llevará a cabo? Tiene que estar escrito de manera breve y concisa. Un buen título describe con exactitud y usando el menor número posible de palabras el tema central del proyecto. Nota: las respuestas a las preguntas anteriormente formuladas no necesariamente deben responderse en mismo orden en el que aparecen. (Máximo 40 palabras)"
                        />
                        <Textarea
                            id="titulo"
                            error={form.errors.titulo}
                            value={form.data.titulo}
                            onChange={(e) => form.setData('titulo', e.target.value)}
                            required
                            disabled={evaluacion ? 'disabled' : undefined}
                        />
                    </div>

                    <Grid item md={6}>
                        <Label required labelFor="fecha_inicio" error={form.errors.fecha_inicio} value="Fecha de inicio" />
                    </Grid>
                    <Grid item md={6}>
                        <DatePicker
                            variant="outlined"
                            id="fecha_inicio"
                            name="fecha_inicio"
                            value={form.data.fecha_inicio}
                            className="p-4 w-full"
                            onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Label required labelFor="fecha_finalizacion" error={form.errors.fecha_finalizacion} value="Fecha de finalización" />
                    </Grid>
                    <Grid item md={6}>
                        <DatePicker
                            variant="outlined"
                            id="fecha_finalizacion"
                            name="fecha_finalizacion"
                            value={form.data.fecha_finalizacion}
                            className="p-4 w-full"
                            onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="tipo_proyecto_st_id" value="Tipo de proyecto ST" />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            id="tipo_proyecto_st_id"
                            options={tiposProyectoSt}
                            selectedValue={form.data.tipo_proyecto_st_id}
                            onChange={(event, newValue) => form.setData('tipo_proyecto_st_id', newValue.value)}
                            error={form.errors.tipo_proyecto_st_id}
                            placeholder="Seleccione una tipología de ST"
                            required
                            disabled={evaluacion ? 'disabled' : undefined}
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="nombre_area_tecnica" value="Nombre del área técnica" />
                    </Grid>
                    <Grid item md={6}>
                        <TextInput
                            label="Nombre del área técnica"
                            id="nombre_area_tecnica"
                            type="text"
                            error={form.errors.nombre_area_tecnica}
                            value={form.data.nombre_area_tecnica}
                            onChange={(e) => form.setData('nombre_area_tecnica', e.target.value)}
                            required
                            disabled={evaluacion ? 'disabled' : undefined}
                        />
                    </Grid>

                    {form.data.tipo_proyecto_st_id && (
                        <>
                            <Grid item md={6}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="estado_sistema_gestion_id" value="Estado del sistema de gestión" />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="estado_sistema_gestion_id"
                                    options={estados_sistema_gestion}
                                    selectedValue={form.data.estado_sistema_gestion_id}
                                    onChange={(event, newValue) => form.setData('estado_sistema_gestion_id', newValue.value)}
                                    error={form.errors.estado_sistema_gestion_id}
                                    placeholder="Seleccione un estado"
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item md={6}>
                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="sector_productivo" value="Sector priorizado de Colombia Productiva" />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            id="sector_productivo"
                            options={sectores_productivos}
                            selectedValue={form.data.sector_productivo}
                            onChange={(event, newValue) => form.setData('sector_productivo', newValue.value)}
                            error={form.errors.sector_productivo}
                            placeholder="Seleccione una sector"
                            required
                            disabled={evaluacion ? 'disabled' : undefined}
                        />
                    </Grid>

                    {method == 'crear' && (
                        <>
                            <Grid item md={12}>
                                <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                            </Grid>

                            <Grid item md={6}>
                                <Label required labelFor="rol_sennova" className="mb-4" value="Rol SENNOVA" />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="rol_sennova"
                                    selectedValue={form.data.rol_sennova}
                                    onChange={(event, newValue) => form.setData('rol_sennova', newValue.value)}
                                    options={roles_sennova}
                                    placeholder="Seleccione un rol SENNOVA"
                                    required
                                />
                            </Grid>

                            {form.data.fecha_inicio && form.data.fecha_finalizacion && (
                                <>
                                    <Grid item md={6}>
                                        <Label required labelFor="cantidad_meses" className="mb-4" value="Número de meses de vinculación al proyecto" />
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
                                            placeholder="Número de meses de vinculación"
                                            required
                                        />
                                        {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion) && (
                                            <small>
                                                El proyecto se ejecutará entre {form.data.fecha_inicio} y el {form.data.fecha_finalizacion}, por lo tanto el número de meses máximo es:{' '}
                                                {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion)}
                                            </small>
                                        )}
                                    </Grid>
                                </>
                            )}

                            <Grid item md={6}>
                                <Label required labelFor="cantidad_horas" className="mb-4" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    type="number"
                                    id="cantidad_horas"
                                    inputProps={{
                                        step: 1,
                                        min: 1,
                                        max: form.data.rol_sennova?.maxHoras,
                                    }}
                                    value={form.data.cantidad_horas}
                                    onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                    placeholder="Número de horas semanales dedicadas"
                                    required
                                />
                            </Grid>
                        </>
                    )}

                    {method == 'editar' && (
                        <>
                            <Grid item md={6}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="linea_programatica_id"
                                    options={lineas_programaticas}
                                    selectedValue={form.data.linea_programatica_id}
                                    onChange={(event, newValue) => form.setData('linea_programatica_id', newValue.value)}
                                    error={form.errors.linea_programatica_id}
                                    placeholder="Seleccione una línea programática"
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <h1 className="text-2xl text-center" id="estructura-proyecto">
                                    Estructura del proyecto
                                </h1>
                            </Grid>

                            <Grid item md={12}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="resumen" value="Resumen ejecutivo" />
                                <AlertMui className="my-2">
                                    <p>
                                        Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo
                                        cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                                        <br />
                                        <strong>Nota:</strong> El resumen por lo general se construye al final de la contextualización con el fin de tener claros todos los puntos que intervinieron en
                                        la misma y poder dar a conocer de forma más pertinente los por menores del proyecto. (Máximo 1000 caracteres).
                                    </p>
                                </AlertMui>

                                <Textarea
                                    id="resumen"
                                    error={form.errors.resumen}
                                    value={form.data.resumen}
                                    onChange={(e) => form.setData('resumen', e.target.value)}
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="antecedentes" value="Antecedentes" />
                                <AlertMui className="my-2">
                                    <p>
                                        Se debe evidenciar la identificación y caracterización del mercado potencial/objetivo, nicho de mercado al cual se busca atender o la necesidad que se busca
                                        satisfacer tomando como referencia el estudio del sector, identificando si existen el(los) mismo(s) alcance(s) o similar(es) en la empresa privada o pública u
                                        otros centros de formación de tal forma que el proyecto no se convierta en una competencia frente a un servicio/producto ofertado. Se debe registrar el análisis
                                        de las tendencias del mercado, en relación con clientes potenciales, competidores y proveedores. En este ítem es necesario valorar las necesidades de los
                                        clientes actuales o potenciales y precisar la segmentación del mercado, las tendencias de los precios y las gestiones comerciales a realizadas.
                                        <br />
                                        <strong>Nota:</strong> La información debe ser de fuentes primarias, ejemplo: Secretarías, DANE, Artículos científicos, entre otros y citarla utilizando normas
                                        APA séptima edición. (Máximo 10000 caracteres).
                                    </p>
                                </AlertMui>

                                <Textarea
                                    id="antecedentes"
                                    error={form.errors.antecedentes}
                                    value={form.data.antecedentes}
                                    onChange={(e) => form.setData('antecedentes', e.target.value)}
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="identificacion_problema" value="Identificación y descripción del problema" />
                                <AlertMui className="my-2">
                                    1. Descripción de la necesidad, problema u oportunidad identificada del plan tecnológico y/o agendas departamentales de innovación y competitividad.
                                    <br />
                                    2. Descripción del problema que se atiende con el proyecto, sustentado en el contexto, la caracterización, los datos, las estadísticas, de la regional, entre otros,
                                    citar toda la información consignada utilizando normas APA última edición. La información debe ser de fuentes primarias de información, ejemplo: Secretarías, DANE,
                                    Artículos científicos, entre otros.
                                </AlertMui>

                                <Textarea
                                    label="Identificación y descripción del problema"
                                    id="identificacion_problema"
                                    error={form.errors.identificacion_problema}
                                    value={form.data.identificacion_problema}
                                    onChange={(e) => form.setData('identificacion_problema', e.target.value)}
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="pregunta_formulacion_problema" value="Pregunta de formulación del problema" />
                                <AlertMui className="my-2">
                                    <p>Se debe verificar que la pregunta del problema defina con exactitud ¿cuál es el problema para resolver, investigar o intervenir?</p>
                                    La pregunta debe cumplir las siguientes condiciones:
                                    <ul>
                                        <li>• Guardar estrecha correspondencia con el título del proyecto.</li>
                                        <li>• Evitar adjetivos que impliquen juicios de valor tales como: bueno, malo, mejor, peor.</li>
                                        <li>• No debe dar origen a respuestas tales como si o no.</li>
                                    </ul>
                                    <br />
                                    <strong>Nota:</strong> Se sugiere convertir el problema principal (tronco) identificado en el árbol de problemas en forma pregunta.
                                    <br />
                                    <strong>Máximo 50 palabras</strong>
                                </AlertMui>

                                <Textarea
                                    id="pregunta_formulacion_problema"
                                    error={form.errors.pregunta_formulacion_problema}
                                    value={form.data.pregunta_formulacion_problema}
                                    onChange={(e) => form.setData('pregunta_formulacion_problema', e.target.value)}
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="justificacion_problema" value="Justificación" />
                                <AlertMui className="my-2">
                                    <p>La justificación debe describir la solución del problema y debe responder a las siguientes preguntas:</p>
                                    <ul>
                                        <li>• ¿Cómo se relaciona el proyecto con las prioridades de la región y del país?</li>
                                        <li>• ¿Qué resultados se lograrán?</li>
                                        <li>• ¿Cuál es la finalidad con los resultados esperados?</li>
                                        <li>• ¿Cómo se utilizarán los resultados y quiénes serán los beneficiarios?</li>
                                        <li>• Debe incluir el impacto a la formación, al sector productivo y a la política nacional de ciencia, tecnología e innovación.</li>
                                    </ul>
                                    <strong>Nota:</strong> La justificación debe brindar un argumento convincente de los resultados del proyecto generado y de su aplicabilidad."
                                </AlertMui>

                                <Textarea
                                    id="justificacion_problema"
                                    error={form.errors.justificacion_problema}
                                    value={form.data.justificacion_problema}
                                    onChange={(e) => form.setData('justificacion_problema', e.target.value)}
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>

                            <Grid item md={6}>
                                <Label
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                    className="mb-4"
                                    labelFor="programas_formacion"
                                    value="Nombre de los programas de formación con los que se relaciona el proyecto"
                                />
                            </Grid>
                            <Grid item md={6}>
                                <SelectMultiple
                                    id="programas_formacion"
                                    bdValues={form.data.programas_formacion}
                                    options={programas_formacion_con_registro_calificado}
                                    onChange={(event, newValue) => {
                                        const selectedValues = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            programas_formacion: selectedValues,
                                        }))
                                    }}
                                    error={form.errors.programas_formacion}
                                    placeholder="Buscar por el nombre del programa de formación"
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>

                            <Grid item md={6}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="zona_influencia" value="Zona de influencia" />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    label="Zona de influencia"
                                    id="zona_influencia"
                                    type="text"
                                    error={form.errors.zona_influencia}
                                    value={form.data.zona_influencia}
                                    onChange={(e) => form.setData('zona_influencia', e.target.value)}
                                    placeholder="Escriba el número de aprendices que se beneficiarán en la ejecución del proyecto"
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="bibliografia" value="Bibliografía" />
                                <AlertMui>
                                    Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición
                                    (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).
                                </AlertMui>
                                <Textarea
                                    id="bibliografia"
                                    error={form.errors.bibliografia}
                                    value={form.data.bibliografia}
                                    onChange={(e) => form.setData('bibliografia', e.target.value)}
                                    required
                                    disabled={evaluacion ? 'disabled' : undefined}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </fieldset>

            {form.isDirty && <div>There are unsaved form changes.</div>}

            {method == 'crear' || proyecto_linea_68.proyecto?.allowed?.to_update ? (
                <div className="pt-8 pb-4 space-y-4">
                    <PrimaryButton type="submit" className="ml-auto">
                        Guardar
                    </PrimaryButton>
                </div>
            ) : null}
        </form>
    )
}

export default Form
