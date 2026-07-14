import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { refreshAccessToken } from "#/api/auth";
import { setStoredAccessToken } from "#/lib/authToken";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: { id: string; email: string; name: string } | null;
  setUser: (user: AuthContextType["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  //para manter o usuário logado mesmo quando tem refresh do navegador
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const { newAccessToken: newToken, user } = await refreshAccessToken();
        // console.log(`refresh token ${newToken}`);
        setAccessToken(newToken);
        setUser(user);
        setStoredAccessToken(newToken);
      } catch (error: any) {
        console.log("Failed to refresh access token", error);
      }
    };

    loadAuth();
  }, []);

  //para quando o access token muda
  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a provider");
  return context;
};
