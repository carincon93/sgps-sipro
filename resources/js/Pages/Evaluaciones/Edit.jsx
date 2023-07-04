<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let evaluacion
    export let evaluadores
    export let proyectos

    $: $title = evaluacion ? evaluacion.proyecto.codigo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        habilitado: evaluacion.habilitado,
        modificable: evaluacion.modificable,
        finalizado: evaluacion.finalizado,
        proyecto_id: evaluacion.proyecto_id,
        user_id: evaluacion.user_id,
    })

    function submit() {
        if (evaluacion.allowed.to_update) {
            $form.put(route('evaluaciones.update', evaluacion.id), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap flex items-center">
                    <a use:inertia href={route('evaluaciones.index')} className="text-app-400 hover:text-app-600"> Evaluaciones </a>
                    <span className="text-app-400 font-medium mx-1.5">/</span>
                    {evaluacion.proyecto.codigo}
                    <a className="bg-app-600 text-white p-1 pr-5 rounded ml-2" href={route('convocatorias.evaluaciones.redireccionar', [evaluacion.proyecto.convocatoria.id, evaluacion.id])} target="_blank">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <small> Ver detalles </small>
                        </span>
                    </a>
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Editar evaluación</h1>
        </div>
        <div className="bg-white rounded shadow col-span-2">
            <Form {form} {submit} {errors} {evaluacion} {evaluadores} {proyectos} />
        </div>
    </div>
</AuthenticatedLayout>
