<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    import Form from './Form'

    export let errors
    export let usuario
    export let tiposDocumento
    export let tiposVinculacion
    export let roles
    export let rolesRelacionados
    export let permisosRelacionados
    export let proyectos
    export let centrosFormacion

    $: $title = usuario ? usuario.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _token: $page.props.csrf_token,
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password,
        tipo_documento: usuario.tipo_documento,
        numero_documento: usuario.numero_documento,
        numero_celular: usuario.numero_celular,
        habilitado: usuario.habilitado,
        tipo_vinculacion: usuario.tipo_vinculacion,
        centro_formacion_id: usuario.centro_formacion_id,
        role_id: rolesRelacionados,
        permission_id: permisosRelacionados,
        autorizacion_datos: usuario.autorizacion_datos,
        default_password: false,
    })

    function submit() {
        if (usuario.allowed.to_update) {
            $form.put(route('users.update', usuario.id), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('users.index')} className="text-app-400 hover:text-app-600"> Usuarios </a>
                    <span className="text-app-400 font-medium">/</span>
                    {usuario.nombre}
                </h1>
            </div>
        </div>
    </header>

    <Form {submit} {form} {errors} {usuario} {tiposDocumento} {tiposVinculacion} {roles} {centrosFormacion} />

    <h1 className="mt-24 mb-8 text-center text-3xl">Proyectos asociados</h1>
    <div className="bg-white rounded shadow">
        <table className="w-full whitespace-no-wrap table-fixed data-table">
            <thead>
                <tr className="text-left font-bold">
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título </th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de ejecución </th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
                </tr>
            </thead>

            <tbody>
                {#each proyectos as proyecto}
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t">
                            <p className="px-6 py-4 focus:text-app-500">
                                {proyecto.codigo}
                            </p>
                        </td>
                        <td className="border-t">
                            <p className="px-6 py-4 focus:text-app-500">
                                {proyecto.idi ? proyecto.idi.titulo : proyecto.cultura_innovacion ? proyecto.cultura_innovacion.titulo : proyecto.servicio_tecnologico ? proyecto.servicio_tecnologico.titulo : proyecto.tp?.nodo_tecnoparque ? proyecto.tp?.titulo : proyecto.tecnoacademia_lineas_tecnoacademia ? proyecto.tecnoacademia_lineas_tecnoacademia[0]?.tecnoacademia.nombre : null}
                            </p>
                        </td>
                        <td className="border-t">
                            <p className="px-6 py-4">
                                {proyecto.idi ? proyecto.idi.fecha_ejecucion : proyecto.cultura_innovacion ? proyecto.cultura_innovacion.fecha_ejecucion : proyecto.servicio_tecnologico ? proyecto.servicio_tecnologico.fecha_ejecucion : proyecto.ta ? proyecto.ta.fecha_ejecucion : proyecto.tp ? proyecto.tp?.fecha_ejecucion : null}
                            </p>
                        </td>
                        <td className="border-t td-actions">
                            <DataTableMenu className={proyecto.length < 3 ? 'z-50' : ''}>
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.edit', [proyecto.convocatoria_id, proyecto.id]))} disabled={isSuperAdmin || !checkRole(authUser, [3, 4, 21]) == false ? false : true} className={!isSuperAdmin && !checkRole(authUser, [3, 4, 21]) ? 'hidden' : ''}>
                                    <Text>Ver detalles</Text>
                                </Item>
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if proyectos.length === 0}
                    <tr>
                        <td className="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</AuthenticatedLayout>
