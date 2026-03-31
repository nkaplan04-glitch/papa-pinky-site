import { supabase } from './supabase';

export async function register({ email, password, houseName, headcount }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        house_name: houseName,
        headcount: headcount,
        role: 'house',
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    houseName: profile.house_name,
    headcount: profile.headcount,
    role: profile.role,
    approved: profile.approved,
  };
}

export async function updateHeadcount(userId, headcount) {
  const { error } = await supabase
    .from('profiles')
    .update({ headcount })
    .eq('id', userId);
  if (error) throw error;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
