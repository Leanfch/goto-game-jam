import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useCookies } from "react-cookie"
import LoaderSpinner from "../../components/LoaderSpinner"
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertHelper"

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
    })

    const [cookies, setCookie] = useCookies(["token"])

    const [autenticating, setAutenticating] = useState(false)

    const navigate = useNavigate()

    const onSubmit = (data, e) => {
        e.preventDefault();
        setAutenticating(true);
        fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('La contraseña o el email son incorrectos');
                }
                return response.json();
            })
            .then((data) => {
                if (data.error) {
                    showErrorAlert('Error', data.message);
                    setAutenticating(false);
                    return;
                }
                if (!data.token) {
                    showErrorAlert('Error', 'Respuesta de inicio de sesión inválida');
                    setAutenticating(false);
                    return;
                }
                setCookie("token", data.token);
                showSuccessAlert('¡Éxito!', 'Has iniciado sesión correctamente').then(() => {
                    navigate("/dashboard");
                });
            })
            .catch((error) => {
                showErrorAlert('Error de inicio de sesión', error.message);
                setAutenticating(false);
            });
    };

    return (
        <main className="flex my-auto items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Iniciar sesión
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Ingresa a tu cuenta de Game Jam ON
                        </p>
                    </div>

                    {autenticating && (
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

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Este campo es requerido",
                                    minLength: {
                                        value: 6,
                                        message: "La contraseña debe tener al menos 6 caracteres",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <a
                                href="/auth/forgot-password"
                                className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <button
                            disabled={autenticating}
                            type="submit"
                            className="w-full py-3.5 px-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            {autenticating ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <a
                                href="/auth/register"
                                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                            >
                                Regístrate aquí
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
