<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    import Header from '../Shared/Header'

    export let errors
    export let proyectoCapacidadInstalada
    export let producto
    export let resultados
    export let tipologiasMinciencias

    $: $title = 'Editar producto'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        descripcion: producto.descripcion,
        resultado_id: producto.proyecto_capacidad_resultado_id,
        tipologia_minciencias: producto.tipologia_minciencias,
    })

    function submit() {
        if (proyectoCapacidadInstalada.allowed.to_update) {
            $form.put(route('proyectos-capacidad-instalada.productos.update', [proyectoCapacidadInstalada.id, producto.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <Header {proyectoCapacidadInstalada} />
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar producto</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyectoCapacidadInstalada} {producto} {resultados} {tipologiasMinciencias} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
