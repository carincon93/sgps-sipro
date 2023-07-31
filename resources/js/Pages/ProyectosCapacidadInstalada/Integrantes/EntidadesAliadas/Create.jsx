<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'
    import Header from '../../Shared/Header'

    export let errors
    export let proyectoCapacidadInstalada

    $: $title = 'Crear entidad aliada'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        nombre: '',
        nit: '',
        documento: null,
    })

    function submit() {
        if (proyectoCapacidadInstalada.allowed.to_update) {
            $form.post(route('proyectos-capacidad-instalada.entidades-aliadas.store', [proyectoCapacidadInstalada.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <Header {proyectoCapacidadInstalada} />
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nueva entidad aliada</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {proyectoCapacidadInstalada} {form} {submit} allowToCreate={proyectoCapacidadInstalada.allowed.to_update} showInput={true} />
        </div>
    </div>
</AuthenticatedLayout>
