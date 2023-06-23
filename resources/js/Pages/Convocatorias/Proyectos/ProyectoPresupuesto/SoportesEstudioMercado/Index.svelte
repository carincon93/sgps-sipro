<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import InfoMessage from '@/Shared/InfoMessage'
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import File from '@/Shared/File'
    import LoadingButton from '@/Shared/LoadingButton'

    export let errors
    export let convocatoria
    export let proyecto
    export let proyectoPresupuesto
    export let soportesEstudioMercado

    $title = 'Soportes'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

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

    function submitSoportes() {
        if (proyecto.allowed.to_update) {
            $formSoporte.post(route('convocatorias.proyectos.presupuesto.soportes.store', [convocatoria.id, proyecto.id, proyectoPresupuesto]), {
                preserveScroll: true,
            })
        }
    }

    let form = useForm({
        valor_total: proyectoPresupuesto.valor_total,
        formato_estudio_mercado: null,
    })
    function submitEstudioMercado() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.presupuesto.estudio-mercado.store', [convocatoria.id, proyecto.id, proyectoPresupuesto]), {
                preserveScroll: true,
            })
        }
    }

    let dialogEliminar = false
    let allowedToDestroy = false
    let soporteEstudioMercadoId
    let deleteLoading = false
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.presupuesto.soportes.destroy', [convocatoria.id, proyecto.id, proyectoPresupuesto.id, soporteEstudioMercadoId]), {
                preserveScroll: true,
                onStart: () => {
                    deleteLoading = true
                },
                onFinish: () => {
                    ;(dialogEliminar = false), (deleteLoading = false)
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="flex">
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.index', [convocatoria.id, proyecto.id]) + '?page=' + proyectoPresupuesto.item_page + '&#PRE-' + proyectoPresupuesto.id} class="text-app-400 hover:text-app-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        Volver a la lista de rubros
                    </a>
                    <span class="text-app-400 font-medium ml-2 mr-2">/</span>
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.edit', [convocatoria.id, proyecto.id, proyectoPresupuesto.id])} class="text-app-400 hover:text-app-600 overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap inline-block">
                        {proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion}
                    </a>
                    <span class="text-app-400 font-medium ml-2 mr-2">/</span>
                    Soportes
                </h1>
            </div>
        </div>
    </header>

    {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
        <h1 class="mt-24 mb-8 text-center text-3xl">Estudio de mercado</h1>

        <a href="/storage/documentos-descarga/Formato%20_guia_4_Estudio_de_mercado.xlsx" target="_blank" class="bg-gray-800 hover:bg-gray-700 block mt-1 mb-10 mx-auto p-2 rounded text-center text-white w-44" rel="noopener noreferrer">Descargar Formato guía 4: Estudio de mercado</a>

        <form class="mb-20" on:submit|preventDefault={submitEstudioMercado}>
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
                    error={errors.formato_estudio_mercado}
                    route={proyectoPresupuesto?.formato_estudio_mercado?.includes('http') ? null : route('convocatorias.proyectos.presupuesto.download-file-sharepoint', [convocatoria, proyecto, proyectoPresupuesto, 'formato_estudio_mercado'])}
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

                <Input label="Valor total" id="valor_total" type="number" input$min="0" class="mt-1" bind:value={$form.valor_total} error={errors.valor_total} required />
            </div>

            <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                {#if proyecto.allowed.to_update}
                    <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar estudio de mercado y valor total</LoadingButton>
                {:else}
                    <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                {/if}
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
            En la siguiente sección deberá adjuntar todos los soportes dados por las empresas. Para ello se recomienda unir los soportes de <stong>cada empresa</stong> en un PDF o ZIP. Revise que los valores en los soportes sean iguales a los valores relacionados en el Excel. (Los soportes pueden ser precotizaciones, precios de catálogos de canales comerciales oficiales de proveedores o de almacenes
            de grandes superficies, o valores de acuerdos marco de precios de Colombia Compra. Los valores del estudio deberán corresponder a proveedores ubicados en Colombia y tener una fecha no mayor a 4 meses.)
        </InfoMessage>

        <form on:submit|preventDefault={submitSoportes}>
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true} class="divide-y">
                <div class="grid grid-cols-3 gap-12 py-24">
                    <div>
                        <Label required class="mb-4" labelFor="soporte" value="Nombre de la primer empresa" />
                        <Input id="nombre_primer_empresa" type="text" class="mt-1" bind:value={$formSoporte.nombre_primer_empresa} error={errors.nombre_primer_empresa} required />
                    </div>

                    <div class="col-span-2">
                        <Label required class="mb-4" labelFor="soporte" value="Soporte PDF o ZIP de la primer empresa" />
                        <File
                            class="w-full"
                            id="soporte_primer_empresa"
                            accept=".zip,application/pdf"
                            maxSize="10000"
                            bind:value={$formSoporte.soporte_primer_empresa}
                            valueDb={soportesEstudioMercado[0]?.soporte}
                            error={errors.soporte_primer_empresa}
                            route={soportesEstudioMercado[0]?.soporte?.includes('http') == true || soportesEstudioMercado[0]?.soporte?.includes('http') == undefined ? null : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [convocatoria, proyecto, proyectoPresupuesto, soportesEstudioMercado[0]?.id, 'soporte'])}
                        />

                        {#if soportesEstudioMercado[0]?.id}
                            <Button class="mt-14" on:click={() => ((soporteEstudioMercadoId = soportesEstudioMercado[0]?.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} type="button">Eliminar soporte</Button>
                        {/if}
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-12 py-24">
                    <div>
                        <Label required class="mb-4" labelFor="soporte" value="Nombre de la segunda empresa" />
                        <Input id="nombre_segunda_empresa" type="text" class="mt-1" bind:value={$formSoporte.nombre_segunda_empresa} error={errors.nombre_segunda_empresa} required />
                    </div>

                    <div class="col-span-2">
                        <Label required class="mb-4" labelFor="soporte" value="Soporte PDF o ZIP de la segunda empresa" />
                        <File
                            class="w-full"
                            id="soporte_segunda_empresa"
                            accept=".zip,application/pdf"
                            maxSize="10000"
                            bind:value={$formSoporte.soporte_segunda_empresa}
                            valueDb={soportesEstudioMercado[1]?.soporte}
                            error={errors.soporte_segunda_empresa}
                            route={soportesEstudioMercado[1]?.soporte?.includes('http') == true || soportesEstudioMercado[1]?.soporte?.includes('http') == undefined ? null : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [convocatoria, proyecto, proyectoPresupuesto, soportesEstudioMercado[1]?.id, 'soporte'])}
                        />
                        {#if soportesEstudioMercado[1]?.id}
                            <Button class="mt-14" on:click={() => ((soporteEstudioMercadoId = soportesEstudioMercado[1]?.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} type="button">Eliminar soporte</Button>
                        {/if}
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-12 py-24">
                    <div>
                        <Label required={$formSoporte.soporte_tercer_empresa || $formSoporte.nombre_tercer_empresa ? 'required' : undefined} class="mb-4" labelFor="soporte" value="Nombre de la tercer empresa" />
                        <Input id="nombre_tercer_empresa" type="text" class="mt-1" bind:value={$formSoporte.nombre_tercer_empresa} error={errors.nombre_tercer_empresa} required={$formSoporte.soporte_tercer_empresa ? 'required' : undefined} />
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
                            error={errors.soporte_tercer_empresa}
                            route={soportesEstudioMercado[2]?.soporte?.includes('http') == true || soportesEstudioMercado[2]?.soporte?.includes('http') == undefined ? null : route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [convocatoria, proyecto, proyectoPresupuesto, soportesEstudioMercado[2]?.id, 'soporte'])}
                        />

                        {#if soportesEstudioMercado[2]?.id}
                            <Button class="mt-14" on:click={() => ((soporteEstudioMercadoId = soportesEstudioMercado[2]?.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} type="button">Eliminar soporte</Button>
                        {/if}
                    </div>
                </div>
            </fieldset>
            <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                {#if proyecto.allowed.to_update}
                    <LoadingButton loading={$formSoporte.processing} class="ml-auto" type="submit">Cargar soporte(s)</LoadingButton>
                {:else}
                    <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                {/if}
            </div>
        </form>
    {:else if convocatoria.tipo_convocatoria == 2}
        <InfoMessage class="mt-20" alertMsg={true}>No se permite el cargue de archivos anexos porque es un proyecto DEMO de ejercicio y no es un proyecto oficial.</InfoMessage>
    {/if}

    <Dialog bind:open={dialogEliminar}>
        <div slot="title">
            <div class="text-center">Eliminar recurso</div>
            <div class="relative bg-app-100 text-app-600 p-5 h-44 w-1/3 m-auto my-10" style="border-radius: 41% 59% 70% 30% / 32% 40% 60% 68% ;">
                <figure>
                    <img src="/images/eliminar.png" alt="" class="h-44 m-auto" />
                </figure>
            </div>
            <div class="text-center">
                ¿Está seguro (a) que desea eliminar este elemento?<br />Una vez eliminado todos sus recursos y datos se eliminarán de forma permanente.
            </div>
        </div>
        <div slot="content" />
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <LoadingButton loading={deleteLoading} variant="raised" type="button" on:click={() => destroy()}>Confirmar</LoadingButton>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
