import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, seguimiento, equipo_ambiente_modernizacion, roles_sennova, ...props }) => {
    const form = useForm({
        id: equipo_ambiente_modernizacion?.id,
        seguimiento_ambiente_modernizacion_id: seguimiento?.id,
        numero_inventario_equipo: equipo_ambiente_modernizacion?.numero_inventario_equipo,
        nombre_equipo: equipo_ambiente_modernizacion?.nombre_equipo,
        descripcion_tecnica_equipo: equipo_ambiente_modernizacion?.descripcion_tecnica_equipo,
        estado_equipo: equipo_ambiente_modernizacion?.estado_equipo,
        equipo_en_funcionamiento: equipo_ambiente_modernizacion?.equipo_en_funcionamiento,
        observaciones_generales: equipo_ambiente_modernizacion?.observaciones_generales,
        marca: equipo_ambiente_modernizacion?.marca,
        horas_promedio_uso: equipo_ambiente_modernizacion?.horas_promedio_uso,
        frecuencia_mantenimiento: equipo_ambiente_modernizacion?.frecuencia_mantenimiento,
        year_adquisicion: equipo_ambiente_modernizacion?.year_adquisicion,
        nombre_cuentadante: equipo_ambiente_modernizacion?.nombre_cuentadante,
        cedula_cuentadante: equipo_ambiente_modernizacion?.cedula_cuentadante,
        rol_cuentadante: equipo_ambiente_modernizacion?.rol_cuentadante,
    })

    let estados_equipo = [
        { value: 'Bueno', label: 'Bueno' },
        { value: 'Regular', label: 'Regular' },
        { value: 'Malo', label: 'Malo' },
    ]

    let opciones_frecuencia = [
        { value: 'N/A', label: 'N/A' },
        { value: 'Semanal', label: 'Semanal' },
        { value: 'Mensual', label: 'Mensual' },
        { value: 'Trimestral', label: 'Trimestral' },
        { value: 'Semestral', label: 'Semestral' },
        { value: 'Anual', label: 'Anual' },
    ]

    const submit = (e) => {
        e.preventDefault()
        form.post(route('equipos-ambiente-modernizacion.update-create-equipo', [seguimiento.id]), {
            onSuccess: () => setDialogStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} equipo</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={8}>
                            <Grid item md={12}>
                                <TextInput
                                    label="Número de inventario del equipo o máquina"
                                    id="numero_inventario_equipo"
                                    type="text"
                                    value={form.data.numero_inventario_equipo}
                                    error={form.errors.numero_inventario_equipo}
                                    onChange={(e) => form.setData('numero_inventario_equipo', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <TextInput
                                    label="Año de adquisición del equipo o maquina"
                                    id="year_adquisicion"
                                    inputProps={{
                                        min: 2010,
                                    }}
                                    type="number"
                                    value={form.data.year_adquisicion}
                                    error={form.errors.year_adquisicion}
                                    onChange={(e) => form.setData('year_adquisicion', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <TextInput
                                    label="Nombre del equipo o máquina"
                                    id="nombre_equipo"
                                    type="text"
                                    value={form.data.nombre_equipo}
                                    error={form.errors.nombre_equipo}
                                    onChange={(e) => form.setData('nombre_equipo', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <TextInput label="Marca" id="marca" type="text" value={form.data.marca} error={form.errors.marca} onChange={(e) => form.setData('marca', e.target.value)} required />
                            </Grid>

                            <Grid item md={12}>
                                <Textarea
                                    label="Descripción general técnica del equipo o máquina"
                                    id="descripcion_tecnica_equipo"
                                    value={form.data.descripcion_tecnica_equipo}
                                    error={form.errors.descripcion_tecnica_equipo}
                                    onChange={(e) => form.setData('descripcion_tecnica_equipo', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <TextInput
                                    label="Promedio de horas de uso al año"
                                    id="horas_promedio_uso"
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    value={form.data.horas_promedio_uso}
                                    error={form.errors.horas_promedio_uso}
                                    onChange={(e) => form.setData('horas_promedio_uso', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    label="Estado del equipo o máquina (Bueno, Regular, Malo)"
                                    id="estado_equipo"
                                    options={estados_equipo}
                                    selectedValue={form.data.estado_equipo}
                                    onChange={(event, newValue) => form.setData('estado_equipo', newValue.value)}
                                    error={form.errors.estado_equipo}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    label="¿El equipo o máquina está funcionamiento? SI/NO"
                                    id="equipo_en_funcionamiento"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.equipo_en_funcionamiento}
                                    onChange={(event, newValue) => form.setData('equipo_en_funcionamiento', newValue.value)}
                                    error={form.errors.equipo_en_funcionamiento}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    label="¿Con qué frecuencia requiere mantenimiento preventivo el equipo o maquina?"
                                    id="frecuencia_mantenimiento"
                                    options={opciones_frecuencia}
                                    selectedValue={form.data.frecuencia_mantenimiento}
                                    onChange={(event, newValue) => form.setData('frecuencia_mantenimiento', newValue.value)}
                                    error={form.errors.frecuencia_mantenimiento}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Textarea
                                    label="Observaciones generales"
                                    id="observaciones_generales"
                                    value={form.data.observaciones_generales}
                                    error={form.errors.observaciones_generales}
                                    onChange={(e) => form.setData('observaciones_generales', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <h1 className="text-cener font-black">Información del cuentadante</h1>
                            </Grid>

                            <Grid item md={12}>
                                <TextInput
                                    label="Nombre completo"
                                    id="nombre_cuentadante"
                                    type="text"
                                    value={form.data.nombre_cuentadante}
                                    error={form.errors.nombre_cuentadante}
                                    onChange={(e) => form.setData('nombre_cuentadante', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <TextInput
                                    label="Número de cédula"
                                    id="cedula_cuentadante"
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    value={form.data.cedula_cuentadante}
                                    error={form.errors.cedula_cuentadante}
                                    onChange={(e) => form.setData('cedula_cuentadante', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    label="Rol del cuentadante"
                                    id="rol_cuentadante"
                                    options={roles_sennova}
                                    selectedValue={form.data.rol_cuentadante}
                                    onChange={(event, newValue) => form.setData('rol_cuentadante', newValue.value)}
                                    error={form.errors.rol_cuentadante}
                                    placeholder="Seleccione una opción"
                                    required
                                />
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
