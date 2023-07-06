<script>
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { onMount } from 'svelte'

    export let convocatoria
    export let evaluacion
    export let proyecto

    let container
    let activeProyecto = route().current('convocatorias.ta-evaluaciones.edit') || route().current('convocatorias.tp-evaluaciones.edit') || route().current('convocatorias.idi-evaluaciones.edit') || route().current('convocatorias.servicios-tecnologicos-evaluaciones.edit') || route().current('convocatorias.cultura-innovacion-evaluaciones.edit')

    onMount(() => {
        let steps = container.getElementsByClassName('step-number')
        for (let i = 0; i < steps.length; i++) {
            steps[i].textContent = i + 1
        }
    })

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<!-- Stepper -->
<div class="flex justify-around my-8 relative w-[80%] mx-auto" id="stepper" bind:this={container}>
    <div class="w-10/12 step">
        <a use:inertia active={activeProyecto} href={route('convocatorias.evaluaciones.redireccionar', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Generalidades</p>
        </a>
    </div>
    {#if proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <div class="w-10/12 step">
            <a use:inertia active={route().current('convocatorias.evaluaciones.participantes')} href={route('convocatorias.evaluaciones.participantes', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                <p class="text-sm text-center">{proyecto.codigo_linea_programatica == 68 ? 'Formulador del proyecto' : 'Participantes'}</p>
            </a>
        </div>
    {:else if proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 69}
        <div class="w-10/12 step">
            <a use:inertia active={route().current('convocatorias.evaluaciones.articulacion-sennova')} href={route('convocatorias.evaluaciones.articulacion-sennova', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                <p class="text-sm text-center">Articulación SENNOVA</p>
            </a>
        </div>
    {/if}
    <div class="w-10/12 step">
        <a use:inertia active={route().current('convocatorias.evaluaciones.arbol-problemas')} href={route('convocatorias.evaluaciones.arbol-problemas', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Árbol de problemas</p>
        </a>
    </div>
    <div class="w-10/12 step">
        <a use:inertia active={route().current('convocatorias.evaluaciones.arbol-objetivos')} href={route('convocatorias.evaluaciones.arbol-objetivos', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Árbol de objetivos</p>
        </a>
    </div>
    <div class="flex justify-around relative w-10/12 px-1.5 presupuesto-container">
        {#if proyecto.codigo_linea_programatica != 23}
            <div class="w-10/12 step">
                <a use:inertia active={route().current('convocatorias.evaluaciones.proyecto-rol-sennova.index')} href={route('convocatorias.evaluaciones.proyecto-rol-sennova.index', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                    <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                    <p class="text-sm text-center">Roles</p>
                </a>
            </div>
        {/if}
        <div class="w-10/12 step{proyecto.codigo_linea_programatica != 23 ? ' ml-5' : ''}">
            <a use:inertia active={route().current('convocatorias.evaluaciones.presupuesto.index')} href={route('convocatorias.evaluaciones.presupuesto.index', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                <p class="text-sm text-center">Presupuesto</p>
            </a>
        </div>
        {#if proyecto.codigo_linea_programatica == 70}
            <div class="w-10/12 step ml-5">
                <a use:inertia active={route().current('convocatorias.evaluaciones.edt')} href={route('convocatorias.evaluaciones.edt', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                    <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                    <p class="text-sm text-center">EDT</p>
                </a>
            </div>
        {/if}
        <small class="absolute bg-app-500 text-white px-2 py-1 rounded-full w-max text-center total">$ {new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.precio_proyecto) ? proyecto.precio_proyecto : 0)} COP</small>
    </div>
    <div class="w-10/12 step">
        <a use:inertia active={route().current('convocatorias.evaluaciones.actividades')} href={route('convocatorias.evaluaciones.actividades', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Metodología y actividades</p>
        </a>
    </div>
    <div class="w-10/12 step">
        <a use:inertia active={route().current('convocatorias.evaluaciones.productos')} href={route('convocatorias.evaluaciones.productos', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Productos</p>
        </a>
    </div>
    <div class="w-10/12 step">
        <a use:inertia active={route().current('convocatorias.evaluaciones.analisis-riesgos')} href={route('convocatorias.evaluaciones.analisis-riesgos', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Análisis de riesgos</p>
        </a>
    </div>
    {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 || proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 69}
        <div class="w-10/12 step">
            <a use:inertia active={route().current('convocatorias.evaluaciones.entidades-aliadas')} href={route('convocatorias.evaluaciones.entidades-aliadas', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                <p class="text-sm text-center">Entidades aliadas</p>
            </a>
        </div>
    {/if}
    <div class="w-10/12 step">
        <a use:inertia active={route().current('convocatorias.evaluaciones.anexos')} href={route('convocatorias.evaluaciones.anexos', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Anexos</p>
        </a>
    </div>
    {#if proyecto.codigo_linea_programatica == 68}
        <div class="w-10/12 step">
            <a use:inertia active={route().current('convocatorias.evaluaciones.inventario-equipos')} href={route('convocatorias.evaluaciones.inventario-equipos', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                <p class="text-sm text-center">Inventario de equipos</p>
            </a>
        </div>
    {/if}
    <div class="w-10/12 step">
        <a use:inertia active={route().current('convocatorias.evaluaciones.cadena-valor')} href={route('convocatorias.evaluaciones.cadena-valor', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Cadena de valor</p>
        </a>
    </div>
    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <div class="w-10/12 step">
            <a use:inertia active={route().current('convocatorias.evaluaciones.causales-rechazo')} href={route('convocatorias.evaluaciones.causales-rechazo', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                <p class="text-sm text-center">Causales de rechazo</p>
            </a>
        </div>
    {/if}

    {#if isSuperAdmin || convocatoria.fase == 2 || convocatoria.fase == 3 || convocatoria.fase == 4 || convocatoria.fase == 5}
        <div class="w-10/12 step">
            <a use:inertia active={route().current('convocatorias.evaluaciones.comentarios-generales-form')} href={route('convocatorias.evaluaciones.comentarios-generales-form', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
                <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
                <p class="text-sm text-center">Comentarios generales</p>
            </a>
        </div>
    {/if}

    <div class="w-10/12 step">
        <a use:inertia active={route().current('convocatorias.evaluaciones.summary')} href={route('convocatorias.evaluaciones.summary', [convocatoria.id, evaluacion.id])} class="flex flex-col items-center">
            <div class="rounded-full bg-white w-11 h-11 text-center flex items-center justify-center shadow mb-2 step-number" />
            <p class="text-sm text-center">Finalizar evaluación</p>
        </a>
    </div>
</div>

<style>
    #stepper a[active='true'] .rounded-full {
        background: var(--mdc-theme-primary);
        color: #fff;
    }

    #stepper a .rounded-full:hover {
        background: var(--mdc-theme-primary);
        transition: cubic-bezier(0.075, 0.82, 0.165, 1);
        color: #fff;
    }

    .presupuesto-container {
        border: 1px solid #6366f12b;
    }

    .total {
        bottom: -32px;
    }
</style>
