<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import Input from '@/Shared/Input'
    import Switch from '@/Shared/Switch'
    import Select from '@/Shared/Select'
    import File from '@/Shared/File'

    export let convocatoria
    export let evaluacion
    export let proyecto
    export let entidadAliada
    export let actividades
    export let actividadesRelacionadas
    export let objetivosEspecificosRelacionados
    export let tiposEntidadAliada
    export let naturalezaEntidadAliada
    export let tiposEmpresa

    $: $title = entidadAliada ? entidadAliada.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let entidadAliadaInfo = {
        tipo: entidadAliada.tipo,
        nombre: entidadAliada.nombre,
        naturaleza: entidadAliada.naturaleza,
        tipo_empresa: entidadAliada.tipo_empresa,
        nit: entidadAliada.nit,
        tiene_convenio: entidadAliada.entidad_aliada_idi?.descripcion_convenio != null ? true : false,
        tiene_grupo_investigacion: entidadAliada.entidad_aliada_idi?.grupo_investigacion != null ? true : false,
        descripcion_convenio: entidadAliada.entidad_aliada_idi?.descripcion_convenio,
        grupo_investigacion: entidadAliada.entidad_aliada_idi?.grupo_investigacion,
        codigo_gruplac: entidadAliada.entidad_aliada_idi?.codigo_gruplac,
        enlace_gruplac: entidadAliada.entidad_aliada_idi?.enlace_gruplac,
        actividades_transferencia_conocimiento: entidadAliada.entidad_aliada_idi?.actividades_transferencia_conocimiento,
        recursos_especie: entidadAliada.entidad_aliada_idi?.recursos_especie,
        descripcion_recursos_especie: entidadAliada.entidad_aliada_idi?.descripcion_recursos_especie,
        recursos_dinero: entidadAliada.entidad_aliada_idi?.recursos_dinero,
        descripcion_recursos_dinero: entidadAliada.entidad_aliada_idi?.descripcion_recursos_dinero,
        carta_intencion: entidadAliada.entidad_aliada_idi?.carta_intencion,
        carta_propiedad_intelectual: entidadAliada.entidad_aliada_idi?.carta_propiedad_intelectual,
        actividad_id: actividadesRelacionadas,
        soporte_convenio: entidadAliada.entidad_aliada_ta_tp?.soporte_convenio,
        fecha_inicio_convenio: entidadAliada.entidad_aliada_ta_tp?.fecha_inicio_convenio,
        fecha_fin_convenio: entidadAliada.entidad_aliada_ta_tp?.fecha_fin_convenio,
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.entidades-aliadas', [convocatoria.id, evaluacion.id])} class="text-app-400 hover:text-app-600">Entidades aliadas</a>
                    <span class="text-app-400 font-medium">/</span>
                    {entidadAliada.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="flex">
        <div class="bg-white rounded shadow max-w-3xl flex-1">
            <form>
                <fieldset class="p-8" disabled={isSuperAdmin || (checkRole(authUser, [11, 5]) && proyecto.finalizado == true) ? undefined : true}>
                    <div class="mt-8">
                        <Label class="mb-4" labelFor="tipo" value="Tipo de entidad aliada" />
                        <Select disabled={true} id="tipo" items={tiposEntidadAliada} bind:selectedValue={entidadAliadaInfo.tipo} autocomplete="off" placeholder="Seleccione el tipo de entidad" />
                    </div>

                    <div class="mt-8">
                        <Textarea disabled label="Nombre de la entidad aliada/Centro de formación" maxlength="40000" id="nombre" value={entidadAliadaInfo.nombre} />
                    </div>

                    <div class="mt-8">
                        <Label class="mb-4" labelFor="naturaleza" value="Naturaleza de la entidad" />
                        <Select disabled={true} id="naturaleza" items={naturalezaEntidadAliada} bind:selectedValue={entidadAliadaInfo.naturaleza} autocomplete="off" placeholder="Seleccione la naturaleza de la entidad" />
                    </div>

                    <div class="mt-8">
                        <Label class="mb-4" labelFor="tipo_empresa" value="Tipo de empresa" />
                        <Select disabled={true} id="tipo_empresa" items={tiposEmpresa} bind:selectedValue={entidadAliadaInfo.tipo_empresa} autocomplete="off" placeholder="Seleccione el tipo de empresa" />
                    </div>

                    <div class="mt-8">
                        <Input disabled label="NIT" id="nit" type="text" class="mt-1" value={entidadAliadaInfo.nit} />
                    </div>

                    {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
                        <div class="mt-8">
                            <p>¿Hay convenio?</p>
                            <Switch disabled bind:checked={entidadAliadaInfo.tiene_convenio} />
                        </div>
                        {#if entidadAliadaInfo.tiene_convenio}
                            <div class="mt-8">
                                <Textarea disabled label="Descipción del convenio" maxlength="400" id="descripcion_convenio" value={entidadAliadaInfo.descripcion_convenio} />
                            </div>
                        {/if}

                        <div class="mt-8">
                            <p>¿La entidad aliada tiene grupo de investigación?</p>
                            <Switch disabled bind:checked={entidadAliadaInfo.tiene_grupo_investigacion} />
                        </div>
                        {#if entidadAliadaInfo.tiene_grupo_investigacion}
                            <div class="mt-8">
                                <Textarea disabled label="Grupo de investigación" maxlength="400" id="grupo_investigacion" value={entidadAliadaInfo.grupo_investigacion} />
                            </div>

                            <div class="mt-8">
                                <Input disabled label="Código del GrupLAC" id="codigo_gruplac" type="text" class="mt-1" placeholder="Ejemplo: COL0000000" value={entidadAliadaInfo.codigo_gruplac} />
                            </div>

                            <div class="mt-8">
                                <Input disabled label="Enlace del GrupLAC" id="enlace_gruplac" type="url" class="mt-1" placeholder="Ejemplo: https://scienti.minciencias.gov.co/gruplac/jsp/Medicion/graficas/verPerfiles.jsp?id_convocatoria=0nroIdGrupo=0000000" value={entidadAliadaInfo.enlace_gruplac} />
                            </div>
                        {/if}

                        <div class="mt-8">
                            <Input disabled label="Recursos en especie entidad aliada ($COP)" id="recursos_especie" type="number" input$min="0" class="mt-1" placeholder="COP" value={entidadAliadaInfo.recursos_especie} />
                        </div>

                        <div class="mt-8">
                            <Textarea disabled label="Descripción de los recursos en especie aportados" maxlength="2500" id="descripcion_recursos_especie" value={entidadAliadaInfo.descripcion_recursos_especie} />
                        </div>

                        <div class="mt-8">
                            <Input disabled label="Recursos en dinero entidad aliada ($COP)" id="recursos_dinero" type="number" input$min="0" class="mt-1" placeholder="COP" value={entidadAliadaInfo.recursos_dinero} />
                        </div>

                        <div class="mt-8">
                            <Textarea disabled label="Descripción de la destinación del dinero aportado" maxlength="2500" id="descripcion_recursos_dinero" value={entidadAliadaInfo.descripcion_recursos_dinero} />
                        </div>

                        <div class="mt-8">
                            <Textarea disabled label="Metodología o actividades de transferencia al centro de formación" maxlength="2500" id="actividades_transferencia_conocimiento" value={entidadAliadaInfo.actividades_transferencia_conocimiento} />
                        </div>

                        <div class="mt-8">
                            <Label class="mb-4" labelFor="carta_intencion" value="ANEXO 7. Carta de intención o acta que soporta el trabajo articulado con entidades aliadas (diferentes al SENA)" />

                            <File
                                id="carta_intencion"
                                maxSize="10000"
                                bind:value={entidadAliadaInfo.carta_intencion}
                                valueDb={entidadAliada?.entidad_aliada_idi?.carta_intencion}
                                route={entidadAliada?.entidad_aliada_idi?.carta_intencion?.includes('http') ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria.id, proyecto.id, entidadAliada, 'carta_intencion'])}
                            />
                        </div>

                        <div class="mt-8">
                            <Label class="mb-4" labelFor="carta_propiedad_intelectual" value="ANEXO 8. Propiedad intelectual" />

                            <File
                                id="carta_propiedad_intelectual"
                                maxSize="10000"
                                bind:value={entidadAliadaInfo.carta_propiedad_intelectual}
                                valueDb={entidadAliada?.entidad_aliada_idi?.carta_propiedad_intelectual}
                                route={entidadAliada?.entidad_aliada_idi?.carta_propiedad_intelectual?.includes('http') ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria.id, proyecto.id, entidadAliada, 'carta_propiedad_intelectual'])}
                            />
                        </div>
                    {:else if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
                        <div class="mt-8">
                            <Label class="mb-4" labelFor="soporte_convenio" value="Archivo del convenio" />

                            <File
                                disabled
                                id="soporte_convenio"
                                maxSize="10000"
                                bind:value={entidadAliadaInfo.soporte_convenio}
                                valueDb={entidadAliada?.entidad_aliada_ta_tp?.soporte_convenio}
                                route={entidadAliada?.entidad_aliada_ta_tp?.soporte_convenio?.includes('http') ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria.id, proyecto.id, entidadAliada, 'soporte_convenio'])}
                            />
                        </div>

                        <div class="mt-8">
                            <p class="text-center">Fechas de vigencia Convenio/Acuerdos</p>
                            <div class="mt-4 flex items-start justify-around">
                                <div class="mt-4 flex">
                                    <Label required labelFor="fecha_inicio_convenio" value="Del" />
                                    <div class="ml-4">
                                        <input id="fecha_inicio_convenio" type="date" class="mt-1 block w-full p-4" bind:value={entidadAliadaInfo.fecha_inicio_convenio} required />
                                    </div>
                                </div>
                                <div class="mt-4 flex">
                                    <Label required labelFor="fecha_fin_convenio" value="hasta" />
                                    <div class="ml-4">
                                        <input id="fecha_fin_convenio" type="date" class="mt-1 block w-full p-4" bind:value={entidadAliadaInfo.fecha_fin_convenio} required />
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}

                    {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
                        <h6 class="mt-20 mb-12 text-2xl" id="actividades">Actividades</h6>

                        <div class="bg-white rounded shadow overflow-hidden">
                            <div class="p-4">
                                <Label class="mb-4" labelFor="actividad_id" value="Relacione alguna actividad" />

                                <div class="p-2">
                                    <ul class="list-disc p-4">
                                        {#each actividades as { id, descripcion }, i}
                                            {#each entidadAliadaInfo.actividad_id as actividad}
                                                {#if id == actividad}
                                                    <li class="first-letter-uppercase mb-4">{descripcion}</li>
                                                {/if}
                                            {/each}
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    {/if}
                </fieldset>
            </form>
        </div>
        {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
            <div class="px-4">
                <h1 class="mb-4">Enlaces de interés</h1>
                <ul>
                    <li class="mt-6">
                        <a class="bg-app-100 hover:bg-app-200 mb-4 px-6 py-2 rounded-3xl text-center text-app-400" href="#objetivos-especificos"> Objetivos específicos relacionados </a>
                    </li>
                </ul>
            </div>
        {/if}
    </div>

    {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <h1 class="mt-24 mb-8 text-center text-3xl" id="miembros-entidad-aliada">Miembros de la entidad aliada</h1>
        <div class="bg-white rounded shadow">
            <table class="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr class="text-left font-bold">
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nombre </th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Correo electrónico </th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Número de celular </th>
                    </tr>
                </thead>

                <tbody>
                    {#each entidadAliada.miembros_entidad_aliada as miembroEntidadAliada (miembroEntidadAliada.id)}
                        <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td class="border-t">
                                <p class="px-6 py-4 focus:text-app-500">
                                    {miembroEntidadAliada.nombre}
                                </p>
                            </td>

                            <td class="border-t">
                                <p class="px-6 py-4 focus:text-app-500">
                                    {miembroEntidadAliada.email}
                                </p>
                            </td>

                            <td class="border-t">
                                <p class="px-6 py-4 focus:text-app-500">
                                    {miembroEntidadAliada.numero_celular}
                                </p>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <h1 class="mt-24 mb-8 text-center text-3xl" id="objetivos-especificos">Objetivos específicos</h1>
        <p class="mb-6">A continuación, se listan los objetivos específicos relacionados con la entidad aliada.</p>
        <div class="bg-white rounded shadow">
            <table class="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr class="text-left font-bold">
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Descripción </th>
                    </tr>
                </thead>

                <tbody>
                    {#each objetivosEspecificosRelacionados as { id, descripcion }}
                        <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td class="border-t">
                                <p class="px-6 py-4 focus:text-app-500">
                                    {descripcion}
                                </p>
                            </td>
                        </tr>
                    {/each}

                    {#if objetivosEspecificosRelacionados.length === 0}
                        <tr>
                            <td class="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}
</AuthenticatedLayout>
