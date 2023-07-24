import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'
import SelectMultiple from '@/Components/SelectMultiple'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, presupuesto, municipioAVisitar, municipios, proyectoRolesSennova, distanciasMunicipios, frecuenciasSemanales, ...props }) => {
    const form = useForm({
        actividad_a_realizar: municipioAVisitar?.actividad_a_realizar ?? '',
        municipios: JSON.parse(municipioAVisitar?.municipios) ?? null,
        distancia_municipio: municipioAVisitar?.distancia_municipio ?? '',
        frecuencia_semanal: municipioAVisitar?.frecuencia_semanal ?? '',
        numero_visitas: municipioAVisitar?.numero_visitas ?? '',
        proyecto_rol_sennova_id: municipioAVisitar?.proyecto_rol_sennova_id ?? '',
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'crear'
                ? form.post(route('convocatorias.proyectos.presupuesto.municipios.store', [convocatoria.id, proyecto.id, presupuesto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.presupuesto.municipios.update', [convocatoria.id, proyecto.id, presupuesto.id, municipioAVisitar.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">{method == 'crear' ? 'Añadir' : 'Modificar'} EDT</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <div className="mt-8">
                                <Autocomplete
                                    id="proyecto_rol_sennova_id"
                                    options={proyectoRolesSennova}
                                    selectedValue={form.data.proyecto_rol_sennova_id}
                                    onChange={(event, newValue) => form.setData('proyecto_rol_sennova_id', newValue.value)}
                                    error={form.errors.proyecto_rol_sennova_id}
                                    label="Rol"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="actividad_a_realizar"
                                    error={form.errors.actividad_a_realizar}
                                    value={form.data.actividad_a_realizar}
                                    onChange={(e) => form.setData('actividad_a_realizar', e.target.value)}
                                    label="Actividades a realizar"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <SelectMultiple
                                    id="municipios"
                                    bdValues={form.data.municipios}
                                    options={municipios}
                                    isGroupable={true}
                                    groupBy={(option) => option.group}
                                    onChange={(event, newValue) => {
                                        const selectedValues = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            municipios: selectedValues,
                                        }))
                                    }}
                                    error={form.errors.municipios}
                                    label="Municipios a visitar"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="distancia_municipio"
                                    options={distanciasMunicipios}
                                    selectedValue={form.data.distancia_municipio}
                                    onChange={(event, newValue) => form.setData('distancia_municipio', newValue.value)}
                                    error={form.errors.distancia_municipio}
                                    label="Distancia municipio"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="frecuencia_semanal"
                                    options={frecuenciasSemanales}
                                    selectedValue={form.data.frecuencia_semanal}
                                    onChange={(event, newValue) => form.setData('frecuencia_semanal', newValue.value)}
                                    error={form.errors.frecuencia_semanal}
                                    label="Frecuencia semanal de visita"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="numero_visitas"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    error={form.errors.numero_visitas}
                                    value={form.data.numero_visitas}
                                    onChange={(e) => form.setData('numero_visitas', e.target.value)}
                                    label="Número de visitas"
                                    required
                                />
                            </div>
                        </fieldset>

                        {municipioAVisitar && <small className="flex items-center text-app-700">{municipioAVisitar.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Añadir' : 'Modificar'} municipio
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
