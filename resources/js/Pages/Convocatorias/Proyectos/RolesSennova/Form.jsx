import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useEffect, useState } from 'react'

const Form = ({ proyecto, proyectoRolSennova, convocatoriaRolesSennova, form, submit, lineasTecnologicas, actividades }) => {
    const [diffMeses, setDiffMeses] = useState(proyecto.diff_meses)
    useEffect(() => {
        if (form.convocatoria_rol_sennova_id) {
            if (proyecto.codigo_linea_programatica === 68) {
                form.numero_meses = proyecto.max_meses_ejecucion
            }
        }
    }, [form.convocatoria_rol_sennova_id, proyecto.codigo_linea_programatica, proyecto.max_meses_ejecucion])

    let esFacilitador
    let esMonitor
    useEffect(() => {
        esFacilitador = form.convocatoria_rol_sennova_id?.label?.includes('facilitador') || form.convocatoria_rol_sennova_id?.label?.includes('Facilitador')
        esMonitor = form.convocatoria_rol_sennova_id?.label?.includes('monitor') || form.convocatoria_rol_sennova_id?.label?.includes('Monitor')
    }, [form.convocatoria_rol_sennova_id])

    const selectRolSennova = (event, label = null) => {
        esFacilitador = event.detail.label.includes('facilitador') || event.detail.label.includes('Facilitador')
        esMonitor = event.detail.label.includes('monitor') || event.detail.label.includes('Monitor')
    }

    const numeroMonitoria = [
        {
            value: 1,
            label: '1 monitor(a)',
        },
        {
            value: 2,
            label: '2 monitores',
        },
        {
            value: 3,
            label: '3 monitores',
        },
        {
            value: 4,
            label: '4 monitores',
        },
    ]

    return (
        <form onSubmit={submit}>
            <fieldset className="p-8" disabled={proyecto?.allowed?.to_update ? undefined : true}>
                <div className="mt-8">
                    <Autocomplete
                        id="convocatoria_rol_sennova_id"
                        label="Rol SENNOVA"
                        options={convocatoriaRolesSennova}
                        selectedValue={form.data.convocatoria_rol_sennova_id}
                        error={form.errors.convocatoria_rol_sennova_id}
                        onChange={(event, newValue) => {
                            form.setData('convocatoria_rol_sennova_id', newValue.value)
                        }}
                        required
                    />
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

                {proyecto.codigo_linea_programatica !== 68 && esMonitor === false && (
                    <div className="mt-8">
                        <TextInput
                            label="Número de meses que requiere el apoyo"
                            id="numero_meses"
                            type="number"
                            inputProps={{
                                min: 1,
                                max: diffMeses < 6 ? 6 : diffMeses,
                                step: '0.1',
                            }}
                            className="mt-1"
                            error={form.errors.numero_meses}
                            value={form.data.numero_meses}
                            required
                        />

                        <AlertMui>
                            El proyecto se ejecutará entre {proyecto.fecha_inicio} y {proyecto.fecha_finalizacion}, por lo tanto el número de meses máximo es: {diff_meses}
                        </AlertMui>
                    </div>
                )}

                {esMonitor === true && (
                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="numero_meses_monitorias" value="Número meses" />
                        <Autocomplete
                            id="numero_meses_monitorias"
                            options={[
                                {
                                    value: 3,
                                    label: '3 meses',
                                },
                                {
                                    value: 4,
                                    label: '4 meses',
                                },
                                {
                                    value: 5,
                                    label: '5 meses',
                                },
                                {
                                    value: 6,
                                    label: '6 meses',
                                },
                            ]}
                            selectedValue={form.data.numero_meses_monitorias}
                            error={form.errors.numero_meses_monitorias}
                            placeholder="Seleccione la cantidad de meses"
                            required
                        />
                    </div>
                )}

                {esMonitor === false && (
                    <div className="mt-8">
                        <TextInput label="Número de personas requeridas" id="numero_roles" type="number" input$min="1" input$max={esMonitor ? 4 : undefined} className="mt-1" error={form.errors.numero_roles} value={form.data.numero_roles} required />
                    </div>
                )}

                {(esFacilitador || proyecto.codigo_linea_programatica === 69) && (
                    <>
                        <h6 className="mt-20 mb-12 text-2xl">Líneas tecnológicas</h6>
                        <AlertMui className="ml-10 mb-6">Seleccione una o varias líneas</AlertMui>
                        <div className="bg-white rounded shadow overflow-hidden">
                            <div className="p-4">
                                <Label className="mb-4" labelFor="linea_tecnologica_id" value="Relacione alguna línea" />
                            </div>
                            <div className="flex flex-col">
                                <SelectMultiple
                                    id="linea_tecnologica_id"
                                    options={lineasTecnologicas}
                                    onChange={(event, newValue) => {
                                        const selectedValues = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            linea_tecnologica_id: selectedValues,
                                        }))
                                    }}
                                    error={form.errors.linea_tecnologica_id}
                                    required
                                />
                                {lineasTecnologicas.length === 0 && <p className="p-4">Sin información registrada</p>}
                            </div>
                        </div>
                    </>
                )}

                <h6 className="mt-20 mb-6 text-2xl">Actividades</h6>
                <div>
                    <AlertMui hiddenIcon={true} className="mb-6">
                        Seleccione las actividades que debe ejecutar el rol
                    </AlertMui>
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
                    {actividades.length === 0 && <p className="p-4">Sin información registrada</p>}
                </div>
            </fieldset>
            <div className="flex items-center justify-between mt-14 px-8 py-4">
                {proyectoRolSennova && (
                    <small className="flex items-center text-app-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {proyectoRolSennova.updated_at}
                    </small>
                )}
                {proyecto?.allowed?.to_update ? (
                    <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                        Añadir rol SENNOVA
                    </PrimaryButton>
                ) : (
                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                )}
            </div>
        </form>
    )
}

export default Form
