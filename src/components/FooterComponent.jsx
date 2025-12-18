export const FooterComponent = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white mt-auto border-t border-purple-800/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-gray-300 font-medium">
                            Final - Aplicaciones Híbridas - 2023
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Desarrollado por Leandro Fernandez - DW4NBV
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <img src="/gamejam.jpeg" alt="Game Jam ON" className="h-auto w-12" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
