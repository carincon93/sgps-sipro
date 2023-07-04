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
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('users.change-user-profile')} className="text-app-400 hover:text-app-600"> Perfil </a>
                    <span className="text-app-400 font-medium">/</span>
                    Editar participación
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar participación</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {participacionProyectoSennova} {form} {submit} {tiposProyectos} />
        </div>
    </div>
</AuthenticatedLayout>
