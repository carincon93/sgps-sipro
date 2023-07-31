import ButtonMui from '@/Components/Button'

import { router } from '@inertiajs/react'

const Error = ({ status, message }) => {
    return (
        <div className="{status >= 500 || status == 403 || status == 405 ? 'bg-red-500' : 'bg-app-700'} flex flex-col items-center justify-center min-h-screen text-white">
            <figure>
                {status >= 500 || status == 403 || status == 405 ? (
                    <img src="/images/error.png" alt="Error" className="w-2/3 m-auto mb-10" />
                ) : (
                    status == 404 && <img src="/images/error404.png" alt="Error" className="w-2/3 m-auto mb-10" />
                )}
            </figure>

            <div className="px-20">
                {message ? (
                    <h1 className="text-2xl text-center">{message}</h1>
                ) : (
                    <>
                        {status == 403 ? (
                            <h1 className="text-2xl text-center">Está acción no está autorizada para su rol.</h1>
                        ) : status == 405 ? (
                            <h1 className="text-2xl text-center">
                                Su sesión ha finalizado previamente y no puede realizar está acción. Por favor vuelva a iniciar sesión (En el formulario de Inisio de sesión se recomienda que active la
                                casilla de <strong>Mantener sesión activa</strong>)
                            </h1>
                        ) : status == 404 ? (
                            <>
                                <h1 className="text-2xl text-center">La página que busca no existe.</h1>

                                <div className="mt-20">
                                    <p>Posibles motivos por los que la página solicitada no se encuentra disponible:</p>
                                    <ul className="list-disc mt-5">
                                        <li>Puede que haya cambiado de dirección (URL).</li>
                                        <li>Es posible que está página no exista o no se haya escrito correctamente la URL, compruebe de nuevo y verifique que este bien escrita.</li>
                                    </ul>
                                </div>
                            </>
                        ) : status == 500 ? (
                            <h1 className="text-2xl text-center">Algo está mal en nuestros servidores. Por favor notifique este error a la mesa de ayuda.</h1>
                        ) : (
                            status == 503 && <h1 className="text-2xl text-center">La aplicación está en mantenimiento. Por favor intenta de nuevo en unos minutos.</h1>
                        )}

                        {status != 503 && status != 405 && status != 403 && (
                            <div className="mt-10">
                                <p>Puede notificar a la mesa de ayuda realice los siguientes pasos:</p>
                                <ul className="list-disc mt-5">
                                    <li>
                                        Tome un pantallazo del error desde alguna aplicación de Windows o Mac. El pantallazo se recomienda hacerlo de pantalla completa donde se observe con claridad la
                                        url y la fecha del momento en el que ocurrió el error.
                                    </li>
                                    <li>
                                        Envie las evidencias al correo{' '}
                                        <a className="underline" href="mailto:sgpssipro@sena.edu.co">
                                            sgpssipro@sena.edu.co
                                        </a>{' '}
                                        describriendo de como ocurrió el error. (Se debe enviar desde una cuenta @sena.edu.co)
                                    </li>
                                </ul>
                            </div>
                        )}
                        <div className="flex items-center justify-center mt-10">
                            <ButtonMui onClick={() => router.visit(route('login'))} variant="raised" type="button" className="mr-4 bg-white text-black">
                                Regresar a la aplicación
                            </ButtonMui>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Error
