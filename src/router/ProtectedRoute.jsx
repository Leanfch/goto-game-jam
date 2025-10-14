import { Navigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useState, useEffect } from "react"
import LoaderSpinner from "../components/LoaderSpinner"

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [cookies] = useCookies(["token"])
    const [userRole, setUserRole] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!cookies.token) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch("http://localhost:3000/api/auth/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })

                if (!response.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }

                const data = await response.json()
                setUserRole(data.role)
            } catch (err) {
                console.error("Error fetching user profile:", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [cookies.token])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderSpinner />
            </div>
        )
    }

    if (!cookies.token || error) {
        return <Navigate to="/auth/login" replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-red-100 rounded-lg">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">
                        Acceso Denegado
                    </h2>
                    <p className="text-red-600 mb-4">
                        No tienes permisos para acceder a esta página.
                    </p>
                    <p className="text-sm text-gray-600">
                        Tu rol actual: <strong>{userRole}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        Roles permitidos: <strong>{allowedRoles.join(", ")}</strong>
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Volver
                    </button>
                </div>
            </div>
        )
    }

    return children
}
