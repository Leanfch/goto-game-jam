import { useState, useEffect } from "react"
import { MainTitle } from "../components"
import { useParams, Navigate } from "react-router-dom"
import { showSuccessAlert, showErrorAlert } from "../utils/sweetAlertHelper"

// ESTE COMPONENTE PERMITE ACTUALIZAR UN JUEGO
export const UpdateGamePage = () => {
    const { id } = useParams()

    const [gameData, setGameData] = useState({
        id: "",
        name: "",
        genre: "",
        edition: "",
        photo: "",
        members: "",
    })

    useEffect(() => {
        const fetchGames = async () => {
            const response = await fetch(
                `http://localhost:3000/api/games/${id}`
            )
            const data = await response.json()

            setGameData({
                id: id,
                name: data.name,
                genre: data.genre,
                edition: data.edition,
                photo: data.photo || "",
                members: Array.isArray(data.members) ? data.members.join(', ') : "",
            })
        }

        fetchGames()
    }, [id])

    const handleChange = (e) => {
        setGameData({ ...gameData, [e.target.name]: e.target.value })
    }

    const [shouldRedirect, setShouldRedirect] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Convertir members de string a array antes de enviar
        const dataToSend = {
            ...gameData,
            members: gameData.members ? gameData.members.split(',').map(m => m.trim()).filter(m => m !== '') : []
        }

        const response = await fetch(`http://localhost:3000/api/games`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // IMPORTANTE: Enviar cookies con JWT
            body: JSON.stringify(dataToSend),
        })

        if (response.ok) {
            showSuccessAlert('¡Éxito!', 'Juego actualizado correctamente').then(() => {
                setShouldRedirect(true)
            })
        } else {
            showErrorAlert('Error', 'No se pudo actualizar el juego')
        }
    }
    if (shouldRedirect) {
        return <Navigate to="/games" />
    }

    return (
        <main className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <MainTitle title="Modificar juego" />

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl mb-6">
                            <svg className="w-16 h-16 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Actualizar Información
                        </h2>
                        <p className="text-gray-600">
                            Modifica los detalles del juego
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre del Juego
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={gameData.name}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:bg-white transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 mb-2">
                                Género
                            </label>
                            <input
                                type="text"
                                id="genre"
                                name="genre"
                                value={gameData.genre}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:bg-white transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="edition" className="block text-sm font-semibold text-gray-700 mb-2">
                                Edición (Año)
                            </label>
                            <input
                                type="text"
                                id="edition"
                                name="edition"
                                value={gameData.edition}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:bg-white transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2">
                                URL de la Foto del Juego
                            </label>
                            <input
                                type="text"
                                id="photo"
                                name="photo"
                                value={gameData.photo}
                                onChange={handleChange}
                                placeholder="Ej: https://ejemplo.com/imagen.jpg"
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:bg-white transition-all outline-none"
                            />
                            <p className="text-gray-500 text-xs mt-1">Opcional: URL de la imagen del juego</p>
                        </div>

                        <div>
                            <label htmlFor="members" className="block text-sm font-semibold text-gray-700 mb-2">
                                Miembros del Equipo
                            </label>
                            <textarea
                                id="members"
                                name="members"
                                rows="3"
                                value={gameData.members}
                                onChange={handleChange}
                                placeholder="Ej: Juan Pérez, María García, Carlos López"
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:bg-white transition-all outline-none resize-none"
                            />
                            <p className="text-gray-500 text-xs mt-1">Opcional: Separar nombres con comas</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Actualizar Juego
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
