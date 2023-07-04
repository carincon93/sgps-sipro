<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let primerGrupoPresupuestal
    export let segundoGrupoPresupuestal
    export let tercerGrupoPresupuestal
    export let usosPresupuestales
    export let lineasProgramaticas

    $: $title = 'Crear presupuesto SENNOVA'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        requiere_estudio_mercado: null,
        sumar_al_presupuesto: null,
        mensaje: '',
        habilitado: null,
        primer_grupo_presupuestal_id: null,
        segundo_grupo_presupuestal_id: null,
        tercer_grupo_presupuestal_id: null,
        uso_presupuestal_id: null,
        linea_programatica_id: null,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.post(route('presupuesto-sennova.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('presupuesto-sennova.index')} className="text-app-400 hover:text-app-600"> Presupuesto SENNOVA </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo presupuesto SENNOVA</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {submit} {form} {errors} {isSuperAdmin} {primerGrupoPresupuestal} {segundoGrupoPresupuestal} {tercerGrupoPresupuestal} {usosPresupuestales} {lineasProgramaticas} />
        </div>
    </div>
</AuthenticatedLayout>
