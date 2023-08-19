import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', convocatoria, proyecto, setDialogStatus, proyecto_rol_sennova, convocatoria_roles_sennova, lineas_tecnologicas, actividades }) => {
    const form = useForm({
        proyecto_id: proyecto.id,
        numero_meses: proyecto_rol_sennova?.numero_meses,
        numero_roles: proyecto_rol_sennova?.numero_roles,
        descripcion: proyecto_rol_sennova?.descripcion,
        educacion: proyecto_rol_sennova?.educacion,
        formacion: proyecto_rol_sennova?.formacion,
        experiencia: proyecto_rol_sennova?.experiencia,
        convocatoria_rol_sennova_id: proyecto_rol_sennova?.convocatoria_rol_sennova_id,
        actividad_id: proyecto_rol_sennova?.actividades.map((item) => item.id),
        linea_tecnologica_id:
            proyecto_rol_sennova?.lineas_tecnoacademia.length > 0 ? proyecto_rol_sennova?.lineas_tecnoacademia.map((item) => item.id) : proyecto_rol_sennova?.lineas_tecnoparque.map((item) => item.id),
        numero_monitorias: proyecto_rol_sennova?.numero_roles,
        numero_meses_monitorias: proyecto_rol_sennova?.numero_meses,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos.proyecto-rol-sennova.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                  })
                : form.put(route('convocatorias.proyectos.proyecto-rol-sennova.update', [convocatoria.id, proyecto.id, proyecto_rol_sennova.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    const roles_sennova_incompletos = convocatoria_roles_sennova.some((item) => item.label === null)

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Rol SENNOVA</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto?.allowed?.to_update ? false : true}>
                            <div>
                                {!roles_sennova_incompletos ? (
                                    <Autocomplete
                                        id="convocatoria_rol_sennova_id"
                                        label="Rol SENNOVA"
                                        options={convocatoria_roles_sennova}
                                        selectedValue={form.data.convocatoria_rol_sennova_id}
                                        error={form.errors.convocatoria_rol_sennova_id}
                                        onChange={(event, newValue) => {
                                            form.setData('convocatoria_rol_sennova_id', newValue.value)
                                        }}
                                        required
                                    />
                                ) : (
                                    <AlertMui severity="error">
                                        Aún no se ha completado la información de los roles, por favor revise los canales de ayuda e informe al respectivo activador(a) para que actualice la
                                        información.
                                    </AlertMui>
                                )}
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="descripcion"
                                    error={form.errors.descripcion}
                                    label="Descripción del perfil requerido"
                                    value={form.data.descripcion}
                                    onChange={(e) => {
                                        form.setData('descripcion', e.target.value)
                                    }}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    label="Número de meses que requiere el apoyo"
                                    id="numero_meses"
                                    type="number"
                                    inputProps={{
                                        step: 0.1,
                                        min: 1,
                                        max: proyecto.diff_meses,
                                    }}
                                    className="mt-1"
                                    error={form.errors.numero_meses}
                                    value={form.data.numero_meses}
                                    onChange={(e) => {
                                        form.setData('numero_meses', e.target.value)
                                    }}
                                    required
                                />

                                <AlertMui>
                                    El proyecto se ejecutará entre {proyecto.fecha_inicio} y {proyecto.fecha_finalizacion}, por lo tanto el número de meses máximo es: {proyecto.diff_meses}
                                </AlertMui>
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    label="Número de personas requeridas"
                                    id="numero_roles"
                                    type="number"
                                    inputProps={{
                                        min: 1,
                                    }}
                                    className="mt-1"
                                    error={form.errors.numero_roles}
                                    value={form.data.numero_roles}
                                    onChange={(e) => {
                                        form.setData('numero_roles', e.target.value)
                                    }}
                                    required
                                />
                            </div>

                            <h6 className="mt-20 mb-6 text-2xl">Actividades que debe ejecutar el rol</h6>
                            <div>
                                <SelectMultiple
                                    id="actividad_id"
                                    bdValues={form.data.actividad_id}
                                    options={actividades}
                                    onChange={(event, newValue) => {
                                        const selectedValues = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            actividad_id: selectedValues,
                                        }))
                                    }}
                                    error={form.errors.actividad_id}
                                    label="Relacione las respectivas actividades"
                                    required
                                />
                                {actividades.length === 0 && <AlertMui error={true}>Importante: No ha creado actividades</AlertMui>}
                            </div>
                        </fieldset>
                        {proyecto_rol_sennova && <small className="flex items-center my-10 text-app-700">{proyecto_rol_sennova.updated_at}</small>}
                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto?.allowed?.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing || roles_sennova_incompletos || !form.isDirty} className="mr-2 ml-auto" type="submit">
                                        {method == 'POST' ? 'Agregar' : 'Modificar'} rol SENNOVA
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
