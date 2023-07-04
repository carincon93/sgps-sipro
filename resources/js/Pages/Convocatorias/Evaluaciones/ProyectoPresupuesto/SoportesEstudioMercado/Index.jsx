<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import InfoMessage from '@/Shared/InfoMessage'
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import File from '@/Shared/File'

    export let convocatoria
    export let evaluacion
    export let proyectoPresupuesto
    export let soportesEstudioMercado

    $title = 'Soportes'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        valor_total: proyectoPresupuesto.valor_total,
        formato_estudio_mercado: null,
    })

    let formSoporte = useForm({
        id_primer_empresa: soportesEstudioMercado[0]?.id,
        nombre_primer_empresa: soportesEstudioMercado[0] ? soportesEstudioMercado[0]?.empresa : '',
        soporte_primer_empresa: null,
        id_segunda_empresa: soportesEstudioMercado[1]?.id,
        nombre_segunda_empresa: soportesEstudioMercado[1] ? soportesEstudioMercado[1]?.empresa : '',
        soporte_segunda_empresa: null,
        id_tercer_empresa: soportesEstudioMercado[2]?.id,
        nombre_tercer_empresa: soportesEstudioMercado[2] ? soportesEstudioMercado[2]?.empresa : '',
        soporte_tercer_empresa: null,
    })
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="flex">
                    {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                        <a use:inertia href={route('convocatorias.evaluaciones.presupuesto.index', [convocatoria.id, evaluacion.id])} class="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block"> Presupuesto </a>
                    {/if}
                    <span class="text-app-400 font-medium ml-2 mr-2">/</span>
                    {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                        <a use:inertia href={route('convocatorias.evaluaciones.presupuesto.edit', [convocatoria.id, evaluacion.id, proyectoPresupuesto.id])} class="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block">
                            {proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion}
                        </a>
                    {/if}
                    <span class="text-app-400 font-medium ml-2 mr-2">/</span>
                    Soportes
                </h1>
            </div>
        </div>
    </header>

    <h1 class="mt-24 mb-8 text-center text-3xl">Estudio de mercado</h1>

    <a href="/storage/documentos-descarga/Formato%20_guia_4_Estudio_de_mercado.xlsx" target="_blank" class="bg-gray-800 hover:bg-gray-700 block mt-1 mb-10 mx-auto p-2 rounded text-center text-white w-44" rel="noopener noreferrer">Descargar Formato guía 4: Estudio de mercado</a>

    <form class="mb-20" disabled>
        <InfoMessage>
            <span class="text-5xl font-black">1.</span> En el Excel <strong>Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong> agruegue todos los ítems que pertenezcan al uso presupuestal <strong>{proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion}</strong>. Luego debe subirlo al sistema desde el siguiente campo:
        </InfoMessage>

        <div class="mt-8">
            <Label required={proyectoPresupuesto?.formato_estudio_mercado ? undefined : true} class="mb-4" labelFor="formato_estudio_mercado" value="Estudio de mercado - Convocatoria Sennova {convocatoria.year}" />
            <File
                required={proyectoPresupuesto?.formato_estudio_mercado ? undefined : true}
                id="formato_estudio_mercado"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                maxSize="10000"
                bind:value={$form.formato_estudio_mercado}
                valueDb={proyectoPresupuesto?.formato_estudio_mercado}
                route={proyectoPresupuesto?.formato_estudio_mercado?.includes('http') ? null : route('convocatorias.proyectos.presupuesto.download-file-sharepoint', [convocatoria, evaluacion.proyecto, proyectoPresupuesto, 'formato_estudio_mercado'])}
            />
        </div>

        <h1 class="mt-24 mb-8 text-center text-3xl">Valor total</h1>

        <div class="mt-14">
            <InfoMessage>
                <span class="text-5xl font-black">2.</span> En el siguiente campo indique el valor total que arrojó el <strong>Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong> en la casilla <strong>TOTAL</strong>

                <figure class="mt-2">
                    <img src="/images/estudio-mercado.jpg" alt="" class="shadow" />
                </figure>
            </InfoMessage>

            <Input label="Valor total" id="valor_total" type="number" input$min="0" class="mt-1" bind:value={$form.valor_total} required />
        </div>
    </form>

    <h1 class="mt-24 mb-8 text-center text-3xl">Soportes</h1>

    <InfoMessage class="mb-8">
        <span class="text-5xl font-black">3.</span>
        Tenga en cuenta que en el Excel <strong>Estudio de mercado - Convocatoria Sennova {convocatoria.year}</strong> deberá relacionar mínimo 2 empresas (Máximo 3).
        <figure class="my-4">
            <img src="/images/soportes.jpg" alt="" class="shadow mx-auto" />
        </figure>
        <br />
        En la siguiente sección deberá adjuntar todos los soportes dados por las empresas. Para ello se recomienda unir los soportes de <stong>cada empresa</stong> en un PDF o ZIP. Revise que los valores en los soportes sean iguales a los valores relacionados en el Excel. (Los soportes pueden ser precotizaciones, precios de catálogos de canales comerciales oficiales de proveedores o de almacenes de
        grandes superficies, o valores de acuerdos marco de precios de Colombia Compra. Los valores del estudio deberán corresponder a proveedores ubicados en Colombia y tener una fecha no mayor a 4 meses.)
    </InfoMessage>

    <form disabled>
        <fieldset class="divide-y">
            <div class="grid grid-cols-3 gap-12 py-24">
                <div>
                    <Label required class="mb-4" labelFor="soporte" value="Nombre de la primer empresa" />
                    <Input id="nombre_primer_empresa" type="text" class="mt-1" bind:value={$formSoporte.nombre_primer_empresa} required />
                </div>

                <div class="col-span-2">
                    <Label class="mb-4" labelFor="soporte" value="Soporte PDF o ZIP de la primer empresa" />
                    <File
                        class="w-full"
                        id="soporte_primer_empresa"
                        accept=".zip,application/pdf"
                        maxSize="10000"
                        bind:value={$formSoporte.soporte_primer_empresa}
                        valueDb={soportesEstudioMercado[0]?.soporte}
                        route={soportesEstudioMercado[0]?.soporte?.includes('http') == true || soportesEstudioMercado[0]?.soporte?.includes('http') == undefined ? null : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [convocatoria, evaluacion.proyecto, proyectoPresupuesto, soportesEstudioMercado[0]?.id, 'soporte'])}
                    />
                </div>
            </div>

            <div class="grid grid-cols-3 gap-12 py-24">
                <div>
                    <Label required class="mb-4" labelFor="soporte" value="Nombre de la segunda empresa" />
                    <Input id="nombre_segunda_empresa" type="text" class="mt-1" bind:value={$formSoporte.nombre_segunda_empresa} required />
                </div>

                <div class="col-span-2">
                    <Label class="mb-4" labelFor="soporte" value="Soporte PDF o ZIP de la segunda empresa" />
                    <File
                        class="w-full"
                        id="soporte_segunda_empresa"
                        accept=".zip,application/pdf"
                        maxSize="10000"
                        bind:value={$formSoporte.soporte_segunda_empresa}
                        valueDb={soportesEstudioMercado[1]?.soporte}
                        route={soportesEstudioMercado[1]?.soporte?.includes('http') == true || soportesEstudioMercado[1]?.soporte?.includes('http') == undefined ? null : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [convocatoria, evaluacion.proyecto, proyectoPresupuesto, soportesEstudioMercado[1]?.id, 'soporte'])}
                    />
                </div>
            </div>

            <div class="grid grid-cols-3 gap-12 py-24">
                <div>
                    <Label required={$formSoporte.soporte_tercer_empresa || $formSoporte.nombre_tercer_empresa ? 'required' : undefined} class="mb-4" labelFor="soporte" value="Nombre de la tercer empresa" />
                    <Input id="nombre_tercer_empresa" type="text" class="mt-1" bind:value={$formSoporte.nombre_tercer_empresa} required={$formSoporte.soporte_tercer_empresa ? 'required' : undefined} />
                </div>

                <div class="col-span-2">
                    <Label required={($formSoporte.nombre_tercer_empresa && soportesEstudioMercado[2] == null) || ($formSoporte.soporte_tercer_empresa && soportesEstudioMercado[2] == null) ? 'required' : undefined} class="mb-4" labelFor="soporte" value="Soporte PDF o ZIP de la tercer empresa" />
                    <File
                        class="w-full"
                        required={$formSoporte.nombre_tercer_empresa && soportesEstudioMercado[2] == null ? 'required' : undefined}
                        id="soporte_tercer_empresa"
                        accept=".zip,application/pdf"
                        maxSize="10000"
                        bind:value={$formSoporte.soporte_tercer_empresa}
                        valueDb={soportesEstudioMercado[2]?.soporte}
                        route={soportesEstudioMercado[2]?.soporte?.includes('http') == true || soportesEstudioMercado[2]?.soporte?.includes('http') == undefined ? null : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [convocatoria, evaluacion.proyecto, proyectoPresupuesto, soportesEstudioMercado[2]?.id, 'soporte'])}
                    />
                </div>
            </div>
        </fieldset>
    </form>
</AuthenticatedLayout>
