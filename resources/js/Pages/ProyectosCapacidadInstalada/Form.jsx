<script>
    import { monthDiff } from '@/Utils'

    import InputError from '@/Components/InputError'
    import Label from '@/Components/Label'
    import Textarea from '@/Components/Textarea'
    import Select from '@/Components/Select'
    import InfoMessage from '@/Components/InfoMessage'
    import Input from '@/Components/Input'

    export let id
    export let submit
    export let proyectoCapacidadInstalada
    export let errors
    export let form
    export let centrosFormacion
    export let lineasInvestigacion
    export let semillerosInvestigacion = []
    export let redesConocimiento
    export let areasConocimiento
    export let subareasConocimiento = []
    export let disciplinasSubareaConocimiento = []
    export let actividadesEconomicas
    export let tiposProyectoCapacidadInstalada
    export let subtiposProyectoCapacidadInstalada = []
    export let listaBeneficiados
    export let roles
    export let selectProgramasFormacionConRegistros
    export let allowedToCreate

    let arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
        return obj.area_conocimiento_id == $form.area_conocimiento_id
    })
    function selectAreaConocimiento(event) {
        arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
            return obj.area_conocimiento_id == event.detail?.value
        })
    }

    let arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
        return obj.subarea_conocimiento_id == $form.subarea_conocimiento_id
    })
    function selectSubreaConocimiento(event) {
        arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
            return obj.subarea_conocimiento_id == event.detail?.value
        })
    }

    let arrayLineasInvestigacion = lineasInvestigacion.filter(function (obj) {
        return obj.centro_formacion_id == $form.centro_formacion_id
    })
    function selectLineaInvestigacion(event) {
        arrayLineasInvestigacion = lineasInvestigacion.filter(function (obj) {
            return obj.centro_formacion_id == event.detail?.value
        })
    }

    let arraySemillerosInvestigacion = semillerosInvestigacion
    function selectSemilleroInvestigacion(event) {
        arraySemillerosInvestigacion = semillerosInvestigacion.filter(function (obj) {
            return obj.linea_investigacion_id == event.detail?.value
        })
    }

    let arraySubtiposProyectoCapacidadInstalada = subtiposProyectoCapacidadInstalada
    function selectTipoProyectoCapacidadInstalada(event) {
        arraySubtiposProyectoCapacidadInstalada = subtiposProyectoCapacidadInstalada.filter(function (obj) {
            return obj.tipo_proyecto_capacidad_instalada_id == event.detail?.value
        })
    }
</script>

