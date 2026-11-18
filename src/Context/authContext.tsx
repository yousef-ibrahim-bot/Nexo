
import { createContext, useEffect, useState, type ReactNode } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  user: string;
}

export type AuthContextType = {
  Token: string | null;
  UserId: string;
  addDataToToken: (tkn: string) => void;
  removeToken: () => void;
};

export const CreatedAuthenticationContext = createContext<
  AuthContextType | undefined
>(undefined);

export default function AuthContext({ children }: { children: ReactNode }) {
  const [Token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token") || null;
  });

  const [UserId, setUserId] = useState<string>("");

  useEffect(() => {
    if (Token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(Token);
        setUserId(typeof decoded.user === "string" ? decoded.user : "");
      } catch {
        setUserId("");
      }
    } else {
      setUserId("");
    }
  }, [Token]);

  function addDataToToken(tkn: string) {
    setToken(tkn);
    localStorage.setItem("token", tkn);
  }

  function removeToken() {
    setToken(null);
    setUserId("");
    localStorage.removeItem("token");
  }

  return (
    <CreatedAuthenticationContext.Provider
      value={{
        Token,
        addDataToToken,
        removeToken,
        UserId,
      }}
    >
      {children}
    </CreatedAuthenticationContext.Provider>
  );
}
