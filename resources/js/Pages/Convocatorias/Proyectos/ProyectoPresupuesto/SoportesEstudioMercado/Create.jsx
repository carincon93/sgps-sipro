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

    $: $title = 'Crear soporte'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        soporte: '',
        empresa: '',
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.presupuesto.soportes.store', [convocatoria.id, proyecto.id, proyectoPresupuesto]))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="flex">
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block"> Presupuesto </a>
                    <span className="text-app-400 font-medium ml-2 mr-2">/</span>
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.edit', [convocatoria.id, proyecto.id, proyectoPresupuesto.id])} className="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block">
                        {proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion}
                    </a>
                    <span className="text-app-400 font-medium ml-2 mr-2">/</span>
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.soportes.index', [convocatoria.id, proyecto.id, proyectoPresupuesto.id])} className="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block"> Soportes </a>
                    <span className="text-app-400 font-medium ml-2 mr-2">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo estudio de mercado</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {proyectoPresupuesto} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
