import AlertMui from '@/Components/Alert'
import InputError from '@/Components/InputError'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Divider, MenuItem, TableCell, TableRow } from '@mui/material'

import SearchBar from '@/Components/SearchBar'
import Autocomplete from '@/Components/Autocomplete'
import TextInput from '@/Components/TextInput'

import { router, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { useEffect } from 'react'

const Participantes = ({ auth_user, convocatoria, proyecto, roles_sennova, nuevo_participante, autor_principal }) => {
    const { props: page_props } = usePage()
    const [search_param, setSearchParam] = useState()
    const [participante_a_modificar_id, setParticipanteAModificarId] = useState(null)

    /**
     * Participantes
     */
    const form_participante = useForm({
        user_id: null,
        cantidad_meses: '',
        cantidad_horas: '',
        rol_sennova: null,
    })

    const form_nuevo_participante = useForm({
        user_id: null,
        cantidad_meses: '',
        cantidad_horas: '',
        rol_sennova: null,
    })

    const submitNuevoParticipante = () => {
        if (proyecto.allowed.to_update) {
            form_nuevo_participante.post(
                route('convocatorias.proyectos.participantes.users.link', {
                    proyecto: proyecto.id,
                    convocatoria: convocatoria.id,
                }),
                {
                    preserveScroll: true,
                },
            )
        }
    }

    useEffect(() => {
        form_nuevo_participante.reset()
        setSearchParam(page_props.ziggy.query.search)
    }, [page_props.ziggy.query.search])

    useEffect(() => {
        if (form_nuevo_participante.data.user_id) submitNuevoParticipante()
    }, [form_nuevo_participante.data.user_id])

    proyecto.participantes.sort((a, b) => a.nombre.localeCompare(b.nombre))

    return (
        <>
            <h1 className="text-3xl mt-24 mb-8 text-center">Participantes vinculados</h1>

            {proyecto.tipo_formulario_convocatoria_id == 8 ||
            proyecto.tipo_formulario_convocatoria_id == 6 ||
            proyecto.tipo_formulario_convocatoria_id == 7 ||
            proyecto.tipo_formulario_convocatoria_id == 9 ? (
                <>
                    <AlertMui className="my-8">
                        <h1 className="mb-4 text-3xl font-black">Importante</h1>
                        Debe relacionar mínimo 2 aprendices con el rol de "Aprendiz en semillero de investigación"
                        <br />
                        Debe relacionar mínimo 1 instructor con el rol de “Instructor investigador"
                    </AlertMui>
                </>
            ) : null}

            <TableMui className="mt-20" rows={['Nombre', 'Rol SENNOVA', 'Participación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                {proyecto.participantes.map((participante, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            {participante.id == autor_principal?.id && <Chip className="!bg-green-100 !text-xs mb-2" size="small" label="Autor(a) principal" />}
                            <br />
                            {participante.nombre}
                            <br />
                            <Chip className="mt-2" label={participante.email} />

                            <br />
                            <br />
                            {participante.centro_formacion ? participante.centro_formacion.nombre : ''}
                            <br />
                            <Chip className="mt-2" label={participante.centro_formacion ? participante.centro_formacion.regional.nombre : ''} />
                        </TableCell>
                        {participante.id == participante_a_modificar_id ? (
                            <>
                                <TableCell>
                                    <Autocomplete
                                        id="rol_sennova"
                                        size="small"
                                        options={roles_sennova}
                                        selectedValue={form_participante.data.rol_sennova}
                                        onChange={(event, newValue) => {
                                            form_participante.setData('rol_sennova', newValue.value)
                                        }}
                                        label="Seleccione el rol SENNOVA"
                                        required
                                    />
                                    {form_participante.errors.rol_sennova && <InputError className="relative top-6" message={form_participante.errors.rol_sennova} />}
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center justify-center">
                                        <TextInput
                                            id="cantidad_meses"
                                            type="number"
                                            name="cantidad_meses"
                                            inputProps={{
                                                min: 1,
                                                max: proyecto.diff_meses,
                                                step: '0.1',
                                            }}
                                            size="small"
                                            required
                                            value={form_participante.data.cantidad_meses}
                                            onChange={(e) => form_participante.setData('cantidad_meses', e.target.value)}
                                            className="!inline-block !w-20 !mr-2"
                                        />{' '}
                                        meses
                                        <TextInput
                                            id="cantidad_horas"
                                            type="number"
                                            name="cantidad_horas"
                                            size="small"
                                            required
                                            value={form_participante.data.cantidad_horas}
                                            onChange={(e) => {
                                                form_participante.setData('cantidad_horas', e.target.value)
                                            }}
                                            className="!inline-block !w-16 !mx-2"
                                        />{' '}
                                        horas semanales
                                    </div>

                                    {form_participante.errors.cantidad_meses && <InputError className="relative top-6" message={form_participante.errors.cantidad_meses} />}
                                    {form_participante.errors.cantidad_horas && <InputError className="relative top-6" message={form_participante.errors.cantidad_horas} />}
                                </TableCell>
                            </>
                        ) : (
                            <>
                                <TableCell>{roles_sennova.filter((rolSennova) => rolSennova.value == participante.pivot.rol_sennova)[0]?.label}</TableCell>
                                <TableCell>
                                    {participante.pivot.cantidad_meses.replace('.', ',')} meses - {participante.pivot.cantidad_horas} horas semanales
                                </TableCell>
                            </>
                        )}

                        {participante.id != participante_a_modificar_id ? (
                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    <MenuItem
                                        onClick={() =>
                                            router.post(route('convocatorias.proyectos.participantes.nuevo-autor-principal', [convocatoria.id, proyecto.id, participante.id]), [], {
                                                preserveScroll: true,
                                            })
                                        }
                                        disabled={!proyecto.allowed.to_update}
                                        className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                        Convertir en autor principal
                                    </MenuItem>
                                    <Divider className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                                    <MenuItem
                                        onClick={() => {
                                            form_participante.reset()
                                            form_participante.setData({
                                                user_id: participante.id,
                                                cantidad_meses: participante.pivot.cantidad_meses,
                                                cantidad_horas: participante.pivot.cantidad_horas,
                                                rol_sennova: participante.pivot.rol_sennova,
                                            })
                                            setParticipanteAModificarId(participante.id)
                                        }}
                                        disabled={!proyecto.allowed.to_update}
                                        className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                        Editar
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            router.delete(
                                                route('convocatorias.proyectos.participantes.users.unlink', {
                                                    proyecto: proyecto.id,
                                                    convocatoria: convocatoria.id,
                                                    user: participante.id,
                                                }),
                                                { preserveScroll: true },
                                            )
                                        }
                                        disabled={(!proyecto.allowed.to_update && auth_user.id != participante.id) || (!proyecto.allowed.to_update && !participante.formulador)}
                                        className={(!proyecto.allowed.to_update && auth_user.id != participante.id) || (!proyecto.allowed.to_update && !participante.formulador) ? 'hidden' : ''}>
                                        Quitar
                                    </MenuItem>
                                </MenuMui>
                            </TableCell>
                        ) : (
                            <TableCell>
                                <PrimaryButton
                                    onClick={() => {
                                        form_participante.put(
                                            route('convocatorias.proyectos.participantes.users.update', {
                                                proyecto: proyecto.id,
                                                convocatoria: convocatoria.id,
                                            }),
                                            { preserveScroll: true },
                                        )
                                    }}
                                    disabled={form_participante.processing}>
                                    Guardar
                                </PrimaryButton>
                            </TableCell>
                        )}
                    </TableRow>
                ))}

                {nuevo_participante && (
                    <>
                        {search_param && (
                            <TableRow sx={{ backgroundColor: '#e5f6fd' }}>
                                <TableCell>
                                    {nuevo_participante.nombre}
                                    <br />
                                    <Chip className="mt-2" label={nuevo_participante.email} />

                                    <br />
                                    <br />
                                    {nuevo_participante.centro_formacion ? nuevo_participante.centro_formacion.nombre : ''}
                                    <br />
                                    <Chip className="mt-2" label={nuevo_participante.centro_formacion ? nuevo_participante.centro_formacion.regional.nombre : ''} />
                                </TableCell>

                                <TableCell>
                                    <Autocomplete
                                        id="rol_sennova"
                                        size="small"
                                        options={roles_sennova}
                                        selectedValue={form_nuevo_participante.data.rol_sennova ?? nuevo_participante.rol_sennova_id}
                                        onChange={(event, newValue) => {
                                            form_nuevo_participante.setData('rol_sennova', newValue.value)
                                        }}
                                        label="Seleccione el rol SENNOVA"
                                        required
                                    />

                                    {form_nuevo_participante.errors.rol_sennova && <InputError className="relative top-6" message={form_nuevo_participante.errors.rol_sennova} />}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center">
                                        <TextInput
                                            id="cantidad_meses"
                                            type="number"
                                            name="cantidad_meses"
                                            inputProps={{
                                                min: 1,
                                                max: proyecto.diff_meses,
                                                step: '0.1',
                                            }}
                                            size="small"
                                            required
                                            value={form_nuevo_participante.data.cantidad_meses}
                                            className="!inline-block !w-20 !mr-2"
                                            onChange={(e) => form_nuevo_participante.setData('cantidad_meses', e.target.value)}
                                        />
                                        meses
                                        <TextInput
                                            id="cantidad_horas"
                                            type="number"
                                            name="cantidad_horas"
                                            size="small"
                                            required
                                            value={form_nuevo_participante.data.cantidad_horas}
                                            className="!inline-block !w-16 !mx-2"
                                            onChange={(e) => form_nuevo_participante.setData('cantidad_horas', e.target.value)}
                                        />{' '}
                                        horas semanales
                                    </div>

                                    {form_nuevo_participante.errors.cantidad_meses && <InputError className="relative top-6" message={form_nuevo_participante.errors.cantidad_meses} />}
                                    {form_nuevo_participante.errors.cantidad_horas && <InputError className="relative top-6" message={form_nuevo_participante.errors.cantidad_horas} />}
                                </TableCell>

                                <TableCell>
                                    <PrimaryButton
                                        onClick={() => {
                                            form_nuevo_participante.setData('user_id', nuevo_participante.id)
                                        }}
                                        disabled={form_nuevo_participante.processing}>
                                        Vincular
                                    </PrimaryButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </>
                )}
                <TableRow sx={{ backgroundColor: '#e5f6fd' }}>
                    <TableCell colSpan={6} className="!align-top">
                        <p>Agregar participante</p>
                        <AlertMui className="mt-5">1. Escriba el nombre, número de documento o el correo electrónico institucional del participante.</AlertMui>
                        <SearchBar placeholder="Buscar participantes" inputBackground="white" routeParams={[convocatoria.id, proyecto.id]} />
                    </TableCell>
                </TableRow>
            </TableMui>
        </>
    )
}

export default Participantes
