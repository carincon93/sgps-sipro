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
import { Head, router, useForm } from '@inertiajs/react'
import { Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'
import Form from './Form'

const Index = ({ auth, proyectos, ods }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
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
                    <SearchBar className="mt-20" placeholder="Código SGPS del proyecto" />

                    <TableMui className="mt-16" rows={['Código', 'Título proyecto (Convocatoria)', 'Imagen', 'Nombre del proyecto', 'ODS', 'Acciones']} sxCellThead={{ width: '320px' }}>
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

                                {/* <TableCell>
                                    <AlertMui>
                                        {proyecto.estado_proyecto_proyecto_formulario_8_linea_66 ||
                                        proyecto.estado_proyecto_proyecto_formulario_1_linea_65 ||
                                        proyecto.estado_proyecto_proyecto_formulario_1_linea_68 ? (
                                            <>
                                                {proyecto.estado_proyecto_por_evaluador?.estado}
                                                {proyecto.allowed.to_view && (
                                                    <>
                                                        <br />
                                                        <small>
                                                            Puntaje: {proyecto.total_proyecto}
                                                            <br />
                                                            Número de recomendaciones: {proyecto.total_recomendaciones}
                                                        </small>
                                                    </>
                                                )}
                                            </>
                                        ) : proyecto.estado_proyecto_proyecto_formulario_4_linea_70 ? (
                                            <>
                                                {proyecto.estado_proyecto_proyecto_formulario_4_linea_70.estado}
                                                <br />| {proyecto.allowed.to_view && <small>Número de recomendaciones: {proyecto.total_recomendaciones}</small>}
                                            </>
                                        ) : proyecto.estado_proyecto_proyecto_formulario_5_linea_69 ? (
                                            <>
                                                {proyecto.estado_proyecto_proyecto_formulario_5_linea_69.estado}
                                                <br />| {proyecto.allowed.to_view && <small>Número de recomendaciones: {proyecto.total_recomendaciones}</small>}
                                            </>
                                        ) : (
                                            'Sin información registrada'
                                        )}
                                    </AlertMui>
                                </TableCell> */}
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
