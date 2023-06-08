<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Stepper from '@/Shared/Stepper'
    import ArbolObjetivosComponent from './ArbolObjetivosComponent'

    export let errors
    export let to_pdf
    export let convocatoria
    export let proyecto
    export let efectosDirectos
    export let causasDirectas
    export let tiposImpacto
    export let resultados
    export let objetivosEspecificos

    $: $title = 'Árbol de objetivos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        {#if !to_pdf}
            <Stepper {convocatoria} {proyecto} />
        {/if}
    </header>

    <ArbolObjetivosComponent {errors} {convocatoria} {proyecto} {efectosDirectos} {causasDirectas} {tiposImpacto} {resultados} {objetivosEspecificos} />
</AuthenticatedLayout>
