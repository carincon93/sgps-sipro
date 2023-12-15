import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import FileInput from '@/Components/FileInput'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import PrimaryButton from '@/Components/PrimaryButton'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import { checkRole } from '@/Utils'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'

import Form from './Form'

const Index = ({ auth, proyectos, ods, proyectos_sin_autores }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_proyectos_sin_autor, setDialogProyectosSinAutorStatus] = useState(proyectos_sin_autores.length > 0 && checkRole(auth_user, [1, 4, 5, 17, 18, 19]))
    const [dialog_info_status, setDialogInfoStatus] = useState(true)
    const [dialog_imagen_status, setDialogImagenStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [proyecto, setProyecto] = useState(null)
    const [proyecto_to_destroy, setProyectooDestroy] = useState(null)

    const form = useForm({
        _method: 'PUT',
        imagen: '',
    })

    const submit = (e) => {
        e.preventDefault()
        form.post(route('proyectos.update', [proyecto.id]), {
            onSuccess: () => setDialogImagenStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Proyectos" />

            <Grid container>
                <Grid item md={12}>
                    <DialogMui
                        open={dialog_proyectos_sin_autor}
                        fullWidth={true}
                        maxWidth="lg"
                        blurEnabled={true}
                        dialogContent={
                            <div>
                                <h1 className="font-black text-2xl">
                                    Importante: Hay proyectos sin un(a) autor(a) principal. Por favor, haga clic en el proyecto, diríjase al paso de Participantes y, asigne un autor. Si es un proyecto
                                    de prueba, solicite la eliminación.
                                </h1>
                                <p className="my-6">Lista de proyectos:</p>
                                <AlertMui severity="error">
                                    <ul className="!list-disc">
                                        {proyectos_sin_autores.map((proyecto, i) => (
                                            <li key={i} className="mb-4 hover:opacity-70">
                                                <Link href={route('convocatorias.proyectos.edit', [proyecto.convocatoria_id, proyecto.id])}>
                                                    #{i + 1} -{' '}
                                                    <strong>
                                                        {proyecto.codigo} (Convocatoria {proyecto.year})
                                                    </strong>{' '}
                                                    -{' '}
                                                    {proyecto.proyecto_formulario7_linea23
                                                        ? proyecto.proyecto_formulario7_linea23.titulo
                                                        : proyecto.proyecto_formulario9_linea23
                                                        ? proyecto.proyecto_formulario9_linea23.titulo
                                                        : proyecto.proyecto_formulario3_linea61
                                                        ? proyecto.proyecto_formulario3_linea61.titulo
                                                        : proyecto.proyecto_formulario1_linea65
                                                        ? proyecto.proyecto_formulario1_linea65.titulo
                                                        : proyecto.proyecto_formulario13_linea65
                                                        ? proyecto.proyecto_formulario13_linea65.titulo
                                                        : proyecto.proyecto_formulario15_linea65
                                                        ? proyecto.proyecto_formulario15_linea65.titulo
                                                        : proyecto.proyecto_formulario16_linea65
                                                        ? proyecto.proyecto_formulario16_linea65.titulo
                                                        : proyecto.proyecto_formulario8_linea66
                                                        ? proyecto.proyecto_formulario8_linea66.titulo
                                                        : proyecto.proyecto_formulario12_linea68
                                                        ? proyecto.proyecto_formulario12_linea68.titulo
                                                        : proyecto.proyecto_formulario5_linea69
                                                        ? proyecto.proyecto_formulario5_linea69.titulo
                                                        : proyecto.proyecto_formulario10_linea69
                                                        ? proyecto.proyecto_formulario10_linea69.titulo
                                                        : proyecto.proyecto_formulario17_linea69
                                                        ? proyecto.proyecto_formulario17_linea69.titulo
                                                        : proyecto.proyecto_formulario4_linea70
                                                        ? proyecto.proyecto_formulario4_linea70.titulo
                                                        : proyecto.proyecto_formulario6_linea82
                                                        ? proyecto.proyecto_formulario6_linea82.titulo
                                                        : proyecto.proyecto_formulario11_linea83
                                                        ? proyecto.proyecto_formulario11_linea83.titulo
                                                        : 'Sin información registrada'}
                                                    <strong>{' - '} Ir al proyecto.</strong>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </AlertMui>
                            </div>
                        }
                        dialogActions={
                            <ButtonMui onClick={() => setDialogProyectosSinAutorStatus(false)} type="button" className="!mr-3 !mb-3">
                                He completado la información de los proyectos
                            </ButtonMui>
                        }
                    />

                    <SearchBar className="mt-20" placeholder="Código SGPS del proyecto" />

                    <TableMui
                        className="mt-16"
                        rows={['Código', 'Título proyecto (Convocatoria)', 'Imagen', 'Nombre del proyecto', 'ODS', 'Estado (Evaluación)', 'Acciones']}
                        sxCellThead={{ width: '320px' }}>
                        {proyectos.data.map((proyecto, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    {proyecto.codigo}
                                    <Divider />
                                    <small>Convocatoria {proyecto.convocatoria.year}</small>
                                </TableCell>
                                <TableCell>
                                    <p className="uppercase line-clamp-4">
                                        {proyecto.proyecto_formulario7_linea23
                                            ? proyecto.proyecto_formulario7_linea23.titulo
                                            : proyecto.proyecto_formulario9_linea23
                                            ? proyecto.proyecto_formulario9_linea23.titulo
                                            : proyecto.proyecto_formulario3_linea61
                                            ? proyecto.proyecto_formulario3_linea61.titulo
                                            : proyecto.proyecto_formulario1_linea65
                                            ? proyecto.proyecto_formulario1_linea65.titulo
                                            : proyecto.proyecto_formulario13_linea65
                                            ? proyecto.proyecto_formulario13_linea65.titulo
                                            : proyecto.proyecto_formulario15_linea65
                                            ? proyecto.proyecto_formulario15_linea65.titulo
                                            : proyecto.proyecto_formulario16_linea65
                                            ? proyecto.proyecto_formulario16_linea65.titulo
                                            : proyecto.proyecto_formulario8_linea66
                                            ? proyecto.proyecto_formulario8_linea66.titulo
                                            : proyecto.proyecto_formulario12_linea68
                                            ? proyecto.proyecto_formulario12_linea68.titulo
                                            : proyecto.proyecto_formulario5_linea69
                                            ? proyecto.proyecto_formulario5_linea69.titulo
                                            : proyecto.proyecto_formulario10_linea69
                                            ? proyecto.proyecto_formulario10_linea69.titulo
                                            : proyecto.proyecto_formulario17_linea69
                                            ? proyecto.proyecto_formulario17_linea69.titulo
                                            : proyecto.proyecto_formulario4_linea70
                                            ? proyecto.proyecto_formulario4_linea70.titulo
                                            : proyecto.proyecto_formulario6_linea82
                                            ? proyecto.proyecto_formulario6_linea82.titulo
                                            : proyecto.proyecto_formulario11_linea83
                                            ? proyecto.proyecto_formulario11_linea83.titulo
                                            : 'Sin información registrada'}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <img src={proyecto.imagen ? '/storage/imagenes-proyectos/' + proyecto.imagen : '/storage/imagenes-proyectos/default-image.png'} width="100%" className="" />
                                    <ButtonMui className="!my-1 !text-left !normal-case w-full" onClick={() => (form.reset(), setDialogImagenStatus(true), setMethod('PUT'), setProyecto(proyecto))}>
                                        Subir imagen
                                    </ButtonMui>
                                </TableCell>

                                <TableCell>
                                    {proyecto.nuevo_titulo ? (
                                        <p className="uppercase line-clamp-4">{proyecto.nuevo_titulo}</p>
                                    ) : (
                                        <AlertMui severity="error" className="!text-xs !px-1">
                                            Sin información registrada
                                        </AlertMui>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {ods
                                        .filter((item) => proyecto?.ods?.includes(item.value))
                                        .map((item) => item.label)
                                        .join(', ')}

                                    {proyecto?.ods == null && (
                                        <AlertMui severity="error" className="!text-xs !px-1">
                                            Sin información registrada
                                        </AlertMui>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {checkRole(auth_user, [1]) || !['1', '2', '4'].includes(proyecto.convocatoria.fase) ? (
                                        <>
                                            {proyecto.convocatoria.esta_activa && proyecto?.estado_evaluacion_proyecto?.requiere_subsanar && ['3', '5'].includes(proyecto.convocatoria.fase) ? (
                                                <>
                                                    <AlertMui severity="warning" className="!mb-1">
                                                        <small>Requiere subsanación</small>
                                                    </AlertMui>
                                                </>
                                            ) : !proyecto.convocatoria.esta_activa ? (
                                                <AlertMui className="!leading-4">
                                                    <strong>Convocatoria {proyecto.convocatoria.year}</strong>
                                                    <Divider className="!my-1" />
                                                    {proyecto?.estado_evaluacion_proyecto?.estado_evaluacion}
                                                </AlertMui>
                                            ) : (
                                                <AlertMui className="!leading-4">
                                                    <strong>Convocatoria {proyecto.convocatoria.year}</strong>
                                                    <Divider className="!my-1" />
                                                    Los resultados definitivos se publicarán próximamente.
                                                </AlertMui>
                                            )}

                                            {/* <AlertMui className="!leading-3">
                                                <small>{proyecto?.estado_evaluacion_proyecto?.estado_evaluacion}</small>
                                            </AlertMui> */}

                                            {checkRole(auth_user, [1]) && (
                                                <AlertMui className="!leading-3">
                                                    {proyecto?.estado_evaluacion_proyecto?.estado_evaluacion}
                                                    <Divider className="!my-2" />
                                                    <div>Puntaje: {proyecto?.estado_evaluacion_proyecto?.puntaje_total}</div>
                                                    <small>
                                                        Número de recomendaciones: {proyecto?.estado_evaluacion_proyecto?.total_recomendaciones}
                                                        <br />
                                                        Evaluaciones: {proyecto?.estado_evaluacion_proyecto?.cantidad_evaluaciones} habilitada(s) /{' '}
                                                        {proyecto?.estado_evaluacion_proyecto?.evaluaciones_finalizadas} finalizada(s)
                                                    </small>
                                                </AlertMui>
                                            )}
                                        </>
                                    ) : (
                                        <AlertMui className="!leading-3">
                                            <small>Aún no tiene permisos para ver el estado de evaluación de este proyecto.</small>
                                        </AlertMui>
                                    )}

                                    {checkRole(auth_user, [1]) ? (
                                        <>
                                            {proyecto?.estado_evaluacion_proyecto?.alerta && (
                                                <AlertMui severity="error" className="mt-4 !text-xs">
                                                    Importante: {proyecto?.estado_evaluacion_proyecto?.alerta}
                                                </AlertMui>
                                            )}
                                        </>
                                    ) : null}
                                </TableCell>
                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {proyecto.id !== proyecto_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setProyecto(proyecto))}>
                                                    Completar información para divulgación del proyecto
                                                </MenuItem>
                                                <MenuItem onClick={() => router.visit(route('convocatorias.proyectos.edit', [proyecto.convocatoria_id, proyecto.id]))}>Ir al proyecto</MenuItem>

                                                {is_super_admin && (
                                                    <>
                                                        <Divider />
                                                        <MenuItem
                                                            onClick={() => {
                                                                setProyectooDestroy(proyecto.id)
                                                            }}>
                                                            Eliminar
                                                        </MenuItem>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setProyectooDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (proyecto.allowed.to_update) {
                                                            router.delete(route('convocatorias.proyectos.destroy', [proyecto.convocatoria_id, proyecto.id]), {
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

                    <PaginationMui links={proyectos.links} className="mt-8" />

                    <DialogMui
                        open={dialog_info_status}
                        fullWidth={true}
                        maxWidth="lg"
                        blurEnabled={true}
                        enableGradient={true}
                        dialogContent={
                            <div className="text-white">
                                <h1 className="text-2xl font-bold mb-4">
                                    Estamos trabajando en mejorar la divulgación de los proyectos registrados en la plataforma SGPS SIPRO y necesitamos de su ayuda.
                                </h1>

                                <p className="mb-10">Por favor, revise cada uno de los proyectos en los que participó y complete la siguiente información:</p>
                                <Grid container rowSpacing={6}>
                                    <Grid item md={3}>
                                        <img src="/storage/imagenes-proyectos/imagen-dialog.png" className="rounded shadow" alt="" />
                                    </Grid>
                                    <Grid item md={9} className="flex items-center">
                                        <p>
                                            <strong>Foto o imagen: </strong>Debe cargar una imagen/foto que represente de manera visual el proyecto o los productos más destacados. Esta funcionalidad
                                            facilitará la visualización y comprensión del proyecto.
                                        </p>
                                    </Grid>

                                    <Grid item md={3}>
                                        <img src="/storage/imagenes-proyectos/titulo.png" alt="" className="rounded shadow" width="100%" />
                                    </Grid>
                                    <Grid item md={9} className="flex items-center">
                                        <p>
                                            <strong>Nombre del proyecto: </strong> Asigne un nombre "comercial" o llamativo a su proyecto.
                                        </p>
                                    </Grid>

                                    <Grid item md={3}>
                                        <img src="/storage/imagenes-proyectos/ods.png" alt="" className="mt-1 rounded shadow" />
                                    </Grid>
                                    <Grid item md={9}>
                                        <p>
                                            <strong>Objetivos ODS: </strong>Seleccione uno o mas objetivos de desarrollo sostenible asociados con el proyecto SGPS. Esto apuntará a destacar la
                                            contribución de su proyecto a los objetivos globales de sostenibilidad.
                                        </p>
                                    </Grid>
                                </Grid>
                            </div>
                        }
                        dialogActions={
                            <ButtonMui onClick={() => setDialogInfoStatus(false)} type="button" className="!mr-3 !mb-3">
                                Entendido
                            </ButtonMui>
                        }
                    />

                    <DialogMui
                        open={dialog_status}
                        fullWidth={true}
                        maxWidth="lg"
                        blurEnabled={true}
                        dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} proyecto={proyecto} ods={ods} />}
                    />

                    <DialogMui
                        open={dialog_imagen_status}
                        dialogContent={
                            <>
                                <form onSubmit={submit}>
                                    <FileInput
                                        id="imagen"
                                        value={form.data.imagen}
                                        filename={proyecto?.filename.imagen_filename}
                                        extension={proyecto?.extension.imagen_extension}
                                        label="Imagen o foto del proyecto"
                                        onChange={(e) => form.setData('imagen', e)}
                                        accept="image/*"
                                        error={form.errors.imagen}
                                    />
                                    <AlertMui>
                                        Este campo permitirá asociar una imagen que represente de manera visual el proyecto o los productos más destacados. Esta funcionalidad facilitará la
                                        visualización y comprensión del proyecto.
                                    </AlertMui>
                                    <div className="flex items-center justify-between mt-14 py-4">
                                        <PrimaryButton disabled={form.processing || !form.isDirty} className="ml-auto" type="submit">
                                            Cargar imagen
                                        </PrimaryButton>
                                        <ButtonMui type="button" primary={false} onClick={() => setDialogImagenStatus(false)} className="!ml-2 !bg-transparent">
                                            Cancelar
                                        </ButtonMui>
                                    </div>
                                </form>
                            </>
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index
