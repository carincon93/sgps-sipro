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
import { useEffect } from 'react'
import { useState } from 'react'

const SoporteEstudioMercado = ({ auth, convocatoria, proyecto, evaluacion, proyecto_presupuesto, soportes_estudio_mercado }) => {
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
        nombre_primer_empresa: soportes_estudio_mercado[0] ? soportes_estudio_mercado[0]?.concepto : '',
        soporte_primer_empresa: null,
        id_segunda_empresa: soportes_estudio_mercado[1]?.id,
        nombre_segunda_empresa: soportes_estudio_mercado[1] ? soportes_estudio_mercado[1]?.concepto : '',
        soporte_segunda_empresa: null,
        id_tercer_empresa: soportes_estudio_mercado[2]?.id,
        nombre_tercer_empresa: soportes_estudio_mercado[2] ? soportes_estudio_mercado[2]?.concepto : '',
        soporte_tercer_empresa: null,
    })

    const submitSoporte = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formSoporte.post(route('convocatorias.proyectos.presupuesto.soportes.store', [convocatoria.id, proyecto.id, proyecto_presupuesto]), {
                preserveScroll: true,
            })
        }
    }

    const destroySoporte = (soporte_estudio_mercado_id) => {
        if (proyecto.allowed.to_update) {
            router.delete(route('convocatorias.proyectos.presupuesto.soportes.destroy', [convocatoria.id, proyecto.id, proyecto_presupuesto.id, soporte_estudio_mercado_id]), {
                preserveScroll: true,
            })
        }
    }

    const checkSegundoGrupoPresupuestalCodigo = (codigo) =>
        proyecto_presupuesto.convocatoria_proyecto_rubros_presupuestales.some(
            (convocatoria_rubro_presupuestal) => convocatoria_rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.codigo == codigo,
        )

    const [equipo_requiere_actualizacion, setEquipoRequiereActualizacion] = useState(false)
    const [requiere_adecuacion, setRequiereAdecuacion] = useState(false)
    useEffect(() => {
        const codigo1 = 2040115
        const codigo2 = 2040125
        const codigo3 = 2045110

        if (checkSegundoGrupoPresupuestalCodigo(codigo1) || checkSegundoGrupoPresupuestalCodigo(codigo2)) {
            setEquipoRequiereActualizacion(true)
        }

        if (checkSegundoGrupoPresupuestalCodigo(codigo3)) {
            setRequiereAdecuacion(true)
        }
    }, [proyecto_presupuesto])

    const formProyectoLinea68 = useForm({
        id_estudio_mercado: soportes_estudio_mercado[3]?.id,
        conceptos_tecnicos: soportes_estudio_mercado[3] ? soportes_estudio_mercado[3]?.concepto : '',
        soporte: null,
    })

    const submitSoporteProyectoLinea68 = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formProyectoLinea68.post(route('convocatorias.proyectos.presupuesto.soportes-proyecto-linea-68.store', [convocatoria.id, proyecto.id, proyecto_presupuesto]), {
                preserveScroll: true,
            })
        }
    }

    const tabs =
        equipo_requiere_actualizacion && proyecto_presupuesto.rubro_presupuestal_proyecto_linea68?.equipo_para_modernizar
            ? [
                  { label: 'Estudio de mercado' },
                  { label: 'Soporte - Primer empresa' },
                  { label: 'Soporte - Segunda empresa' },
                  { label: 'Soporte - Tercer empresa' },
                  { label: 'Soporte - Equipo a actualizar' },
              ]
            : requiere_adecuacion
            ? [
                  { label: 'Estudio de mercado' },
                  { label: 'Soporte - Primer empresa' },
                  { label: 'Soporte - Segunda empresa' },
                  { label: 'Soporte - Tercer empresa' },
                  { label: 'Soporte - Adecuación y construcción' },
              ]
            : [{ label: 'Estudio de mercado' }, { label: 'Soporte - Primer empresa' }, { label: 'Soporte - Segunda empresa' }, { label: 'Soporte - Tercer empresa' }]

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} label="Estudios de mercado" />
            </Grid>

            <Grid item md={12}>
                <TabsMui tabs={tabs}>
                    <div>
                        <h1 className="mt-24 mb-8 text-center text-3xl">Estudio de mercado</h1>

                        <form className="mb-20" onSubmit={submitEstudioMercado}>
                            <AlertMui>
                                <span className="text-5xl font-black">1.</span>
                                <br />
                                <a href="/storage/documentos-descarga/Formato%20_guia_4_Estudio_de_mercado.xlsx" className="my-4 inline-block underline" target="_blank">
                                    <DownloadIcon />
                                    <strong>Descargue el Estudio de mercado - Convocatoria Sennova {convocatoria.year} haciendo clic aquí</strong>
                                </a>
                                <br />
                                <div>
                                    A continuación, diligencie el <strong>Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong>. Debe incluir ítems que pertenezcan a los usos
                                    presupuestales:
                                    <ul className="list-disc ml-4">
                                        {proyecto_presupuesto.convocatoria_proyecto_rubros_presupuestales.map((convocatoria_rubro_presupuestal, i) => (
                                            <li key={i}>
                                                <p className="first-letter:uppercase mb-2 font-black">{convocatoria_rubro_presupuestal.rubro_presupuestal.uso_presupuestal.descripcion}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <br />

                                <span className="text-5xl font-black">2.</span>
                                <p className="mt-4">
                                    Copie el valor total que arrojó el <strong>Excel de Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong>
                                </p>
                                <figure className="mt-2">
                                    <img src="/images/estudio-mercado.jpg" alt="" className="shadow" />
                                </figure>
                            </AlertMui>

                            <div className="mt-20">
                                <TextInput
                                    className="!mb-10"
                                    label="Indique el valor total que arrojó el Excel"
                                    id="valor_total"
                                    isCurrency={true}
                                    inputProps={{
                                        min: 0,
                                        prefix: '$',
                                    }}
                                    value={form.data.valor_total}
                                    error={form.errors.valor_total}
                                    onChange={(e) => form.setData('valor_total', e.target.value)}
                                    required
                                />

                                <FileInput
                                    id="formato_estudio_mercado"
                                    value={form.data.formato_estudio_mercado}
                                    filename={proyecto_presupuesto?.filename}
                                    extension={proyecto_presupuesto?.extension}
                                    label={`Estudio de mercado - Convocatoria Sennova ` + convocatoria.year}
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    downloadRoute={
                                        proyecto_presupuesto?.formato_estudio_mercado
                                            ? proyecto_presupuesto?.formato_estudio_mercado?.includes('http')
                                                ? proyecto_presupuesto?.formato_estudio_mercado
                                                : route('convocatorias.proyectos.presupuesto.download-file-sharepoint', [convocatoria, proyecto, proyecto_presupuesto, 'formato_estudio_mercado'])
                                            : null
                                    }
                                    onChange={(e) => form.setData('formato_estudio_mercado', e)}
                                    error={form.errors.formato_estudio_mercado}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-14 py-4">
                                {proyecto.allowed.to_update ? (
                                    <PrimaryButton className="ml-auto" disabled={form.processing || !form.isDirty} type="submit">
                                        Guardar estudio de mercado y valor total
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                    <div>
                        <h1 className="mt-24 mb-8 text-center text-3xl">Soporte / Cotización de la primer empresa</h1>

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

                        <form onSubmit={submitSoporte}>
                            <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                                <TextInput
                                    id="nombre_primer_empresa"
                                    label="Nombre de la primer empresa"
                                    type="text"
                                    className="!my-14"
                                    value={formSoporte.data.nombre_primer_empresa}
                                    onChange={(e) => formSoporte.setData('nombre_primer_empresa', e.target.value)}
                                    error={formSoporte.errors.nombre_primer_empresa}
                                    required
                                />

                                <Label required className="mb-4" labelFor="soporte_primer_empresa" value="Soporte PDF o ZIP de la primer empresa" />
                                <FileInput
                                    id="soporte_primer_empresa"
                                    value={formSoporte.data.soporte_primer_empresa}
                                    filename={soportes_estudio_mercado[0] ? soportes_estudio_mercado[0]?.filename : ''}
                                    extension={soportes_estudio_mercado[0] ? soportes_estudio_mercado[0]?.extension : ''}
                                    label="Soporte de la primer empresa"
                                    accept=".zip,application/pdf"
                                    downloadRoute={
                                        soportes_estudio_mercado[0]?.soporte
                                            ? soportes_estudio_mercado[0]?.soporte?.includes('http') == true || soportes_estudio_mercado[0]?.soporte?.includes('http') == undefined
                                                ? soportes_estudio_mercado[0]?.soporte
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
                                    onChange={(e) => formSoporte.setData('soporte_primer_empresa', e)}
                                    error={formSoporte.errors.soporte_primer_empresa}
                                />
                            </fieldset>
                            <div className="flex items-center justify-between py-4">
                                {proyecto.allowed.to_update ? (
                                    <PrimaryButton disabled={formSoporte.processing || !formSoporte.isDirty} className="ml-auto" type="submit">
                                        Cargar soporte
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>

                    <div>
                        <h1 className="mt-24 mb-8 text-center text-3xl">Soporte / Cotización de la segunda empresa</h1>

                        <form onSubmit={submitSoporte}>
                            <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                                <TextInput
                                    id="nombre_segunda_empresa"
                                    label="Nombre de la segunda empresa"
                                    type="text"
                                    className="!my-14"
                                    value={formSoporte.data.nombre_segunda_empresa}
                                    onChange={(e) => formSoporte.setData('nombre_segunda_empresa', e.target.value)}
                                    error={formSoporte.errors.nombre_segunda_empresa}
                                    required
                                />

                                <Label required className="mb-4" labelFor="soporte_segunda_empresa" value="Soporte PDF o ZIP de la segunda empresa" />
                                <FileInput
                                    id="soporte_segunda_empresa"
                                    value={formSoporte.data.soporte_segunda_empresa}
                                    filename={soportes_estudio_mercado[1] ? soportes_estudio_mercado[1]?.filename : ''}
                                    extension={soportes_estudio_mercado[1] ? soportes_estudio_mercado[1]?.extension : ''}
                                    label="Soporte de la segunda empresa"
                                    accept=".zip,application/pdf"
                                    downloadRoute={
                                        soportes_estudio_mercado[1]?.soporte
                                            ? soportes_estudio_mercado[1]?.soporte?.includes('http') == true || soportes_estudio_mercado[1]?.soporte?.includes('http') == undefined
                                                ? soportes_estudio_mercado[1]?.soporte
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
                                    onChange={(e) => formSoporte.setData('soporte_segunda_empresa', e)}
                                    error={formSoporte.errors.soporte_segunda_empresa}
                                />
                            </fieldset>
                            <div className="flex items-center justify-between py-4">
                                {proyecto.allowed.to_update ? (
                                    <PrimaryButton disabled={formSoporte.processing || !formSoporte.isDirty} className="ml-auto" type="submit">
                                        Cargar soporte
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>

                    <div>
                        <h1 className="mt-24 mb-8 text-center text-3xl">Soporte / Cotización de la tercer empresa</h1>

                        <form onSubmit={submitSoporte}>
                            <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                                <TextInput
                                    id="nombre_tercer_empresa"
                                    label="Nombre de la tercer empresa"
                                    type="text"
                                    className="!my-14"
                                    value={formSoporte.data.nombre_tercer_empresa}
                                    onChange={(e) => formSoporte.setData('nombre_tercer_empresa', e.target.value)}
                                    error={formSoporte.errors.nombre_tercer_empresa}
                                />

                                <Label className="mb-4" labelFor="soporte_tercer_empresa" value="Soporte PDF o ZIP de la tercer empresa" />
                                <FileInput
                                    id="soporte_tercer_empresa"
                                    value={formSoporte.data.soporte_tercer_empresa}
                                    filename={soportes_estudio_mercado[2] ? soportes_estudio_mercado[2]?.filename : ''}
                                    extension={soportes_estudio_mercado[2] ? soportes_estudio_mercado[2]?.extension : ''}
                                    label="Soporte de la tercer empresa"
                                    accept=".zip,application/pdf"
                                    downloadRoute={
                                        soportes_estudio_mercado[2]?.soporte
                                            ? soportes_estudio_mercado[2]?.soporte?.includes('http') == true || soportes_estudio_mercado[2]?.soporte?.includes('http') == undefined
                                                ? soportes_estudio_mercado[2]?.soporte
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
                                    onChange={(e) => formSoporte.setData('soporte_tercer_empresa', e)}
                                    error={formSoporte.errors.soporte_tercer_empresa}
                                />
                            </fieldset>
                            <div className="flex items-center justify-between py-4">
                                {proyecto.allowed.to_update ? (
                                    <PrimaryButton disabled={formSoporte.processing || !formSoporte.isDirty} className="ml-auto" type="submit">
                                        Cargar soporte
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>

                    {equipo_requiere_actualizacion ? (
                        <div>
                            <h1 className="mt-24 mb-8 text-center text-3xl">Soporte - Equipo a actualizar</h1>

                            <form onSubmit={submitSoporteProyectoLinea68}>
                                <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                                    <TextInput
                                        label="Conceptos técnicos"
                                        id="conceptos_tecnicos"
                                        type="text"
                                        className="!my-14"
                                        value={formProyectoLinea68.data.conceptos_tecnicos}
                                        onChange={(e) => formProyectoLinea68.setData('conceptos_tecnicos', e.target.value)}
                                        error={formProyectoLinea68.errors.conceptos_tecnicos}
                                        required
                                    />

                                    <Label required className="mb-4" labelFor="soporte" value="Soporte PDF firmados de 1) el servicio de mantenimiento y 2) el cuentadante del equipo a actualizar" />
                                    <FileInput
                                        id="soporte"
                                        value={formProyectoLinea68.data.soporte}
                                        filename={soportes_estudio_mercado[3] ? soportes_estudio_mercado[3]?.filename : ''}
                                        extension={soportes_estudio_mercado[3] ? soportes_estudio_mercado[3]?.extension : ''}
                                        label="Conceptos técnicos firmados"
                                        accept=".zip,application/pdf"
                                        downloadRoute={
                                            soportes_estudio_mercado[3]?.soporte
                                                ? soportes_estudio_mercado[3]?.soporte?.includes('http') == true || soportes_estudio_mercado[3]?.soporte?.includes('http') == undefined
                                                    ? soportes_estudio_mercado[3]?.soporte
                                                    : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [
                                                          convocatoria,
                                                          proyecto,
                                                          proyecto_presupuesto,
                                                          soportes_estudio_mercado[3]?.id,
                                                          'soporte',
                                                      ])
                                                : null
                                        }
                                        onDelete={() => destroySoporte(soportes_estudio_mercado[3]?.id)}
                                        onChange={(e) => formProyectoLinea68.setData('soporte', e)}
                                        error={formProyectoLinea68.errors.soporte}
                                    />
                                </fieldset>
                                <div className="flex items-center justify-between py-4">
                                    {proyecto.allowed.to_update ? (
                                        <PrimaryButton disabled={formProyectoLinea68.processing || !formProyectoLinea68.isDirty} className="ml-auto" type="submit">
                                            Cargar soporte
                                        </PrimaryButton>
                                    ) : (
                                        <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    ) : null}

                    {requiere_adecuacion ? (
                        <div>
                            <h1 className="mt-24 mb-8 text-center text-3xl">Soporte - Adecuaciones y construcciones</h1>

                            <form onSubmit={submitSoporteProyectoLinea68}>
                                <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                                    <TextInput
                                        id="conceptos_tecnicos"
                                        label="Conceptos técnicos"
                                        type="text"
                                        className="!my-14"
                                        value={formProyectoLinea68.data.conceptos_tecnicos}
                                        onChange={(e) => formProyectoLinea68.setData('conceptos_tecnicos', e.target.value)}
                                        error={formProyectoLinea68.errors.conceptos_tecnicos}
                                        required
                                    />
                                    <Label required className="mb-4" labelFor="soporte" value="Soporte PDF firmado por el profesional del área de construcciones del Centro" />
                                    <FileInput
                                        id="soporte"
                                        value={formProyectoLinea68.data.soporte}
                                        filename={soportes_estudio_mercado[3] ? soportes_estudio_mercado[3]?.filename : ''}
                                        extension={soportes_estudio_mercado[3] ? soportes_estudio_mercado[3]?.extension : ''}
                                        label="Concepto técnico firmado"
                                        accept=".zip,application/pdf"
                                        downloadRoute={
                                            soportes_estudio_mercado[3]?.soporte
                                                ? soportes_estudio_mercado[3]?.soporte?.includes('http') == true || soportes_estudio_mercado[3]?.soporte?.includes('http') == undefined
                                                    ? soportes_estudio_mercado[3]?.soporte
                                                    : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [
                                                          convocatoria,
                                                          proyecto,
                                                          proyecto_presupuesto,
                                                          soportes_estudio_mercado[3]?.id,
                                                          'soporte',
                                                      ])
                                                : null
                                        }
                                        onDelete={() => destroySoporte(soportes_estudio_mercado[3]?.id)}
                                        onChange={(e) => formProyectoLinea68.setData('soporte', e)}
                                        error={formProyectoLinea68.errors.soporte}
                                    />
                                </fieldset>
                                <div className="flex items-center justify-between py-4">
                                    {proyecto.allowed.to_update ? (
                                        <PrimaryButton disabled={formProyectoLinea68.processing || !formProyectoLinea68.isDirty} className="ml-auto" type="submit">
                                            Cargar soporte
                                        </PrimaryButton>
                                    ) : (
                                        <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    ) : null}
                </TabsMui>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default SoporteEstudioMercado
