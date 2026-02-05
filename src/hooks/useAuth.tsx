 import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
 import { Session, User } from "@supabase/supabase-js";
 import { supabase } from "@/integrations/supabase/client";

 interface AuthContextType {
  isAuthenticated: boolean;
   user: User | null;
   session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
   logout: () => Promise<void>;
  isLoading: boolean;
}

 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     // Set up auth state listener FIRST
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (_event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
       }
     );
 
     // THEN check for existing session
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       setIsLoading(false);
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const login = async (email: string, password: string): Promise<boolean> => {
     const { error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
     return !error;
   };
 
   const logout = async () => {
     await supabase.auth.signOut();
   };

  return (
    <AuthContext.Provider
      value={{
         isAuthenticated: !!session,
         session,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
