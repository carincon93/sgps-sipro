import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const FormServiciosEdicionInfo = ({ is_super_admin, method = '', setDialogStatus, convocatoria, proyecto, rubro_presupuestal, opciones_servicios_edicion }) => {
    const form = useForm({
        info: rubro_presupuestal?.nodo_editorial_info?.info ?? '',
    })

    const submit = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.presupuesto.nodos-editoriales', [convocatoria.id, proyecto.id, rubro_presupuestal.id]), {
                onSuccess: () => setDialogStatus(false),
                preserveScroll: true,
            })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Información del nodo editorial</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit} id="form-proyecto-presupuesto">
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <div className="mt-8">
                                <Autocomplete
                                    id="info"
                                    options={opciones_servicios_edicion}
                                    selectedValue={form.data.info}
                                    error={form.errors.info}
                                    onChange={(e, newValue) => form.setData('info', newValue.value)}
                                    label="Seleccione el nodo editorial"
                                    required
                                />
                            </div>
                        </fieldset>

                        {rubro_presupuestal && <small className="flex items-center mt-14 text-app-700">{rubro_presupuestal.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'POST' ? 'Agregar' : 'Modificar'} información del nodo editorial
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

export default FormServiciosEdicionInfo
