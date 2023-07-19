<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Input from '@/Components/Input'
    import InputError from '@/Components/InputError'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import Select from '@/Components/Select'
    import InfoMessage from '@/Components/InfoMessage'

    export let errors
    export let convocatoria
    export let roles
    export let tiposProyectoSt
    export let sectoresProductivos
    export let estadosSistemaGestion
    export let allowedToCreate

    $: $title = 'Crear proyecto de servicios tecnológicos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        tipo_proyecto_st_id: null,
        estado_sistema_gestion_id: null,
        titulo: '',
        fecha_inicio: '',
        fecha_finalizacion: '',
        max_meses_ejecucion: 0,
        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
        sector_productivo: null,
        nombre_area_tecnica: '',
    })

    $: if ($form.fecha_inicio && $form.fecha_finalizacion) {
        $form.max_meses_ejecucion = monthDiff($form.fecha_inicio, $form.fecha_finalizacion)
    }

    function submit() {
        if (allowedToCreate) {
            $form.post(route('convocatorias.servicios-tecnologicos.store', [convocatoria.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.servicios-tecnologicos.index', [convocatoria.id])} className="text-app-400 hover:text-app-600"> Servicios tecnológicos </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <form on:submit|preventDefault={submit}>
        <fieldset className="p-8 divide-y">
            <div className="py-24">
                <Label
                    required
                    labelFor="titulo"
                    className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full"
                    value="Debe corresponder al contenido del proyecto y responder a los siguientes interrogantes: ¿Qué se va a hacer?, ¿Sobre qué o quiénes se hará?, ¿Cómo?, ¿Dónde se llevará a cabo? Tiene que estar escrito de manera breve y concisa. Un buen título describe con exactitud y usando el menor número posible de palabras el tema central del proyecto. Nota: las respuestas a las preguntas anteriormente formuladas no necesariamente deben responderse en mismo orden en el que aparecen. (Máximo 40 palabras)"
                />
                <Textarea label="Título" id="titulo" sinContador={true} error={errors.titulo} bind:value={$form.titulo} classes="bg-transparent block border-0 {errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required />
            </div>

            <div className="py-24">
                <p className="text-center">Fecha de ejecución</p>
                <small className="text-red-400 block text-center"> * Campo obligatorio </small>

                <div className="mt-4 flex items-start justify-around">
                    <div className="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
                        <Label required labelFor="fecha_inicio" className={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                        <div className="ml-4">
                            <input id="fecha_inicio" type="date" className="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_68} max={convocatoria.max_fecha_finalizacion_proyectos_linea_68} error={errors.fecha_inicio} bind:value={$form.fecha_inicio} required />
                        </div>
                    </div>
                    <div className="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
                        <Label required labelFor="fecha_finalizacion" className={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                        <div className="ml-4">
                            <input id="fecha_finalizacion" type="date" className="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_68} max={convocatoria.max_fecha_finalizacion_proyectos_linea_68} error={errors.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required />
                        </div>
                    </div>
                </div>
                {#if errors.fecha_inicio || errors.fecha_finalizacion || errors.max_meses_ejecucion}
                    <div className="mb-20 flex justify-center mt-4">
                        <InputError classes="text-center" message={errors.fecha_inicio} />
                        <InputError classes="text-center" message={errors.fecha_finalizacion} />
                        <InputError classes="text-center" message={errors.max_meses_ejecucion} />
                    </div>
                {/if}
            </div>

            <div className="py-24">
                <div className="grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="tipo_proyecto_st_id" value="Centro de formación" />
                    </div>
                    <div>
                        <Select id="tipo_proyecto_st_id" items={tiposProyectoSt} bind:selectedValue={$form.tipo_proyecto_st_id} error={errors.tipo_proyecto_st_id} autocomplete="off" placeholder="Seleccione una tipología de ST" required />
                    </div>
                </div>
            </div>

            <div className="py-24">
                <div className="grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="nombre_area_tecnica" value="Nombre del área técnica" />
                    </div>
                    <div>
                        <InfoMessage>Nombre del laboratorio o ambiente, tal como aparece en la resolución de creación (Lugar en donde se prestarán los servicios laboratorio, técnico o especiales)</InfoMessage>
                        <Input label="Nombre del área técnica" id="nombre_area_tecnica" type="text" className="mt-1" error={errors.nombre_area_tecnica} bind:value={$form.nombre_area_tecnica} required />
                    </div>
                </div>
            </div>

            {#if $form.tipo_proyecto_st_id}
                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label required className="mb-4" labelFor="estado_sistema_gestion_id" value="Estado del sistema de gestión" />
                        </div>
                        <div>
                            <Select id="estado_sistema_gestion_id" items={estadosSistemaGestion} bind:selectedValue={$form.estado_sistema_gestion_id} error={errors.estado_sistema_gestion_id} autocomplete="off" placeholder="Seleccione un estado" required />
                        </div>
                    </div>
                </div>
            {/if}

            <div className="py-24">
                <div className="grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="sector_productivo" value="Sector priorizado de Colombia Productiva" />
                    </div>
                    <div>
                        <Select id="sector_productivo" items={sectoresProductivos} bind:selectedValue={$form.sector_productivo} error={errors.sector_productivo} autocomplete="off" placeholder="Seleccione una sector" required />
                    </div>
                </div>
            </div>

            <hr className="mt-32" />

            <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
            <div className="grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
                </div>
                <div>
                    <Select id="rol_sennova" items={roles} bind:selectedValue={$form.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                </div>
            </div>
        </fieldset>

        <div className="flex items-center justify-between mt-14 px-8 py-4">
            {#if allowedToCreate}
                <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">
                    {$_('Continue')}
                </PrimaryButton>
            {/if}
        </div>
    </form>
</AuthenticatedLayout>
