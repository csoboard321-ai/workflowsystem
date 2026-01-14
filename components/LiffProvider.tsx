"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import liff from "@line/liff";

interface LiffContextType {
    liffObject: typeof liff | null;
    isLoggedIn: boolean;
    profile: {
        userId: string;
        displayName: string;
        pictureUrl?: string;
    } | null;
    error: string | null;
}

const LiffContext = createContext<LiffContextType>({
    liffObject: null,
    isLoggedIn: false,
    profile: null,
    error: null,
});

export const useLiff = () => useContext(LiffContext);

export default function LiffProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState<LiffContextType["profile"]>(null);

    useEffect(() => {
        const initLiff = async () => {
            try {
                const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
                if (!liffId) {
                    console.warn("NEXT_PUBLIC_LIFF_ID is not set in .env.local");
                    return;
                }

                await liff.init({ liffId });
                setLiffObject(liff);

                if (liff.isLoggedIn()) {
                    setIsLoggedIn(true);
                    const p = await liff.getProfile();
                    setProfile({
                        userId: p.userId,
                        displayName: p.displayName,
                        pictureUrl: p.pictureUrl,
                    });
                }
            } catch (e) {
                console.error("LIFF Init Error", e);
                setError(JSON.stringify(e));
            }
        };

        initLiff();
    }, []);

    return (
        <LiffContext.Provider value={{ liffObject, isLoggedIn, profile, error }}>
            {children}
        </LiffContext.Provider>
    );
}
