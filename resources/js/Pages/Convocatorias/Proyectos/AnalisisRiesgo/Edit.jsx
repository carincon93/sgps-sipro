<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let analisisRiesgo
    export let nivelesRiesgo
    export let tiposRiesgo
    export let probabilidadesRiesgo
    export let impactosRiesgo

    $: $title = analisisRiesgo ? 'Análisis de riesgos - ' + analisisRiesgo.nivel : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nivel: analisisRiesgo.nivel,
        tipo: analisisRiesgo.tipo,
        descripcion: analisisRiesgo.descripcion,
        impacto: analisisRiesgo.impacto,
        probabilidad: analisisRiesgo.probabilidad,
        efectos: analisisRiesgo.efectos,
        medidas_mitigacion: analisisRiesgo.medidas_mitigacion,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.analisis-riesgos.update', [convocatoria.id, proyecto.id, analisisRiesgo.id]), {
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
                    <a use:inertia href={route('convocatorias.proyectos.analisis-riesgos.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600">Análisis de riesgos</a>
                    <span className="text-app-400 font-medium">/</span>
                    {analisisRiesgo.tipo}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar análisis de riesgo</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {analisisRiesgo} {nivelesRiesgo} {tiposRiesgo} {probabilidadesRiesgo} {impactosRiesgo} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
