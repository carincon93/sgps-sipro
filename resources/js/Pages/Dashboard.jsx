import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { route, checkRole, checkPermission } from '@/Utils'
import { Link } from '@inertiajs/react'

export default function Dashboard({ auth }) {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}>
            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="flex items-center justify-between rounded-xl px-10 py-20 text-app-800 bg-app-300/50 col-span-2">
                    <div className="max-w-2xl">
                        <h1 className="text-2xl font-bold">
                            ¡Bienvenido(a) <span className="capitalize">{auth.user.nombre}</span>! 👋🏻
                        </h1>

                        <p className="my-8">Formule proyectos de I+D+i, Tecnoacademia-Tecnoparque, Servicios Tecnológicos y/o Cultura de la innovación.</p>
                    </div>
                    <div>
                        <figure>
                            <img src={'/images/dashboard.png'} alt="" />
                        </figure>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-10">
                <Link
                    className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                    href={route('convocatorias.index')}>
                    Convocatorias
                </Link>

                {is_super_admin || checkRole(auth_user, [4]) || checkPermission(auth_user, [8, 17]) ? (
                    <Link
                        className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col text-center"
                        href={route('nuevos-proyectos-ta-tp')}>
                        Nuevos proyectos Tecnoacademia - Tecnoparque
                    </Link>
                ) : null}

                {is_super_admin || checkRole(auth_user, [4, 5, 17, 18, 19, 21]) ? (
                    <Link
                        className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                        href={route('users.index')}>
                        Usuarios
                    </Link>
                ) : null}
            </div>

            {/* <Dialog bind:open={dialogOpen} id="informacion">
                <div slot="title" className="flex items-center flex-col mb-10">Importante</div>
                <div slot="content">
                    <small>Junio 8</small>

                    <hr className="mt-10 mb-10" />
                    <div>
                        <p>El CENSO SENNOVA 2023 está habilitado. Por favor haga clic en <strong>Ir al CENSO SENNOVA 2023</strong> para diligenciarlo.</p>
                    </div>
                </div>
                <div slot="actions">
                    <div className="p-4 flex">
                        {#if auth_user.informacion_completa}
                            <Button variant="outlined" on:click={() => (dialogOpen = false)}>Ya he completado el CENSO</Button>
                        }
                        <Link className="ml-2 overflow-hidden shadow-sm rounded px-6 py-2 bg-app-500 text-white flex justify-around items-center flex-col text-center" href={route('users.perfil')}>Ir al CENSO SENNOVA 2023</Link>
                    </div>
                </div>
            </Dialog> */}
        </AuthenticatedLayout>
    )
}
