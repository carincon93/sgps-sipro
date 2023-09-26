import GuestLayout from '@/Layouts/GuestLayout'

import AlertMui from '@/Components/Alert'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { Head, useForm } from '@inertiajs/react'

export default function ForgotPassword({ status, ...props }) {
    const form = useForm({
        email: '',
        numero_documento: '',
    })

    const submit = (e) => {
        e.preventDefault()

        form.post(route('password.email'))
    }

    if (form.errors.email == 'El campo correo electrónico seleccionado es inválido.') {
        status = `El correo electrónico ${data.email} no ha sido registrado.`
    }

    return (
        <GuestLayout>
            <Head title="Restablecer contraseña" />

            {status && (
                <AlertMui className="my-4" error={props.flash?.error}>
                    {status}
                </AlertMui>
            )}

            <p className="mt-10 text-gray-500 text-justify">
                ¿Ha olvidado su contraseña? No se preocupe. Díganos su correo electrónico institucional y número de documento. Si los datos coinciden se restablecerá su contraseña y esta será su
                número de documento.
            </p>

            <form onSubmit={submit} className="w-[22rem] my-10 relative">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        label="Correo electrónico SENA"
                        required
                        value={form.data.email}
                        error={form.errors.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        onChange={(e) => form.setData('email', e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <TextInput
                        id="numero_documento"
                        type="number"
                        name="numero_documento"
                        label="Número de documento"
                        required
                        value={form.data.numero_documento}
                        error={form.errors.numero_documento}
                        className="mt-1 block w-full"
                        autoComplete="current-numero_documento"
                        onChange={(e) => form.setData('numero_documento', e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={form.processing}>
                        Restablecer contraseña
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}
