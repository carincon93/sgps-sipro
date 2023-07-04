<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'

    import Stepper from '@/Components/Stepper'
    import ArbolProblemasComponent from './ArbolProblemasComponent'

    export let errors
    export let to_pdf
    export let convocatoria
    export let proyecto
    export let efectosDirectos
    export let causasDirectas

    $: $title = 'Árbol de problemas'
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        {#if !to_pdf}
            <Stepper {convocatoria} {proyecto} />
        {/if}
    </header>

    <ArbolProblemasComponent {errors} {to_pdf} {convocatoria} {proyecto} {efectosDirectos} {causasDirectas} />
</AuthenticatedLayout>

{#if to_pdf}
    <style>
        nav,
        button.absolute.bottom-1\.5,
        .bg-gray-200.p-4.rounded.border-orangered.border.mb-5 {
            display: none !important;
        }
    </style>
{/if}
