import GuestLayout from '@/Layouts/GuestLayout'

import AlertMui from '@/Components/Alert'
import Checkbox from '@/Components/Checkbox'
import PasswordInput from '@/Components/PasswordInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { Head, useForm } from '@inertiajs/react'
import { useEffect } from 'react'

export default function Login({ status }) {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    })

    useEffect(() => {
        return () => {
            form.reset('password')
        }
    }, [])

    const submit = (e) => {
        e.preventDefault()

        form.post(route('login'))
    }

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {status && <AlertMui error={props.flash?.error}>{status}</AlertMui>}

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
                        className="block w-full"
                        autoComplete="email"
                        onChange={(e) => form.setData('email', e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <PasswordInput
                        id="password"
                        type="password"
                        name="password"
                        label="Contraseña"
                        required
                        value={form.data.password}
                        error={form.errors.password}
                        className="block w-full"
                        autoComplete="current-password"
                        onChange={(e) => form.setData('password', e.target.value)}
                    />
                </div>

                <div className="block mt-4">
                    <Checkbox name="remember" checked={form.data.remember} onChange={(e) => form.setData('remember', e.target.checked)} label="Mantener la sesión activa" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={form.processing}>
                        Iniciar sesión
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}
