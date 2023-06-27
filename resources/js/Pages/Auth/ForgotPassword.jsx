import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        numero_documento: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'))
    };

    return (
        <GuestLayout>
            <Head title="Restablecer contraseña" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <p className="mt-10 text-gray-500 text-justify">¿Ha olvidado su contraseña? No se preocupe. Díganos su correo electrónico institucional y número de documento. Si los datos coinciden se restablecerá su contraseña y esta será su número de documento.</p>

            <form onSubmit={submit} className="w-[22rem] my-10 relative">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        label="Correo electrónico SENA"
                        required
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <TextInput
                        id="numero_documento"
                        type="number"
                        name="numero_documento"
                        label="Número de documento"
                        required
                        value={data.numero_documento}
                        className="mt-1 block w-full"
                        autoComplete="current-numero_documento"
                        onChange={(e) => setData('numero_documento', e.target.value)}
                    />

                    <InputError message={errors.numero_documento} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Restablecer contraseña
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}
