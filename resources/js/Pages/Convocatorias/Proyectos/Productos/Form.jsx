import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'

const Form = ({ method = '', setDialogStatus, isSuperAdmin, convocatoria, proyecto, producto, resultados, subtipologiasMinciencias, tiposProducto, ...props }) => {
    const form = useForm({
        nombre: producto?.nombre,
        resultado_id: producto?.resultado_id,
        fecha_inicio: producto?.fecha_inicio,
        fecha_finalizacion: producto?.fecha_finalizacion,
        indicador: producto?.indicador,
        medio_verificacion: producto?.producto_ta_tp ? producto?.producto_ta_tp?.medio_verificacion : producto?.producto_servicio_tecnologico ? producto?.producto_servicio_tecnologico?.medio_verificacion : '',

        nombre_indicador: producto?.producto_servicio_tecnologico?.nombre_indicador,
        formula_indicador: producto?.producto_servicio_tecnologico?.formula_indicador,
        meta_indicador: producto?.producto_servicio_tecnologico?.meta_indicador,

        tipo: producto?.producto_idi ? producto.producto_idi.tipo : producto?.producto_cultura_innovacion ? producto.producto_cultura_innovacion?.tipo : '',
        subtipologia_minciencias_id: producto?.producto_idi ? producto.producto_idi?.subtipologia_minciencias_id : producto?.producto_cultura_innovacion ? producto.producto_cultura_innovacion?.subtipologia_minciencias_id : null,

        valor_proyectado: producto?.producto_ta_tp ? producto.producto_ta_tp?.valor_proyectado : '',
        tatp_servicio_tecnologico: proyecto.ta || proyecto.tp || proyecto.servicio_tecnologico ? true : false,
        actividad_id: null,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.productos.update', [convocatoria.id, proyecto.id, producto.id]), {
                preserveScroll: true,
            })
        }
    }

    const [actividades, setActividades] = useState([])
    useEffect(() => {
        if (resultados.find((item) => item.value == producto?.resultado_id)?.actividades) {
            const tmpOptionsFiltered = resultados
                .find((item) => item.value == producto?.resultado_id)
                ?.actividades.map((option) => {
                    const { id, descripcion } = option
                    return { value: id, label: descripcion }
                })

            setActividades(tmpOptionsFiltered)
        }
    }, [producto])

    useEffect(() => {
        if (resultados.find((item) => item.value == form.data.resultado_id)?.actividades) {
            const tmpOptionsFiltered = resultados
                .find((item) => item.value == form.data.resultado_id)
                ?.actividades.map((option) => {
                    const { id, descripcion } = option
                    return { value: id, label: descripcion }
                })

            setActividades(tmpOptionsFiltered)
        }
    }, [form.data.resultado_id])

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10"> {method == 'crear' ? 'Añadir' : 'Modificar'} producto</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            {proyecto.codigo_linea_programatica == 70 && (
                                <AlertMui hiddenIcon={true} className="my-8">
                                    <p>
                                        <strong>Importante:</strong> Debe modifcar las fechas de ejecución, meta y las activiades a asociar.
                                    </p>
                                </AlertMui>
                            )}

                            <div className="mt-8">
                                <p className="text-center">Fecha de ejecución</p>
                                <div className="ml-2 mt-4">
                                    <div>
                                        <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                                        <div className="ml-14">
                                            <DatePicker id="fecha_inicio" className="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} value={form.data.fecha_inicio} onChange={(e) => form.setData('fecha_inicio', e.target.value)} error={form.errors.fecha_inicio} required />
                                        </div>
                                    </div>
                                    <div>
                                        <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                                        <div className="ml-4">
                                            <DatePicker id="fecha_finalizacion" className="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} value={form.data.fecha_finalizacion} onChange={(e) => form.setData('fecha_finalizacion', e.target.value)} error={form.errors.fecha_finalizacion} required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                {form.tatp_servicio_tecnologico && proyecto.codigo_linea_programatica != 70 && (
                                    <AlertMui hiddenIcon={true} className="my-8">
                                        <p>
                                            Los productos pueden corresponder a bienes o servicios. Un bien es un objeto tangible, almacenable o transportable, mientras que el servicio es una prestación intangible.
                                            <br />
                                            El producto debe cumplir con la siguiente estructura:
                                            <br />
                                            Cuando el producto es un bien: nombre del bien + la condición deseada. Ejemplo: Vía construida.
                                            <br />
                                            Cuando el producto es un servicio: nombre del servicio + el complemento. Ejemplo: Servicio de asistencia técnica para el mejoramiento de hábitos alimentarios
                                        </p>
                                    </AlertMui>
                                )}
                                <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" id="nombre" error={form.errors.nombre} value={form.data.nombre} onChange={(e) => form.setData('nombre', e.target.value)} required />
                            </div>

                            {proyecto.codigo_linea_programatica != 70 ||
                                (isSuperAdmin && (
                                    <div className="mt-8">
                                        <Autocomplete id="resultado_id" options={resultados} selectedValue={form.data.resultado_id} onChange={(event, newValue) => form.setData('resultado_id', newValue.value)} error={form.errors.resultado_id} label="Resultado" placeholder="Seleccione un resultado" required />
                                    </div>
                                ))}

                            {proyecto.servicio_tecnologico == null && (
                                <div className="mt-8">
                                    {proyecto.codigo_linea_programatica != 70 && (
                                        <>{form.tatp_servicio_tecnologico == true ? <AlertMui hiddenIcon={true} className="my-8" message="Deber ser medible y con una fórmula. Por ejemplo: (# metodologías validadas/# metodologías totales) X 100" /> : <AlertMui hiddenIcon={true} className="my-8" message="Especifique los medios de verificación para validar los logros del proyecto." />}</>
                                    )}
                                    <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} id="indicador" error={form.errors.indicador} value={form.data.indicador} onChange={(e) => form.setData('indicador', e.target.value)} label="Indicador" required />
                                </div>
                            )}

                            {form.tatp_servicio_tecnologico == false ? (
                                <>
                                    <div className="mt-8">
                                        <Autocomplete
                                            id="subtipologia_minciencias_id"
                                            options={subtipologiasMinciencias}
                                            selectedValue={form.data.subtipologia_minciencias_id}
                                            onChange={(event, newValue) => form.setData('subtipologia_minciencias_id', newValue.value)}
                                            error={form.errors.subtipologia_minciencias_id}
                                            label="Subtipología Minciencias"
                                            placeholder="Seleccione una subtipología"
                                            required
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <Autocomplete id="tipo" options={tiposProducto} selectedValue={form.data.tipo} onChange={(event, newValue) => form.setData('tipo', newValue.value)} error={form.errors.tipo} placeholder="Seleccione un tipo" required />
                                    </div>
                                </>
                            ) : (
                                proyecto.ta ||
                                (proyecto.tp && (
                                    <div className="mt-8">
                                        <Textarea label="Meta" id="valor_proyectado" error={form.errors.valor_proyectado} value={form.data.valor_proyectado} onChange={(e) => form.setData('valor_proyectado', e.target.value)} required />
                                    </div>
                                ))
                            )}

                            {form.tatp_servicio_tecnologico == true && (
                                <div className="mt-8">
                                    {proyecto.codigo_linea_programatica !=
                                        70(
                                            <>
                                                {proyecto.servicio_tecnologico ? (
                                                    <AlertMui
                                                        hiddenIcon={true}
                                                        className="my-8"
                                                        message="Los medios de verificación corresponden a las evidencias y/o fuentes de información en las que está disponibles los registros, la información necesaria y suficiente. Dichos medios pueden ser documentos oficiales, informes, evaluaciones, encuestas, documentos o reportes internos que genera el proyecto, entre otros."
                                                    />
                                                ) : (
                                                    <AlertMui hiddenIcon={true} className="my-8" message="Especifique los medios de verificación para validar los logros del objetivo específico." />
                                                )}
                                            </>,
                                        )}

                                    <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} id="medio_verificacion" error={form.errors.medio_verificacion} value={form.data.medio_verificacion} onChange={(e) => form.setData('medio_verificacion', e.target.value)} label="Medio de verificación" required />
                                </div>
                            )}

                            {proyecto.servicio_tecnologico && (
                                <>
                                    <div className="mt-8">
                                        <AlertMui hiddenIcon={true} className="my-8">
                                            El indicador debe mantener una estructura coherente. Esta se compone de dos elementos: en primer lugar, debe ir el objeto a cuantificar, descrito por un sujeto y posteriormente la condición deseada, definida a través de un verbo en participio. Por ejemplo: Kilómetros de red vial nacional construidos.
                                        </AlertMui>
                                        <Textarea id="nombre_indicador" error={form.errors.nombre_indicador} value={form.data.nombre_indicador} onChange={(e) => form.setData('nombre_indicador', e.target.value)} label="Nombre del Indicador del producto" required />
                                    </div>

                                    <div className="mt-8">
                                        <AlertMui hiddenIcon={true} className="my-8">
                                            El método de cálculo debe ser una expresión matemática definida de manera adecuada y de fácil comprensión, es decir, deben quedar claras cuáles son las variables utilizadas. Los métodos de cálculo más comunes son el porcentaje, la tasa de variación, la razón y el número índice. Aunque éstos no son las únicas expresiones para los indicadores, sí son las
                                            más frecuentes.
                                        </AlertMui>
                                        <Textarea id="indicador" error={form.errors.indicador} value={form.data.indicador} onChange={(e) => form.setData('indicador', e.target.value)} label="Fórmula del Indicador del producto" required />
                                    </div>

                                    <div className="mt-8">
                                        <Textarea id="meta_indicador" error={form.errors.meta_indicador} value={form.data.meta_indicador} onChange={(e) => form.setData('meta_indicador', e.target.value)} label="Meta del indicador" required />
                                    </div>
                                </>
                            )}

                            <h6 className="mt-20 mb-12 text-2xl">Actividades</h6>
                            <div className="bg-white rounded shadow overflow-hidden">
                                <div className="p-4">
                                    <Label required className="mb-4" labelFor="actividad_id" value="Relacione alguna actividad" />
                                </div>
                                <div>
                                    {actividades?.length > 0 ? (
                                        <SelectMultiple
                                            id="actividad_id"
                                            bdValues={form.data.actividad_id}
                                            options={actividades}
                                            error={form.errors.actividad_id}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    actividad_id: selectedValues,
                                                }))
                                            }}
                                            required
                                        />
                                    ) : (
                                        <AlertMui hiddenIcon={true}>
                                            El resultado seleccionado no tiene actividades asociadas. Debe completar la información de cada actividad en el numeral de <strong>Metodología y actividades</strong>. Para ello diríjase a la parte inferior de la ventanta, haga clic en los tres puntos de cada actividad | Ver detalles. En el formulario que visualiza deberá completar el resto de
                                            información.
                                        </AlertMui>
                                    )}
                                </div>
                            </div>
                        </fieldset>
                        {producto && <small className="flex items-center text-app-700">{producto.updated_at}</small>}
                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Añadir' : 'Modificar'} producto
                                    </PrimaryButton>
                                    <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)}>
                                        Cancelar
                                    </ButtonMui>
                                </>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Form
