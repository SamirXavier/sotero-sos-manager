
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface AuthUser extends User {
  profile?: Profile;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Iniciando verificação de autenticação');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Sessão inicial:', session ? 'Existe' : 'Não existe');
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        console.log('useAuth: Nenhuma sessão encontrada, definindo loading como false');
        setLoading(false);
      }
    }).catch(error => {
      console.error('useAuth: Erro ao obter sessão:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Mudança de estado de auth:', event, session ? 'Sessão existe' : 'Sem sessão');
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      setUser({ ...authUser, profile: profile || undefined });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(authUser);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
};
