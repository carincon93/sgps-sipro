import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined'
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined'

import { useState } from 'react'

const HelpDesk = () => {
    const [dialog_status, setDialogStatus] = useState(false)

    return (
        <>
            <ButtonMui className="!fixed bottom-20 left-6 z-[9999]" onClick={() => setDialogStatus(true)} type="button">
                <HelpOutlineOutlinedIcon className="mr-2" /> Ayuda
            </ButtonMui>

            <DialogMui
                open={dialog_status}
                fullWidth={true}
                maxWidth="sm"
                dialogContent={
                    <>
                        <h1 className="font-black">Soporte técnico plataforma SGPS SIPRO</h1>

                        <ul>
                            <li className="mt-2">
                                <MailOutlineOutlinedIcon className="mr-2 text-gray-400" />
                                <a href="mailto:sgpssipro@sena.edu.co">sgpssipro@sena.edu.co</a>
                            </li>
                            <li className="mt-4">
                                <PlaylistRemoveOutlinedIcon className="mr-2 text-gray-400" />
                                <a href="https://forms.office.com/r/6206w44sM4" target="_blank">
                                    Registro de errores https://forms.office.com/r/6206w44sM4
                                </a>
                            </li>
                        </ul>

                        <h1 className="font-black mt-10">Dudas sobre la convocatoria</h1>

                        <ul>
                            <li className="mt-2">
                                <MailOutlineOutlinedIcon className="mr-2 text-gray-400" />
                                <a href="mailto:convocatoriasennova@sena.edu.co">convocatoriasennova@sena.edu.co</a>
                            </li>
                        </ul>

                        <h1 className="font-black mt-10 mb-4">Activadores</h1>

                        <ul className="space-y-6">
                            <li className="flex items-center justify-between">
                                <span>
                                    Randy José Agustín Montenegro Socha <br />
                                    <MailOutlineOutlinedIcon className="mr-2 text-gray-400" />
                                    <a href="mailto:amontenegro@sena.edu.co">amontenegro@sena.edu.co</a>
                                </span>
                                <span>(Línea 23)</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>
                                    Ingrid Fernanda Hernandez Diaz <br />
                                    <MailOutlineOutlinedIcon className="mr-2 text-gray-400" />
                                    <a href="mailto:ifhernandez@sena.edu.co">ifhernandez@sena.edu.co</a>
                                </span>
                                <span>(Línea 70)</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>
                                    Giselle Marcela Daza Sarmiento <br />
                                    <MailOutlineOutlinedIcon className="mr-2 text-gray-400" />
                                    <a href="mailto:gmdaza@sena.edu.co">gmdaza@sena.edu.co</a>
                                </span>
                                <span>()</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>
                                    Liz Catherine Caicedo Cortés <br />
                                    <MailOutlineOutlinedIcon className="mr-2 text-gray-400" />
                                    <a href="mailto:lccaicedo@sena.edu.co">lccaicedo@sena.edu.co</a>
                                </span>
                                <span>(Línea 82)</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>
                                    Roberto Carlo Gonzalez Campo <br />
                                    <MailOutlineOutlinedIcon className="mr-2 text-gray-400" />
                                    <a href="mailto:rcgonzalez@sena.edu.co">rcgonzalez@sena.edu.co</a>
                                </span>
                                <span>(Líneas 61 - 65 - 69)</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>
                                    Cristian Camilo Buitrago Escamilla <br />
                                    <MailOutlineOutlinedIcon className="mr-2 text-gray-400" />
                                    <a href="mailto:ccbuitrago@sena.edu.co">ccbuitrago@sena.edu.co</a>
                                </span>
                                <span>(Línea 68)</span>
                            </li>
                        </ul>
                    </>
                }
                dialogActions={
                    <ButtonMui onClick={() => setDialogStatus(false)} type="button" className="!mr-3 !mb-3">
                        Cerrar
                    </ButtonMui>
                }
            />
        </>
    )
}

export default HelpDesk
