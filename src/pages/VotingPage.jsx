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
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <MainTitle title={`Votar: ${game.name}`} />

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                    {/* Header del juego */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-6">
                            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{game.name}</h2>
                        <div className="flex justify-center gap-4 text-sm">
                            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
                                {game.genre}
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                                Edición {game.edition}
                            </span>
                        </div>
                    </div>

                    {/* Formulario de votación */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Jugabilidad */}
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                            <label className="block text-lg font-bold text-gray-900 mb-3">
                                🎮 Jugabilidad
                            </label>
                            <p className="text-sm text-gray-600 mb-3">
                                Evalúa la mecánica, controles y diversión del juego
                            </p>
                            <input
                                type="number"
                                {...register("gameplayPoints", {
                                    required: "Este campo es requerido",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 10, message: "El máximo es 10" },
                                })}
                                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-lg font-semibold text-center"
                                placeholder="1-10"
                            />
                            {errors.gameplayPoints && (
                                <p className="text-red-600 text-sm mt-2">{errors.gameplayPoints.message}</p>
                            )}
                        </div>

                        {/* Arte */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                            <label className="block text-lg font-bold text-gray-900 mb-3">
                                🎨 Arte Visual
                            </label>
                            <p className="text-sm text-gray-600 mb-3">
                                Califica los gráficos, estilo artístico y diseño visual
                            </p>
                            <input
                                type="number"
                                {...register("artPoints", {
                                    required: "Este campo es requerido",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 10, message: "El máximo es 10" },
                                })}
                                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg font-semibold text-center"
                                placeholder="1-10"
                            />
                            {errors.artPoints && (
                                <p className="text-red-600 text-sm mt-2">{errors.artPoints.message}</p>
                            )}
                        </div>

                        {/* Sonido */}
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                            <label className="block text-lg font-bold text-gray-900 mb-3">
                                🔊 Diseño de Sonido
                            </label>
                            <p className="text-sm text-gray-600 mb-3">
                                Valora la música, efectos de sonido y audio general
                            </p>
                            <input
                                type="number"
                                {...register("soundPoints", {
                                    required: "Este campo es requerido",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 10, message: "El máximo es 10" },
                                })}
                                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-lg font-semibold text-center"
                                placeholder="1-10"
                            />
                            {errors.soundPoints && (
                                <p className="text-red-600 text-sm mt-2">{errors.soundPoints.message}</p>
                            )}
                        </div>

                        {/* Temática */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                            <label className="block text-lg font-bold text-gray-900 mb-3">
                                💡 Afinidad a la Temática
                            </label>
                            <p className="text-sm text-gray-600 mb-3">
                                Evalúa qué tan bien se adapta al tema de la Game Jam
                            </p>
                            <input
                                type="number"
                                {...register("themePoints", {
                                    required: "Este campo es requerido",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 10, message: "El máximo es 10" },
                                })}
                                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg font-semibold text-center"
                                placeholder="1-10"
                            />
                            {errors.themePoints && (
                                <p className="text-red-600 text-sm mt-2">{errors.themePoints.message}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-lg"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Enviar Votación
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/games')}
                                className="px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
