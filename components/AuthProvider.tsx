"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLiff } from "./LiffProvider";
import { User, getUsers, loginUser as apiLoginUser } from "../lib/api";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    loginWeb: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    authMethod: "LINE" | "WEB" | "GUEST";
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    loginWeb: async () => ({ success: false }),
    logout: () => { },
    isAuthenticated: false,
    authMethod: "GUEST",
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isLoggedIn: isLiffLoggedIn, profile: liffProfile } = useLiff();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authMethod, setAuthMethod] = useState<"LINE" | "WEB" | "GUEST">("GUEST");

    // Load web session from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("web_user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                setAuthMethod("WEB");
                setIsLoading(false);
            } catch (e) {
                localStorage.removeItem("web_user");
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    // Sync with LIFF
    useEffect(() => {
        if (isLiffLoggedIn && liffProfile) {
            setIsLoading(true);
            // Fetch full user details to get Role from Sheet
            getUsers().then((allUsers) => {
                const match = allUsers.find((u) => u.id === liffProfile.userId);
                if (match) {
                    setUser(match);
                } else {
                    // New user or not in sheet yet (Register logic in page.tsx handles creation, 
                    // but here we might just have basic profile)
                    setUser({
                        id: liffProfile.userId,
                        name: liffProfile.displayName,
                        nickName: liffProfile.displayName,
                        role: "No Role"
                    });
                }
                setAuthMethod("LINE");
            }).finally(() => setIsLoading(false));
        }
    }, [isLiffLoggedIn, liffProfile]);

    const loginWeb = async (username: string, password: string) => {
        setIsLoading(true);
        const result = await apiLoginUser(username, password);
        if (result.success && result.user) {
            setUser(result.user);
            setAuthMethod("WEB");
            localStorage.setItem("web_user", JSON.stringify(result.user));
        }
        setIsLoading(false);
        return result;
    };

    const logout = () => {
        setUser(null);
        setAuthMethod("GUEST");
        localStorage.removeItem("web_user");
        // If Line, we can't really "logout" from LIFF context easily without closing window, 
        // but we can clear local state. 
        // Actually LIFF logout is `liff.logout()`, but in LIFF browser it does nothing usually.
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading: isLoading && !user, // Only loading if we don't have a user yet
            loginWeb,
            logout,
            isAuthenticated: !!user,
            authMethod
        }}>
            {children}
        </AuthContext.Provider>
    );
}
