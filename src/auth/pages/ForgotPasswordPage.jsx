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
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Recuperar Contraseña
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Ingresa tu email para recibir instrucciones de recuperación
                        </p>
                    </div>

                    {sending && (
                        <div className="mb-6">
                            <LoaderSpinner />
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="ejemplo@correo.com"
                                {...register("email", {
                                    required: "Este campo es requerido",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Ingrese un email válido",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            disabled={sending}
                            type="submit"
                            className="w-full py-3.5 px-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            {sending ? "Enviando..." : "Enviar solicitud"}
                        </button>
                    </form>

                    {resetUrl && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 font-semibold mb-2">
                                Link de recuperación generado:
                            </p>
                            <a
                                href={resetUrl}
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                            >
                                {resetUrl}
                            </a>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Recordaste tu contraseña?{" "}
                            <a
                                href="/auth/login"
                                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                            >
                                Inicia sesión aquí
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
