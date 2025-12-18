import { useEffect, useRef, useState } from "react"
import { CookiesProvider, useCookies } from "react-cookie"
import { NavLink, Link } from "react-router-dom"

export const NavBar = () => {
    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
    const [userRole, setUserRole] = useState(null)

    const dropdownRef = useRef(null)
    const mobileMenuRef = useRef(null)

    const toggleDropdownProfile = () => {
        setIsOpenProfile(!isOpenProfile)
    }

    const closeDropdownProfile = () => {
        setIsOpenProfile(false)
    }

    const toggleMobileMenu = () => {
        setIsOpenMobileMenu(!isOpenMobileMenu)
    }

    const closeMobileMenu = () => {
        setIsOpenMobileMenu(false)
    }

    const [cookies, setCookie, removeCookie] = useCookies(["token"])

    // Obtener el rol del usuario
    useEffect(() => {
        if (cookies.token) {
            fetch("http://localhost:3000/api/auth/profile", {
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserRole(data.role)
                })
                .catch((error) => {
                    console.error("Error fetching user profile:", error)
                    setUserRole(null)
                })
        } else {
            // Si no hay token, limpiar el rol
            setUserRole(null)
        }
    }, [cookies.token])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                closeDropdownProfile()
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('.mobile-menu-button')
            ) {
                closeMobileMenu()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    const handleLogout = async () => {
        try {
            closeDropdownProfile()
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            })
            removeCookie("token", { path: "/" })
            setUserRole(null)
            setTimeout(() => {
                window.location.href = "/"
            }, 100)
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
            removeCookie("token", { path: "/" })
            setUserRole(null)
            setTimeout(() => {
                window.location.href = "/"
            }, 100)
        }
    }

    return (
        <nav className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img src="/gamejam.jpeg" alt="Game Jam ON" className="h-12 md:h-16 w-auto rounded-lg shadow-md" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex gap-3 items-center">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    isActive
                                        ? "bg-purple-600 text-white shadow-lg"
                                        : "text-gray-200 hover:bg-purple-700/50 hover:text-white"
                                }`
                            }
                        >
                            Inicio
                        </NavLink>
                        <NavLink
                            to="/games"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    isActive
                                        ? "bg-purple-600 text-white shadow-lg"
                                        : "text-gray-200 hover:bg-purple-700/50 hover:text-white"
                                }`
                            }
                        >
                            Juegos
                        </NavLink>

                        <CookiesProvider>
                            {cookies.token ? (
                                <>
                                    <NavLink
                                        to="/judges"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                isActive
                                                    ? "bg-purple-600 text-white shadow-lg"
                                                    : "text-gray-200 hover:bg-purple-700/50 hover:text-white"
                                            }`
                                        }
                                    >
                                        Jueces
                                    </NavLink>

                                    {userRole === 'admin' && (
                                        <NavLink
                                            to="/admin/create-user"
                                            className={({ isActive }) =>
                                                `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                    isActive
                                                        ? "bg-purple-600 text-white shadow-lg"
                                                        : "text-gray-200 hover:bg-purple-700/50 hover:text-white"
                                                }`
                                            }
                                        >
                                            Agregar Juez
                                        </NavLink>
                                    )}

                                    <div className="relative ml-6" ref={dropdownRef}>
                                        <button
                                            onClick={toggleDropdownProfile}
                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
                                        >
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                        </button>

                                        {isOpenProfile && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <Link to="/auth/login">
                                    <button className="ml-6 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                                        Ingresar
                                    </button>
                                </Link>
                            )}
                        </CookiesProvider>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-lg text-gray-200 hover:bg-purple-700/50 focus:outline-none transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpenMobileMenu ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpenMobileMenu && (
                    <div ref={mobileMenuRef} className="lg:hidden pb-4 space-y-2">
                        <NavLink
                            to="/"
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    isActive
                                        ? "bg-purple-600 text-white"
                                        : "text-gray-200 hover:bg-purple-700/50"
                                }`
                            }
                        >
                            Inicio
                        </NavLink>
                        <NavLink
                            to="/games"
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    isActive
                                        ? "bg-purple-600 text-white"
                                        : "text-gray-200 hover:bg-purple-700/50"
                                }`
                            }
                        >
                            Juegos
                        </NavLink>

                        <CookiesProvider>
                            {cookies.token ? (
                                <>
                                    <NavLink
                                        to="/judges"
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) =>
                                            `block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                isActive
                                                    ? "bg-purple-600 text-white"
                                                    : "text-gray-200 hover:bg-purple-700/50"
                                            }`
                                        }
                                    >
                                        Jueces
                                    </NavLink>

                                    {userRole === 'admin' && (
                                        <NavLink
                                            to="/admin/create-user"
                                            onClick={closeMobileMenu}
                                            className={({ isActive }) =>
                                                `block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                    isActive
                                                        ? "bg-purple-600 text-white"
                                                        : "text-gray-200 hover:bg-purple-700/50"
                                                }`
                                            }
                                        >
                                            Agregar Juez
                                        </NavLink>
                                    )}

                                    <button
                                        onClick={() => {
                                            closeMobileMenu()
                                            handleLogout()
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link to="/auth/login" onClick={closeMobileMenu}>
                                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                                        Ingresar
                                    </button>
                                </Link>
                            )}
                        </CookiesProvider>
                    </div>
                )}
            </div>
        </nav>
    )
}
