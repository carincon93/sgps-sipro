<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let proyectoPresupuesto
    export let soporteEstudioMercado

    $: $title = proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion ? proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        soporte: soporteEstudioMercado.soporte,
        empresa: soporteEstudioMercado.empresa,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.presupuesto.soportes.update', [convocatoria.id, proyecto.id, proyectoPresupuesto.id, soporteEstudioMercado.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="flex">
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block"> Presupuesto </a>
                    <span class="text-app-400 font-medium ml-2 mr-2">/</span>
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.edit', [convocatoria.id, proyecto.id, proyectoPresupuesto.id])} class="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block">
                        {proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion}
                    </a>
                    <span class="text-app-400 font-medium ml-2 mr-2">/</span>
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.soportes.index', [convocatoria.id, proyecto.id, proyectoPresupuesto.id])} class="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block"> Soportes </a>
                    <span class="text-app-400 font-medium ml-2 mr-2">/</span>
                    {soporteEstudioMercado.empresa}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar estudio de mercado</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {soporteEstudioMercado} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
