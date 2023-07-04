<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let presupuestoSennova
    export let primerGrupoPresupuestal
    export let segundoGrupoPresupuestal
    export let tercerGrupoPresupuestal
    export let usosPresupuestales
    export let lineasProgramaticas

    $: $title = presupuestoSennova ? presupuestoSennova.id : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        requiere_estudio_mercado: presupuestoSennova.requiere_estudio_mercado,
        sumar_al_presupuesto: presupuestoSennova.sumar_al_presupuesto,
        mensaje: presupuestoSennova.mensaje,
        habilitado: presupuestoSennova.habilitado,
        primer_grupo_presupuestal_id: presupuestoSennova.primer_grupo_presupuestal_id,
        segundo_grupo_presupuestal_id: presupuestoSennova.segundo_grupo_presupuestal_id,
        tercer_grupo_presupuestal_id: presupuestoSennova.tercer_grupo_presupuestal_id,
        uso_presupuestal_id: presupuestoSennova.uso_presupuestal_id,
        linea_programatica_id: presupuestoSennova.linea_programatica_id,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.put(route('presupuesto-sennova.update', presupuestoSennova.id), {
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
                    <a use:inertia href={route('presupuesto-sennova.index')} className="text-app-400 hover:text-app-600"> Presupuesto SENNOVA </a>
                    <span className="text-app-400 font-medium">/</span>
                    Editar presupuesto SENNOVA
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar presupuesto SENNOVA</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {submit} {form} {errors} {presupuestoSennova} {isSuperAdmin} {primerGrupoPresupuestal} {segundoGrupoPresupuestal} {tercerGrupoPresupuestal} {usosPresupuestales} {lineasProgramaticas} />
        </div>
    </div>
</AuthenticatedLayout>
