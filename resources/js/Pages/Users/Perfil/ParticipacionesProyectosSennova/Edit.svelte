<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let participacionProyectoSennova
    export let tiposProyectos

    $: $title = 'Editar participación'

    let form = useForm({
        ha_formulado_proyectos_sennova: false,
        tipo_proyecto: participacionProyectoSennova.tipo_proyecto,
        codigo_proyecto: participacionProyectoSennova.codigo_proyecto,
        titulo: participacionProyectoSennova.titulo,
        fecha_inicio_proyecto: participacionProyectoSennova.fecha_inicio_proyecto,
        fecha_finalizacion_proyecto: participacionProyectoSennova.fecha_finalizacion_proyecto,
    })

    function submit() {
        $form.put(route('participaciones-proyectos-sennova.update', participacionProyectoSennova.id), {
            preserveScroll: true,
        })
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('users.change-user-profile')} class="text-app-400 hover:text-app-600"> Perfil </a>
                    <span class="text-app-400 font-medium">/</span>
                    Editar participación
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar participación</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {participacionProyectoSennova} {form} {submit} {tiposProyectos} />
        </div>
    </div>
</AuthenticatedLayout>
