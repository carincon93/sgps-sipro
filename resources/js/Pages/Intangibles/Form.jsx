import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', is_super_admin, setDialogStatus, intangible, tipos_intangibles, ...props }) => {
    const form = useForm({
        _method: method,
        codigo_intangible: intangible?.codigo_intangible,
        nombre_intangible: intangible?.nombre_intangible,
        fecha_cierre_vigencia: intangible?.fecha_cierre_vigencia,
        fecha_cierre_vigencia_presupuestal: intangible?.fecha_cierre_vigencia_presupuestal,
        tipo_intangible: intangible?.tipo_intangible,
        clase_intangible: intangible?.clase_intangible,

        recurso_controlado: intangible?.recurso_controlado,
        observacion_recurso: intangible?.observacion_recurso,
        potencial_servicios: intangible?.potencial_servicios,
        observacion_potencial_servicios: intangible?.observacion_potencial_servicios,
        fiabilidad: intangible?.fiabilidad,
        observacion_fiabilidad: intangible?.observacion_fiabilidad,
        identificar: intangible?.identificar,
        observacion_identificar: intangible?.observacion_identificar,
        monetario: intangible?.monetario,
        observacion_monetario: intangible?.observacion_monetario,
        apariencia_fisica: intangible?.apariencia_fisica,
        observacion_apariencia_fisica: intangible?.observacion_apariencia_fisica,
        uso_mas_vigencias: intangible?.uso_mas_vigencias,
        observacion_uso_vigencias: intangible?.observacion_uso_vigencias,
        actividades_entidad: intangible?.actividades_entidad,
        observacion_actividades_entidad: intangible?.observacion_actividades_entidad,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('intangibles.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('intangibles.update', [intangible.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Preguntas aplicables a los intangibles SENNOVA' : 'Modificar intangible SENNOVA'} </h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={8}>
                            <Grid item md={12}>
                                <Label required labelFor="codigo_intangible" value="Código" />
                                <TextInput
                                    id="codigo_intangible"
                                    type="text"
                                    value={form.data.codigo_intangible}
                                    error={form.errors.codigo_intangible}
                                    onChange={(e) => form.setData('codigo_intangible', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="nombre_intangible" value="Nombre del intangible" />
                                <TextInput
                                    id="nombre_intangible"
                                    type="text"
                                    value={form.data.nombre_intangible}
                                    error={form.errors.nombre_intangible}
                                    onChange={(e) => form.setData('nombre_intangible', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required labelFor="tipo_intangible" value="Tipo de intangible" />
                                <Autocomplete
                                    id="tipo_intangible"
                                    options={tipos_intangibles}
                                    selectedValue={form.data.tipo_intangible}
                                    onChange={(event, newValue) => form.setData('tipo_intangible', newValue.value)}
                                    error={form.errors.tipo_intangible}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required labelFor="clase_intangible" value="Clase de intangible" />
                                <Autocomplete
                                    id="clase_intangible"
                                    options={[]}
                                    selectedValue={form.data.clase_intangible}
                                    onChange={(event, newValue) => form.setData('clase_intangible', newValue.value)}
                                    error={form.errors.tipo_intangible}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required labelFor="fecha_cierre_vigencia" value="Fecha de cierre del proyecto con vigencia 20XX que cierra técnicamente en la vigencia 20XX" />
                                <DatePicker
                                    variant="outlined"
                                    id="fecha_cierre_vigencia"
                                    className="w-full"
                                    value={form.data.fecha_cierre_vigencia}
                                    onChange={(e) => form.setData('fecha_cierre_vigencia', e.target.value)}
                                    error={form.errors.fecha_cierre_vigencia}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required labelFor="fecha_cierre_vigencia_presupuestal" value="Fecha de cierre del proyecto presupuestalmente en la vigencia 20XX" />
                                <DatePicker
                                    variant="outlined"
                                    id="fecha_cierre_vigencia_presupuestal"
                                    className="w-full"
                                    value={form.data.fecha_cierre_vigencia_presupuestal}
                                    onChange={(e) => form.setData('fecha_cierre_vigencia_presupuestal', e.target.value)}
                                    error={form.errors.fecha_cierre_vigencia_presupuestal}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="recurso_controlado" value="¿El intangible es un recurso controlado?" />
                                <SwitchMui className="!my-6" checked={form.data.recurso_controlado} onChange={(e) => form.setData('recurso_controlado', e.target.checked)} />
                                {form.data.recurso_controlado && (
                                    <Textarea
                                        label="Observación"
                                        className="mt-4"
                                        inputBackground="#fff"
                                        id="observacion_recurso"
                                        value={form.data.observacion_recurso}
                                        error={form.errors.observacion_recurso}
                                        onChange={(e) => form.setData('observacion_recurso', e.target.value)}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="potencial_servicios" value="¿Del intangible se espera obtener un potencial de servicios?" />
                                <SwitchMui className="!my-6" checked={form.data.potencial_servicios} onChange={(e) => form.setData('potencial_servicios', e.target.checked)} />
                                {form.data.potencial_servicios && (
                                    <Textarea
                                        label="Observación"
                                        className="mt-4"
                                        inputBackground="#fff"
                                        id="observacion_potencial_servicios"
                                        value={form.data.observacion_potencial_servicios}
                                        error={form.errors.observacion_potencial_servicios}
                                        onChange={(e) => form.setData('observacion_potencial_servicios', e.target.value)}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="fiabilidad" value="¿El intangible se puede medir fiablemente?" />
                                <SwitchMui className="!my-6" checked={form.data.fiabilidad} onChange={(e) => form.setData('fiabilidad', e.target.checked)} />
                                {form.data.fiabilidad && (
                                    <Textarea
                                        label="Observación"
                                        className="mt-4"
                                        inputBackground="#fff"
                                        id="observacion_fiabilidad"
                                        value={form.data.observacion_fiabilidad}
                                        error={form.errors.observacion_fiabilidad}
                                        onChange={(e) => form.setData('observacion_fiabilidad', e.target.value)}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="identificar" value="¿El intangible se puede identificar?" />
                                <SwitchMui className="!my-6" checked={form.data.identificar} onChange={(e) => form.setData('identificar', e.target.checked)} />
                                {form.data.identificar && (
                                    <Textarea
                                        label="Observación"
                                        className="mt-4"
                                        inputBackground="#fff"
                                        id="observacion_identificar"
                                        value={form.data.observacion_identificar}
                                        error={form.errors.observacion_identificar}
                                        onChange={(e) => form.setData('observacion_identificar', e.target.value)}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="monetario" value="¿El intangible NO es considerado monetario?" />
                                <SwitchMui className="!my-6" checked={form.data.monetario} onChange={(e) => form.setData('monetario', e.target.checked)} />
                                {form.data.monetario && (
                                    <Textarea
                                        label="Observación"
                                        className="mt-4"
                                        inputBackground="#fff"
                                        id="observacion_monetario"
                                        value={form.data.observacion_monetario}
                                        error={form.errors.observacion_monetario}
                                        onChange={(e) => form.setData('observacion_monetario', e.target.value)}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="apariencia_fisica" value="¿El intangible es sin apariencia física?" />
                                <SwitchMui className="!my-6" checked={form.data.apariencia_fisica} onChange={(e) => form.setData('apariencia_fisica', e.target.checked)} />
                                {form.data.apariencia_fisica && (
                                    <Textarea
                                        label="Observación"
                                        className="mt-4"
                                        inputBackground="#fff"
                                        id="observacion_apariencia_fisica"
                                        value={form.data.observacion_apariencia_fisica}
                                        error={form.errors.observacion_apariencia_fisica}
                                        onChange={(e) => form.setData('observacion_apariencia_fisica', e.target.value)}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="uso_mas_vigencias" value="¿El intangible se va a utilizar por más de un año?" />
                                <SwitchMui className="!my-6" checked={form.data.uso_mas_vigencias} onChange={(e) => form.setData('uso_mas_vigencias', e.target.checked)} />
                                {form.data.uso_mas_vigencias && (
                                    <Textarea
                                        label="Observación"
                                        className="mt-4"
                                        inputBackground="#fff"
                                        id="observacion_uso_vigencias"
                                        value={form.data.observacion_uso_vigencias}
                                        error={form.errors.observacion_uso_vigencias}
                                        onChange={(e) => form.setData('observacion_uso_vigencias', e.target.value)}
                                        required
                                    />
                                )}
                            </Grid>

                            <Grid item md={12}>
                                <Label required labelFor="actividades_entidad" value="¿No se espera vender en el curso de las actividades de la entidad?" />
                                <SwitchMui className="!my-6" checked={form.data.actividades_entidad} onChange={(e) => form.setData('actividades_entidad', e.target.checked)} />
                                {form.data.actividades_entidad && (
                                    <Textarea
                                        label="Observación"
                                        className="mt-4"
                                        inputBackground="#fff"
                                        id="observacion_actividades_entidad"
                                        value={form.data.observacion_actividades_entidad}
                                        error={form.errors.observacion_actividades_entidad}
                                        onChange={(e) => form.setData('observacion_actividades_entidad', e.target.value)}
                                        required
                                    />
                                )}
                            </Grid>
                        </Grid>

                        <div className="py-4 flex items-center justify-end">
                            <PrimaryButton disabled={form.processing || !form.isDirty} type="submit">
                                Guardar cambios
                            </PrimaryButton>
                            <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)} className="!ml-2">
                                Cancelar
                            </ButtonMui>
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Form
