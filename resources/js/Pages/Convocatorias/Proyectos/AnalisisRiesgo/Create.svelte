<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let convocatoria
    export let proyecto
    export let errors
    export let nivelesRiesgo
    export let tiposRiesgo
    export let probabilidadesRiesgo
    export let impactosRiesgo

    $: $title = 'Crear análisis de riesgo'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nivel: '',
        tipo: '',
        descripcion: '',
        impacto: '',
        probabilidad: '',
        efectos: '',
        medidas_mitigacion: '',
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.analisis-riesgos.store', [convocatoria.id, proyecto.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.proyectos.analisis-riesgos.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600">Análisis de riesgos</a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Nuevo análisis de riesgo</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {nivelesRiesgo} {tiposRiesgo} {probabilidadesRiesgo} {impactosRiesgo} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
