<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let entidadAliada
    export let miembroEntidadAliada
    export let tiposDocumento

    $: $title = miembroEntidadAliada ? miembroEntidadAliada.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: miembroEntidadAliada.nombre,
        email: miembroEntidadAliada.email,
        tipo_documento: miembroEntidadAliada.tipo_documento,
        numero_documento: miembroEntidadAliada.numero_documento,
        numero_celular: miembroEntidadAliada.numero_celular,
        autorizacion_datos: miembroEntidadAliada.autorizacion_datos,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.update', [convocatoria.id, proyecto.id, entidadAliada.id, miembroEntidadAliada.id]), {
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
                    <a use:inertia href={route('convocatorias.proyectos.entidades-aliadas.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600">Entidades aliadas</a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('convocatorias.proyectos.entidades-aliadas.edit', [convocatoria.id, proyecto.id, entidadAliada.id]) + '#miembros-entidad-aliada'} class="text-app-400 hover:text-app-600">{entidadAliada.nombre}</a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('convocatorias.proyectos.entidades-aliadas.edit', [convocatoria.id, proyecto.id, entidadAliada.id]) + '#miembros-entidad-aliada'} class="text-app-400 hover:text-app-600">Miembros de la entidad aliada</a>
                    <span class="text-app-400 font-medium">/</span>
                    {miembroEntidadAliada.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar miembro</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {miembroEntidadAliada} {tiposDocumento} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
