import Checkbox from '@/Components/Checkbox'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { route, checkRole } from '@/Utils'

import { useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'

export default function Reportes({ auth, centros_formacion }) {
    const auth_user = auth.user

    const is_super_admin = checkRole(auth_user, [1])
    const [loading, setLoading] = useState(false)

    const form = useForm({
        centro_formacion_id: null,
        reporte_completo: false,
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

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}>
            <Grid container columnSpacing={2} rowSpacing={5}>
                <Grid item md={12}>
                    <div className="flex items-center justify-between rounded-xl p-8 text-green-800 bg-green-100/50">
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

                {checkRole(auth_user, [1, 4, 5, 17, 18, 19, 21]) && (
                    <Grid item md={12}>
                        <form onSubmit={submit} className="bg-white overflow-hidden rounded-lg px-6 py-2 shadow-md">
                            <Grid container className="mt-10">
                                <Grid item md={4}>
                                    <h1>Censo SENNOVA</h1>
                                </Grid>
                                <Grid item md={8}>
                                    {checkRole(auth_user, [1, 4, 5, 17, 18, 19, 21]) && (
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
                                        options={checkRole(auth_user, [2, 4]) ? [centros_formacion.find((item) => item.value == auth_user.centro_formacion_id)] : centros_formacion}
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
            </Grid>
        </AuthenticatedLayout>
    )
}
