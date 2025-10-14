import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MainTitle } from "../components"
import LoaderSpinner from "../components/LoaderSpinner"

// ESTE COMPONENTE MUESTRA UN JUEZ
export const OneJudgePage = () => {
    const { name, judgeId } = useParams()

    const [votes, setVotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchVote = async () => {
            try {
                const responseJudgeVotes = await fetch(
                    `http://localhost:3000/api/judges/judge/${judgeId}`
                )

                if (!responseJudgeVotes.ok) {
                    throw new Error('Error al cargar los votos del juez')
                }

                const dataJudgeVotes = await responseJudgeVotes.json()
                console.log('Votes data:', dataJudgeVotes)
                setVotes(dataJudgeVotes)
            } catch (err) {
                console.error('Error fetching votes:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (judgeId) {
            fetchVote()
        }
    }, [judgeId])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        )
    }

    return (
        <>
            <MainTitle title={`Votos del Juez ${name}`} />
            <div className="container mx-auto px-4 py-8">
                {votes.length === 0 ? (
                    <p className="text-center text-gray-500 text-xl">
                        Este juez aún no ha votado por ningún juego.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {votes.map((vote) => {
                            const totalPoints =
                                vote.artPoints +
                                vote.gameplayPoints +
                                vote.soundPoints +
                                vote.themePoints
                            const averagePoints = (totalPoints / 4).toFixed(1)

                            return (
                                <div
                                    key={vote._id}
                                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                                        {vote.gameId?.name || 'Juego no encontrado'}
                                    </h3>
                                    <div className="space-y-2 mb-4">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Jugabilidad:</span> {vote.gameplayPoints}/10
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Arte:</span> {vote.artPoints}/10
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Sonido:</span> {vote.soundPoints}/10
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Temática:</span> {vote.themePoints}/10
                                        </p>
                                    </div>
                                    <div className="border-t pt-4">
                                        <p className="text-xl font-bold text-center">
                                            <span className="text-gray-600">Total:</span>{" "}
                                            <span className="text-blue-600">{totalPoints}/40</span>
                                        </p>
                                        <p className="text-lg text-center text-gray-600">
                                            Promedio: {averagePoints}/10
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}
