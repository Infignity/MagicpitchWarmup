'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authContext";
type Props = {
    children: React.ReactNode;
  };
const RequireAuth: React.FC<Props> = ({ children }) => {
    const { token, login } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    return token ? <>{children}</> : null;
};

export default RequireAuth;
