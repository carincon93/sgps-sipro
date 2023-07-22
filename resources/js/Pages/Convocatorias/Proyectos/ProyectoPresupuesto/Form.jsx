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
import { Grid, Paper } from '@mui/material'
import { useEffect, useState } from 'react'

const Form = ({
    method = '',
    setDialogStatus,
    convocatoria,
    proyecto,
    rubroPresupuestal,
    tiposLicencia,
    tiposSoftware,
    opcionesServiciosEdicion,
    segundoGrupoPresupuestal,
    tercerGrupoPresupuestal,
    usosPresupuestales,
    conceptosViaticos,
}) => {
    const form = useForm({
        segundo_grupo_presupuestal_id: rubroPresupuestal?.convocatoria_presupuesto?.presupuesto_sennova?.segundo_grupo_presupuestal_id ?? null,
        tercer_grupo_presupuestal_id: rubroPresupuestal?.convocatoria_presupuesto?.presupuesto_sennova?.tercer_grupo_presupuestal_id ?? null,
        convocatoria_presupuesto_id: rubroPresupuestal?.convocatoria_presupuesto_id ?? null,
        descripcion: rubroPresupuestal?.descripcion ?? '',
        justificacion: rubroPresupuestal?.justificacion ?? '',
        numero_items: rubroPresupuestal?.numero_items ?? '',
        tipo_software: rubroPresupuestal?.software_info?.tipo_software ?? '',
        tipo_licencia: rubroPresupuestal?.software_info?.tipo_licencia ?? '',
        fecha_inicio: rubroPresupuestal?.software_info?.fecha_inicio ?? '',
        fecha_finalizacion: rubroPresupuestal?.software_info?.fecha_finalizacion ?? '',
        servicio_edicion_info: rubroPresupuestal?.servicio_edicion_info?.info ?? '',
        valor_total: rubroPresupuestal?.valor_total ?? '',
        concepto_viaticos: rubroPresupuestal?.concepto_viaticos ?? '',
    })

    const [arrayTecerGrupoPresupuestal, setArrayTecerGrupoPresupuestal] = useState([])
    const [arrayUsosPresupuestales, setArrayUsosPresupuestales] = useState([])
    const [requiereEstudioMercado, setRequiereEstudioMercado] = useState(true)
    const [codigoUsoPresupuestal, setCodigoUsoPresupuestal] = useState('')
    const [codigoSegundoGrupoPresupuestal, setCodigoSegundoGrupoPresupuestal] = useState('')
    useEffect(() => {
        setRequiereEstudioMercado(true)
        setArrayTecerGrupoPresupuestal([])
        setArrayUsosPresupuestales([])

        setTimeout(() => {
            const filteredTecerGrupoPresupuestal = tercerGrupoPresupuestal.filter((obj) => obj.segundo_grupo_presupuestal_id == form.data.segundo_grupo_presupuestal_id)
            setArrayTecerGrupoPresupuestal(filteredTecerGrupoPresupuestal)
            setCodigoSegundoGrupoPresupuestal(segundoGrupoPresupuestal.find((obj) => obj.value == form.data.segundo_grupo_presupuestal_id)?.codigo)
        }, 500)
    }, [form.data.segundo_grupo_presupuestal_id])

    useEffect(() => {
        setRequiereEstudioMercado(true)
        setArrayUsosPresupuestales([])

        setTimeout(() => {
            const filteredUsosPresupuestales = usosPresupuestales.filter(
                (obj) => obj.segundo_grupo_presupuestal_id == form.data.segundo_grupo_presupuestal_id && obj.tercer_grupo_presupuestal_id == form.data.tercer_grupo_presupuestal_id,
            )
            setArrayUsosPresupuestales(filteredUsosPresupuestales)
        }, 500)
    }, [form.data.tercer_grupo_presupuestal_id])

    useEffect(() => {
        setCodigoUsoPresupuestal(arrayUsosPresupuestales.find((obj) => obj.value == form.data.convocatoria_presupuesto_id)?.codigo_uso_presupuestal)
        setRequiereEstudioMercado(arrayUsosPresupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id)?.requiere_estudio_mercado)
    }, [form.data.convocatoria_presupuesto_id])

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'crear'
                ? form.post(route('convocatorias.proyectos.presupuesto.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.presupuesto.update', [convocatoria.id, proyecto.id, rubroPresupuestal.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">Rol SENNOVA</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit} id="form-proyecto-presupuesto">
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <div className={`${arrayTecerGrupoPresupuestal.length == 0 ? 'mb-[13.8rem]' : 'mb-0'}`}>
                                <Label required labelFor="segundo_grupo_presupuestal_id" value="Rubro concepto interno SENA" />
                                <Autocomplete
                                    id="segundo_grupo_presupuestal_id"
                                    options={segundoGrupoPresupuestal}
                                    selectedValue={form.data.segundo_grupo_presupuestal_id}
                                    onChange={(e, newValue) => form.setData('segundo_grupo_presupuestal_id', newValue.value)}
                                    error={form.errors.segundo_grupo_presupuestal_id}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </div>

                            {arrayTecerGrupoPresupuestal.length > 0 && (
                                <div className={`mt-8 ${arrayUsosPresupuestales.length == 0 ? 'mb-[7rem]' : 'mb-0'}`}>
                                    <Label required labelFor="tercer_grupo_presupuestal_id" value="Rubro concepto ministerio de hacienda" />
                                    <Autocomplete
                                        id="tercer_grupo_presupuestal_id"
                                        options={arrayTecerGrupoPresupuestal}
                                        selectedValue={form.data.tercer_grupo_presupuestal_id}
                                        onChange={(e, newValue) => form.setData('tercer_grupo_presupuestal_id', newValue.value)}
                                        error={form.errors.tercer_grupo_presupuestal_id}
                                        placeholder="Seleccione una opción"
                                        required
                                    />
                                </div>
                            )}

                            {arrayUsosPresupuestales.length > 0 && (
                                <div className="mt-8">
                                    <Label required labelFor="convocatoria_presupuesto_id" value="Usos presupuestales" />
                                    <SelectMultiple
                                        id="convocatoria_presupuesto_id"
                                        options={arrayUsosPresupuestales}
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

                            {!requiereEstudioMercado && (
                                <>
                                    <AlertMui hiddenIcon={true}>
                                        <strong>Importante:</strong> El uso presupuestal seleccionado no requiere de estudio de mercado.
                                    </AlertMui>

                                    <div className="mt-10">
                                        <TextInput
                                            label="Valor total"
                                            id="valor_total"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            className="mt-1"
                                            value={form.data.valor_total}
                                            onChange={(e) => form.setData('valor_total', e.target.value)}
                                            error={form.errors.valor_total}
                                            required
                                        />
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

                            {codigoUsoPresupuestal == '2010100600203101' && (
                                <>
                                    <div className="mt-8">
                                        <Autocomplete
                                            id="tipo_licencia"
                                            options={tiposLicencia}
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
                                            options={tiposSoftware}
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
                                                onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {codigoUsoPresupuestal == '2020200800901' && (
                                <div className="mt-8">
                                    <Label required className="mb-4" labelFor="servicio_edicion_info" value="Nodo editorial" />
                                    <Autocomplete
                                        id="servicio_edicion_info"
                                        options={opcionesServiciosEdicion}
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
                                    {(codigoSegundoGrupoPresupuestal == '2041102' || codigoSegundoGrupoPresupuestal == '2041101' || codigoSegundoGrupoPresupuestal == '2041104') && (
                                        <div className="mt-8">
                                            <Label required labelFor="concepto_viaticos" value="Concepto" />
                                            <Autocomplete
                                                id="concepto_viaticos"
                                                options={conceptosViaticos}
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

                        {rubroPresupuestal && <small className="flex items-center mt-14 text-app-700">{rubroPresupuestal.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Añadir' : 'Modificar'} rubro presupuestal
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
