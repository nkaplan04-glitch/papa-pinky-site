import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function createHouseAccount({ email, password, houseName, headcount, mealPlan }) {
  const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await tempClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        house_name: houseName,
        headcount: headcount,
        role: 'house',
        meal_plan: mealPlan || 'bld_semester',
      },
    },
  });
  if (error) throw error;

  if (data.user) {
    const { error: approveError } = await supabase
      .from('profiles')
      .update({ approved: true, meal_plan: mealPlan || 'bld_semester' })
      .eq('id', data.user.id);
    if (approveError) throw approveError;
  }

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
    mealPlan: profile.meal_plan || 'bld_semester',
  };
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
