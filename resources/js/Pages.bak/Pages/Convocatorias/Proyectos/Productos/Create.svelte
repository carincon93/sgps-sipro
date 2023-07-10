<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let resultados
    export let subtipologiasMinciencias
    export let tiposProducto

    $: $title = 'Crear producto'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: '',
        resultado_id: null,
        subtipologia_minciencias_id: null,
        fecha_inicio: '',
        fecha_finalizacion: '',
        indicador: '',
        meta_indicador: '',

        tipo: null,
        tatp_servicio_tecnologico: proyecto.ta || proyecto.tp || proyecto.servicio_tecnologico ? true : false,
        valor_proyectado: null,
        medio_verificacion: '',
        nombre_indicador: '',
        formula_indicador: '',
        actividad_id: [],
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.productos.store', [convocatoria.id, proyecto.id]))
        }
    }

    let actividades = []
    let resultado_id = null

    $: if (resultado_id?.value) {
        $form.actividad_id = []
        $form.resultado_id = resultado_id.value
        actividades = resultado_id.actividades
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.proyectos.productos.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600"> Productos </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Nuevo producto</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {resultados} {subtipologiasMinciencias} {tiposProducto} {form} {submit} {isSuperAdmin} />
        </div>
    </div>
</AuthenticatedLayout>
