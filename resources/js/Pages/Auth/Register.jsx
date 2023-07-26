import GuestLayout from '@/Layouts/GuestLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Checkbox from '@/Components/Checkbox'
import DatePicker from '@/Components/DatePicker'
import PasswordInput from '@/Components/PasswordInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { Head, Link, useForm } from '@inertiajs/react'

export default function Login({ tiposDocumento, tiposVinculacion, roles, centrosFormacion, municipios, opcionesGenero, user, status, ...props }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: user?.nombre,
        email: user?.email,
        password: user?.password,
        password_confirmation: user?.password_confirmation,
        tipo_documento: user?.tipo_documento,
        numero_documento: user?.numero_documento,
        lugar_expedicion_id: user?.lugar_expedicion_id,
        genero: user?.genero,
        fecha_nacimiento: user?.fecha_nacimiento,
        numero_celular: user?.numero_celular,
        tipo_vinculacion: user?.tipo_vinculacion,
        centro_formacion_id: user?.centro_formacion_id,
        autorizacion_datos: user?.autorizacion_datos ?? false,
    })

    const submit = (e) => {
        e.preventDefault()

        post(route('register'))
    }

    return (
        <GuestLayout>
            <Head title="Registro" />

            {status && <AlertMui error={props.flash?.error}>{status}</AlertMui>}

            {user && (
                <AlertMui>
                    El usuario con número de documento {user.numero_documento} ya está registrado en el sistema. Por favor inicie sesión haciendo. Si no recuerda la contraseña la puede recuperar en la
                    opcion: Recuperar contraseña.
                </AlertMui>
            )}
            <form onSubmit={submit} className="mt-20 w-[22rem]">
                <div>
                    <TextInput
                        label="Nombre completo"
                        id="nombre"
                        type="text"
                        className="mt-1 w-full"
                        value={data.nombre}
                        error={errors.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        required
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
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email == 'El campo correo electrónico ya ha sido tomado.' && (
                        <AlertMui severity="error">
                            El correo electrónico ya fue registrado, Por favor inicie sesión haciendo{' '}
                            <Link href="/" className="underline">
                                clic aquí
                            </Link>
                            . Si no recuerda la contraseña la puede recuperar en el siguiente enlace{' '}
                            <Link href="/forgot-password" className="underline">
                                Recuperar contraseña
                            </Link>
                        </AlertMui>
                    )}
                </div>

                <div className="mt-8">
                    <PasswordInput
                        label="Contraseña"
                        id="password"
                        type="password"
                        className="mt-1 w-full"
                        value={data.password}
                        error={errors.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
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
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="tipo_documento"
                        options={tiposDocumento}
                        selectedValue={data.tipo_documento}
                        error={errors.tipo_documento}
                        onChange={(event, newValue) => {
                            setData('tipo_documento', newValue.value)
                        }}
                        label="Tipo de documento"
                        required
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
                        onChange={(e) => setData('numero_documento', e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="lugar_expedicion_id"
                        options={municipios}
                        selectedValue={data.lugar_expedicion_id}
                        error={errors.lugar_expedicion_id}
                        onChange={(event, newValue) => {
                            setData('lugar_expedicion_id', newValue.value)
                        }}
                        label="Lugar de expedición"
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="genero"
                        options={opcionesGenero}
                        className="mt-1 w-full"
                        selectedValue={data.genero}
                        error={errors.genero}
                        onChange={(event, newValue) => {
                            setData('genero', newValue.value)
                        }}
                        label="Género"
                        required
                    />
                </div>

                <div className="mt-8">
                    <DatePicker
                        variant="outlined"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        label="Fecha de nacimiento"
                        value={data.fecha_nacimiento}
                        className="p-4 w-full"
                        onChange={(e) => setData({ ...data, fecha_nacimiento: e.target.value })}
                        required
                    />
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
                        onChange={(e) => setData('numero_celular', e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="tipo_vinculacion"
                        options={tiposVinculacion}
                        selectedValue={data.tipo_vinculacion}
                        error={errors.tipo_vinculacion}
                        onChange={(event, newValue) => {
                            setData('tipo_vinculacion', newValue.value)
                        }}
                        label="Tipo de vinculación"
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="centro_formacion_id"
                        options={centrosFormacion}
                        selectedValue={data.centro_formacion_id}
                        error={errors.centro_formacion_id}
                        onChange={(event, newValue) => {
                            setData('centro_formacion_id', newValue.value)
                        }}
                        label="Centro de formación"
                        required
                    />
                </div>

                <div className="block mt-8">
                    <AlertMui>
                        Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (Acuerdo No. 0009 del 2016)
                    </AlertMui>

                    <Checkbox
                        className="mt-8"
                        name="autorizacion_datos"
                        checked={data.autorizacion_datos}
                        error={errors.autorizacion_datos}
                        onChange={(e) => setData('autorizacion_datos', e.target.checked)}
                        label="Autorizo el tratamiento de mis datos personales."
                    />
                </div>

                <div className="flex options-center justify-end mt-4">
                    <Link href={route('login')} className="mr-4 underline text-sm text-gray-600 hover:text-gray-900">
                        Ya tengo una cuenta
                    </Link>

                    <PrimaryButton type="submit" disabled={processing || !data.autorizacion_datos}>
                        Continuar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}
