import { useForm } from "react-hook-form"
import { useState } from "react"
import LoaderSpinner from "../../components/LoaderSpinner"
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertHelper"

export const ForgotPasswordPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [sending, setSending] = useState(false)
    const [resetUrl, setResetUrl] = useState("")

    const onSubmit = (data, e) => {
        e.preventDefault()
        setSending(true)

        fetch("http://localhost:3000/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(err.message || "Error al solicitar recuperación")
                    })
                }
                return response.json()
            })
            .then((data) => {
                setResetUrl(data.resetUrl)
                showSuccessAlert(
                    "¡Solicitud enviada!",
                    "Se ha generado un link de recuperación. En producción, esto se enviaría por email."
                )
                setSending(false)
            })
            .catch((error) => {
                showErrorAlert("Error", error.message)
                setSending(false)
            })
    }

    return (
        <main className="flex items-center justify-center flex-grow">
            <div className="bg-stone-200 w-full p-6 m-auto rounded-md shadow-xl md:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                    Recuperar Contraseña
                    {sending && <LoaderSpinner />}
                </h1>
                <p className="text-center text-sm text-gray-600 mt-2">
                    Ingresa tu email para recibir instrucciones de recuperación
                </p>
                <form
                    action=""
                    className="mt-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            {...register("email", {
                                required: "Este campo es requerido",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Ingrese un email válido",
                                },
                            })}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                        {errors.email && (
                            <span className="text-red-700">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            disabled={sending}
                            type="submit"
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600 disabled:bg-purple-400"
                        >
                            Enviar solicitud
                        </button>
                    </div>
                </form>

                {resetUrl && (
                    <div className="mt-4 p-4 bg-green-100 rounded-md">
                        <p className="text-sm text-green-800 font-semibold mb-2">
                            Link de recuperación generado:
                        </p>
                        <a
                            href={resetUrl}
                            className="text-sm text-blue-600 hover:underline break-all"
                        >
                            {resetUrl}
                        </a>
                    </div>
                )}

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    ¿Recordaste tu contraseña?{" "}
                    <a
                        href="/auth/login"
                        className="font-medium text-purple-600 hover:underline"
                    >
                        Inicia sesión aquí
                    </a>
                </p>
            </div>
        </main>
    )
}
