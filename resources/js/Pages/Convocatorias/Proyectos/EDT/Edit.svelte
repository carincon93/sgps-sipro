<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let edt
    export let tiposEvento
    export let proyectoPresupuesto

    $: $title = 'EDT'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        tipo_evento: edt.tipo_evento,
        descripcion_evento: edt.descripcion_evento,
        descripcion_participacion_entidad: edt.descripcion_participacion_entidad,
        publico_objetivo: edt.publico_objetivo,
        numero_asistentes: edt.numero_asistentes,
        estrategia_comunicacion: edt.estrategia_comunicacion,
        proyecto_presupuesto_id: edt.proyecto_presupuesto_id,
        nombre_evento: edt.nombre_evento,
        organizador: edt.organizador,
        fecha_evento: edt.fecha_evento,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.edt.update', [convocatoria.id, proyecto.id, edt.id]), {
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
                    <a use:inertia href={route('convocatorias.proyectos.edt.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600">EDT</a>
                    <span class="text-app-400 font-medium">/</span>
                    Editar
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar EDT</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {edt} {tiposEvento} {proyectoPresupuesto} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
