import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'
import { useEffect, useState } from 'react'

const Form = ({ method = '', convocatoria, proyecto, setDialogStatus, proyecto_rol_sennova, convocatoria_roles_sennova, niveles_academicos, actividades }) => {
    const roles_sennova_incompletos = convocatoria_roles_sennova.some((item) => item.label === null)
    const [meses_maximos, setMesesMaximo] = useState(proyecto.diff_meses)

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

    useEffect(() => {
        setMesesMaximo(proyecto.diff_meses)

        if (form.data.convocatoria_rol_sennova_id) {
            setTimeout(() => {
                const { meses_maximos } = convocatoria_roles_sennova.find((item) => item.value == form.data.convocatoria_rol_sennova_id)

                setMesesMaximo(meses_maximos)
            }, 500)
        }
    }, [form.data.convocatoria_rol_sennova_id])

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Rol SENNOVA</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={6}>
                            <Grid item md={12}>
                                {!roles_sennova_incompletos ? (
                                    <>
                                        {method == 'POST' ? (
                                            <Autocomplete
                                                id="convocatoria_rol_sennova_id"
                                                label="Rol SENNOVA"
                                                options={convocatoria_roles_sennova}
                                                selectedValue={form.data.convocatoria_rol_sennova_id}
                                                error={form.errors.convocatoria_rol_sennova_id}
                                                onChange={(event, newValue) => {
                                                    form.setData('convocatoria_rol_sennova_id', newValue.value)
                                                }}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                        ) : (
                                            <>
                                                <p>{proyecto_rol_sennova.convocatoria_rol_sennova.rol_sennova.nombre}</p>

                                                <p className="first-letter:uppercase text-gray-00 my-4">
                                                    {niveles_academicos.find((item) => item.value == proyecto_rol_sennova?.convocatoria_rol_sennova?.nivel_academico).label}
                                                </p>

                                                <p className="text-gray-600 my-4 whitespace-pre-wrap">
                                                    Experiencia / Perfil
                                                    <br />
                                                    {proyecto_rol_sennova.convocatoria_rol_sennova.experiencia}
                                                </p>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <AlertMui severity="error">
                                        Aún no se ha completado la información de los roles, por favor revise los canales de ayuda e informe al respectivo activador(a) para que actualice la
                                        información.
                                    </AlertMui>
                                )}
                            </Grid>

                            {proyecto.tipo_formulario_convocatoria_id != 12 ? (
                                <Grid item md={12}>
                                    <Textarea
                                        id="descripcion"
                                        error={form.errors.descripcion}
                                        label="Descripción del perfil requerido"
                                        value={form.data.descripcion}
                                        onChange={(e) => {
                                            form.setData('descripcion', e.target.value)
                                        }}
                                        disabled={!proyecto?.allowed?.to_update}
                                        required
                                    />
                                </Grid>
                            ) : (
                                proyecto.tipo_formulario_convocatoria_id == 12 && (
                                    <>
                                        <Grid item md={12}>
                                            <Textarea
                                                id="educacion"
                                                error={form.errors.educacion}
                                                label="Educación"
                                                value={form.data.educacion}
                                                onChange={(e) => {
                                                    form.setData('educacion', e.target.value)
                                                }}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                            <AlertMui>
                                                Relacione la información correspondiente con el título profesional del rol solicitado de acuerdo con las orientaciones para la contratación de roles
                                                SENNOVA conforme con la línea técnica a la que pertenece el proyecto.
                                            </AlertMui>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Textarea
                                                id="formacion"
                                                error={form.errors.formacion}
                                                label="Formación"
                                                value={form.data.formacion}
                                                onChange={(e) => {
                                                    form.setData('formacion', e.target.value)
                                                }}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                            <AlertMui>
                                                Relacione la información correspondiente con la formación específica del rol solicitado de acuerdo con las orientaciones para la contratación de roles
                                                SENNOVA conforme con la línea técnica a la que pertenece el proyecto.
                                            </AlertMui>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Textarea
                                                id="experiencia"
                                                error={form.errors.experiencia}
                                                label="Experiencia"
                                                value={form.data.experiencia}
                                                onChange={(e) => {
                                                    form.setData('experiencia', e.target.value)
                                                }}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                            <AlertMui>
                                                Relacione la información correspondiente con la experiencia del rol solicitado en número de meses de acuerdo con las orientaciones para la contratación
                                                de roles SENNOVA conforme con la línea técnica a la que pertenece el proyecto.
                                            </AlertMui>
                                        </Grid>
                                    </>
                                )
                            )}

                            <Grid item md={12}>
                                <TextInput
                                    label="Número de meses que requiere el apoyo"
                                    id="numero_meses"
                                    type="number"
                                    inputProps={{
                                        step: 0.1,
                                        min: 1,
                                        max: meses_maximos,
                                    }}
                                    error={form.errors.numero_meses}
                                    value={form.data.numero_meses}
                                    onChange={(e) => {
                                        form.setData('numero_meses', e.target.value)
                                    }}
                                    disabled={!proyecto?.allowed?.to_update}
                                    required
                                />

                                <AlertMui>El rol seleccionado no puede superar los {meses_maximos} meses de vinculación</AlertMui>
                            </Grid>

                            <Grid item md={12}>
                                <TextInput
                                    label="Número de personas requeridas"
                                    id="numero_roles"
                                    type="number"
                                    inputProps={{
                                        min: 1,
                                    }}
                                    error={form.errors.numero_roles}
                                    value={form.data.numero_roles}
                                    onChange={(e) => {
                                        form.setData('numero_roles', e.target.value)
                                    }}
                                    disabled={!proyecto?.allowed?.to_update}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <h6 className="text-2xl mb-4">Actividades que deberá ejecutar el rol</h6>
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
                                    disabled={!proyecto?.allowed?.to_update}
                                    error={form.errors.actividad_id}
                                    label="Relacione las respectivas actividades"
                                    required
                                />
                                {actividades.length === 0 && (
                                    <AlertMui error={true}>
                                        <strong>Importante:</strong> Debe completar la información de Objetivos, resultados, impactos y actividades. De lo contrario, no puede relacionar las actividades.
                                    </AlertMui>
                                )}
                            </Grid>
                        </Grid>
                        {proyecto_rol_sennova && <small className="flex items-center my-10 text-app-700">{proyecto_rol_sennova.updated_at}</small>}
                        <div className="flex items-center justify-between mt-8 py-4">
                            {proyecto?.allowed?.to_update ? (
                                <PrimaryButton disabled={form.processing || roles_sennova_incompletos || !form.isDirty || actividades.length === 0} className="mr-2 ml-auto" type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'} rol SENNOVA
                                </PrimaryButton>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
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
