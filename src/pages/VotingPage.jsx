import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MainTitle } from "../components"
import { useForm } from "react-hook-form"
import LoaderSpinner from "../components/LoaderSpinner"
import { showSuccessAlert, showErrorAlert } from "../utils/sweetAlertHelper"
import { useCookies } from "react-cookie"

export const VotingPage = () => {
    const { gameId } = useParams()
    const navigate = useNavigate()
    const [cookies] = useCookies(["token"])
    const [game, setGame] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener información del juego
                const gameResponse = await fetch(`http://localhost:3000/api/games/${gameId}`)
                if (!gameResponse.ok) throw new Error("No se pudo cargar el juego")
                const gameData = await gameResponse.json()
                setGame(gameData)

                // Obtener información del usuario
                const userResponse = await fetch("http://localhost:3000/api/auth/profile", {
                    credentials: "include",
                })
                if (userResponse.ok) {
                    const userData = await userResponse.json()
                    setUser(userData)

                    // Verificar que el usuario sea juez
                    if (userData.role !== 'juez') {
                        showErrorAlert('Acceso Denegado', 'Solo los jueces pueden votar')
                        navigate('/games')
                        return
                    }
                }
            } catch (error) {
                showErrorAlert('Error', error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [gameId, navigate])

    const onSubmit = async (data) => {
        setSubmitting(true)

        try {
            const voteData = {
                gameId: gameId,
                judgeId: user.id,
                gameplayPoints: parseInt(data.gameplayPoints),
                artPoints: parseInt(data.artPoints),
                soundPoints: parseInt(data.soundPoints),
                themePoints: parseInt(data.themePoints),
            }

            const response = await fetch("http://localhost:3000/api/judges/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(voteData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Error al enviar el voto")
            }

            showSuccessAlert('¡Voto Enviado!', 'Tu votación ha sido registrada correctamente').then(() => {
                navigate('/games')
            })
        } catch (error) {
            showErrorAlert('Error', error.message)
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderSpinner />
            </div>
        )
    }

    if (!game) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-red-600">Juego no encontrado</p>
            </div>
        )
    }

    return (
        <>
            <MainTitle title={`Votar: ${game.name}`} />
            <div className="flex justify-center items-center min-h-screen px-4">
                <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{game.name}</h2>
                        <p className="text-gray-600">Género: {game.genre}</p>
                        <p className="text-gray-600">Edición: {game.edition}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-lg font-semibold text-gray-800 mb-2">
                                Jugabilidad (1-10)
                            </label>
                            <input
                                type="number"
                                {...register("gameplayPoints", {
                                    required: "Este campo es requerido",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 10, message: "El máximo es 10" },
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.gameplayPoints && (
                                <p className="text-red-500 text-sm mt-1">{errors.gameplayPoints.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-800 mb-2">
                                Arte (1-10)
                            </label>
                            <input
                                type="number"
                                {...register("artPoints", {
                                    required: "Este campo es requerido",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 10, message: "El máximo es 10" },
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.artPoints && (
                                <p className="text-red-500 text-sm mt-1">{errors.artPoints.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-800 mb-2">
                                Sonido (1-10)
                            </label>
                            <input
                                type="number"
                                {...register("soundPoints", {
                                    required: "Este campo es requerido",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 10, message: "El máximo es 10" },
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.soundPoints && (
                                <p className="text-red-500 text-sm mt-1">{errors.soundPoints.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-800 mb-2">
                                Afinidad a la Temática (1-10)
                            </label>
                            <input
                                type="number"
                                {...register("themePoints", {
                                    required: "Este campo es requerido",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 10, message: "El máximo es 10" },
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.themePoints && (
                                <p className="text-red-500 text-sm mt-1">{errors.themePoints.message}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-600 disabled:bg-purple-400 transition-colors"
                            >
                                {submitting ? "Enviando..." : "Enviar Votación"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/games')}
                                className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
