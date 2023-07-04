import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { checkRole } from "@/Utils"
import { Link } from "@inertiajs/react"

export default function Dashboard({ auth, convocatorias, convocatoria_activa }) {

    let isSuperAdmin = checkRole(auth.user, [1])

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}
        >
            <header className="pt-[8rem]" slot="header">
                <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
                    <div>
                        {convocatoria_activa ?
                            <h1 className="font-bold text-5xl">
                                Lista de convocatorias
                            </h1>
                        : (
                            <>
                                <h1 className="font-bold text-5xl">Aún no hay una convocatoria activa.</h1>
                                <p>Debe crear una nueva convocatoria y activarla o activar una convocatoria previamente creada.</p>
                            </>
                        )}
                    </div>
                    <div>
                        <figure>
                            <img src={'/images/dashboard.png'} alt="" />
                        </figure>
                    </div>
                </div>
            </header>
            <div className={isSuperAdmin ? 'py-12' : ''}>
                {isSuperAdmin &&
                    <div className="flex justify-center items-center flex-col my-20">
                        <p>A continuación, se listan todas las convocatorias, si desea crear una nueva de clic en el siguiente botón.</p>
                        <div>
                            <Link href={route('convocatorias.create')} className="mt-8 mb-20">Crear convocatoria</Link>
                        </div>
                    </div>
                }

                <div className="grid grid-cols-3 gap-4">
                    {isSuperAdmin || checkRole(authUser, [11]) || checkPermission(authUser, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 14, 15, 16, 20, 21]) ? (
                        convocatorias.data.map((convocatoria) => (
                            (convocatoria.tipo_convocatoria != 3 && convocatoria.visible) || isSuperAdmin || checkRole(authUser, [5, 17, 18, 19, 20]) ?
                                <div key={convocatoria.id}>
                                    {isSuperAdmin &&
                                        <div className="bg-white flex w-full justify-end">
                                            {/* <DataTableMenu className="!min-w-0">
                                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.edit', convocatoria.id))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                                                    <Text>Editar convocatoria</Text>
                                                </Item>

                                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.convocatoria-rol-sennova.index', convocatoria.id))}>
                                                    <Text>Roles SENNOVA</Text>
                                                </Item>

                                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.convocatoria-presupuesto.index', convocatoria.id))}>
                                                    <Text>Rúbrica presupuestal SENNOVA</Text>
                                                </Item>

                                                <Separator disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''} />
                                                <Item on:SMUI:action={() => ((convocatoria_id = convocatoria.id), (dialogEliminar = true), (allowedToDestroy = isSuperAdmin))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                                                    <Text>Eliminar convocatoria</Text>
                                                </Item>
                                            </DataTableMenu> */}
                                        </div>
                                    }
                                    <Link href={route('convocatorias.lineas-programaticas.index', convocatoria.id)} className="bg-white overflow-hidden shadow-md px-6 py-2 hover:bg-app-500 hover:text-white h-72 flex justify-center items-center flex-col">
                                        <h1 className="text-2xl text-center my-4">
                                            {convocatoria.tipo_convocatoria == 1 ? (
                                                <>
                                                    {convocatoria.descripcion}
                                                    <br />
                                                    {convocatoria.year}
                                                </>
                                            ) : convocatoria.tipo_convocatoria == 2 ? (
                                                <>
                                                    Proyectos de ejercicio (DEMO)
                                                </>
                                            ) : (
                                                <>
                                                    Nuevas TecnoAcademias - Nuevos Tecnoparques
                                                </>

                                            )}
                                        </h1>

                                        <div className="bg-gray-700 text-white p-2 rounded-sm mt-4 flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>

                                            <small> Convocatoria {convocatoria.esta_activa ? 'activa' : 'inactiva'} {convocatoria.visible && isSuperAdmin ? ' y visible' : convocatoria.visible == false && isSuperAdmin ? 'y oculta' : ''}</small>
                                        </div>
                                    </Link>
                                </div>
                            : null )
                        )
                    ) : null}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
