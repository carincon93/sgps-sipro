<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let inventarioEquipo
    export let estadosInventarioEquipos

    $: $title = inventarioEquipo ? inventarioEquipo.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: inventarioEquipo.nombre,
        marca: inventarioEquipo.marca,
        serial: inventarioEquipo.serial,
        codigo_interno: inventarioEquipo.codigo_interno,
        fecha_adquisicion: inventarioEquipo.fecha_adquisicion,
        estado: inventarioEquipo.estado,
        uso_st: inventarioEquipo.uso_st,
        uso_otra_dependencia: inventarioEquipo.uso_otra_dependencia,
        dependencia: inventarioEquipo.dependencia,
        descripcion: inventarioEquipo.descripcion,
        mantenimiento_prox_year: inventarioEquipo.mantenimiento_prox_year,
        calibracion_prox_year: inventarioEquipo.calibracion_prox_year,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.inventario-equipos.update', [convocatoria.id, proyecto.id, inventarioEquipo.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.proyectos.inventario-equipos.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600">Inventario de equipos</a>
                    <span class="text-app-400 font-medium">/</span>
                    Editar
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar inventario</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {inventarioEquipo} {estadosInventarioEquipos} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
