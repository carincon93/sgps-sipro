<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'
    import Header from '../Shared/Header'

    export let errors
    export let proyectoCapacidadInstalada
    export let objetivoEspecifico

    $: $title = 'Editar objetivo específico'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        descripcion: objetivoEspecifico.descripcion,
        descripcion_resultado: objetivoEspecifico.resultado.descripcion,
    })

    function submit() {
        if (proyectoCapacidadInstalada.allowed.to_update) {
            $form.put(route('proyectos-capacidad-instalada.objetivos-especificos.update', [proyectoCapacidadInstalada.id, objetivoEspecifico.id]), {
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
            <h1 class="font-black text-4xl uppercase">Editar objetivo específico</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyectoCapacidadInstalada} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
