export const FooterComponent = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white mt-auto border-t border-purple-800/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-gray-300 font-medium">
                            &copy; 2023 Game Jam ON - Todos los derechos reservados
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Desarrollado por Leandro Fernandez - DW4NBV
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
