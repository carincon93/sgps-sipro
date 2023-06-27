import ApplicationLogo from '@/Components/ApplicationLogo'
import SenaLogo from '@/Components/SenaLogo'
import TextInput from '@/Components/TextInput'
import { Link, useForm } from '@inertiajs/react'

export default function GuestLayout({ children }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        numero_documento: '',
    })

    return (
        <main className="min-h-screen flex flex-col items-center pt-6 sm:pt-0">
            <div className="mt-10 z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none rounded-lg shadow bg-[#ffffff59]">
                    <Link className="pointer-events-none place-items-center gap-2 flex px-4 py-2" href="/">
                        SENNOVA | <SenaLogo className="w-10" />
                    </Link>
                </div>
            </div>

            <div
                className="mt-32 relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-green-200 after:via-sena-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-sena-700 before:dark:opacity-10 after:dark:from-green-900 after:dark:via-[#01ff67] after:dark:opacity-40 before:lg:h-[360px] w-5/12"
            >
                <Link href={route('login')} className="flex items-center justify-center text-orangered-600 text-xl">
                    <ApplicationLogo fill="white" className="w-64 mr-6" />
                </Link>
                {children}
            </div>

            <div className="my-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left">
                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">Registrarse</h2>

                    <p className="m-0 max-w-[30ch] text-sm text-justify opacity-50">Por favor ingrese el número de documento para verificar si ya tiene una cuenta creada.</p>

                    <TextInput
                        id="numero_documento"
                        type="number"
                        name="numero_documento"
                        value={data.numero_documento}
                        className="!mt-4 block w-full"
                        label="Número de documento"
                        isFocused={true}
                        onChange={(e) => setData('numero_documento', e.target.value)}
                    />

                    <Link
                        href={`/register?numero_documento=${data.numero_documento}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-app-500 focus:ring-offset-2 transition ease-in-out duration-150 mt-2">
                            Verificar
                    </Link>
                </div>

                <Link href={route('password.request')} className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">Recuperar contraseña</h2>

                    <p className="m-0 max-w-[30ch] text-sm opacity-50">Mediante el correo electrónico institucional y el número de documento puede recuperar la contraseña de su cuenta.</p>
                </Link>

                <Link href="https://forms.office.com/r/6206w44sM4" target="_blank" className="group rounded-lg border border-transparent px-5 py-4 transition-colors bg-gray-100">
                    <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 mt-1 w-6 h-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288"
                            />
                        </svg>
                        <h2 className="mb-3 text-2xl font-semibold">Ayuda</h2>
                    </div>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        ¿Problemas con la plataforma?. <br /> Por favor diligencie el siguiente formulario: https://forms.office.com/r/6206w44sM4
                    </p>
                </Link>
            </div>
        </main>
    )
}

