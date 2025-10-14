import { MainTitle } from "../components"
import { Link } from "react-router-dom"

export const HomePage = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <MainTitle title="Game Jam ON" />

                {/* Hero Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-6">
                            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Donde la Creatividad se Convierte en Juego
                        </h2>
                    </div>

                    <div className="space-y-6 text-gray-700 leading-relaxed">
                        <p className="text-base md:text-lg">
                            Descubre el emocionante mundo de <span className="font-semibold text-purple-600">Game Jam ON</span>,
                            la competencia anual que desafía a equipos de talentosos desarrolladores a crear asombrosos videojuegos
                            en tan solo <span className="font-semibold">48 horas</span>. Nuestro escenario es el crisol de la innovación,
                            donde la imaginación cobra vida en forma de juegos únicos y cautivadores.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">Categorías de Evaluación</h3>
                                </div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                        Jugabilidad
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                        Arte Visual
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                        Diseño de Sonido
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                        Afinidad a la Temática
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">Jueces Expertos</h3>
                                </div>
                                <p className="text-sm">
                                    Profesionales de la industria evalúan cada proyecto con criterios rigurosos
                                    para garantizar una competencia justa y emocionante.
                                </p>
                            </div>
                        </div>

                        <p className="text-base md:text-lg">
                            ¡Prepárate para sumergirte en una experiencia donde la pasión por el desarrollo de videojuegos
                            se encuentra con la intensidad de la competencia! Únete a nosotros en esta emocionante jornada
                            donde la creatividad y la destreza se fusionan para dar vida a los juegos del mañana.
                        </p>

                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white text-center">
                            <p className="text-lg md:text-xl font-bold mb-2">
                                Game Jam ON
                            </p>
                            <p className="text-sm md:text-base opacity-90">
                                Donde cada línea de código cuenta y cada idea se convierte en diversión interactiva
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <Link
                            to="/games"
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 text-center"
                        >
                            Ver Juegos Participantes
                        </Link>
                        <Link
                            to="/judges"
                            className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg shadow-lg border-2 border-purple-600 hover:bg-purple-50 transition-all transform hover:scale-105 text-center"
                        >
                            Conocer a los Jueces
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
