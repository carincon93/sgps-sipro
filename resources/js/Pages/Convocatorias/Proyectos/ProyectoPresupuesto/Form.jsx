import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Chip, Grid, Paper } from '@mui/material'
import { useEffect, useState } from 'react'

const Form = ({
    method = '',
    setDialogStatus,
    convocatoria,
    proyecto,
    rubro_presupuestal,
    tipos_licencia,
    tipos_software,
    opciones_servicios_edicion,
    segundo_grupo_presupuestal,
    tercer_grupo_presupuestal,
    usos_presupuestales,
    conceptos_viaticos,
}) => {
    const [array_tecer_grupo_presupuestal, setArrayTecerGrupoPresupuestal] = useState([])
    const [array_usos_presupuestales, setArrayUsosPresupuestales] = useState([])
    const [requiere_estudio_mercado, setRequiereEstudioMercado] = useState(true)
    const [codigos_usos_presupuestales, setCodigosUsosPresupuestales] = useState([])
    const [codigo_segundo_grupo_presupuestal, setCodigoSegundoGrupoPresupuestal] = useState('')
    const [same_values_requiere_estudio_mercado, setSameValuesRequiereEstudioMercado] = useState(false)
    const [modificar_usos_presupuestales, setModificarUsosPresupuestales] = useState(false)

    const form = useForm({
        segundo_grupo_presupuestal_id: null,
        tercer_grupo_presupuestal_id: null,
        convocatoria_presupuesto_id: rubro_presupuestal?.convocatoria_proyecto_rubros_presupuestales.map((item) => item.id),
        descripcion: rubro_presupuestal?.descripcion ?? '',
        justificacion: rubro_presupuestal?.justificacion ?? '',
        tipo_software: rubro_presupuestal?.software_info?.tipo_software ?? '',
        tipo_licencia: rubro_presupuestal?.software_info?.tipo_licencia ?? '',
        fecha_inicio: rubro_presupuestal?.software_info?.fecha_inicio ?? '',
        fecha_finalizacion: rubro_presupuestal?.software_info?.fecha_finalizacion ?? '',
        servicio_edicion_info: rubro_presupuestal?.servicio_edicion_info?.info ?? '',
        valor_total: rubro_presupuestal?.valor_total ?? '',
        concepto_viaticos: rubro_presupuestal?.concepto_viaticos ?? '',
    })

    useEffect(() => {
        if (form.data.segundo_grupo_presupuestal_id) {
            setRequiereEstudioMercado(true)
            setArrayTecerGrupoPresupuestal([])
            setArrayUsosPresupuestales([])

            setTimeout(() => {
                const filtered_tecer_grupo_presupuestal = tercer_grupo_presupuestal.filter((item) => item.segundo_grupo_presupuestal_id == form.data.segundo_grupo_presupuestal_id)
                setArrayTecerGrupoPresupuestal(filtered_tecer_grupo_presupuestal)
                setCodigoSegundoGrupoPresupuestal(segundo_grupo_presupuestal.find((item) => item.value == form.data.segundo_grupo_presupuestal_id)?.codigo)
            }, 500)
        }
    }, [form.data.segundo_grupo_presupuestal_id])

    useEffect(() => {
        if (form.data.tercer_grupo_presupuestal_id) {
            setRequiereEstudioMercado(true)

            setTimeout(() => {
                const filtered_usos_presupuestales = usos_presupuestales.filter(
                    (item) => item.segundo_grupo_presupuestal_id == form.data.segundo_grupo_presupuestal_id && item.tercer_grupo_presupuestal_id == form.data.tercer_grupo_presupuestal_id,
                )

                setArrayUsosPresupuestales((prevArray) => [...prevArray, ...filtered_usos_presupuestales])
            }, 500)
        }
    }, [form.data.tercer_grupo_presupuestal_id])

    useEffect(() => {
        if (form.data.convocatoria_presupuesto_id) {
            setSameValuesRequiereEstudioMercado(
                array_usos_presupuestales
                    .filter((item) => form.data.convocatoria_presupuesto_id?.includes(item.value))
                    .every(
                        (item) =>
                            item.requiere_estudio_mercado ===
                            array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id[form.data.convocatoria_presupuesto_id.length - 1])?.requiere_estudio_mercado,
                    ),
            )

            if (
                same_values_requiere_estudio_mercado &&
                array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id[form.data.convocatoria_presupuesto_id.length - 1])?.requiere_estudio_mercado
            ) {
                setRequiereEstudioMercado(true)
            } else if (
                same_values_requiere_estudio_mercado &&
                array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id[form.data.convocatoria_presupuesto_id.length - 1])?.requiere_estudio_mercado == false
            ) {
                setRequiereEstudioMercado(false)
            }

            setCodigosUsosPresupuestales(array_usos_presupuestales.filter((item) => form.data.convocatoria_presupuesto_id?.includes(item.value)))
        }
    }, [form.data.convocatoria_presupuesto_id])

    useEffect(() => {
        if (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado === true) {
            setRequiereEstudioMercado(true)
        } else if (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado === false) {
            setRequiereEstudioMercado(false)
        }

        if (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales.length > 0) {
            setModificarUsosPresupuestales(true)
        }

        setCodigosUsosPresupuestales(usos_presupuestales.filter((item) => form.data.convocatoria_presupuesto_id?.includes(item.value)))
    }, [rubro_presupuestal])

    const submit = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos.presupuesto.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.presupuesto.update', [convocatoria.id, proyecto.id, rubro_presupuestal.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Rubro presupuestal</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    {modificar_usos_presupuestales && (
                        <>
                            <h1>Usos presupuestales</h1>

                            <ul className="mt-6 space-y-2 list-disc">
                                {rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales.map((convocatoriaRubroPresupuestal, i) => (
                                    <li key={i}>
                                        <p className="first-letter:uppercase">
                                            {convocatoriaRubroPresupuestal.rubro_presupuestal.uso_presupuestal.descripcion}
                                            <Chip
                                                component="span"
                                                label={convocatoriaRubroPresupuestal.requiere_estudio_mercado ? 'Requiere estudio de mercado' : 'No requiere estudio de mercado'}
                                                className="ml-2"
                                                size="small"
                                            />
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <form onSubmit={submit} id="form-proyecto-presupuesto">
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            {!modificar_usos_presupuestales && (
                                <>
                                    <div className={`${array_tecer_grupo_presupuestal.length == 0 ? 'mb-[13.8rem]' : 'mb-0'}`}>
                                        <Label required labelFor="segundo_grupo_presupuestal_id" value="Rubro concepto interno SENA" />
                                        <Autocomplete
                                            id="segundo_grupo_presupuestal_id"
                                            options={segundo_grupo_presupuestal}
                                            selectedValue={form.data.segundo_grupo_presupuestal_id}
                                            onChange={(e, newValue) => form.setData('segundo_grupo_presupuestal_id', newValue.value)}
                                            error={form.errors.segundo_grupo_presupuestal_id}
                                            placeholder="Seleccione una opción"
                                            required
                                        />
                                    </div>

                                    {array_tecer_grupo_presupuestal.length > 0 && (
                                        <div className={`mt-8 ${array_usos_presupuestales.length == 0 ? 'mb-[7rem]' : 'mb-0'}`}>
                                            <Label required labelFor="tercer_grupo_presupuestal_id" value="Rubro concepto ministerio de hacienda" />
                                            <Autocomplete
                                                id="tercer_grupo_presupuestal_id"
                                                options={array_tecer_grupo_presupuestal}
                                                selectedValue={form.data.tercer_grupo_presupuestal_id}
                                                onChange={(e, newValue) => form.setData('tercer_grupo_presupuestal_id', newValue.value)}
                                                error={form.errors.tercer_grupo_presupuestal_id}
                                                placeholder="Seleccione una opción"
                                                required
                                            />
                                        </div>
                                    )}

                                    {array_usos_presupuestales.length > 0 && (
                                        <div className="mt-8">
                                            <Label required labelFor="convocatoria_presupuesto_id" value="Usos presupuestales" />
                                            <SelectMultiple
                                                id="convocatoria_presupuesto_id"
                                                options={array_usos_presupuestales}
                                                bdValues={form.data.convocatoria_presupuesto_id}
                                                onChange={(event, newValue) => {
                                                    const selectedValues = newValue.map((option) => option.value)

                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        convocatoria_presupuesto_id: selectedValues,
                                                    }))
                                                }}
                                                error={form.errors.convocatoria_presupuesto_id}
                                                required
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {method == 'PUT' && (
                                <ButtonMui
                                    onClick={() => (
                                        setModificarUsosPresupuestales(!modificar_usos_presupuestales),
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            segundo_grupo_presupuestal_id: [],
                                            tercer_grupo_presupuestal_id: [],
                                            convocatoria_presupuesto_id: [],
                                        }))
                                    )}
                                    className="!my-6">
                                    {!modificar_usos_presupuestales ? 'Cancelar' : 'Modificar usos presupuestales'}
                                </ButtonMui>
                            )}

                            {requiere_estudio_mercado == false && (
                                <>
                                    <div className="mt-10">
                                        <TextInput
                                            label="Valor total"
                                            id="valor_total"
                                            isCurrency={true}
                                            inputProps={{ min: 0, prefix: '$' }}
                                            value={form.data.valor_total}
                                            onChange={(e) => form.setData('valor_total', e.target.value)}
                                            error={form.errors.valor_total}
                                            required
                                        />
                                        <AlertMui>
                                            <strong>Importante:</strong> El uso presupuestal seleccionado no requiere de estudio de mercado. Por favor diligencie el VALOR TOTAL.
                                        </AlertMui>
                                    </div>
                                </>
                            )}
                            <div className="mt-8">
                                <Textarea
                                    label="Describa los bienes o servicios a adquirir. Sea específico"
                                    id="descripcion"
                                    error={form.errors.descripcion}
                                    value={form.data.descripcion}
                                    onChange={(e) => form.setData('descripcion', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-8">
                                <Textarea
                                    label="Justificación de la necesidad: ¿por qué se requiere este producto o servicio?"
                                    id="justificacion"
                                    error={form.errors.justificacion}
                                    value={form.data.justificacion}
                                    onChange={(e) => form.setData('justificacion', e.target.value)}
                                    required
                                />
                            </div>
                            {codigos_usos_presupuestales.some((item) => item.codigo_uso_presupuestal == '2010100600203101' || item.codigo_uso_presupuestal == '2020100400708') && (
                                <>
                                    <div className="mt-8">
                                        <Autocomplete
                                            id="tipo_licencia"
                                            options={tipos_licencia}
                                            label="Tipo de licencia"
                                            selectedValue={form.data.tipo_licencia}
                                            onChange={(e, newValue) => form.setData('tipo_licencia', newValue.value)}
                                            error={form.errors.tipo_licencia}
                                            placeholder="Seleccione una opción"
                                            required
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <Autocomplete
                                            id="tipo_software"
                                            options={tipos_software}
                                            label="Tipo de software"
                                            selectedValue={form.data.tipo_software}
                                            onChange={(e, newValue) => form.setData('tipo_software', newValue.value)}
                                            error={form.errors.tipo_software}
                                            placeholder="Seleccione una opción"
                                            required
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <h1 className="font-black">Periodo de uso</h1>
                                        <div className="mt-8 flex justify-between">
                                            <Label required className="mb-4" labelFor="fecha_inicio" value="Fecha de inicio" />
                                            <DatePicker
                                                label="Fecha de inicio"
                                                id="fecha_inicio"
                                                type="date"
                                                className="mt-1 p-4"
                                                value={form.data.fecha_inicio}
                                                error={form.errors.fecha_inicio}
                                                onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-8 flex justify-between">
                                            <Label className="mb-4" labelFor="fecha_finalizacion" value="Fecha de finalización (Cuando aplique)" />
                                            <DatePicker
                                                label="Fecha de finalización"
                                                id="fecha_finalizacion"
                                                type="date"
                                                className="mt-1 p-4"
                                                value={form.data.fecha_finalizacion}
                                                error={form.errors.fecha_finalizacion}
                                                onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {codigos_usos_presupuestales.some((item) => item.codigo_uso_presupuestal == '2020200800901') && (
                                <div className="mt-8">
                                    <Label required className="mb-4" labelFor="servicio_edicion_info" value="Nodo editorial" />
                                    <Autocomplete
                                        id="servicio_edicion_info"
                                        options={opciones_servicios_edicion}
                                        selectedValue={form.data.servicio_edicion_info}
                                        error={form.errors.servicio_edicion_info}
                                        onChange={(e, newValue) => form.setData('servicio_edicion_info', newValue.value)}
                                        placeholder="Seleccione una opción"
                                        required
                                    />
                                </div>
                            )}
                            {proyecto.codigo_linea_programatica == 69 && (
                                <>
                                    {(codigo_segundo_grupo_presupuestal == '2041102' || codigo_segundo_grupo_presupuestal == '2041101' || codigo_segundo_grupo_presupuestal == '2041104') && (
                                        <div className="mt-8">
                                            <Label required labelFor="concepto_viaticos" value="Concepto" />
                                            <Autocomplete
                                                id="concepto_viaticos"
                                                options={conceptos_viaticos}
                                                selectedValue={form.data.concepto_viaticos}
                                                error={form.errors.concepto_viaticos}
                                                onChange={(e, newValue) => form.setData('concepto_viaticos', newValue.value)}
                                                placeholder="Seleccione una opción"
                                                required
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </fieldset>

                        {rubro_presupuestal && <small className="flex items-center mt-14 text-app-700">{rubro_presupuestal.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    {same_values_requiere_estudio_mercado ? (
                                        <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                            {method == 'POST' ? 'Agregar' : 'Modificar'} rubro presupuestal
                                        </PrimaryButton>
                                    ) : (
                                        method == 'PUT' && (
                                            <AlertMui severity="error" className="r-10">
                                                Hay algunos usos presupuestales que requieren de estudios de mercado y otros no, por favor seleccione primero los que si requieren. Aquellos usos
                                                presupuestales que no requieren estudios debe agruparlos en otro formulario.
                                            </AlertMui>
                                        )
                                    )}

                                    <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)} className={!same_values_requiere_estudio_mercado ? '!ml-2 w-full' : ''}>
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
