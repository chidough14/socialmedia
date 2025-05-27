import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabase-client";

interface AuthContextType {
  user: User | null
  signInWithGithub: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const insertProfileIfNew = async (user: User) => {
  const { data } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!data) {
    const { error: insertError } = await supabase.from("profiles").insert({
      name: user.user_metadata?.full_name,
      avatar: user.user_metadata?.avatar_url || null,
      email: user.email,
      user_id: user.id
    });

    if (insertError) {
      console.error("Error inserting profile:", insertError);
    }
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const hasInserted = useRef(false)

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setUser(session?.user ?? null)
    })

    const {data: listener} = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user && !hasInserted.current) {
        insertProfileIfNew(session.user);
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithGithub = () => {
    // supabase.auth.signInWithOAuth({ provider: "github" })
    supabase.auth.signInWithOAuth({ provider: "google" })
  }

  const signOut = () => {
    supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGithub, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider")
  }

  return context
}