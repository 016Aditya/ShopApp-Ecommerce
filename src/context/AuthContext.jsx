import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Shared security states across the app
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Bootstrapping phase: check if user token exists
        const token = localStorage.getItem('token');
        
        if (token) {
            // Future phase: Parse JWT payload or call backend validation profile endpoint
            // setUser(parsedUser);
            setLoading(false);
        } else {
            // PROTOTYPING FALLBACK: Inject a temporary mock user matching UserDto.Response
            // This lets you develop Cart/Orders smoothly right now without real auth filters!
            setUser({
                id: "test_user_mongodb_123",
                firstName: "Guest",
                lastName: "Developer",
                email: "test@domain.com",
                role: "USER"
            });
            setLoading(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated: !!user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);