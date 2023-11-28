import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MainTitle } from "../components"

// ESTE COMPONENTE MUESTRA UN JUEZ
export const OneJudgePage = () => {
    const { id, name } = useParams()

    const [games, setGames] = useState([])
    const [votes, setVotes] = useState([])

    useEffect(() => {
        const fetchVote = async () => {
            const responseJudgeVotes = await fetch(
                `http://localhost:3000/api/judges/judge/${id}`
            )
            const dataJudgeVotes = await responseJudgeVotes.json()

            const gamePromises = dataJudgeVotes.map(async (vote) => {
                if (vote.game) {
                    const responseGame = await fetch(
                        `http://localhost:3000/api/games/${vote.game}`
                    )
                    return responseGame.json()
                }
            })

            const gamesFetch = await Promise.all(gamePromises)
            setGames(gamesFetch)

            const votesPromises = dataJudgeVotes.map(async (vote) => {
                if (vote.game) {
                    const responseVote =
                        (vote.artPoints +
                            vote.gameplayPoints +
                            vote.soundPoints +
                            vote.themePoints) /
                        4

                    const idGameVote = vote.game

                    return { totalVotes: responseVote, gameId: idGameVote }
                }
            })

            const votesFetch = await Promise.all(votesPromises)
            setVotes(votesFetch)
        }

        fetchVote()
    }, [id])

    if (!games) {
        return <span className="text-3xl">Estoy cargando...</span>
    }

    return (
        <>
            <MainTitle title={`Voto del Juez ${name}`} />
            <div className="flex">
                {games.map((game) => {
                    const vote = votes.find((v) => v.gameId === game._id)
                    return (
                        <div
                            key={game._id}
                            className="text-center w-[50%] mx-auto"
                        >
                            <p className="text-3xl font-bold mb-2">
                                {game.name}
                            </p>
                            <p>Promedio Voto :{vote.totalVotes} </p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
