import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useCookies } from "react-cookie"

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
    })
    const [setCookie] = useCookies(["token"])

    const [autenticating] = useState(false)

    const navigate = useNavigate()

    const onSubmit = (data, e) => {
        e.preventDefault()
        try {
            fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                // Convertimos la respuesta a JSON
                .then((response) => response.json())
                .then((data) => {
                    setCookie("token", data.token)

                    navigate("/")

                    console.log(data)
                })
        } catch {
            console.log("Hubo un ERRRORRRRR")
        }
    }

    return (
        <>
            <div className="bg-slate-700 relative flex flex-col justify-center min-h-[75vh] overflow-hidden">
                <div className="bg-stone-100 w-full p-6 m-auto rounded-md shadow-xl lg:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                        Iniciar Sesion
                    </h1>
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
            </div>
        </>
    )
}
