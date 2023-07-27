<AuthenticatedLayout>
    <div className="grid grid-cols-3">
        <div>
            <h1 className="font-black text-4xl uppercase">{user.nombre}</h1>
        </div>
        
    </div>

    <hr className="w-full my-20" />

    <div className="grid gap-4 grid-cols-3">
        <div>
            <h1 className="font-black text-4xl uppercase">Estudios académicos</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <EstudioAcademico {estudiosAcademicos} />
        </div>
    </div>

    <hr className="w-full my-20" />

    <div className="grid gap-4 grid-cols-3">
        <div>
            <h1 className="font-black text-4xl uppercase">Formación académica SENA</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <FormacionAcademicaSena {formacionesAcademicasSena} />
        </div>
    </div>

    <hr className="w-full my-20" />

    <div className="grid gap-4 grid-cols-3">
        <div>
            <h1 className="font-black text-4xl uppercase">Participación en grupos de investigación SENA</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <ParticipacionGruposInvestigacion {participacionesGruposInvestigacionSena} />
        </div>
    </div>

    <hr className="w-full my-20" />

    <div className="grid gap-4 grid-cols-3">
        <div>
            <h1 className="font-black text-4xl uppercase">Participación en proyectos SENNOVA</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <ParticipacionProyectosSennova {participacionesProyectosSennova} />
        </div>
    </div>

    <hr className="w-full my-20" />

    <h1 className="font-black text-4xl uppercase">Confirmación de información completa</h1>

    <div className="mt-8 pb-20">
        <Label required className="mb-4" labelFor="informacion_completa" value="Confirmo que he completado la información solicitada" />
        <Select
            id="informacion_completa"
            items={[
                { value: 1, label: 'Si' },
                { value: 2, label: 'No' },
            ]}
            bind:selectedValue={$form.informacion_completa}
            error={errors.informacion_completa}
            autocomplete="off"
            placeholder="Seleccione una opción"
            required
        />
        <PrimaryButton loading={$form.processing} type="submit" className="mt-8" form="informacion-basica">Guardar</PrimaryButton>
    </div>

    <!-- <hr className="w-full my-20" />

    <div className="grid gap-4 grid-cols-3">
        <div>
            <h1 className="font-black text-4xl uppercase">Cambiar la contraseña</h1>
        </div>
        <form on:submit|preventDefault={submitChangePassword} className="bg-white rounded shadow col-span-2">
            <fieldset className="p-8">
                <div className="mt-8">
                    <Input label="Contraseña actual" id="old_password" type="password" className="mt-1" bind:value={$formChangePassword.old_password} error={errors.old_password} required />
                </div>
                <div className="mt-8">
                    <Input label={'Nueva ' + $_('Password').toLowerCase()} id="password" type="password" className="mt-1" bind:value={$formChangePassword.password} error={errors.password} required autocomplete="new-password" />
                </div>

                <div className="mt-8">
                    <Input label={$_('Confirm Password')} id="password_confirmation" type="password" className="mt-1" bind:value={$formChangePassword.password_confirmation} error={errors.password_confirmation} required autocomplete="new-password" />
                </div>
            </fieldset>
            <div className="px-8 py-4 bg-gray-100 border-t border-gray-200 flex items-center">
                <PrimaryButton loading={$formChangePassword.processing} type="submit" bind:disabled={$formChangePassword.autorizacion_datos}>Cambiar contraseña</PrimaryButton>
            </div>
        </form>
    </div> -->
</AuthenticatedLayout>
