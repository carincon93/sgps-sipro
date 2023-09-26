import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import SenaLogo from '@/Components/SenaLogo'

import { route, checkRole } from '@/Utils'
import { Head, Link, router } from '@inertiajs/react'
import { Divider, Grid } from '@mui/material'
import React, { useState } from 'react'

const ConvocatoriaTiposFormulario = ({ auth, convocatoria, tipos_formulario_convocatoria }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(convocatoria.year == 2024)

    return (
        <AuthenticatedLayout user={auth_user}>
            <Head title="Líneas programáticas" />

            <Grid item md={12}>
                <h1 className="text-4xl text-center mb-8">A continuación, se listan las líneas programáticas de la vigencia {convocatoria.year} en las que puede formular proyectos.</h1>
            </Grid>

            {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                <Grid item md={12}>
                    <AlertMui className="mt-10">
                        <p>Si desea modificar la convocatoria por favor de clic en el siguiente botón:</p>
                        <Link href={route('convocatorias.edit', [convocatoria.id])} className="my-4 bg-app-800 text-white py-2 px-4 rounded inline-block">
                            Modificar convocatoria
                        </Link>
                    </AlertMui>
                </Grid>
            )}

            {convocatoria.year == 2024 && (
                <Grid item md={12}>
                    <AlertMui severity="error">
                        <strong>Importante:</strong> Estamos trabajando para habilitar los formularios y líneas faltantes. Se habilitarán pronto.
                    </AlertMui>
                </Grid>
            )}

            {tipos_formulario_convocatoria.map((tipo_formulario_convocatoria, i) => (
                <React.Fragment key={i}>
                    {tipo_formulario_convocatoria.pivot.visible || checkRole(auth_user, [1, 20, 18, 19, 5, 17]) ? (
                        <Grid item md={3} key={tipo_formulario_convocatoria.id}>
                            <ButtonMui
                                primary={false}
                                onClick={() => router.visit(route('convocatorias.tipos-formulario-convocatoria.proyectos', [convocatoria.id, tipo_formulario_convocatoria.id]))}
                                className={`${
                                    tipo_formulario_convocatoria.pivot.visible
                                        ? '!bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-cyan-800 via-neutral-300 to-white '
                                        : ' !bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-800 via-neutral-300 to-white'
                                }overflow-hidden z-[2] relative text-center !shadow-md rounded-lg px-6 py-2 flex justify-around items-center flex-col m-auto w-full h-96`}>
                                {tipo_formulario_convocatoria.nombre + ' - Línea: ' + tipo_formulario_convocatoria.linea_programatica.codigo}
                            </ButtonMui>
                        </Grid>
                    ) : null}
                </React.Fragment>
            ))}

            <DialogMui
                fullWidth={true}
                maxWidth="md"
                blurEnabled={true}
                open={dialog_status}
                enableGradient={true}
                dialogContent={
                    <>
                        <span className="text-white pointer-events-none place-items-center gap-2 flex py-2" href="/">
                            SENNOVA | <SenaLogo className="w-10" />
                        </span>
                        <h1 className="text-center text-3xl text-white mt-6 mb-10">CONVOCATORIA {convocatoria.year}</h1>
                        <h6 className="text-white mt-10">Soporte técnico plataforma SGPS SIPRO</h6>
                        <ul className="text-white list-disc ml-4">
                            <li>
                                <a href="mailto:sgpssipro@sena.edu.co" target="_blank" className="underline">
                                    sgpssipro@sena.edu.co
                                </a>
                            </li>
                            <li>
                                Registro de errores:{' '}
                                <a href="https://forms.office.com/r/6206w44sM4" target="_blank" className="underline">
                                    https://forms.office.com/r/6206w44sM4
                                </a>
                            </li>
                        </ul>
                        <h6 className="text-white mt-6">Dudas sobre la convocatoria</h6>
                        <ul className="text-white list-disc ml-4">
                            <li>
                                <a href="mailto:convocatoriasennova@sena.edu.co" target="_blank" className="underline">
                                    convocatoriasennova@sena.edu.co
                                </a>
                            </li>
                        </ul>
                        <h6 className="text-white mt-6">Activadores</h6>
                        <ul className="text-white list-disc ml-4">
                            <li>
                                Randy José Agustín Montenegro - Socha{' '}
                                <a href="mailto:amontenegro@sena.edu.co" target="_blank" className="underline">
                                    amontenegro@sena.edu.co
                                </a>{' '}
                                (Línea 23)
                            </li>
                            <li>
                                Ingrid Fernanda Hernandez Diaz -{' '}
                                <a href="mailto:ifhernandez@sena.edu.co" target="_blank" className="underline">
                                    ifhernandez@sena.edu.co
                                </a>{' '}
                                (Línea 70)
                            </li>
                            <li>
                                Giselle Marcela Daza Sarmiento -{' '}
                                <a href="mailto:gmdaza@sena.edu.co" target="_blank" className="underline">
                                    gmdaza@sena.edu.co
                                </a>{' '}
                                (Línea 66)
                            </li>
                            <li>
                                Liz Catherine Caicedo Cortés -{' '}
                                <a href="mailto:lccaicedo@sena.edu.co" target="_blank" className="underline">
                                    lccaicedo@sena.edu.co
                                </a>{' '}
                                (Línea 82)
                            </li>
                            <li>
                                Roberto Carlo Gonzalez Campo -{' '}
                                <a href="mailto:rcgonzalez@sena.edu.co" target="_blank" className="underline">
                                    rcgonzalez@sena.edu.co
                                </a>{' '}
                                (Líneas 61 - 65 - Hubs de innovación)
                            </li>
                            <li>
                                Cristian Camilo Buitrago Escamilla -{' '}
                                <a href="mailto:ccbuitrago@sena.edu.co" target="_blank" className="underline">
                                    ccbuitrago@sena.edu.co
                                </a>{' '}
                                (Línea 68)
                            </li>
                        </ul>

                        <a href="/storage/documentos-descarga/Lineamientos_CONVOCATORIA_2024.pdf" className="bg-white text-center p-2 rounded block mt-6 hover:opacity-90" target="_blank">
                            Descargar Lineamientos y Términos de Referencia CONVOCATORIA 2024
                        </a>

                        <Divider className="text-white bg-white !my-6" />
                    </>
                }
                dialogActions={
                    <>
                        <ButtonMui onClick={() => setDialogStatus(false)} className="!mr-4">
                            Cerrar
                        </ButtonMui>
                    </>
                }
            />
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaTiposFormulario
