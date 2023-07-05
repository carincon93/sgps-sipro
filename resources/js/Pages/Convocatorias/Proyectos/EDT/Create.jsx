<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let convocatoria
    export let proyecto
    export let errors
    export let tiposEvento
    export let proyectoPresupuesto

    $: $title = 'Crear EDT'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        tipo_evento: '',
        descripcion_evento: '',
        descripcion_participacion_entidad: '',
        publico_objetivo: '',
        numero_asistentes: '',
        estrategia_comunicacion: '',
        proyecto_presupuesto_id: null,
        nombre_evento: '',
        organizador: '',
        fecha_evento: '',
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.edt.store', [convocatoria.id, proyecto.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.proyectos.edt.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600">EDT</a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo EDT</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {tiposEvento} {proyectoPresupuesto} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
