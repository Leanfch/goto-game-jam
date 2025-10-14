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
        <main className="flex items-center justify-center flex-grow">
            <div className="bg-stone-200 w-full p-6 m-auto rounded-md shadow-xl md:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                    Crear Cuenta
                    {registering && <LoaderSpinner />}
                </h1>
                <form
                    action=""
                    className="mt-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-2">
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-800"
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
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                        {errors.name && (
                            <span className="text-red-700">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

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

                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Contraseña"
                            {...register("password", {
                                required: "Este campo es requerido",
                                minLength: {
                                    value: 6,
                                    message:
                                        "La contraseña debe tener al menos 6 caracteres",
                                },
                            })}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                        {errors.password && (
                            <span className="text-red-700">
                                {errors.password.message}
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
                                validate: value =>
                                    value === password || "Las contraseñas no coinciden"
                            })}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-700">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-2">
                        <label
                            htmlFor="role"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Tipo de Usuario
                        </label>
                        <select
                            id="role"
                            {...register("role", {
                                required: "Este campo es requerido",
                            })}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        >
                            <option value="">Selecciona un rol</option>
                            <option value="usuario">Usuario (Agregar juegos)</option>
                            <option value="juez">Juez (Votar juegos)</option>
                            <option value="admin">Administrador (Gestionar jueces)</option>
                        </select>
                        {errors.role && (
                            <span className="text-red-700">
                                {errors.role.message}
                            </span>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            disabled={registering}
                            type="submit"
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600 disabled:bg-purple-400"
                        >
                            Crear cuenta
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    ¿Ya tienes una cuenta?{" "}
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
