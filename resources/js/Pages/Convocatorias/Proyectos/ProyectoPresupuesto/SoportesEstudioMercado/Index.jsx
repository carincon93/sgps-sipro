import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import DownloadFile from '@/Components/DownloadFile'
import FileInput from '@/Components/FileInput'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import StepperMui from '@/Components/Stepper'
import TableMui from '@/Components/Table'
import TabsMui from '@/Components/TabsMui'
import TextInput from '@/Components/TextInput'

import { route, checkRole } from '@/Utils'
import { router, useForm } from '@inertiajs/react'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DownloadIcon from '@mui/icons-material/Download'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import Form from './Form'

import { useEffect } from 'react'
import { useState } from 'react'

const SoporteEstudioMercado = ({ auth, convocatoria, proyecto, evaluacion, proyecto_presupuesto, soportes_estudio_mercado }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [soporte_to_destroy, setSoporteToDestroy] = useState(null)
    const [soporte, setSoporte] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_archivo_status, setDialogSoporteStatus] = useState(false)
    const [method, setMethod] = useState('')

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
        soporte: null,
    })
    const submitSoporte = (e) => {
        e.preventDefault()

        if (proyecto?.allowed?.to_update) {
            formSoporte.post(route('convocatorias.proyectos.presupuesto.soportes.upload-soporte', [convocatoria.id, proyecto.id, proyecto_presupuesto.id, soporte.id]), {
                onSuccess: () => setDialogSoporteStatus(false),
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
        if (proyecto.tipo_formulario_convocatoria_id == 12) {
            const codigo1 = 2040115
            const codigo2 = 2040125
            const codigo3 = 2045110

            if (checkSegundoGrupoPresupuestalCodigo(codigo1) || checkSegundoGrupoPresupuestalCodigo(codigo2)) {
                setEquipoRequiereActualizacion(true)
            }

            if (checkSegundoGrupoPresupuestalCodigo(codigo3)) {
                setRequiereAdecuacion(true)
            }
        }
    }, [proyecto_presupuesto])

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} label="Estudios de mercado" />
            </Grid>

            <Grid item md={12}>
                <TabsMui tabs={[{ label: 'Estudio de mercado' }, { label: 'Empresas / Soportes' }]}>
                    <div>
                        <h1 className="mt-24 mb-8 text-center text-3xl">Estudio de mercado</h1>

                        <form className="mb-20" onSubmit={submitEstudioMercado}>
                            <AlertMui>
                                <span className="text-5xl font-black">1.</span>
                                <br />
                                <a href="/storage/documentos-descarga/Formato%20_guia_4_Estudio_de_mercado.xlsx" className="my-4 inline-block underline" target="_blank">
                                    <DownloadIcon />
                                    <strong>De clic aquí para descargar el Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong>
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
                                    disabled={!proyecto?.allowed?.to_update}
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
                                    disabled={!proyecto?.allowed?.to_update}
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
                        {equipo_requiere_actualizacion && proyecto_presupuesto?.rubro_presupuestal_proyecto_linea68?.equipo_para_modernizar && (
                            <AlertMui className="mt-20" severity="error">
                                En la pregunta <strong>¿El equipo se requiere para modernizar uno ya existente en el área técnica?</strong> su respuesta ha sido <strong>SI</strong>. Debe cargar
                                obligatoriamente el <strong>Soporte PDF firmados de 1) el servicio de mantenimiento y 2) el cuentadante del equipo a actualizar</strong> adicional a las cotizaciones de
                                las empresas.
                            </AlertMui>
                        )}

                        {requiere_adecuacion && (
                            <AlertMui className="mt-20" severity="error">
                                Este rubro pertenece al Concepto interno SENA:{' '}
                                <strong>{proyecto_presupuesto.convocatoria_proyecto_rubros_presupuestales[0].rubro_presupuestal.segundo_grupo_presupuestal.nombre}</strong>. Debe cargar
                                obligatoriamente el <strong>Soporte PDF firmado por el profesional del área de construcciones del Centro</strong> adicional a las cotizaciones de las empresas.
                            </AlertMui>
                        )}

                        <AlertMui className="mt-20" severity="error">
                            Debe cargar mínimo 2 empresas con sus respectivos soportes / cotizaciones en PDF o ZIP.
                            <br />
                            <br />
                            <strong>
                                Importante: Si ha cargado más de 3 empresas, debe generar las respectivas columnas de empresas en el Excel Formato de Estudio de Mercado - Convocatoria SENNOVA{' '}
                                {convocatoria.year}. Recuerde que la información debe coincidir en el Excel y en la plataforma, tanto en la cantidad de empresas como en el valor total.
                                <br />
                                <br />
                                En la siguiente sección deberá adjuntar todos los soportes dados por las empresas. Para ello se recomienda unir los soportes de <strong>cada empresa</strong> en un PDF
                                o ZIP. Revise que los valores en los soportes sean iguales a los valores relacionados en el Excel. (Los soportes pueden ser precotizaciones, precios de catálogos de
                                canales comerciales oficiales de proveedores o de almacenes de grandes superficies, o valores de acuerdos marco de precios de Colombia Compra. (Los valores del estudio
                                deberán corresponder a proveedores ubicados en Colombia y tener una fecha no mayor a 4 meses).
                            </strong>
                        </AlertMui>
                        <TableMui className="mb-8" rows={['Concepto / Nombre de la empresa', 'Soporte(s)', 'Acciones']} sxCellThead={{ width: '320px' }}>
                            {proyecto.allowed.to_update ? (
                                <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setSoporte(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                                    <TableCell colSpan={4}>
                                        <ButtonMui>
                                            <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar
                                        </ButtonMui>
                                    </TableCell>
                                </TableRow>
                            ) : null}

                            {soportes_estudio_mercado.map((soporte, i) => (
                                <TableRow key={i}>
                                    <TableCell>{soporte.concepto}</TableCell>
                                    <TableCell>
                                        <DownloadFile
                                            label="soporte / cotización"
                                            className="!p-2"
                                            filename={soporte?.filename}
                                            extension={soporte?.extension}
                                            downloadRoute={
                                                soporte
                                                    ? soporte?.soporte?.includes('http') == true || soporte?.soporte?.includes('http') == undefined
                                                        ? soporte?.soporte
                                                        : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [
                                                              convocatoria,
                                                              proyecto,
                                                              proyecto_presupuesto,
                                                              soporte?.id,
                                                              'soporte',
                                                          ])
                                                    : null
                                            }
                                        />
                                        <ButtonMui
                                            onClick={() => (formSoporte.reset(), setDialogSoporteStatus(true), setSoporte(soporte))}
                                            className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                            <AutorenewIcon className="mr-2" />
                                            {soporte.filename ? 'Reemplazar' : 'Cargar'} soporte / cotización
                                        </ButtonMui>
                                    </TableCell>

                                    <TableCell>
                                        <MenuMui text={<MoreVertIcon />}>
                                            {soporte.id !== soporte_to_destroy ? (
                                                <div>
                                                    <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setSoporte(soporte))} disabled={!proyecto?.allowed?.to_view}>
                                                        {proyecto?.allowed?.to_view && !proyecto?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            setSoporteToDestroy(soporte.id)
                                                        }}
                                                        disabled={!proyecto?.allowed?.to_update}>
                                                        Eliminar
                                                    </MenuItem>
                                                </div>
                                            ) : (
                                                <div>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            setSoporteToDestroy(null)
                                                        }}>
                                                        Cancelar
                                                    </MenuItem>
                                                    <MenuItem
                                                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if (proyecto.allowed.to_update) {
                                                                router.delete(
                                                                    route('convocatorias.proyectos.presupuesto.soportes.destroy', [convocatoria.id, proyecto.id, proyecto_presupuesto.id, soporte.id]),
                                                                    {
                                                                        preserveScroll: true,
                                                                    },
                                                                )
                                                            }
                                                        }}>
                                                        Confirmar
                                                    </MenuItem>
                                                </div>
                                            )}
                                        </MenuMui>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableMui>

                        <DialogMui
                            open={dialog_status}
                            fullWidth={true}
                            maxWidth="lg"
                            blurEnabled={true}
                            dialogContent={
                                <Form
                                    is_super_admin={is_super_admin}
                                    setDialogStatus={setDialogStatus}
                                    method={method}
                                    proyecto={proyecto}
                                    convocatoria={convocatoria}
                                    proyecto_presupuesto={proyecto_presupuesto}
                                    soporte={soporte}
                                />
                            }
                        />

                        <DialogMui
                            open={dialog_archivo_status}
                            fullWidth={true}
                            maxWidth="lg"
                            blurEnabled={true}
                            dialogContent={
                                <form onSubmit={submitSoporte}>
                                    <FileInput
                                        id="soporte"
                                        value={formSoporte.data.soporte}
                                        label="Soporte / Cotización"
                                        accept=".zip,application/pdf"
                                        onChange={(e) => formSoporte.setData('soporte', e)}
                                        error={formSoporte.errors.soporte}
                                    />
                                    <div className="flex items-center justify-between mt-14 py-4">
                                        <PrimaryButton disabled={formSoporte.processing || !formSoporte.isDirty} className="ml-auto" type="submit">
                                            Cargar soporte
                                        </PrimaryButton>
                                        <ButtonMui type="button" primary={false} onClick={() => setDialogSoporteStatus(false)} className="!ml-2 !bg-transparent">
                                            Cancelar
                                        </ButtonMui>
                                    </div>
                                </form>
                            }
                        />
                    </div>
                </TabsMui>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default SoporteEstudioMercado