<form {id} on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyectoCapacidadInstalada?.allowed.to_update || allowedToCreate ? undefined : true}>
        <div className="mt-28">
            <Label required labelFor="titulo" className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)" />
            <Textarea label="Título" id="titulo" sinContador={true} error={errors.titulo} bind:value={$form.titulo} classes="bg-transparent block border-0 {errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required />
        </div>

        <div className="mt-44">
            <p className="text-center">Fecha de ejecución</p>
            {#if proyectoCapacidadInstalada?.allowed.to_update || allowedToCreate}
                <small className="text-red-400 block text-center"> * Campo obligatorio </small>
            {/if}
            <div className="mt-4 flex items-start justify-around">
                <div className="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
                    <Label labelFor="fecha_inicio" className={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                    <div className="ml-4">
                        <input id="fecha_inicio" type="date" className="mt-1 block w-full p-4" error={errors.fecha_inicio} bind:value={$form.fecha_inicio} required />
                    </div>
                </div>
                <div className="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
                    <Label labelFor="fecha_finalizacion" className={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                    <div className="ml-4">
                        <input id="fecha_finalizacion" type="date" className="mt-1 block w-full p-4" error={errors.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required />
                    </div>
                </div>
            </div>
            {#if errors.fecha_inicio || errors.fecha_finalizacion || errors.max_meses_ejecucion}
                <div className="mb-20 flex justify-center mt-4">
                    <InputError classes="text-center" message={errors.fecha_inicio} />
                    <InputError classes="text-center" message={errors.fecha_finalizacion} />
                </div>
            {/if}
        </div>
        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
            </div>
            <div>
                <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} selectFunctions={[(event) => selectLineaInvestigacion(event), (event) => selectProgramasFormacionConRegistros(event)]} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
            </div>
        </div>

        {#if $form.centro_formacion_id?.value}
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="linea_investigacion_id" value="Línea de investigación" />
                </div>
                <div>
                    <Select id="linea_investigacion_id" items={arrayLineasInvestigacion} bind:selectedValue={$form.linea_investigacion_id} selectFunctions={[(event) => selectSemilleroInvestigacion(event)]} error={errors.linea_investigacion_id} autocomplete="off" placeholder="Busque por el nombre de la línea de investigación, centro de formación, grupo de investigación o regional" required />
                </div>
            </div>
        {/if}
        {#if $form.linea_investigacion_id}
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="semillero_investigacion_id" value="Semillero de investigación" />
                </div>
                <div>
                    <Select id="semillero_investigacion_id" items={arraySemillerosInvestigacion} bind:selectedValue={$form.semillero_investigacion_id} error={errors.semillero_investigacion_id} autocomplete="off" placeholder="Busque por el nombre del semillero de investigación" required />
                </div>
            </div>
        {/if}
        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="red_conocimiento_id" value="Red de conocimiento sectorial" />
            </div>
            <div>
                <Select id="red_conocimiento_id" items={redesConocimiento} bind:selectedValue={$form.red_conocimiento_id} error={errors.red_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la red de conocimiento sectorial" required />
            </div>
        </div>
        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="area_conocimiento_id" value="Área de conocimiento" />
            </div>
            <div>
                <Select id="area_conocimiento_id" items={areasConocimiento} bind:selectedValue={$form.area_conocimiento_id} selectFunctions={[(event) => selectAreaConocimiento(event)]} error={errors.area_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la área de conocimiento" required />
            </div>
        </div>
        {#if $form.area_conocimiento_id}
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="subarea_conocimiento_id" value="Subárea de conocimiento" />
                </div>
                <div>
                    <Select id="subarea_conocimiento_id" items={arraySubareasConocimiento} bind:selectedValue={$form.subarea_conocimiento_id} selectFunctions={[(event) => selectSubreaConocimiento(event)]} error={errors.subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la subárea de conocimiento" required />
                </div>
            </div>
        {/if}
        {#if $form.subarea_conocimiento_id}
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de la subárea de conocimiento" />
                </div>
                <div>
                    <Select id="disciplina_subarea_conocimiento_id" items={arrayDisciplinasSubareaConocimiento} bind:selectedValue={$form.disciplina_subarea_conocimiento_id} error={errors.disciplina_subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la disciplina de subáreas de conocimiento" required />
                </div>
            </div>
        {/if}
        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="actividad_economica_id" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
            </div>
            <div>
                <Select id="actividad_economica_id" items={actividadesEconomicas} bind:selectedValue={$form.actividad_economica_id} error={errors.actividad_economica_id} autocomplete="off" placeholder="Busque por el nombre de la actividad económica" required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="tipo_proyecto_capacidad_instalada_id" value="Tipo de proyecto" />
            </div>
            <div>
                <Select id="tipo_proyecto_capacidad_instalada_id" items={tiposProyectoCapacidadInstalada} bind:selectedValue={$form.tipo_proyecto_capacidad_instalada_id} selectFunctions={[(event) => selectTipoProyectoCapacidadInstalada(event)]} error={errors.tipo_proyecto_capacidad_instalada_id} autocomplete="off" placeholder="Busque por el nombre del tipo de proyecto" required />
            </div>
        </div>
        {#if $form.tipo_proyecto_capacidad_instalada_id}
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="subtipo_proyecto_capacidad_instalada_id" value="Subtipo de proyecto" />
                </div>
                <div>
                    <Select id="subtipo_proyecto_capacidad_instalada_id" items={arraySubtiposProyectoCapacidadInstalada} bind:selectedValue={$form.subtipo_proyecto_capacidad_instalada_id} error={errors.subtipo_proyecto_capacidad_instalada_id} autocomplete="off" placeholder="Busque por el nombre del subtipo de proyecto" required />
                </div>
            </div>
        {/if}

        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="beneficia_a" value="El proyecto beneficiará a:" />
            </div>
            <div>
                <Select id="beneficia_a" items={listaBeneficiados} bind:selectedValue={$form.beneficia_a} error={errors.centro_formacion_id} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>
        </div>

        <slot />

        <hr className="mt-32 mb-32" />

        <h1 className="text-2xl text-center" id="estructura-proyecto">Participación del autor principal</h1>

        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
            </div>

            <div>
                <Select id="rol_sennova" items={roles} bind:selectedValue={$form.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="cantidad_meses" value="Número de meses de vinculación al proyecto" />
            </div>
            <div>
                <Input label="Número de meses de vinculación" id="cantidad_meses" type="number" input$step="0.1" input$min="1" input$max={monthDiff($form.fecha_inicio, $form.fecha_finalizacion)} className="mt-1" bind:value={$form.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="cantidad_horas" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
            </div>
            <div>
                <Input label="Número de horas semanales dedicadas para el desarrollo del proyecto" id="cantidad_horas" type="number" input$step="1" input$min="1" input$max={$form.rol_sennova?.maxHoras} className="mt-1" bind:value={$form.cantidad_horas} placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto" autocomplete="off" required />
                {#if $form.rol_sennova?.maxHoras}
                    <InfoMessage>Horas máximas permitidas para este rol: {$form.rol_sennova?.maxHoras}.</InfoMessage>
                {/if}
            </div>
        </div>

        <slot name="buttons" />
    </fieldset>
</form>
