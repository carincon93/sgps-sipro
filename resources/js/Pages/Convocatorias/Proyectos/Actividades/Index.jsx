import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import Label from '@/Components/Label'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import TableMui from '@/Components/Table'
import TabsMui from '@/Components/TabsMui'
import Textarea from '@/Components/Textarea'
import SelectMultiple from '@/Components/SelectMultiple'
import StepperMui from '@/Components/Stepper'

import { Chip, Grid, MenuItem, Paper, TableCell, TableRow } from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import Evaluacion from './Evaluacion'
import Form from './Form'

import { route, checkRole } from '@/Utils'

import { useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import MetodologiaFormulario10Linea69 from './MetodologiaFormulario10Linea69'
import MetodologiaFormulario11Linea83 from './MetodologiaFormulario11Linea83'
import MetodologiaFormulario17Linea69 from './MetodologiaFormulario17Linea69'
import MetodologiaFormulario4Linea70 from './MetodologiaFormulario4Linea70'
import MetodologiaFormulario5Linea69 from './MetodologiaFormulario5Linea69'

const Actividades = ({
    auth,
    convocatoria,
    proyecto,
    evaluacion,
    actividades,
    municipios,
    regionales,
    programas_formacion,
    disenos_curriculares,
    areas_cualificacion_mnc,
    proyecto_presupuesto,
    proyecto_roles,
    productos,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [actividad_to_destroy, setActividadToDestroy] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_rubro_presupuestal_status, setDialogRubroPresupuestalStatus] = useState(false)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [actividad, setActividad] = useState(null)

    const tabs =
        proyecto.tipo_formulario_convocatoria_id == 7 ||
        proyecto.tipo_formulario_convocatoria_id == 9 ||
        proyecto.tipo_formulario_convocatoria_id == 8 ||
        proyecto.tipo_formulario_convocatoria_id == 1 ||
        proyecto.tipo_formulario_convocatoria_id == 3 ||
        proyecto.tipo_formulario_convocatoria_id == 13 ||
        proyecto.tipo_formulario_convocatoria_id == 15 ||
        proyecto.tipo_formulario_convocatoria_id == 16 ||
        proyecto.tipo_formulario_convocatoria_id == 12 ||
        proyecto.tipo_formulario_convocatoria_id == 6 ||
        proyecto.tipo_formulario_convocatoria_id == 5 ||
        proyecto.tipo_formulario_convocatoria_id == 10 ||
        proyecto.tipo_formulario_convocatoria_id == 17 ||
        proyecto.tipo_formulario_convocatoria_id == 4 ||
        proyecto.tipo_formulario_convocatoria_id == 11
            ? [{ label: 'Metodología' }, { label: 'Actividades' }]
            : [{ label: 'Actividades' }]

    const form_metodologia_proyecto_formularios_lineas_restantes = useForm({
        metodologia:
            proyecto?.proyecto_formulario1_linea65?.metodologia ??
            proyecto?.proyecto_formulario6_linea82?.metodologia ??
            proyecto?.proyecto_formulario7_linea23?.metodologia ??
            proyecto?.proyecto_formulario8_linea66?.metodologia ??
            proyecto?.proyecto_formulario9_linea23?.metodologia ??
            proyecto?.proyecto_formulario12_linea68?.metodologia ??
            proyecto?.proyecto_formulario13_linea65?.metodologia ??
            proyecto?.proyecto_formulario15_linea65?.metodologia ??
            proyecto?.proyecto_formulario3_linea61?.metodologia ??
            proyecto?.proyecto_formulario16_linea65?.metodologia ??
            '',
    })

    const submitMetodologiaProyectoFormulariosLineaRestantes = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_metodologia_proyecto_formularios_lineas_restantes.put(route('convocatorias.proyectos.metodologia', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_rubro_presupuestal = useForm({
        proyecto_presupuesto_id: null,
    })

    const submitRubroPresupuestal = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_rubro_presupuestal.post(route('convocatorias.proyectos.actividades.link-rubros-presupuestales', [convocatoria.id, proyecto.id, actividad.id]), {
                onSuccess: () => setDialogRubroPresupuestalStatus(false),
                preserveScroll: true,
            })
        }
    }

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos.metodologia.updateLongColumn', [convocatoria.id, proyecto?.id, column]),
                    { [column]: data ? data : form.data[column], is_array: Array.isArray(form.data[column]) },
                    {
                        onError: (resp) => console.log(resp),
                        onFinish: () => console.log('Request finished'),
                        preserveScroll: true,
                    },
                )
            } catch (error) {
                console.error('An error occurred:', error)
            }
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Metodologia - Actividades" />

            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            {/* <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={evaluacion_dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion auth_user={auth.user} convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
            </Grid> */}

            {/* {is_super_admin || proyecto.mostrar_recomendaciones ? (
                <>
                    {proyecto.evaluaciones.map((evaluacion, i) =>
                        is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                            <ToolTipMui
                                key={i}
                                title={
                                    <div>
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        {evaluacion.evaluacion_proyecto_linea66 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea66.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea66.metodologia_comentario : 'Sin recomendación'}
                                            </p>
                                        )}
                                        {!evaluacion.evaluacion_proyecto_linea66 && evaluacion.evaluacion_proyecto_linea65 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea65.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea65.metodologia_comentario : 'Sin recomendación'}
                                            </p>
                                        )}
                                        {!evaluacion.evaluacion_proyecto_linea66 && !evaluacion.evaluacion_proyecto_linea65 && evaluacion.evaluacion_proyecto_linea70 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea70.metodologia_comentario ? evaluacion.evaluacion_proyecto_linea70.metodologia_comentario : 'Sin recomendación'}
                                            </p>
                                        )}
                                        {!evaluacion.evaluacion_proyecto_linea66 &&
                                            !evaluacion.evaluacion_proyecto_linea65 &&
                                            !evaluacion.evaluacion_proyecto_linea70 &&
                                            evaluacion.evaluacion_proyecto_linea69 && (
                                                <p className="whitespace-pre-line text-xs">
                                                    {evaluacion.evaluacion_proyecto_linea69.metodologia_comentario
                                                        ? evaluacion.evaluacion_proyecto_linea69.metodologia_comentario
                                                        : 'Sin recomendación'}
                                                </p>
                                            )}
                                        {!evaluacion.evaluacion_proyecto_linea66 &&
                                            !evaluacion.evaluacion_proyecto_linea65 &&
                                            !evaluacion.evaluacion_proyecto_linea70 &&
                                            !evaluacion.evaluacion_proyecto_linea69 &&
                                            evaluacion.evaluacion_proyecto_linea68 && (
                                                <div>
                                                    <h1 className="font-black mt-10">Metodología</h1>
                                                    <p className="whitespace-pre-line text-xs">
                                                        {evaluacion.evaluacion_proyecto_linea68.metodologia_comentario
                                                            ? evaluacion.evaluacion_proyecto_linea68.metodologia_comentario
                                                            : 'Sin recomendación'}
                                                    </p>
                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Actividades</h1>
                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68.actividades_primer_obj_comentario
                                                                ? 'Recomendación actividades del primer objetivo específico: ' +
                                                                  evaluacion.evaluacion_proyecto_linea68.actividades_primer_obj_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68.actividades_segundo_obj_comentario
                                                                ? 'Recomendación actividades del segundo objetivo específico: ' +
                                                                  evaluacion.evaluacion_proyecto_linea68.actividades_segundo_obj_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68.actividades_tercer_obj_comentario
                                                                ? 'Recomendación actividades del tercer objetivo específico: ' +
                                                                  evaluacion.evaluacion_proyecto_linea68.actividades_tercer_obj_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                        <li className="whitespace-pre-line text-xs mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68.actividades_cuarto_obj_comentario
                                                                ? 'Recomendación actividades del cuarto objetivo específico: ' +
                                                                  evaluacion.evaluacion_proyecto_linea68.actividades_cuarto_obj_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                    </div>
                                }>
                                Evaluación {i + 1}
                            </ToolTipMui>
                        ) : null,
                    )}
                    {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                </>
            ) : null} */}

            <Grid item md={12}>
                <AlertMui severity="success" className="my-20 MuiAlert-standardInfo MuiAlert-standardSuccess">
                    <h1 className="text-3xl mt-10 text-center">¿Cómo diligenciar la metodología y las actividades?</h1>

                    <div className="my-10">
                        <p>
                            1. Diligencie toda la información de la pestaña <strong>METODOLOGÍA</strong>.
                        </p>

                        <p>
                            2. Diríjase a la pestaña <strong>ACTIVIDADES</strong>, luego de clic en el menú de acciones y <strong>Editar</strong>. A continuación, complete la información sobre el
                            resultado y roles SENNOVA asociados a cada actividad. Posteriormente, asigne los rubros presupuestales correspondientes desde el botón{' '}
                            <strong>'Asociar rubros presupuestales'</strong>.
                        </p>
                    </div>
                </AlertMui>
            </Grid>

            <Grid item md={12}>
                <TabsMui tabs={tabs}>
                    <div>
                        <div className="mt-20">
                            <AlertMui className="!p-4">
                                <p>
                                    Se debe evidenciar que la metodología se presente de forma organizada y de manera secuencial, de acuerdo con el ciclo P-H-V-A “Planificar – Hacer – Verificar -
                                    Actuar” para alcanzar el objetivo general y cada uno de los objetivos específicos.
                                </p>
                            </AlertMui>
                        </div>
                        {proyecto.tipo_formulario_convocatoria_id == 4 && (
                            <MetodologiaFormulario4Linea70
                                disenos_curriculares={disenos_curriculares}
                                programas_formacion={programas_formacion}
                                convocatoria={convocatoria}
                                municipios={municipios}
                                proyecto={proyecto}
                                regionales={regionales}
                            />
                        )}
                        {proyecto.tipo_formulario_convocatoria_id == 5 && <MetodologiaFormulario5Linea69 convocatoria={convocatoria} proyecto={proyecto} />}
                        {proyecto.tipo_formulario_convocatoria_id == 10 && (
                            <MetodologiaFormulario10Linea69
                                convocatoria={convocatoria}
                                municipios={municipios}
                                proyecto={proyecto}
                                regionales={regionales}
                                areas_cualificacion_mnc={areas_cualificacion_mnc}
                            />
                        )}
                        {proyecto.tipo_formulario_convocatoria_id == 17 && (
                            <MetodologiaFormulario17Linea69
                                convocatoria={convocatoria}
                                municipios={municipios}
                                proyecto={proyecto}
                                regionales={regionales}
                                areas_cualificacion_mnc={areas_cualificacion_mnc}
                            />
                        )}
                        {proyecto.tipo_formulario_convocatoria_id == 11 && <MetodologiaFormulario11Linea83 convocatoria={convocatoria} proyecto={proyecto} regionales={regionales} />}
                        {proyecto.tipo_formulario_convocatoria_id == 7 ||
                        proyecto.tipo_formulario_convocatoria_id == 1 ||
                        proyecto.tipo_formulario_convocatoria_id == 3 ||
                        proyecto.tipo_formulario_convocatoria_id == 6 ||
                        proyecto.tipo_formulario_convocatoria_id == 8 ||
                        proyecto.tipo_formulario_convocatoria_id == 9 ||
                        proyecto.tipo_formulario_convocatoria_id == 12 ||
                        proyecto.tipo_formulario_convocatoria_id == 13 ||
                        proyecto.tipo_formulario_convocatoria_id == 15 ||
                        proyecto.tipo_formulario_convocatoria_id == 16 ? (
                            <form onSubmit={submitMetodologiaProyectoFormulariosLineaRestantes} className="mt-10">
                                <Label required className="mb-4" labelFor="metodologia" value={`Metodología (¿Cómo se implementará la línea en el ${convocatoria.year}?)`} />

                                <Textarea
                                    id="metodologia"
                                    error={form_metodologia_proyecto_formularios_lineas_restantes.errors.metodologia}
                                    value={form_metodologia_proyecto_formularios_lineas_restantes.data.metodologia}
                                    onChange={(e) => form_metodologia_proyecto_formularios_lineas_restantes.setData('metodologia', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    onBlur={() => syncColumnLong('metodologia', form_metodologia_proyecto_formularios_lineas_restantes)}
                                    required
                                />

                                <div className=" flex items-center justify-between py-4">
                                    {proyecto.allowed.to_update && (
                                        <PrimaryButton disabled={form_metodologia_proyecto_formularios_lineas_restantes.processing} className="ml-auto" type="submit">
                                            Guardar información de la metodología
                                        </PrimaryButton>
                                    )}
                                </div>
                            </form>
                        ) : null}
                    </div>

                    <div>
                        <TableMui className="mt-20 mb-8" rows={['Descripción', 'Objetivo específico', '', 'Acciones']} sxCellThead={{ width: '320px' }}>
                            {actividades.map((actividad, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {actividad.fecha_inicio ? (
                                            <>
                                                <Chip
                                                    className="mb-2"
                                                    label={
                                                        <>
                                                            <CalendarTodayOutlinedIcon fontSize="16px" /> Del {actividad.fecha_inicio} al {actividad.fecha_finalizacion}{' '}
                                                        </>
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Chip className="!bg-red-100 !text-red-400 !hover:bg-red-200 px-2 py-1 mb-2" label="Sin fechas definidas" />
                                            </>
                                        )}
                                        <p className="line-clamp-3">{actividad.descripcion}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="line-clamp-3">{actividad.objetivo_especifico != null ? actividad.objetivo_especifico.descripcion : 'Aún no ha registrado la descripción'}</p>

                                        {actividad.resultado_id == null && (
                                            <AlertMui className="mt-2" severity="error">
                                                La actividad no tiene un resultado asociado. Por favor, edítela y, complete la información.
                                            </AlertMui>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <ButtonMui
                                            onClick={() => {
                                                setActividad(actividad)
                                                form_rubro_presupuestal.setData(
                                                    'proyecto_presupuesto_id',
                                                    actividad?.proyecto_presupuesto.map((item) => item.id),
                                                )
                                                setDialogRubroPresupuestalStatus(true)
                                            }}
                                            className="!my-1 !text-left !normal-case ">
                                            <AttachMoneyIcon className="mr-2" />
                                            {actividad.proyecto_presupuesto.length > 0 ? <>Revisar rubros presupuestales</> : <>Asociar rubros presupuestales</>}
                                        </ButtonMui>
                                    </TableCell>

                                    <TableCell>
                                        <MenuMui text={<MoreVertIcon />}>
                                            {actividad.id !== actividad_to_destroy ? (
                                                <div>
                                                    <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setActividad(actividad))} disabled={!proyecto?.allowed?.to_view}>
                                                        Editar
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            setActividadToDestroy(actividad.id)
                                                        }}
                                                        disabled={!proyecto?.allowed?.to_update}>
                                                        Eliminar
                                                    </MenuItem>
                                                </div>
                                            ) : (
                                                <div>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            setActividadToDestroy(null)
                                                        }}>
                                                        Cancelar
                                                    </MenuItem>
                                                    <MenuItem
                                                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if (proyecto.allowed.to_update) {
                                                                router.delete(route('convocatorias.proyectos.actividad.destroy', [convocatoria.id, proyecto.id, actividad.id]), {
                                                                    preserveScroll: true,
                                                                })
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
                                    actividad={actividad}
                                    proyecto_presupuesto={proyecto_presupuesto}
                                    proyecto_roles={proyecto_roles}
                                    productos={productos}
                                />
                            }
                        />

                        <DialogMui
                            open={dialog_rubro_presupuestal_status}
                            fullWidth={true}
                            maxWidth="lg"
                            blurEnabled={true}
                            dialogContent={
                                <Grid container spacing={2}>
                                    <Grid item md={4}>
                                        <h1 className="font-black text-right text-white text-2xl mr-10">Rubros presupuestales</h1>
                                    </Grid>

                                    <Grid item md={8}>
                                        <Paper className="p-8">
                                            <form onSubmit={submitRubroPresupuestal}>
                                                <SelectMultiple
                                                    id="proyecto_presupuesto_id"
                                                    bdValues={form_rubro_presupuestal.data.proyecto_presupuesto_id}
                                                    options={proyecto_presupuesto}
                                                    error={form_rubro_presupuestal.errors.proyecto_presupuesto_id}
                                                    label="Relacione los rubros presupuestales"
                                                    onChange={(event, newValue) => {
                                                        const selected_values = newValue.map((option) => option.value)
                                                        form_rubro_presupuestal.setData((prevData) => ({
                                                            ...prevData,
                                                            proyecto_presupuesto_id: selected_values,
                                                        }))
                                                    }}
                                                    disabled={!proyecto?.allowed?.to_update}
                                                    required
                                                />

                                                <div className="flex items-center justify-between py-4">
                                                    {proyecto.allowed.to_update ? (
                                                        <PrimaryButton disabled={form_rubro_presupuestal.processing || !form_rubro_presupuestal.isDirty} className="mr-2 ml-auto" type="submit">
                                                            Asociar rubros presupuestales
                                                        </PrimaryButton>
                                                    ) : (
                                                        <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                                    )}
                                                    <ButtonMui type="button" primary={false} onClick={() => setDialogRubroPresupuestalStatus(false)}>
                                                        Cancelar
                                                    </ButtonMui>
                                                </div>
                                            </form>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            }
                        />
                    </div>
                </TabsMui>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Actividades
