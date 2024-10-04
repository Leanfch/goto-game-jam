import { useEffect, useRef, useState } from "react"
import { CookiesProvider, useCookies } from "react-cookie"
import { NavLink, Link } from "react-router-dom"

export const NavBar = () => {
    const [isOpenProfile, setIsOpenProfile] = useState(false)

    const dropdownRef = useRef(null)

    const toggleDropdownProfile = () => {
        setIsOpenProfile(!isOpenProfile)
    }

    const closeDropdownProfile = () => {
        setIsOpenProfile(false)
    }

    const [cookies] = useCookies(["token"])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                closeDropdownProfile()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    return (
        <nav className="bg-black">
            <div className="flex mx-auto justify-between px-10 py-3 font-bold text-white max-w-7xl">
                <div className="font-bold">
                    <img src="/gamejam.jpeg" alt="logo" className="w-20" />
                </div>
                <ul className="flex items-center space-x-10 text-xl">
                    <li>
                        <NavLink
                            className="hover:bg-green-700 hover:text-black transition-all hover:p-3 rounded-md"
                            to="/"
                        >
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="hover:bg-green-700 hover:text-black transition-all hover:p-3 rounded-md"
                            to="/games"
                        >
                            Juegos
                        </NavLink>
                    </li>
                    <CookiesProvider>
                        {cookies.token ? (
                            <>
                                <li>
                                    <NavLink
                                        className="hover:bg-green-700 hover:text-black transition-all hover:p-3 rounded-md"
                                        to="/judges"
                                    >
                                        Jueces
                                    </NavLink>
                                </li>

                                <div
                                    className="relative inline-block text-left"
                                    ref={dropdownRef}
                                >
                                    <div>
                                        <button
                                            onClick={toggleDropdownProfile}
                                            className=" flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300"
                                        >
                                            <img
                                                className="w-8 h-8 rounded-full"
                                                src="/default-avatar.png"
                                                alt="Avatar"
                                            />
                                        </button>
                                    </div>

                                    {isOpenProfile && (
                                        <div className="z-10 cursor-pointer origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                            <div
                                                className="py-1"
                                                role="menu"
                                                aria-orientation="vertical"
                                                aria-labelledby="options-menu"
                                            >
                                                <div
                                                    onClick={() => {
                                                        fetch(
                                                            "http://localhost:3000/api/auth/logout",
                                                            {
                                                                method: "POST",
                                                                credentials:
                                                                    "include",
                                                            }
                                                        ).then(() => {
                                                            document.cookie =
                                                                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                                                            window.location.href =
                                                                "/auth/login"
                                                        })
                                                    }}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                >
                                                    Salir
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link to="/auth/login">
                                <button className="mt-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                                    Ingresar
                                </button>
                            </Link>
                        )}
                    </CookiesProvider>
                </ul>
            </div>
        </nav>
    )
}
