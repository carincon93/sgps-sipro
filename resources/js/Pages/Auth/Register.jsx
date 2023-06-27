import GuestLayout from '@/Layouts/GuestLayout'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import PasswordInput from '@/Components/PasswordInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import { Head, Link, useForm } from '@inertiajs/react'

export default function Login({ tiposDocumento, tiposVinculacion, roles, centrosFormacion, municipios, opcionesGenero, user, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: user.nombre,
        email: user.email,
        password: user.password,
        password_confirmation: user.password_confirmation,
        tipo_documento: tiposDocumento.find((item) => item.value == user.tipo_documento),
        numero_documento: user.numero_documento,
        lugar_expedicion_id: municipios.find((item) => item.value == user.lugar_expedicion_id),
        genero: opcionesGenero.find((item) => item.value == user.genero),
        fecha_nacimiento: user.fecha_nacimiento,
        numero_celular: user.numero_celular,
        tipo_vinculacion: tiposVinculacion.find((item) => item.value == user.tipo_vinculacion),
        centro_formacion_id: centrosFormacion.find((item) => item.value == user.centro_formacion_id),
        autorizacion_datos: user.autorizacion_datos,
        role_id: [],
    })

    const submit = (e) => {
        e.preventDefault()

        post(route('register'))
    }

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            {user &&
                <p className="bg-app-200 text-app-700 p-4 rounded shadow mt-6">
                    El usuario con número de documento {user.numero_documento} ya está registrado en el sistema. Por favor inicie sesión haciendo <a use:inertia href="/" className="underline">clic aquí</a>. Si no recuerda la contraseña la puede recuperar en el siguiente enlace: <a use:inertia href="/forgot-password" className="underline">Recuperar contraseña</a>
                </p>
            }
            <form onSubmit={submit} className="mt-20 w-[22rem]">
                <div>
                    <TextInput
                        label="Nombre completo"
                        id="nombre"
                        type="text"
                        className="mt-1 w-full"
                        value={data.nombre}
                        error={errors.nombre}
                        required
                        onChange={(e) => setData('nombre', e.target.value)}
                    />
                </div>

                <div className="mt-8 relative">
                    <TextInput
                        label="Correo electrónico institucional"
                        id="email"
                        type="email"
                        className="mt-1 w-full"
                        value={data.email}
                        error={errors.email}
                        required
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email == "El campo correo electrónico ya ha sido tomado." &&
                        <p className="bg-red-200 text-red-500 p-4 rounded shadow mb-6 absolute top-0 right-[-26rem] w-[400px]">
                            El correo electrónico ya fue registrado, Por favor inicie sesión haciendo <Link href="/" className="underline">clic aquí</Link>. Si no recuerda la contraseña la puede recuperar en el siguiente enlace <Link href="/forgot-password" className="underline">Recuperar contraseña</Link>
                        </p>
                    }
                </div>

                <div className="mt-8">
                    <PasswordInput
                        label="Contraseña"
                        id="password"
                        type="password"
                        className="mt-1 w-full"
                        value={data.password}
                        error={errors.password}
                        required
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </div>

                <div className="mt-8">
                    <PasswordInput
                        label="Confirmar contraseña"
                        id="password_confirmation"
                        type="password"
                        className="mt-1 w-full"
                        value={data.password_confirmation}
                        error={errors.password_confirmation}
                        required
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="tipo_documento"
                        options={tiposDocumento}
                        value={data.tipo_documento}
                        autoComplete={false}
                        label="Tipo de documento"
                        required
                        onChange={(event, newValue) => {
                            setData('tipo_documento', newValue);
                        }}
                    />
                </div>

                <div className="mt-8">
                    <TextInput
                        label="Número de documento"
                        id="numero_documento"
                        type="number"
                        min="55555"
                        max="3900000000"
                        className="mt-1 w-full"
                        value={data.numero_documento}
                        error={errors.numero_documento}
                        required
                        onChange={(e) => setData('numero_documento', e.target.value)}
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="lugar_expedicion_id"
                        options={municipios}
                        value={data.lugar_expedicion_id}
                        error={errors.lugar_expedicion_id}
                        autoComplete={false}
                        label="Lugar de expedición"
                        required
                        onChange={(event, newValue) => {
                            setData('lugar_expedicion_id', newValue);
                        }}
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="genero"
                        options={opcionesGenero}
                        className="mt-1 w-full"
                        value={data.genero}
                        autoComplete={false}
                        label="Género"
                        required
                        onChange={(event, newValue) => {
                            setData('genero', newValue);
                        }}
                    />
                </div>

                <div className="mt-8">
                    <DatePicker variant="outlined" id="fecha_nacimiento" name="fecha_nacimiento" label="Fecha de nacimiento" value={data.fecha_nacimiento} className="p-4 w-full" onChange={(e) => setData({ ...data, fecha_nacimiento: e.target.value })} required />
                </div>

                <div className="mt-8">
                    <TextInput
                        label="Número de celular"
                        id="numero_celular"
                        type="number"
                        min="3000000000"
                        max="3900000000"
                        className="mt-1 w-full"
                        value={data.numero_celular}
                        error={errors.numero_celular}
                        required
                        onChange={(e) => setData('numero_celular', e.target.value)}
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="tipo_vinculacion"
                        options={tiposVinculacion}
                        value={data.tipo_vinculacion}
                        error={errors.tipo_vinculacion}
                        autoComplete={false}
                        label="Tipo de vinculación"
                        required
                        onChange={(event, newValue) => {
                            setData('tipo_vinculacion', newValue);
                        }}
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="centro_formacion_id"
                        options={centrosFormacion}
                        value={data.centro_formacion_id}
                        error={errors.centro_formacion_id}
                        autoComplete={false}
                        label="Centro de formación"
                        required
                        onChange={(event, newValue) => {
                            setData('centro_formacion_id', newValue);
                        }}
                    />
                </div>

                <hr className="mt-4" />

                <div className="block mt-4">
                    <p>Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (Acuerdo No. 0009 del 2016)</p>
                </div>

                <div className="flex options-center justify-end mt-4">
                    <Link
                        href={route("login")}
                        className="mr-4 underline text-sm text-gray-600 hover:text-gray-900"
                    >
                        Ya tengo una cuenta
                    </Link>

                    <PrimaryButton type="submit" disabled={processing}>Continuar</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}

