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
import { useEffect } from 'react'
import { useState } from 'react'

const Form = ({ isSuperAdmin, method = '', setDialogStatus, convocatoria, proyecto, actividad, proyectoPresupuesto, proyectoRoles, productos, ...props }) => {
    const [resultadosFiltrados, setResultadosFiltrados] = useState([])
    const form = useForm({
        resultado_id: actividad?.resultado_id ?? '',
        descripcion: actividad?.descripcion ?? '',
        fecha_inicio: actividad?.fecha_inicio ?? '',
        fecha_finalizacion: actividad?.fecha_finalizacion ?? null,
        proyecto_presupuesto_id: '' ?? null,
        proyecto_rol_sennova_id: '' ?? null,
        requiere_rubros: actividad?.proyecto_presupuesto.length == 0 ? 2 : 1,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.actividades.update', [convocatoria.id, proyecto.id, actividad.id]), {
                preserveScroll: true,
            })
        }
    }

    useEffect(() => {
        const tmpOptionsFiltered = actividad.objetivo_especifico.resultados.map((option) => {
            const { id, descripcion } = option
            return { value: id, label: descripcion }
        })

        setResultadosFiltrados(tmpOptionsFiltered)
    }, [actividad])

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">Modificar actividad</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset className="p-8" disabled={proyecto.allowed.to_update ? false : true}>
                            <div className="mt-8">
                                <p className="text-center">Fecha de ejecución</p>
                                <div className="ml-2 mt-4">
                                    <div>
                                        <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                                        <div className="ml-14">
                                            <DatePicker
                                                id="fecha_inicio"
                                                className="mt-1 block w-full p-4"
                                                min={proyecto.fecha_inicio}
                                                max={proyecto.fecha_finalizacion}
                                                value={form.data.fecha_inicio}
                                                onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                                                error={form.errors.fecha_inicio}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                                        <div className="ml-4">
                                            <DatePicker
                                                id="fecha_finalizacion"
                                                className="mt-1 block w-full p-4"
                                                min={proyecto.fecha_inicio}
                                                max={proyecto.fecha_finalizacion}
                                                value={form.data.fecha_finalizacion}
                                                onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                                                error={form.errors.fecha_finalizacion}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-20">
                                <Label labelFor="resultado_id" value="Resultado" />
                                <Autocomplete
                                    id="resultado_id"
                                    options={resultadosFiltrados}
                                    selectedValue={form.data.resultado_id}
                                    error={form.errors.resultado_id}
                                    onChange={(event, newValue) => form.setData('resultado_id', newValue.value)}
                                    placeholder="Seleccione un resultado"
                                    required
                                />
                            </div>

                            <div className="mt-20">
                                <Textarea
                                    disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false}
                                    label="Descripción"
                                    id="descripcion"
                                    error={form.errors.descripcion}
                                    value={form.data.descripcion}
                                    onChange={(e) => form.setData('descripcion', e.target.value)}
                                    required
                                />
                            </div>

                            <h6 className="mt-20 mb-12 text-2xl">Rubros presupuestales</h6>

                            <AlertMui className="mb-6" hiddenIcon={true}>
                                Si la actividad no requiere asociar un rubro presupuestal. (Ej: Actividad de PQRS) <br /> Por favor, cambie la siguiente opción a <strong>No</strong>
                                <hr className="mb-10" />
                                IMPORTANTE: Solo para actividades que no requieran asociar algún rubro presupuestal. Para el resto de actividades SI debe asociar un rubro para poder completar la
                                <strong className="ml-1.5">Cadena de valor</strong>.
                                <div className="mt-4">
                                    <span className="font-black mr-2">Opción seleccionada:</span>
                                    <br />
                                    <Autocomplete
                                        options={[
                                            { value: 1, label: 'Si' },
                                            { value: 2, label: 'No' },
                                        ]}
                                        id="requiere_rubros"
                                        selectedValue={form.data.requiere_rubros}
                                        error={form.errors.requiere_rubros}
                                        onChange={(event, newValue) => form.setData('requiere_rubros', newValue.value)}
                                        placeholder="Seleccione una opción"
                                        required
                                    />
                                </div>
                            </AlertMui>
                            {form.data.requiere_rubros == 1 && (
                                <div className="bg-white max-h-[600px] overflow-y-auto rounded shadow">
                                    <div className="p-4">
                                        <Label required className="mb-4" labelFor="proyecto_presupuesto_id" value="Relacione algún rubro" />
                                    </div>

                                    <div>
                                        <SelectMultiple
                                            id="proyecto_presupuesto_id"
                                            bdValues={form.data.proyecto_presupuesto_id}
                                            options={proyectoPresupuesto}
                                            error={form.errors.proyecto_presupuesto_id}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    proyecto_presupuesto_id: selectedValues,
                                                }))
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <h6 className="mt-20 mb-12 text-2xl">Roles</h6>
                            <AlertMui hiddenIcon={true}>Si la actividad tiene un responsable por favor seleccione el rol de la siguiente lista</AlertMui>
                            <div className="bg-white rounded shadow overflow-hidden">
                                <div className="p-4">
                                    <Label className="mb-4" labelFor="proyecto_rol_sennova_id" value="Relacione algún rol" />
                                </div>
                                <div>
                                    <SelectMultiple
                                        id="proyecto_rol_sennova_id"
                                        bdValues={form.data.proyecto_rol_sennova_id}
                                        options={proyectoRoles}
                                        error={form.errors.proyecto_rol_sennova_id}
                                        onChange={(event, newValue) => {
                                            const selectedValues = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                proyecto_rol_sennova_id: selectedValues,
                                            }))
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {actividad && <small className="flex items-center text-app-700">{actividad.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Añadir' : 'Modificar'} actividad
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
