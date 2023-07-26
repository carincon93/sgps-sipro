import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Checkbox from '@/Components/Checkbox'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, entidadAliada, miembroEntidadAliada, tiposDocumento, ...props }) => {
    const form = useForm({
        nombre: miembroEntidadAliada?.nombre ?? '',
        email: miembroEntidadAliada?.email ?? '',
        tipo_documento: miembroEntidadAliada?.tipo_documento ?? '',
        numero_documento: miembroEntidadAliada?.numero_documento ?? '',
        numero_celular: miembroEntidadAliada?.numero_celular ?? '',
        autorizacion_datos: miembroEntidadAliada?.autorizacion_datos ?? false,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'crear'
                ? form.post(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.store', [convocatoria.id, proyecto.id, entidadAliada.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.update', [convocatoria.id, proyecto.id, entidadAliada.id, miembroEntidadAliada.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10"> {method == 'crear' ? 'Añadir' : 'Modificar'} miembro</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <div className="mt-8">
                                <TextInput
                                    label="Nombre completo"
                                    id="nombre"
                                    type="text"
                                    value={form.data.nombre}
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    error={form.errors.nombre}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    label="Correo electrónico"
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    error={form.errors.email}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="tipo_documento"
                                    options={tiposDocumento}
                                    selectedValue={form.data.tipo_documento}
                                    onChange={(evente, newValue) => form.setData('tipo_documento', newValue.value)}
                                    error={form.errors.tipo_documento}
                                    label="Tipo de documento"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    label="Número de documento"
                                    id="numero_documento"
                                    type="number"
                                    value={form.data.numero_documento}
                                    onChange={(e) => form.setData('numero_documento', e.target.value)}
                                    error={form.errors.numero_documento}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    label="Número de celular"
                                    id="numero_celular"
                                    type="number"
                                    value={form.data.numero_celular}
                                    onChange={(e) => form.setData('numero_celular', e.target.value)}
                                    error={form.errors.numero_celular}
                                    required
                                />
                            </div>

                            {miembroEntidadAliada ? (
                                <div className="mt-8">
                                    <AlertMui>
                                        {miembroEntidadAliada.autorizacion_datos ? 'Está persona autorizó el tratamiento de datos' : 'Está persona no autorizó el tratamiento de datos'}
                                    </AlertMui>
                                </div>
                            ) : (
                                <div className="mt-8">
                                    <AlertMui className="mb-4">
                                        Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (acuerdo No. 0009 del
                                        2016)
                                    </AlertMui>
                                    <Checkbox
                                        name="autorizacion_datos"
                                        checked={form.data.autorizacion_datos}
                                        onChange={(e) => form.setData('autorizacion_datos', e.target.checked)}
                                        label="¿La persona autoriza el tratamiento de datos personales?"
                                    />
                                </div>
                            )}
                        </fieldset>

                        {miembroEntidadAliada && <small className="flex items-center text-app-700">{miembroEntidadAliada.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Añadir' : 'Modificar'} miembro
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
