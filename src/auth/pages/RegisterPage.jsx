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

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(["token"])

    const [registering, setRegistering] = useState(false)

    const navigate = useNavigate()

    const password = watch("password")

    const onSubmit = (data, e) => {
        e.preventDefault();
        setRegistering(true);

        const { name, email, password, role } = data;

        fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, role }),
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
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Crear Cuenta
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

                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Tipo de Usuario
                        </label>
                        <select
                            id="role"
                            {...register("role", {
                                required: "Este campo es requerido",
                            })}
                            className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none"
                        >
                            <option value="">Selecciona un rol</option>
                            <option value="usuario">Usuario (Agregar juegos)</option>
                            <option value="juez">Juez (Votar juegos)</option>
                            <option value="admin">Administrador (Gestionar jueces)</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-600 text-sm mt-1.5">
                                {errors.role.message}
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
