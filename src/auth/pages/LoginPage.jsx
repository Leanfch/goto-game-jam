import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useCookies } from "react-cookie"
import LoaderSpinner from "../../components/LoaderSpinner"

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
    })

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(["token"])

    const [autenticating, setAutenticating] = useState(false)

    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const onSubmit = (data, e) => {
        e.preventDefault();
        setAutenticating(true);
        fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
                    setError(data.message);
                    setAutenticating(false);
                    return;
                }
                if (!data.token) {
                    setError('Invalid login response');
                    setAutenticating(false);
                    return;
                }
                setCookie("token", data.token);
                navigate("/dashboard");
            })
            .catch((error) => {
                setError(error.message);
                setAutenticating(false);
            });
    };

    return (
        <main className="flex items-center justify-center flex-grow">
                <div className="bg-stone-200 w-full p-6 m-auto rounded-md shadow-xl md:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                        Iniciar Sesión
                    {autenticating && <LoaderSpinner />}
                    </h1>
                    <form
                        action=""
                        className="mt-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {error && <span className="text-red-700">{error}</span>}
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
                                            "La contaseña debe tener al menos 6 caracteres",
                                    },
                                })}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                            {errors.password && (
                                <span className="text-red-700">
                                    {errors.password.message}
                                </span>
                            )}{" "}
                        </div>

                        <div className="mt-6">
                            <button
                                disabled={autenticating}
                                type="submit"
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </form>
                </div>
        </main>
    )
}
