import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, convocatoria_rol_sennova, tipo_formulario_convocatoria_id, roles_sennova, niveles_academicos, ...props }) => {
    const form = useForm({
        rol_sennova_id: convocatoria_rol_sennova?.rol_sennova_id,
        tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id,
        habilitado: convocatoria_rol_sennova?.habilitado,
        sumar_al_presupuesto: convocatoria_rol_sennova?.sumar_al_presupuesto,
        asignacion_mensual: convocatoria_rol_sennova?.asignacion_mensual,
        experiencia: convocatoria_rol_sennova?.experiencia,
        nivel_academico: convocatoria_rol_sennova?.nivel_academico,
        meses_maximos: convocatoria_rol_sennova?.meses_maximos,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.convocatoria-roles-sennova.store', [convocatoria.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('convocatorias.convocatoria-roles-sennova.update', [convocatoria.id, convocatoria_rol_sennova.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} rol SENNOVA</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <div className="mt-8">
                                {method == 'POST' ? (
                                    <Autocomplete
                                        id="rol_sennova_id"
                                        options={roles_sennova}
                                        selectedValue={form.data.rol_sennova_id}
                                        onChange={(event, newValue) => form.setData('rol_sennova_id', newValue.value)}
                                        error={form.errors.rol_sennova_id}
                                        label="Roles SENNOVA"
                                        required
                                    />
                                ) : (
                                    convocatoria_rol_sennova.rol_sennova.nombre
                                )}
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="nivel_academico"
                                    options={niveles_academicos}
                                    selectedValue={form.data.nivel_academico}
                                    onChange={(event, newValue) => form.setData('nivel_academico', newValue.value)}
                                    error={form.errors.nivel_academico}
                                    label="Nivel académico"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="asignacion_mensual"
                                    name="asignacion_mensual"
                                    label={`Asignación mensual ${convocatoria.year}`}
                                    isCurrency={true}
                                    inputProps={{
                                        min: 0,
                                        prefix: '$',
                                    }}
                                    value={form.data.asignacion_mensual}
                                    onChange={(e) => form.setData('asignacion_mensual', e.target.value)}
                                    error={form.errors.asignacion_mensual}
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="experiencia"
                                    name="experiencia"
                                    label="Experiencia requerida"
                                    value={form.data.experiencia}
                                    onChange={(e) => form.setData('experiencia', e.target.value)}
                                    error={form.errors.experiencia}
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    type="number"
                                    id="meses_maximos"
                                    inputProps={{
                                        step: 0.1,
                                        min: 1,
                                        max: 12,
                                    }}
                                    value={form.data.meses_maximos}
                                    onChange={(e) => form.setData('meses_maximos', e.target.value)}
                                    label="Número máximo de meses de vinculación"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Label required value="¿El rol SENNOVA está habilitado?" labelFor="habilitado" />
                                <SwitchMui checked={form.data.habilitado} onChange={(e) => form.setData('habilitado', e.target.checked)} />
                            </div>

                            <div className="mt-8">
                                <Label required value="¿El rol SENNOVA suma al presupuesto del proyecto?" labelFor="sumar_al_presupuesto" />

                                <SwitchMui checked={form.data.sumar_al_presupuesto} onChange={(e) => form.setData('sumar_al_presupuesto', e.target.checked)} />
                            </div>
                        </fieldset>

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                {method == 'POST' ? 'Agregar' : 'Modificar'} rol SENNOVA
                            </PrimaryButton>
                            <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)}>
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
