import {createContext, useState, type ReactNode, useContext, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import type {AuthenticatedUserDetails} from "../types/User.ts";
import {fetchUserDetails} from "../Utils/api.ts";

interface AuthContextType {
    token: string | null;
    user: AuthenticatedUserDetails | null;
    login: (token: string) => void;
    isAuthenticated: boolean;
    logout: () => void;
    updateCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<AuthenticatedUserDetails | null>(null);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
    };
    const updateCurrentUser = () => {
        fetchUserDetails().then(data => setUser(data));
    };
    useEffect(() => {
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const expirationTime = decoded.exp * 1000;
                const currentTime = Date.now();

                if (expirationTime < currentTime) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    logout();
                } else {
                    fetchUserDetails().then(data => setUser(data));
                    const remainingTime = expirationTime - currentTime;
                    const timer = setTimeout(() => {
                        alert("Wylogowano");
                        logout();
                    }, remainingTime);
                    return () => clearTimeout(timer);
                }
            } catch (error) {
                logout();
            }
        }
    }, [token]);
    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{token, login, logout, isAuthenticated, user,
            updateCurrentUser}}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth musi być używane wewnątrz AuthProvider");
    }
    return context;
};

