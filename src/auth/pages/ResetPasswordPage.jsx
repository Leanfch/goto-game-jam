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
            <main className="flex items-center justify-center flex-grow">
                <div className="bg-stone-200 w-full p-6 m-auto rounded-md shadow-xl md:max-w-xl">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">
                            Token Inválido
                        </h1>
                        <p className="text-gray-700 mb-4">
                            El link de recuperación no es válido
                        </p>
                        <a
                            href="/auth/forgot-password"
                            className="text-purple-600 hover:underline"
                        >
                            Solicitar nuevo link
                        </a>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="flex items-center justify-center flex-grow">
            <div className="bg-stone-200 w-full p-6 m-auto rounded-md shadow-xl md:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                    Restablecer Contraseña
                    {resetting && <LoaderSpinner />}
                </h1>
                <p className="text-center text-sm text-gray-600 mt-2">
                    Ingresa tu nueva contraseña
                </p>
                <form
                    action=""
                    className="mt-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-2">
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Nueva contraseña"
                            {...register("newPassword", {
                                required: "Este campo es requerido",
                                minLength: {
                                    value: 6,
                                    message:
                                        "La contraseña debe tener al menos 6 caracteres",
                                },
                            })}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                        {errors.newPassword && (
                            <span className="text-red-700">
                                {errors.newPassword.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-2">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirmar contraseña"
                            {...register("confirmPassword", {
                                required: "Este campo es requerido",
                                validate: (value) =>
                                    value === password ||
                                    "Las contraseñas no coinciden",
                            })}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-700">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            disabled={resetting}
                            type="submit"
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600 disabled:bg-purple-400"
                        >
                            Restablecer contraseña
                        </button>
                    </div>
                </form>

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
