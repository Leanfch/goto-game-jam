import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import LoaderSpinner from "../../components/LoaderSpinner"
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertHelper"

export const ResetPasswordPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm()

    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [resetting, setResetting] = useState(false)
    const navigate = useNavigate()

    const password = watch("newPassword")

    const onSubmit = (data, e) => {
        e.preventDefault()
        setResetting(true)

        if (!token) {
            showErrorAlert("Error", "Token de recuperación no válido")
            setResetting(false)
            return
        }

        fetch("http://localhost:3000/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                newPassword: data.newPassword,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(err.message || "Error al resetear contraseña")
                    })
                }
                return response.json()
            })
            .then(() => {
                showSuccessAlert(
                    "¡Contraseña actualizada!",
                    "Tu contraseña ha sido actualizada exitosamente"
                ).then(() => {
                    navigate("/auth/login")
                })
            })
            .catch((error) => {
                showErrorAlert("Error", error.message)
                setResetting(false)
            })
    }

    if (!token) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Token Inválido
                            </h1>
                            <p className="text-gray-600 mb-6">
                                El link de recuperación no es válido o ha expirado
                            </p>
                            <a
                                href="/auth/forgot-password"
                                className="inline-block py-3 px-6 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
                            >
                                Solicitar nuevo link
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Restablecer Contraseña
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Ingresa tu nueva contraseña
                        </p>
                    </div>

                    {resetting && (
                        <div className="mb-6">
                            <LoaderSpinner />
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="••••••••"
                                {...register("newPassword", {
                                    required: "Este campo es requerido",
                                    minLength: {
                                        value: 6,
                                        message: "La contraseña debe tener al menos 6 caracteres",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.newPassword && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••••"
                                {...register("confirmPassword", {
                                    required: "Este campo es requerido",
                                    validate: (value) =>
                                        value === password ||
                                        "Las contraseñas no coinciden",
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button
                            disabled={resetting}
                            type="submit"
                            className="w-full py-3.5 px-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            {resetting ? "Restableciendo..." : "Restablecer contraseña"}
                        </button>
                    </form>

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
