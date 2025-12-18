import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useCookies } from "react-cookie"
import LoaderSpinner from "../../components/LoaderSpinner"
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertHelper"

export const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        criteriaMode: "all",
    })

    const [cookies, setCookie] = useCookies(["token"])

    const [registering, setRegistering] = useState(false)

    const navigate = useNavigate()

    const password = watch("password")

    const onSubmit = (data, e) => {
        e.preventDefault();
        setRegistering(true);

        const { name, email, password } = data;

        // Por defecto todos los registros son usuarios normales
        fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, role: "usuario" }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Error al registrar usuario');
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (data.error) {
                    showErrorAlert('Error', data.message);
                    setRegistering(false);
                    return;
                }
                setCookie("token", data.token);
                showSuccessAlert('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente').then(() => {
                    navigate("/dashboard");
                });
            })
            .catch((error) => {
                showErrorAlert('Error de registro', error.message);
                setRegistering(false);
            });
    };

    return (
        <main className="my-auto flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Crear cuenta
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Únete a la comunidad de Game Jam ON
                        </p>
                    </div>

                    {registering && (
                        <div className="mb-6">
                            <LoaderSpinner />
                        </div>
                    )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Nombre completo"
                            {...register("name", {
                                required: "Este campo es requerido",
                                minLength: {
                                    value: 3,
                                    message: "El nombre debe tener al menos 3 caracteres",
                                },
                            })}
                            className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none"
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm mt-1.5">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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
                                    message:
                                        "La contraseña debe tener al menos 6 caracteres",
                                },
                            })}
                            className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none"
                        />

                        {/* Requisitos de contraseña */}
                        <div className="mt-2 space-y-1">
                            <div className={`flex items-center text-xs ${password && password.length >= 6 ? 'text-green-600' : 'text-zinc-600'}`}>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    {password && password.length >= 6 ? (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    )}
                                </svg>
                                Mínimo 6 caracteres
                            </div>
                        </div>

                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1.5">
                                {errors.password.message}
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
                                validate: value =>
                                    value === password || "Las contraseñas no coinciden"
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
                        disabled={registering}
                        type="submit"
                        className="w-full py-3.5 px-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                        {registering ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
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
