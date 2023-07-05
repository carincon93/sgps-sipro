<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Components/Label'
    import Select from '@/Components/Select'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'

    export let convocatoria
    export let evaluacion
    export let proyecto
    export let producto
    export let resultados
    export let actividades
    export let actividadesRelacionadas
    export let subtipologiasMinciencias
    export let tiposProducto

    $: $title = producto ? producto.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let productoInfo = {
        nombre: producto.nombre,
        resultado_id: producto.resultado_id,
        fecha_inicio: producto.fecha_inicio,
        fecha_finalizacion: producto.fecha_finalizacion,
        indicador: producto.indicador,
        medio_verificacion: producto.producto_ta_tp ? producto.producto_ta_tp?.medio_verificacion : producto.producto_servicio_tecnologico?.medio_verificacion,

        nombre_indicador: producto.producto_servicio_tecnologico?.nombre_indicador,
        formula_indicador: producto.producto_servicio_tecnologico?.formula_indicador,

        tipo: producto.producto_idi ? producto.producto_idi.tipo : producto.producto_cultura_innovacion?.tipo,
        subtipologia_minciencias_id: producto.producto_idi ? producto.producto_idi?.subtipologia_minciencias_id : producto.producto_cultura_innovacion?.subtipologia_minciencias_id,

        valor_proyectado: producto.producto_ta_tp?.valor_proyectado,
        tatp_servicio_tecnologico: proyecto.ta || proyecto.tp || proyecto.servicio_tecnologico ? true : false,
        actividad_id: actividadesRelacionadas,
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.productos', [convocatoria.id, evaluacion.id])} className="text-app-400 hover:text-app-600"> Productos </a>
                    <span className="text-app-400 font-medium">/</span>
                    {producto.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="bg-white rounded shadow max-w-3xl">
        <form>
            <fieldset className="p-8" disabled={isSuperAdmin || (checkRole(authUser, [11, 5]) && proyecto.finalizado == true) ? undefined : true}>
                <div className="mt-8 mb-8">
                    <Label className="text-center" value="Fecha de ejecución" />
                    <div className="mt-4 flex items-start justify-around">
                        <div className="mt-4 flex">
                            <Label labelFor="fecha_inicio" value="Del" />
                            <div className="ml-4">
                                <input disabled id="fecha_inicio" type="date" className="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} value={productoInfo.fecha_inicio} />
                            </div>
                        </div>
                        <div className="mt-4 flex">
                            <Label labelFor="fecha_finalizacion" value="hasta" />
                            <div className="ml-4">
                                <input disabled id="fecha_finalizacion" type="date" className="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} value={productoInfo.fecha_finalizacion} />
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="mt-8">
                    {#if productoInfo.tatp_servicio_tecnologico == true}
                        <InfoMessage>
                            <p>
                                Los productos pueden corresponder a bienes o servicios. Un bien es un objeto tangible, almacenable o transportable, mientras que el servicio es una prestación intangible.
                                <br />
                                El producto debe cumplir con la siguiente estructura:
                                <br />
                                Cuando el producto es un bien: nombre del bien + la condición deseada. Ejemplo: Vía construida.
                                <br />
                                Cuando el producto es un servicio: nombre del servicio + el complemento. Ejemplo: Servicio de asistencia técnica para el mejoramiento de hábitos alimentarios
                            </p>
                        </InfoMessage>
                    {/if}
                    <Textarea disabled label="Descripción" maxlength="40000" id="nombre" value={productoInfo.nombre} />
                </div>
                <div className="mt-8">
                    <Label className="mb-4" labelFor="resultado_id" value="Resultado" />
                    <Select disabled={true} id="resultado_id" items={resultados} bind:selectedValue={productoInfo.resultado_id} autocomplete="off" placeholder="Seleccione un resultado" />
                </div>
                <div className="mt-8">
                    <Label labelFor="indicador" value="Indicador" />

                    {#if productoInfo.tatp_servicio_tecnologico == true}
                        <InfoMessage className="mb-2" message="Deber ser medible y con una fórmula. Por ejemplo: (# metodologías validadas/# metodologías totales) X 100" />
                    {/if}
                    <Textarea disabled maxlength="40000" id="indicador" value={productoInfo.indicador} />
                </div>

                {#if productoInfo.tatp_servicio_tecnologico == false}
                    <div className="mt-8">
                        <Label className="mb-4" labelFor="subtipologia_minciencias_id" value="Subtipología Minciencias" />
                        <Select id="subtipologia_minciencias_id" items={subtipologiasMinciencias} bind:selectedValue={productoInfo.subtipologia_minciencias_id} autocomplete="off" placeholder="Seleccione una subtipología" />
                    </div>

                    <div className="mt-8">
                        <Select disabled={true} id="tipo-producto" items={tiposProducto} bind:selectedValue={productoInfo.tipo} autocomplete="off" placeholder="Seleccione un tipo" />
                    </div>
                {:else if proyecto.ta || proyecto.tp}
                    <div className="mt-8">
                        <Textarea disabled label="Meta" maxlength="40000" id="valor_proyectado" value={productoInfo.valor_proyectado} />
                    </div>
                {/if}

                {#if productoInfo.tatp_servicio_tecnologico == true}
                    <div className="mt-8">
                        <Label labelFor="medio_verificacion" value="Medio de verificación" />

                        {#if proyecto.servicio_tecnologico}
                            <InfoMessage message="Los medios de verificación corresponden a las evidencias y/o fuentes de información en las que está disponibles los registros, la información necesaria y suficiente. Dichos medios pueden ser documentos oficiales, informes, evaluaciones, encuestas, documentos o reportes internos que genera el proyecto, entre otros." />
                        {:else}
                            <InfoMessage message="Especifique los medios de verificación para validar los logros del objetivo específico." />
                        {/if}

                        <Textarea disabled maxlength="40000" id="medio_verificacion" value={productoInfo.medio_verificacion} />
                    </div>
                {/if}
                {#if proyecto.servicio_tecnologico}
                    <div className="mt-8">
                        <Label labelFor="nombre_indicador" value="Nombre del Indicador del producto" />

                        <InfoMessage message="El indicador debe mantener una estructura coherente. Esta se compone de dos elementos: en primer lugar, debe ir el objeto a cuantificar, descrito por un sujeto y posteriormente la condición deseada, definida a través de un verbo en participio. Por ejemplo: Kilómetros de red vial nacional construidos." />
                        <Textarea disabled maxlength="40000" id="nombre_indicador" value={productoInfo.nombre_indicador} />
                    </div>

                    <div className="mt-8">
                        <Label labelFor="formula_indicador" value="Fórmula del Indicador del producto" />

                        <InfoMessage
                            message="El método de cálculo debe ser una expresión matemática definida de manera adecuada y de fácil comprensión, es decir, deben quedar claras cuáles son las variables utilizadas. Los métodos de cálculo más comunes son el porcentaje, la tasa de variación, la razón y el número índice. Aunque éstos no son las únicas expresiones para los indicadores, sí son las más frecuentes."
                        />
                        <Textarea disabled maxlength="40000" id="formula_indicador" value={productoInfo.formula_indicador} />
                    </div>
                {/if}

                <h6 className="mt-20 mb-12 text-2xl">Actividades</h6>
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="p-4">
                        <Label className="mb-4" labelFor="actividad_id" value="Actividades relacionadas" />
                    </div>

                    <div className="p-2">
                        <ul className="list-disc p-4">
                            {#each actividades as { id, descripcion }, i}
                                {#each productoInfo.actividad_id as actividad}
                                    {#if id == actividad}
                                        <li className="first-letter-uppercase mb-4">{descripcion}</li>
                                    {/if}
                                {/each}
                            {/each}
                        </ul>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</AuthenticatedLayout>
