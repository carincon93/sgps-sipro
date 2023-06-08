<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Stepper from '@/Shared/Stepper'
    import Textarea from '@/Shared/Textarea'

    export let convocatoria
    export let idi
    export let errors

    let form = useForm({
        productividad_beneficiaros: idi.productividad_beneficiaros,
        generacion_empleo_beneficiarios: idi.generacion_empleo_beneficiarios,
        creacion_nuevos_desarrollos: idi.creacion_nuevos_desarrollos,
        generacion_conocimientos_beneficiarios: idi.generacion_conocimientos_beneficiarios,
        generacion_valor_beneficiarios: idi.generacion_valor_beneficiarios,
        fortalecimiento_programas_formacion: idi.fortalecimiento_programas_formacion,
        transferencia_tecnologias: idi.transferencia_tecnologias,
        calidad_formacion: idi.calidad_formacion,
        impacto_ambiental_proyectos: idi.impacto_ambiental_proyectos,
    })

    function submit() {
        if (idi.proyecto.allowed.to_update) {
            $form.post(route('convocatorias.idi.indicadores.store', [convocatoria.id, idi.id]))
        }
    }

    async function syncColumnLong(column, form) {
        return new Promise((resolve) => {
            if (typeof column !== undefined && typeof form !== undefined && idi.proyecto.allowed.to_update) {
                let value
                form[column] ? (value = form[column]) : (value = form)
                Inertia.put(
                    route('convocatorias.idi.updateLongColumn', [convocatoria.id, idi.id, column]),
                    { [column]: value },
                    {
                        onError: (resp) => resolve(resp),
                        onFinish: () => resolve({}),
                        preserveScroll: true,
                    },
                )
            } else {
                resolve({})
            }
        })
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <Stepper {convocatoria} proyecto={idi} />
    </header>

    <p class="text-center">Describa de forma general (en los que aplique) el aporte del proyecto a los indicadores de los proyectos relacionados en el artículo 5 del acuerdo 003 del 02 de febrero de 2012 (<strong>Mínimo debe relacionar uno</strong>).</p>

    <form on:submit|preventDefault={submit}>
        <fieldset class="p-8 divide-y" disabled={idi.proyecto.allowed.to_update ? undefined : true}>
            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="productividad_beneficiaros" value="a) Productividad y competitividad del (los) beneficiario(s) final(es) del proyecto" />
                </div>
                <div>
                    <Textarea maxlength="40000" id="productividad_beneficiaros" error={errors.productividad_beneficiaros} bind:value={$form.productividad_beneficiaros} on:blur={() => syncColumnLong('productividad_beneficiaros', $form.productividad_beneficiaros)} />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="generacion_empleo_beneficiarios" value="b) Generación o mantenimiento de empleo por parte del (los) beneficiario(s) del proyecto" />
                </div>
                <div>
                    <Textarea maxlength="40000" id="generacion_empleo_beneficiarios" error={errors.generacion_empleo_beneficiarios} bind:value={$form.generacion_empleo_beneficiarios} on:blur={() => syncColumnLong('generacion_empleo_beneficiarios', $form.generacion_empleo_beneficiarios)} />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="creacion_nuevos_desarrollos" value=" c) Creación de nuevas empresas y diseño y desarrollo de nuevos productos, procesos o servicios" />
                </div>
                <div>
                    <Textarea maxlength="40000" id="creacion_nuevos_desarrollos" error={errors.creacion_nuevos_desarrollos} bind:value={$form.creacion_nuevos_desarrollos} on:blur={() => syncColumnLong('creacion_nuevos_desarrollos', $form.creacion_nuevos_desarrollos)} />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="generacion_conocimientos_beneficiarios" value="d) Incorporación de nuevos conocimientos y competencias laborales en el talento humano en la(s) empresa(s) beneficiaria(s) del proyecto" />
                </div>
                <div>
                    <Textarea maxlength="40000" id="generacion_conocimientos_beneficiarios" error={errors.generacion_conocimientos_beneficiarios} bind:value={$form.generacion_conocimientos_beneficiarios} on:blur={() => syncColumnLong('generacion_conocimientos_beneficiarios', $form.generacion_conocimientos_beneficiarios)} />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="generacion_valor_beneficiarios" value="e) Generación de valor agregado en la(s) entidad(es) beneficiaria(s) del proyecto" />
                </div>
                <div>
                    <Textarea maxlength="40000" id="generacion_valor_beneficiarios" error={errors.generacion_valor_beneficiarios} bind:value={$form.generacion_valor_beneficiarios} on:blur={() => syncColumnLong('generacion_valor_beneficiarios', $form.generacion_valor_beneficiarios)} />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="fortalecimiento_programas_formacion" value="f) Fortalecimiento de programas de formación del Sena" />
                </div>
                <div>
                    <Textarea maxlength="40000" id="fortalecimiento_programas_formacion" error={errors.fortalecimiento_programas_formacion} bind:value={$form.fortalecimiento_programas_formacion} on:blur={() => syncColumnLong('fortalecimiento_programas_formacion', $form.fortalecimiento_programas_formacion)} />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="transferencia_tecnologias" value="g) Transferencia de tecnologías al Sena y a los sectores productivos relacionados" />
                </div>
                <div>
                    <Textarea maxlength="40000" id="transferencia_tecnologias" error={errors.transferencia_tecnologias} bind:value={$form.transferencia_tecnologias} on:blur={() => syncColumnLong('transferencia_tecnologias', $form.transferencia_tecnologias)} />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="calidad_formacion" value="h) Cobertura, calidad y pertinencia de la formación." />
                </div>
                <div>
                    <Textarea maxlength="40000" id="calidad_formacion" error={errors.calidad_formacion} bind:value={$form.calidad_formacion} on:blur={() => syncColumnLong('calidad_formacion', $form.calidad_formacion)} />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="impacto_ambiental_proyectos" value="i) Impacto ambiental de Proyectos de Innovación e investigación aplicada. " />
                </div>
                <div>
                    <Textarea maxlength="40000" id="impacto_ambiental_proyectos" error={errors.impacto_ambiental_proyectos} bind:value={$form.impacto_ambiental_proyectos} on:blur={() => syncColumnLong('impacto_ambiental_proyectos', $form.impacto_ambiental_proyectos)} />
                </div>
            </div>

            <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                {#if idi.proyecto.allowed.to_update}
                    <LoadingButton loading={$form.processing} class="ml-auto" type="submit">
                        {$_('Save')}
                    </LoadingButton>
                {:else}
                    <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                {/if}
            </div>
        </fieldset>
    </form>
</AuthenticatedLayout>
