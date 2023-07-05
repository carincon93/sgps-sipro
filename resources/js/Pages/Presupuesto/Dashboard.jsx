<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Components/Button'
    import InfoMessage from '@/Components/InfoMessage'

    $title = 'Panel de control'

    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<AuthenticatedLayout>
    <div className="py-12">
        <InfoMessage className="mb-10">
            Antes de añadir un nuevo rubro presupuestal a una convocatoria debe seguir los siguientes pasos:
            <ul>
                <li>1. Crear un rubro en el primer grupo presupuestal</li>
                <li>2. Crear un rubro en el segundo grupo presupuestal</li>
                <li>3. Crear un rubro en el tercer grupo presupuestal</li>
                <li>4. Crear uso presupuestal</li>
                <li>5. Relacionar los anteriores ítems creados en el módulo Rubros presupuestales SENNOVA</li>
                <li>6. Por último ir al módulo de <strong>Convocatorias</strong> > <strong>Editar</strong> > <strong>Configurar rubros presupuesto SENNOVA.</strong> Allí podrá asociar a la convocatoria el rubro presupuestal nuevo.</li>
            </ul>
        </InfoMessage>
        <div className="grid grid-cols-3 gap-10">
            {#if isSuperAdmin}
                <a use:inertia className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('primer-grupo-presupuestal.index')}>Primer grupo presupuestal</a>
            {/if}
            {#if isSuperAdmin}
                <a use:inertia className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('segundo-grupo-presupuestal.index')}>Segundo grupo presupuestal</a>
            {/if}
            {#if isSuperAdmin}
                <a use:inertia className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('tercer-grupo-presupuestal.index')}>Tercer grupo presupuestal</a>
            {/if}
            {#if isSuperAdmin}
                <a use:inertia className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('usos-presupuestales.index')}>Usos presupuestales</a>
            {/if}
            {#if isSuperAdmin}
                <a use:inertia className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('presupuesto-sennova.index')}>Rubros presupuestales SENNOVA</a>
            {/if}
        </div>
    </div>
</AuthenticatedLayout>
