import {createContext, useState, type ReactNode, useContext, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
    };

    useEffect(() => {
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const expirationTime = decoded.exp * 1000;
                const currentTime = Date.now();

                if (expirationTime < currentTime) {
                    logout();
                } else {
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
        <AuthContext.Provider value={{token, login, logout, isAuthenticated}}>
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

