import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'
import ToolTipMui from '@/Components/Tooltip'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import { monthDiff } from '@/Utils'
import { router, useForm } from '@inertiajs/react'

import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'

const Form = ({
    is_super_admin,
    method = '',
    convocatoria,
    proyecto_formulario_12_linea_68,
    lineas_programaticas,
    tipos_proyecto_linea_68,
    sectores_productivos,
    estados_sistema_gestion,
    programas_formacion_sin_registro_calificado,
    programas_formacion_con_registro_calificado,
    municipios,
    roles_sennova,
    evaluacion,
    campos_convocatoria,
    ...props
}) => {
    const form = useForm({
        tipo_proyecto_linea_68_id: proyecto_formulario_12_linea_68?.tipo_proyecto_linea_68_id ?? '',
        titulo: proyecto_formulario_12_linea_68?.titulo ?? '',
        fecha_inicio: proyecto_formulario_12_linea_68?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_formulario_12_linea_68?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_formulario_12_linea_68?.max_meses_ejecucion ?? '',

        programas_formacion: proyecto_formulario_12_linea_68?.proyecto.programas_formacion.map((item) => item.id) ?? null,
        programas_formacion_relacionados:
            programas_formacion_sin_registro_calificado
                ?.filter((item) => proyecto_formulario_12_linea_68?.proyecto.programas_formacion.some((secondItem) => secondItem.id === item.value))
                .map((item) => item.value) ?? null,

        estado_sistema_gestion_id: proyecto_formulario_12_linea_68?.estado_sistema_gestion_id ?? '',
        sector_productivo: proyecto_formulario_12_linea_68?.sector_productivo ?? '',

        resumen: proyecto_formulario_12_linea_68?.resumen ?? '',
        antecedentes: proyecto_formulario_12_linea_68?.antecedentes ?? '',
        continuidad: proyecto_formulario_12_linea_68?.continuidad ?? '',
        bibliografia: proyecto_formulario_12_linea_68?.bibliografia ?? '',
        municipios_influencia: proyecto_formulario_12_linea_68?.municipios_influencia ?? '',
        otras_zonas_influencia: proyecto_formulario_12_linea_68?.otras_zonas_influencia ?? '',
        nombre_area_tecnica: proyecto_formulario_12_linea_68?.nombre_area_tecnica ?? '',

        video: proyecto_formulario_12_linea_68?.video,
        infraestructura_adecuada: proyecto_formulario_12_linea_68?.infraestructura_adecuada ?? false,
        especificaciones_area: proyecto_formulario_12_linea_68?.especificaciones_area,

        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.proyectos-formulario-12-linea-68.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_formulario_12_linea_68.proyecto.allowed.to_update
            ? form.put(route('convocatorias.proyectos-formulario-12-linea-68.update', [convocatoria.id, proyecto_formulario_12_linea_68.id]), {
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

    const [running_sync, setRunningSync] = useState(false)
    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto_formulario_12_linea_68?.proyecto?.allowed?.to_update) {
            setRunningSync(true)
            try {
                await router.put(
                    route('convocatorias.proyectos-formulario-12-linea-68.updateLongColumn', [convocatoria.id, proyecto_formulario_12_linea_68?.proyecto?.id, column]),
                    { [column]: data ? data : form.data[column], is_array: Array.isArray(form.data[column]) },
                    {
                        onError: (resp) => console.log(resp),
                        onFinish: () => {
                            console.log('Request finished'), setRunningSync(false)
                        },
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
                        <figure className="mr-8">
                            <img src="/images/projects.png" alt="" width={350} />
                        </figure>
                        <h1>
                            {method == 'PUT' ? (
                                <>
                                    <strong>{proyecto_formulario_12_linea_68.titulo}</strong>
                                    <br />
                                    {proyecto_formulario_12_linea_68.proyecto.codigo}
                                </>
                            ) : (
                                <>Fortalecimiento de la oferta de servicios tecnológicos para las empresas - Línea 68</>
                            )}
                        </h1>
                    </div>
                </Grid>

                <Grid item md={12}>
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
                        disabled={evaluacion ? true : false}
                        onBlur={() => syncColumnLong('titulo', form)}
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="fecha_inicio" error={form.errors.fecha_inicio} value="Fecha de inicio" />
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
                        minDate={convocatoria.year + '-01-01'}
                        maxDate={convocatoria.year + '-12-31'}
                        name="fecha_finalizacion"
                        value={form.data.fecha_finalizacion}
                        error={form.errors.fecha_finalizacion}
                        className="p-4 w-full"
                        onChange={(e) => (form.setData('fecha_finalizacion', e.target.value), syncColumnLong('fecha_finalizacion', form, e.target.value))}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="tipo_proyecto_linea_68_id" value="Centro de formación y Línea Técnica" />
                </Grid>
                <Grid item md={6}>
                    {method == 'POST' ? (
                        <Autocomplete
                            id="tipo_proyecto_linea_68_id"
                            options={tipos_proyecto_linea_68}
                            selectedValue={form.data.tipo_proyecto_linea_68_id}
                            onChange={(event, newValue) => form.setData('tipo_proyecto_linea_68_id', newValue.value)}
                            error={form.errors.tipo_proyecto_linea_68_id}
                            required
                            disabled={is_super_admin ? false : evaluacion || method === 'editar'}
                        />
                    ) : (
                        <>{proyecto_formulario_12_linea_68.proyecto.centro_formacion.nombre}</>
                    )}
                </Grid>

                <Grid item md={6}>
                    <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="nombre_area_tecnica" value="Nombre del área técnica" />
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
                        disabled={evaluacion ? true : false}
                        onBlur={() => syncColumnLong('nombre_area_tecnica', form)}
                    />
                </Grid>

                {form.data.tipo_proyecto_linea_68_id && (
                    <>
                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="estado_sistema_gestion_id" value="Estado del sistema de gestión" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="estado_sistema_gestion_id"
                                options={estados_sistema_gestion}
                                selectedValue={form.data.estado_sistema_gestion_id}
                                onChange={(event, newValue) => form.setData('estado_sistema_gestion_id', newValue.value)}
                                error={form.errors.estado_sistema_gestion_id}
                                required
                                disabled={evaluacion ? true : false}
                                onBlur={() => syncColumnLong('estado_sistema_gestion_id', form)}
                            />
                        </Grid>
                    </>
                )}

                <Grid item md={6}>
                    <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="sector_productivo" value="Estrategia SENA priorizada" />
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        id="sector_productivo"
                        options={sectores_productivos}
                        selectedValue={form.data.sector_productivo}
                        onChange={(event, newValue) => form.setData('sector_productivo', newValue.value)}
                        error={form.errors.sector_productivo}
                        required
                        disabled={evaluacion ? true : false}
                        onBlur={() => syncColumnLong('sector_productivo', form)}
                    />
                </Grid>

                {method == 'POST' && (
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
                                }}
                                value={form.data.cantidad_horas}
                                onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                placeholder="Número de horas semanales dedicadas"
                                required
                            />
                        </Grid>
                    </>
                )}

                {method == 'PUT' && (
                    <>
                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                        </Grid>
                        <Grid item md={6}>
                            Fortalecimiento de la oferta de servicios tecnológicos para las empresas
                        </Grid>

                        <Grid item md={12}>
                            <h1 className="text-2xl text-center" id="estructura-proyecto">
                                Estructura del proyecto
                            </h1>
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="resumen" value="Resumen ejecutivo" />
                            <AlertMui className="my-2">
                                <p>
                                    Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree
                                    que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                                    <br />
                                    <strong>Nota:</strong> El resumen por lo general se construye al final de la contextualización con el fin de tener claros todos los puntos que intervinieron en la
                                    misma y poder dar a conocer de forma más pertinente los por menores del proyecto. (Máximo 1000 caracteres).
                                </p>
                            </AlertMui>

                            <Textarea
                                id="resumen"
                                error={form.errors.resumen}
                                value={form.data.resumen}
                                onChange={(e) => form.setData('resumen', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                                onBlur={() => syncColumnLong('resumen', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="antecedentes" value="Antecedentes" />
                            <AlertMui className="my-2">
                                <p>
                                    Se debe evidenciar la identificación y caracterización del mercado potencial/objetivo, nicho de mercado al cual se busca atender o la necesidad que se busca
                                    satisfacer tomando como referencia el estudio del sector, identificando si existen el(los) mismo(s) alcance(s) o similar(es) en la empresa privada o pública u otros
                                    centros de formación de tal forma que el proyecto no se convierta en una competencia frente a un servicio/producto ofertado. Se debe registrar el análisis de las
                                    tendencias del mercado, en relación con clientes potenciales, competidores y proveedores. En este ítem es necesario valorar las necesidades de los clientes actuales
                                    o potenciales y precisar la segmentación del mercado, las tendencias de los precios y las gestiones comerciales a realizadas.
                                    <br />
                                    <strong>Nota:</strong> La información debe ser de fuentes primarias, ejemplo: Secretarías, DANE, Artículos científicos, entre otros y citarla utilizando normas APA
                                    séptima edición. (Máximo 10000 caracteres).
                                </p>
                            </AlertMui>

                            <Textarea
                                id="antecedentes"
                                error={form.errors.antecedentes}
                                value={form.data.antecedentes}
                                onChange={(e) => form.setData('antecedentes', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                                onBlur={() => syncColumnLong('antecedentes', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="antecedentes"
                                value={`Relacione el último proyecto con el que fue financiada la operación del área técnica en la cual se desarrollará el proyecto en ${convocatoria.year}`}
                            />

                            <Textarea
                                id="continuidad"
                                error={form.errors.continuidad}
                                value={form.data.continuidad}
                                onChange={(e) => form.setData('continuidad', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                                onBlur={() => syncColumnLong('continuidad', form)}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="programas_formacion_relacionados"
                                value="Nombre de los programas de formación con los que se relaciona el proyecto"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <SelectMultiple
                                id="programas_formacion_relacionados"
                                bdValues={form.data.programas_formacion_relacionados}
                                options={programas_formacion_sin_registro_calificado}
                                onChange={(event, newValue) => {
                                    const selected_values = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        programas_formacion_relacionados: selected_values,
                                    }))
                                }}
                                error={form.errors.programas_formacion_relacionados}
                                required
                                disabled={running_sync}
                                onBlur={() => syncColumnLong('programas_formacion_relacionados', form)}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="programas_formacion"
                                value="Nombre de los programas de formación con registro calificado con los que se relaciona el proyecto"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <SelectMultiple
                                id="programas_formacion"
                                bdValues={form.data.programas_formacion}
                                options={programas_formacion_con_registro_calificado}
                                onChange={(event, newValue) => {
                                    const selected_values = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        programas_formacion: selected_values,
                                    }))
                                }}
                                error={form.errors.programas_formacion}
                                required
                                disabled={running_sync}
                                onBlur={() => syncColumnLong('programas_formacion', form)}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="municipios_influencia" value="Zonas de influencia" />
                        </Grid>
                        <Grid item md={6}>
                            <SelectMultiple
                                id="municipios_influencia"
                                bdValues={form.data.municipios_influencia}
                                options={municipios}
                                isGroupable={true}
                                groupBy={(option) => option.group}
                                onChange={(event, newValue) => {
                                    const selected_values = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        municipios_influencia: selected_values,
                                    }))
                                }}
                                error={form.errors.municipios_influencia}
                                required
                                disabled={evaluacion ? true : false}
                                onBlur={() => syncColumnLong('municipios_influencia', form)}
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label disabled={evaluacion ? true : false} className="mb-4" labelFor="otras_zonas_influencia" value="Otras zonas de influencia (Veredas, corregimientos)" />
                        </Grid>
                        <Grid item md={6}>
                            <TextInput
                                label="(Veredas, corregimientos)"
                                id="otras_zonas_influencia"
                                type="text"
                                error={form.errors.otras_zonas_influencia}
                                value={form.data.otras_zonas_influencia}
                                onChange={(e) => form.setData('otras_zonas_influencia', e.target.value)}
                                disabled={evaluacion ? true : false}
                                onBlur={() => syncColumnLong('otras_zonas_influencia', form)}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <h1 className="mt-24 mb-8 text-center text-3xl">Especificaciones e infraestructura</h1>
                        </Grid>

                        <Grid item md={6}>
                            <Label
                                required
                                labelFor="infraestructura_adecuada"
                                value="¿Cuenta con infraestructura adecuada y propia para el funcionamiento de la línea servicios tecnológicos en el centro de formación?"
                                className="inline-block mb-4"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <SwitchMui
                                checked={form.data.infraestructura_adecuada}
                                onChange={(e) => form.setData('infraestructura_adecuada', e.target.checked)}
                                onBlur={() => syncColumnLong('infraestructura_adecuada', form)}
                            />
                        </Grid>

                        {campos_convocatoria.filter((item) => item.campo == 'especificaciones_area').find((item) => item.convocatoria_id == convocatoria.id) && (
                            <Grid item md={12}>
                                <Label
                                    required
                                    labelFor="especificaciones_area"
                                    value="Relacione las especificaciones del área donde se desarrollan las actividades de servicios tecnológicos en el centro de formación"
                                    className="inline-block mb-4"
                                />
                                <Textarea
                                    label="Especificaciones del área"
                                    id="especificaciones_area"
                                    error={form.errors.especificaciones_area}
                                    value={form.data.especificaciones_area}
                                    onChange={(e) => form.setData('especificaciones_area', e.target.value)}
                                    onBlur={() => syncColumnLong('especificaciones_area', form)}
                                    required
                                />
                            </Grid>
                        )}

                        <Grid item md={6}>
                            <Label
                                required
                                labelFor="video"
                                value="Enlace del video de las instalaciones donde se desarrollan las actividades de la línea servicios tecnológicos. (Youtube, Vídeo en Google Drive con visualización pública)"
                                className="inline-block mb-4"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextInput
                                label="Enlace del video"
                                type="url"
                                value={form.data.video}
                                error={form.errors.video}
                                onChange={(e) => form.setData('video', e.target.value)}
                                onBlur={() => syncColumnLong('video', form)}
                                required
                            />
                            <ToolTipMui
                                className="py-4 hover:cursor-pointer text-cyan-800"
                                title={
                                    <>
                                        <strong>Características técnico del video del área técnica:</strong>
                                        <br />
                                        Video actualizado en donde mediante el uso de voz en off y un recorrido por el área técnica destinada para la prestación del servicio (ejecución del proyecto de
                                        ST) se tengan en cuenta, como mínimo los siguientes requisitos:
                                        <ul>
                                            <li>
                                                1. Identificar el nombre del centro de formación (incluir el código) y el nombre del área técnica. Indicar el número de la resolución de creación del
                                                área destinada para la ejecución del proyecto de Servicios Tecnológicos.
                                            </li>
                                            <li>2. Indicar la cantidad (número) de servicios implementados en el área técnica y las redes de conocimiento con las que se relaciona.</li>
                                            <li>
                                                3. Hacer un barrido de la totalidad del área técnica iniciando y terminando por la zona de acceso. En la medida de lo posible y de acuerdo con la
                                                gestión de los riesgos asociados, deben mostrarse la ejecución de actividades técnicas en el video (operación de equipos) (solo aplica para proyectos en
                                                continuidad)
                                            </li>
                                            <li>4. Indicar si el área es de uso exclusivo para el proyecto de ST o si se comparte con otras líneas del centro de formación.</li>
                                            <li>
                                                5. Se muestre claramente la zona operativa (ejecución de actividades técnicas, recepción y preparación de ítems para la prestación de servicio,
                                                almacenamiento de reactivos/consumibles, disposición de residuos, zonas de seguridad, zonas de gestión de gases, plantas eléctricas) y zonas
                                                administrativas (procesamiento de datos, gestión de información requerida por el proyecto y SENNOVA, etc.) según aplique a la tipología del portafolio
                                                de servicios.
                                            </li>
                                            <li>
                                                6. En los casos en los que se requieran recursos para viáticos, muestre el equipamiento utilizado para la prestación de servicio en sitio (toma de
                                                muestras, ejecución de ensayos, calibraciones, toma de información, levantamiento de datos, etc.) o para participación en ensayos de aptitud (en caso en
                                                que sean en sitio y requiera el desplazamiento de equipamiento)
                                            </li>
                                            <li>
                                                7. En los casos en los que se soliciten recursos para la adquisición de maquinaria industrial, indicar la zona disponible para su ubicación y puntos de
                                                suministro de servicios (eléctrico, gases, vapores, suministro de líquidos, etc. según aplique). En los casos en los que se soliciten recursos para la
                                                adquisición de accesorios de equipos, mostrar los equipos de los que hará parte los accesorios a adquirir.
                                            </li>
                                            <li>
                                                8. En los casos en los que se requieran construcciones o adecuaciones, se debe mostrar la zona o zonas en donde se requiere la ejecución de las mismas
                                                con una corta explicación técnica que soporte la necesidad (la profundidad de la justificación se llevará a cabo en el texto de la formulación)
                                            </li>
                                        </ul>
                                        <br />
                                        <strong>Duración del vídeo máximo 5 minutos.</strong>
                                    </>
                                }>
                                <InfoOutlinedIcon className="mr-2" />
                                Clic aquí para leer las indicaciones sobre el video
                            </ToolTipMui>
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="bibliografia" value="Bibliografía" />
                            <AlertMui>
                                Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (
                                <a href="http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf" target="_blank" className="underline">
                                    http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf
                                </a>
                                ).
                            </AlertMui>
                            <Textarea
                                id="bibliografia"
                                error={form.errors.bibliografia}
                                value={form.data.bibliografia}
                                onChange={(e) => form.setData('bibliografia', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                                onBlur={() => syncColumnLong('bibliografia', form)}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {method == 'POST' || proyecto_formulario_12_linea_68.proyecto?.allowed?.to_update ? (
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
