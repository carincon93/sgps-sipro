<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Input from '@/Components/Input'
    import Textarea from '@/Components/Textarea'
    import PrimaryButton from '@/Components/PrimaryButton'
    import InfoMessage from '@/Components/InfoMessage'

    export let errors

    $: $title = 'Soporte'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        email: '',
        descripcion: '',
        archivo: null,
    })

    function submit() {
        $form.post(route('reportar-problemas.report'))
    }
</script>

<AuthenticatedLayout>
    <InfoMessage className="mb-10">
        <strong>Importante</strong>
        <p>
            Si tiene dudas sobre la formulación de proyectos por favor escriba al correo de la conovocatoria.
            <br />
            Si evidencia fallas y requiere de apoyo técnico por favor escriba a los correos de soporte o diligencie el formulario.
        </p>
        <ul className="list-disc p-4">
            <li>
                <a href="mailto:convocatoriasennova@sena.edu.co">Conovocatoria: <span className="underline">convocatoriasennova@sena.edu.co</span></a>
            </li>
            <li>
                <a href="mailto:ccvasquez@sena.edu.co">Soporte: <span className="underline">ccvasquez@sena.edu.co</span></a>
            </li>
            <li>
                <a href="mailto:jicarrillo@sena.edu.co">Soporte: <span className="underline">jicarrillo@sena.edu.co</span></a>
            </li>
        </ul>
    </InfoMessage>
    <div className="bg-white rounded shadow max-w-3xl">
        <form on:submit|preventDefault={submit}>
            <fieldset className="p-8">
                <div className="mt-8">
                    <Input label="Correo electrónico institucional" id="email" type="email" className="mt-1" bind:value={$form.email} error={errors.email} required />
                    <InfoMessage message="Este atento (a) al correo electrónico, allí se le enviará la respuesta en el menor tiempo posible." />
                </div>
                <div className="mt-8">
                    <Textarea label="Descripción detallada del problema" maxlength="40000" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
                </div>
                <div className="mt-8">
                    <p>Url del archivo donde se observen capturas de pantallas con los errores (El archivo puede ser formato Pdf o Word). Se recomienda usar la herramienta de recortes de Windows y por favor asegúrese que las capturas sean de buena calidad.</p>
                    <Input label="Url" id="archivo" type="url" className="mt-1" error={errors?.archivo} placeholder="Url https://www.google.com.co" bind:value={$form.archivo} />
                    {#if $form.progress}
                        <progress value={$form.progress.percentage} max="100" className="mt-4">
                            {$form.progress.percentage}%
                        </progress>
                    {/if}
                </div>
            </fieldset>
            <div className="flex items-center justify-between mt-14 px-8 py-4">
                <PrimaryButton loading={$form.processing} type="submit" bind:disabled={$form.autorizacion_datos}>Notificar a la mesa de ayuda</PrimaryButton>
            </div>
        </form>
    </div>
</AuthenticatedLayout>
