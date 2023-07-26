import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import FileInput from '@/Components/FileInput'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import TabsMui from '@/Components/TabsMui'
import TextInput from '@/Components/TextInput'
import StepperMui from '@/Components/Stepper'

import { route, checkRole } from '@/Utils'

import { router, useForm } from '@inertiajs/react'

import DownloadIcon from '@mui/icons-material/Download'
import { Grid } from '@mui/material'

const SoporteEstudioMercado = ({ auth, convocatoria, proyecto, proyecto_presupuesto, soportes_estudio_mercado }) => {
    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const form = useForm({
        formato_estudio_mercado: null,
        valor_total: proyecto_presupuesto.valor_total,
    })

    const submitEstudioMercado = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.presupuesto.estudio-mercado.store', [convocatoria.id, proyecto.id, proyecto_presupuesto]), {
                preserveScroll: true,
            })
        }
    }

    const formSoporte = useForm({
        id_primer_empresa: soportes_estudio_mercado[0]?.id,
        nombre_primer_empresa: soportes_estudio_mercado[0] ? soportes_estudio_mercado[0]?.empresa : '',
        soporte_primer_empresa: null,
        id_segunda_empresa: soportes_estudio_mercado[1]?.id,
        nombre_segunda_empresa: soportes_estudio_mercado[1] ? soportes_estudio_mercado[1]?.empresa : '',
        soporte_segunda_empresa: null,
        id_tercer_empresa: soportes_estudio_mercado[2]?.id,
        nombre_tercer_empresa: soportes_estudio_mercado[2] ? soportes_estudio_mercado[2]?.empresa : '',
        soporte_tercer_empresa: null,
    })

    const submitSoportes = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formSoporte.post(route('convocatorias.proyectos.presupuesto.soportes.store', [convocatoria.id, proyecto.id, proyecto_presupuesto]), {
                preserveScroll: true,
            })
        }
    }

    const destroySoporte = (soporteEstudioMercadoId) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('convocatorias.proyectos.presupuesto.soportes.destroy', [convocatoria.id, proyecto.id, proyecto_presupuesto.id, soporteEstudioMercadoId]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} label="Estudios de mercado" />
            </Grid>

            <Grid item md={12}>
                <TabsMui tabs={[{ label: 'Estudio de mercado' }, { label: 'Soportes / Cotizaciones' }]}>
                    <div>
                        <h1 className="mt-24 mb-8 text-center text-3xl">Estudio de mercado</h1>

                        <form className="mb-20" onSubmit={submitEstudioMercado}>
                            <AlertMui>
                                <span className="text-5xl font-black">1.</span>
                                <a href="/storage/documentos-descarga/Formato%20_guia_4_Estudio_de_mercado.xlsx" className="my-4 inline-block underline" target="_blank">
                                    <DownloadIcon />
                                    <strong>Descargue el Estudio de mercado - Convocatoria Sennova {convocatoria.year} haciendo clic aquí</strong>
                                </a>
                                <br />
                                <div className="ml-14">
                                    A continuación, diligencie el <strong>Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong>. Debe incluir ítems que pertenezcan a los usos
                                    presupuestales:
                                    <ul className="list-disc ml-4">
                                        {proyecto_presupuesto.convocatoria_proyecto_rubros_presupuestales.map((convocatoria_rubro_presupuestal, i) => (
                                            <li key={i}>
                                                <p className="first-letter:uppercase mb-2 font-black">{convocatoria_rubro_presupuestal.presupuesto_sennova.uso_presupuestal.descripcion}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    Luego debe subirlo al sistema desde el siguiente campo:
                                </div>
                            </AlertMui>

                            <div className="mt-14">
                                <FileInput
                                    id="formato_estudio_mercado"
                                    value={form.data.formato_estudio_mercado}
                                    filename={proyecto_presupuesto?.filename}
                                    extension={proyecto_presupuesto?.extension}
                                    label={`Seleccione el Estudio de mercado - Convocatoria Sennova ` + convocatoria.year}
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    downloadRoute={
                                        proyecto_presupuesto?.formato_estudio_mercado
                                            ? proyecto_presupuesto?.formato_estudio_mercado?.includes('http')
                                                ? null
                                                : route('convocatorias.proyectos.presupuesto.download-file-sharepoint', [convocatoria, proyecto, proyecto_presupuesto, 'formato_estudio_mercado'])
                                            : null
                                    }
                                    onChange={(e) => form.setData('formato_estudio_mercado', e.target.files[0])}
                                    error={form.errors.formato_estudio_mercado}
                                />

                                <AlertMui className="mt-10">
                                    <span className="text-5xl font-black">2.</span>
                                    <p className="mt-4">
                                        A continuación, indique el valor total que arrojó el <strong>Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong> en la casilla{' '}
                                        <strong>TOTAL</strong>.
                                    </p>
                                    <figure className="mt-2">
                                        <img src="/images/estudio-mercado.jpg" alt="" className="shadow" />
                                    </figure>
                                    <br />
                                    Ahora ingrese el valor total en el siguiente campo:
                                </AlertMui>
                                <TextInput
                                    label="Valor total"
                                    id="valor_total"
                                    isCurrency={true}
                                    inputProps={{
                                        min: 0,
                                        prefix: '$',
                                    }}
                                    className="!mt-4"
                                    value={form.data.valor_total}
                                    error={form.errors.valor_total}
                                    onChange={(e) => form.setData('valor_total', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between mt-14 py-4">
                                {proyecto.allowed.to_update ? (
                                    <PrimaryButton className="ml-auto" disabled={form.processing} type="submit">
                                        Guardar estudio de mercado y valor total
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                    <div>
                        <h1 className="mt-24 mb-8 text-center text-3xl">Soportes</h1>

                        <AlertMui className="mb-8">
                            <span className="text-5xl font-black">3.</span>
                            <br />
                            Tenga en cuenta que en el Excel <strong>Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong> deberá relacionar mínimo 2 empresas (Máximo 3).
                            <figure className="my-4">
                                <img src="/images/soportes.jpg" alt="" className="shadow mx-auto" />
                            </figure>
                            <br />
                            En la siguiente sección deberá adjuntar todos los soportes dados por las empresas. Para ello se recomienda unir los soportes de <strong>cada empresa</strong> en un PDF o
                            ZIP. Revise que los valores en los soportes sean iguales a los valores relacionados en el Excel. (Los soportes pueden ser precotizaciones, precios de catálogos de canales
                            comerciales oficiales de proveedores o de almacenes de grandes superficies, o valores de acuerdos marco de precios de Colombia Compra. (Los valores del estudio deberán
                            corresponder a proveedores ubicados en Colombia y tener una fecha no mayor a 4 meses).
                        </AlertMui>

                        <form onSubmit={submitSoportes}>
                            <fieldset disabled={proyecto.allowed.to_update ? false : true} className="divide-y">
                                <div className="grid grid-cols-3 gap-12 py-24">
                                    <div>
                                        <Label required className="mb-4" labelFor="soporte" value="Nombre de la primer empresa" />
                                        <TextInput
                                            id="nombre_primer_empresa"
                                            type="text"
                                            className="mt-1"
                                            value={formSoporte.data.nombre_primer_empresa}
                                            error={formSoporte.errors.nombre_primer_empresa}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label required className="mb-4" labelFor="soporte_primer_empresa" value="Soporte PDF o ZIP de la primer empresa" />
                                        <FileInput
                                            id="soporte_primer_empresa"
                                            value={formSoporte.data.soporte_primer_empresa}
                                            filename={soportes_estudio_mercado[0] ? soportes_estudio_mercado[0]?.filename : ''}
                                            extension={soportes_estudio_mercado[0] ? soportes_estudio_mercado[0]?.extension : ''}
                                            label="Seleccione el soporte de la primer empresa"
                                            accept=".zip,application/pdf"
                                            downloadRoute={
                                                soportes_estudio_mercado[0]?.soporte
                                                    ? soportes_estudio_mercado[0]?.soporte?.includes('http') == true || soportes_estudio_mercado[0]?.soporte?.includes('http') == undefined
                                                        ? null
                                                        : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [
                                                              convocatoria,
                                                              proyecto,
                                                              proyecto_presupuesto,
                                                              soportes_estudio_mercado[0]?.id,
                                                              'soporte',
                                                          ])
                                                    : null
                                            }
                                            onDelete={() => destroySoporte(soportes_estudio_mercado[0]?.id)}
                                            onChange={(e) => formSoporte.setData('soporte_primer_empresa', e.target.files[0])}
                                            error={formSoporte.errors.soporte_primer_empresa}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-12 py-24">
                                    <div>
                                        <Label required className="mb-4" labelFor="soporte" value="Nombre de la segunda empresa" />
                                        <TextInput
                                            id="nombre_segunda_empresa"
                                            type="text"
                                            className="mt-1"
                                            value={formSoporte.data.nombre_segunda_empresa}
                                            error={formSoporte.errors.nombre_segunda_empresa}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label required className="mb-4" labelFor="soporte_segunda_empresa" value="Soporte PDF o ZIP de la segunda empresa" />
                                        <FileInput
                                            id="soporte_segunda_empresa"
                                            value={formSoporte.data.soporte_segunda_empresa}
                                            filename={soportes_estudio_mercado[1] ? soportes_estudio_mercado[1]?.filename : ''}
                                            extension={soportes_estudio_mercado[1] ? soportes_estudio_mercado[1]?.extension : ''}
                                            label="Seleccione el soporte de la segunda empresa"
                                            accept=".zip,application/pdf"
                                            downloadRoute={
                                                soportes_estudio_mercado[1]?.soporte
                                                    ? soportes_estudio_mercado[1]?.soporte?.includes('http') == true || soportes_estudio_mercado[1]?.soporte?.includes('http') == undefined
                                                        ? null
                                                        : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [
                                                              convocatoria,
                                                              proyecto,
                                                              proyecto_presupuesto,
                                                              soportes_estudio_mercado[1]?.id,
                                                              'soporte',
                                                          ])
                                                    : null
                                            }
                                            onDelete={() => destroySoporte(soportes_estudio_mercado[1]?.id)}
                                            onChange={(e) => formSoporte.setData('soporte_segunda_empresa', e.target.files[0])}
                                            error={formSoporte.errors.soporte_segunda_empresa}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-12 py-24">
                                    <div>
                                        <Label className="mb-4" labelFor="soporte" value="Nombre de la tercer empresa" />
                                        <TextInput
                                            id="nombre_tercer_empresa"
                                            type="text"
                                            className="mt-1"
                                            value={formSoporte.data.nombre_tercer_empresa}
                                            error={formSoporte.errors.nombre_tercer_empresa}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label className="mb-4" labelFor="soporte_tercer_empresa" value="Soporte PDF o ZIP de la tercer empresa" />
                                        <FileInput
                                            id="soporte_tercer_empresa"
                                            value={formSoporte.data.soporte_tercer_empresa}
                                            filename={soportes_estudio_mercado[2] ? soportes_estudio_mercado[2]?.filename : ''}
                                            extension={soportes_estudio_mercado[2] ? soportes_estudio_mercado[2]?.extension : ''}
                                            label="Seleccione el soporte de la tercer empresa"
                                            accept=".zip,application/pdf"
                                            downloadRoute={
                                                soportes_estudio_mercado[2]?.soporte
                                                    ? soportes_estudio_mercado[2]?.soporte?.includes('http') == true || soportes_estudio_mercado[2]?.soporte?.includes('http') == undefined
                                                        ? null
                                                        : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [
                                                              convocatoria,
                                                              proyecto,
                                                              proyecto_presupuesto,
                                                              soportes_estudio_mercado[2]?.id,
                                                              'soporte',
                                                          ])
                                                    : null
                                            }
                                            onDelete={() => destroySoporte(soportes_estudio_mercado[2]?.id)}
                                            onChange={(e) => formSoporte.setData('soporte_tercer_empresa', e.target.files[0])}
                                            error={formSoporte.errors.soporte_tercer_empresa}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            <div className="flex items-center justify-between py-4">
                                {proyecto.allowed.to_update ? (
                                    <PrimaryButton disabled={formSoporte.processing} className="ml-auto" type="submit">
                                        Cargar soporte(s)
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </TabsMui>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default SoporteEstudioMercado
