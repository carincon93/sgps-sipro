

    let form = useForm({
        proyecto_presupuesto_comentario: evaluacion.evaluacion_proyecto_linea70?.proyecto_presupuesto_comentario ? evaluacion.evaluacion_proyecto_linea69?.proyecto_presupuesto_comentario : '',
        proyecto_presupuesto_requiere_comentario: evaluacion.evaluacion_proyecto_linea70 ? (evaluacion.evaluacion_proyecto_linea70?.proyecto_presupuesto_comentario == null ? true : false) : evaluacion.evaluacion_proyecto_linea69?.proyecto_presupuesto_comentario == null ? true : false,
    })
    function submit() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $form.put(route('convocatorias.evaluaciones.proyecto-presupuesto.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }


    {#if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación general</h1>
        <InfoMessage alertMsg={true}><strong>Importante:</strong> Si hace una evaluación general de los rubros presupuestales reemplazará los ítems ya evaluados.</InfoMessage>

        <div className="mt-16">
            <form on:submit|preventDefault={submit}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Los rubros presupuestales son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$form.proyecto_presupuesto_requiere_comentario} />
                        {#if $form.proyecto_presupuesto_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="proyecto_presupuesto_comentario" bind:value={$form.proyecto_presupuesto_comentario} error={errors.proyecto_presupuesto_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>
