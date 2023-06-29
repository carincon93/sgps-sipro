import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import PasswordInput from '@/Components/PasswordInput';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password')
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'))
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit} className="w-[22rem] my-10 relative">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        label="Correo electrónico SENA"
                        required
                        value={data.email}
                        error={errors.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                </div>

                <div className="mt-4">
                    <PasswordInput
                        id="password"
                        type="password"
                        name="password"
                        label="Contraseña"
                        required
                        value={data.password}
                        error={errors.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                </div>

                <div className="block mt-4">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        label='Mantener la sesión activa'
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Iniciar sesión
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}
