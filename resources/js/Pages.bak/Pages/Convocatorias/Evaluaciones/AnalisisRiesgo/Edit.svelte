<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import Textarea from '@/Shared/Textarea'
    import InfoMessage from '@/Shared/InfoMessage'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let analisisRiesgo
    export let nivelesRiesgo
    export let tiposRiesgo
    export let probabilidadesRiesgo
    export let impactosRiesgo

    $: $title = analisisRiesgo ? 'Análisis de riesgos - ' + analisisRiesgo.nivel : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let analisisRiesgoInfo = {
        nivel: analisisRiesgo.nivel,
        tipo: analisisRiesgo.tipo,
        descripcion: analisisRiesgo.descripcion,
        impacto: analisisRiesgo.impacto,
        probabilidad: analisisRiesgo.probabilidad,
        efectos: analisisRiesgo.efectos,
        medidas_mitigacion: analisisRiesgo.medidas_mitigacion,
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.analisis-riesgos', [convocatoria.id, evaluacion.id])} class="text-app-400 hover:text-app-600">Análisis de riesgos</a>
                    <span class="text-app-400 font-medium">/</span>
                    {analisisRiesgo.tipo}
                </h1>
            </div>
        </div>
    </header>

    <div class="bg-white rounded shadow max-w-3xl">
        <form>
            <fieldset class="p-8" disabled={isSuperAdmin || (checkRole(authUser, [11, 5]) && proyecto.finalizado == true) ? undefined : true}>
                <div class="mt-4">
                    <Label class="mb-4" labelFor="nivel" value="Nivel de riesgo" />
                    <Select disabled={true} id="nivel" items={nivelesRiesgo} bind:selectedValue={analisisRiesgoInfo.nivel} autocomplete="off" placeholder="Seleccione el nivel del riesgo" />
                </div>

                <div class="mt-8">
                    <Label class="mb-4" labelFor="tipo" value="Tipo de riesgo" />
                    <Select disabled={true} id="tipo" items={tiposRiesgo} bind:selectedValue={analisisRiesgoInfo.tipo} autocomplete="off" placeholder="Seleccione el tipo de riesgo" />
                    {#if analisisRiesgoInfo.tipo?.value == 1}
                        <InfoMessage message="Es la probabilidad de variaciones en las condiciones del mercado como el precio, la calidad y la disponibilidad de los materiales e insumos, la competencia (oferta/demanda) del producto/servicios ofrecidos, la tasa de cambiaria y los asociados a la tecnología utilizada (obsolescencia)." />
                    {:else if analisisRiesgoInfo.tipo?.value == 2}
                        <InfoMessage message="Es toda posible contingencia que pueda provocar pérdidas en el desarrollo del proyecto por causa de errores humanos, de errores tecnológicos, de procesos internos defectuosos o fallidos. Esta clase de riesgo es inherente a todos los sistemas y procesos realizados por humanos." />
                    {:else if analisisRiesgoInfo.tipo?.value == 3}
                        <InfoMessage
                            message="Son los obstáculos legales o normativos que pueden afectar el desarrollo del proyecto. Por ejemplo: nuevos requisitos legales, cambios reglamentarios o gubernamentales directamente relacionados con el entorno que se desarrolla el proyecto, ausencia y/o deficiencia de documentación, errores en los contratos, incapacidad del proyecto de cumplir lo pactado."
                        />
                    {:else if analisisRiesgoInfo.tipo?.value == 4}
                        <InfoMessage
                            message="Es la probabilidad de incurrir en pérdidas originadas por la deficiencia en la planeación, procesos, controles y/o falta de idoneidad y competencia del personal. Por ejemplo: falta de planeación del proyecto, estructura organizacional incoherente, falta de liderazgo, falta de integración entre la dirección y la parte operativa y/o productiva, ineficiencia en la adaptación a los cambios del entorno, toma de decisiones por información incompleta."
                        />
                    {/if}
                </div>

                <div class="mt-8">
                    <Textarea disabled label="Descripción" maxlength="800" id="descripcion" value={analisisRiesgoInfo.descripcion} />
                </div>

                <div class="mt-8">
                    <Label class="mb-4" labelFor="probabilidad" value="Probabilidad" />
                    <Select disabled={true} id="probabilidad" items={probabilidadesRiesgo} bind:selectedValue={analisisRiesgoInfo.probabilidad} error={errors.probabilidad} autocomplete="off" placeholder="Seleccione la probabilidad" />
                </div>

                <div class="mt-8">
                    <Label class="mb-4" labelFor="impacto" value="Impacto" />
                    <Select disabled={true} id="impacto" items={impactosRiesgo} bind:selectedValue={analisisRiesgoInfo.impacto} autocomplete="off" placeholder="Seleccione la probabilidad" />
                </div>

                <div class="mt-8">
                    <Textarea disabled label="Efectos" maxlength="800" id="efectos" value={analisisRiesgoInfo.efectos} />
                </div>

                <div class="mt-8">
                    <Textarea disabled label="Medidas de mitigación" maxlength="800" id="medidas_mitigacion" value={analisisRiesgoInfo.medidas_mitigacion} />
                </div>
            </fieldset>
        </form>
    </div>
</AuthenticatedLayout>
