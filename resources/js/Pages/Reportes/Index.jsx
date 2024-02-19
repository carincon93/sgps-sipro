import Checkbox from '@/Components/Checkbox'
import FileTypeIcon from '@/Components/FileTypeIcon'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { route, checkRole } from '@/Utils'

import axios from 'axios'
import { Head, Link, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useState } from 'react'
import Autocomplete from '@/Components/Autocomplete'

export default function Reportes({ auth, centros_formacion, convocatorias }) {
    const auth_user = auth.user

    const is_super_admin = checkRole(auth_user, [1])
    const [loading, setLoading] = useState(false)

    const form = useForm({
        centro_formacion_id: null,
        reporte_completo: false,
        convocatoria_id: null,
    })

    const submit = (e) => {
        setLoading(true)

        e.preventDefault()
        axios({
            method: 'post',
            url: route('reportes.censo-sennova'),
            responseType: 'blob',
            data: {
                centro_formacion_id: form.data.centro_formacion_id,
                reporte_completo: form.data.reporte_completo,
            },
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'censo-sennova.xlsx')
                document.body.appendChild(link)
                link.click()
                setLoading(false)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const centros_formacion_filtrados = checkRole(auth_user, [3, 4, 21])
        ? [centros_formacion.find((item) => item.value == auth_user.centro_formacion_id)]
        : checkRole(auth_user, [2])
        ? [centros_formacion.filter((item) => item.convocatoria_id == auth_user.convocatoria_id)][0]
        : centros_formacion

    return (
        <AuthenticatedLayout>
            <Head title="Reportes" />

            <Grid container rowSpacing={8}>
                <Grid item md={12} className="bg-green-100/50 rounded-xl">
                    <div className="flex items-center justify-between  p-8 text-green-800">
                        <div className="max-w-2xl">
                            <h1 className="text-2xl font-bold">Reportes</h1>
                        </div>
                        <div>
                            <figure>
                                <img src={'/images/reportes.png'} alt="" width="480" />
                            </figure>
                        </div>
                    </div>
                </Grid>

                {checkRole(auth_user, [1, 2, 3, 4, 5, 17, 18, 19, 21]) && (
                    <Grid item md={12} className="bg-white overflow-hidden !my-10 rounded-lg px-6 py-2 shadow-md">
                        <form onSubmit={submit}>
                            <Grid container className="mt-10">
                                <Grid item md={4}>
                                    <h1>Censo SENNOVA</h1>
                                </Grid>
                                <Grid item md={8}>
                                    {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                                        <Checkbox
                                            className="mb-4"
                                            name="reporte_completo"
                                            checked={form.data.reporte_completo}
                                            onChange={(e) => form.setData('reporte_completo', e.target.checked)}
                                            error={form.errors.reporte_completo}
                                            label="Descargar el reporte del Censo de todos los centros de formación."
                                        />
                                    )}

                                    <SelectMultiple
                                        className="w-full"
                                        id="centro_formacion_id"
                                        bdValues={form.data.centro_formacion_id}
                                        options={centros_formacion_filtrados}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                centro_formacion_id: selected_values,
                                            }))
                                        }}
                                        error={form.errors.centro_formacion_id}
                                        label="Seleccione los centros de formación"
                                        required
                                    />
                                </Grid>
                            </Grid>

                            <div className="flex items-center justify-between mt-2 p-4">
                                <PrimaryButton
                                    disabled={(form.data.centro_formacion_id?.length == 0 && !loading && !form.data.reporte_completo) || (!form.isDirty && !loading) || loading}
                                    className="ml-auto"
                                    type="submit">
                                    {loading ? 'Descargando...' : 'Descargar reporte'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </Grid>
                )}

                <Grid item md={12} className="bg-white overflow-hidden !my-10 rounded-lg px-6 pb-12 shadow-md">
                    <Grid container alignItems="center">
                        <Grid item md={4}>
                            <h1>Directorio: Grupos de investigación</h1>
                        </Grid>
                        <Grid item md={8}>
                            <a target="_blank" href={route('reportes.grupos-investigacion')} className="flex items-center underline">
                                <FileTypeIcon fileType="xlsx" className="w-6 mr-4" />
                                Descargar reporte
                            </a>
                        </Grid>
                    </Grid>
                </Grid>

                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <>
                        <Grid item md={12} className="bg-white overflow-hidden !my-10 rounded-lg px-6 pb-12 shadow-md">
                            <Grid container alignItems="center">
                                <Grid item md={4}>
                                    <h1>Proyectos de convocatoria</h1>
                                </Grid>
                                <Grid item md={8}>
                                    <Autocomplete
                                        id="convocatoria_id"
                                        options={convocatorias}
                                        selectedValue={form.data.convocatoria_id}
                                        onChange={(event, newValue) => form.setData('convocatoria_id', newValue.value)}
                                        error={form.errors.convocatoria_id}
                                        label="Seleccione una convocatoria"
                                        required
                                    />
                                    {form.data.convocatoria_id && (
                                        <a target="_blank" href={route('reportes.resumen-proyectos', [form.data.convocatoria_id])} className="flex mt-10 items-center underline">
                                            <FileTypeIcon fileType="xlsx" className="w-6 mr-4" />
                                            Descargar reporte
                                        </a>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item md={12} className="bg-white overflow-hidden !my-10 rounded-lg px-6 pb-12 shadow-md">
                            <Grid container alignItems="center">
                                <Grid item md={4}>
                                    <h1>Evaluaciones de convocatoria</h1>
                                </Grid>
                                <Grid item md={8}>
                                    <Autocomplete
                                        id="convocatoria_id"
                                        options={convocatorias}
                                        selectedValue={form.data.convocatoria_id}
                                        onChange={(event, newValue) => form.setData('convocatoria_id', newValue.value)}
                                        error={form.errors.convocatoria_id}
                                        label="Seleccione una convocatoria"
                                        required
                                    />
                                    {form.data.convocatoria_id && (
                                        <a target="_blank" href={route('reportes.evaluaciones', [form.data.convocatoria_id])} className="flex mt-10 items-center underline">
                                            <FileTypeIcon fileType="xlsx" className="w-6 mr-4" />
                                            Descargar reporte
                                        </a>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item md={12} className="bg-white overflow-hidden !my-10 rounded-lg px-6 pb-12 shadow-md">
                            <Grid container alignItems="center">
                                <Grid item md={4}>
                                    <h1>Rúbrica presupuestal y roles SENNOVA - Convocatoria</h1>
                                </Grid>
                                <Grid item md={8}>
                                    <Autocomplete
                                        id="convocatoria_id"
                                        options={convocatorias}
                                        selectedValue={form.data.convocatoria_id}
                                        onChange={(event, newValue) => form.setData('convocatoria_id', newValue.value)}
                                        error={form.errors.convocatoria_id}
                                        label="Seleccione una convocatoria"
                                        required
                                    />
                                    {form.data.convocatoria_id && (
                                        <a target="_blank" href={route('reportes.presupuestos-roles', [form.data.convocatoria_id])} className="flex mt-10 items-center underline">
                                            <FileTypeIcon fileType="xlsx" className="w-6 mr-4" />
                                            Descargar reporte
                                        </a>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item md={12} className="bg-white overflow-hidden !my-10 rounded-lg px-6 pb-12 shadow-md">
                            <Grid container alignItems="center">
                                <Grid item md={4}>
                                    <h1>Proyectos Formulario 12 Línea 68</h1>
                                </Grid>
                                <Grid item md={8}>
                                    <Autocomplete
                                        id="convocatoria_id"
                                        options={convocatorias}
                                        selectedValue={form.data.convocatoria_id}
                                        onChange={(event, newValue) => form.setData('convocatoria_id', newValue.value)}
                                        error={form.errors.convocatoria_id}
                                        label="Seleccione una convocatoria"
                                        required
                                    />
                                    {form.data.convocatoria_id && (
                                        <a target="_blank" href={route('reportes.proyectos-formulario-12', [form.data.convocatoria_id])} className="flex mt-10 items-center underline">
                                            <FileTypeIcon fileType="xlsx" className="w-6 mr-4" />
                                            Descargar reporte
                                        </a>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </AuthenticatedLayout>
    )
}
