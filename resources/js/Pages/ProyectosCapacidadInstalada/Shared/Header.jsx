<script>
    import { inertia } from '@inertiajs/inertia-svelte'
    import { route } from '@/Utils'

    export let proyectoCapacidadInstalada
</script>

<div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
    <div>
        <h1>
            <a use:inertia href={route('proyectos-capacidad-instalada.index')} className="text-app-400 hover:text-app-600"> Proyectos de capacidad instalada </a>
            <span className="text-app-400 font-medium">/</span>
            <a use:inertia href={route('proyectos-capacidad-instalada.edit', proyectoCapacidadInstalada.id)} className="text-app-400 hover:text-app-600 {route().current('proyectos-capacidad-instalada.edit') ? 'font-extrabold' : ''} underline">Información básica</a>
            <span className="text-app-400 font-medium">/</span>
            <a use:inertia href={route('proyectos-capacidad-instalada.integrantes.index', proyectoCapacidadInstalada.id)} className="text-app-400 hover:text-app-600 {route().current('proyectos-capacidad-instalada.integrantes.index') ? 'font-extrabold' : ''}">Integrantes</a>
            <span className="text-app-400 font-medium">/</span>
            <a use:inertia href={route('proyectos-capacidad-instalada.objetivos-especificos.index', proyectoCapacidadInstalada.id)} className="text-app-400 hover:text-app-600 {route().current('proyectos-capacidad-instalada.objetivos-especificos.index') ? 'font-extrabold' : ''}">Objetivos específicos y resultados</a>
            <span className="text-app-400 font-medium">/</span>
            <a use:inertia href={route('proyectos-capacidad-instalada.productos.index', proyectoCapacidadInstalada.id)} className="text-app-400 hover:text-app-600 {route().current('proyectos-capacidad-instalada.productos.index') ? 'font-extrabold' : ''}">Productos</a>
            <span className="text-app-400 font-medium">/</span>
            <a use:inertia href={route('proyectos-capacidad-instalada.finalizar', proyectoCapacidadInstalada.id)} className="text-app-400 hover:text-app-600 {route().current('proyectos-capacidad-instalada.finalizar') ? 'font-extrabold' : ''}">Estado</a>
        </h1>
    </div>
</div>
