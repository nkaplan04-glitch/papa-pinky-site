import { supabase } from './supabase';
import { toDateString } from './dates';

export async function loadSubmission(houseId, date) {
  const orderDate = toDateString(date);
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('house_id', houseId)
    .eq('order_date', orderDate)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function saveSubmission(houseId, date, submission) {
  const orderDate = toDateString(date);
  const row = {
    house_id: houseId,
    order_date: orderDate,
    lunch: submission.lunch,
    dinner: submission.dinner,
    lunch_time: submission.lunchTime,
    dinner_time: submission.dinnerTime,
    daily_headcount: submission.dailyHeadcount,
    notes: submission.notes || '',
    submitted_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('submissions')
    .upsert(row, { onConflict: 'house_id,order_date' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function loadSubmissionsForMonth(houseId, year, month) {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = new Date(year, month + 1, 0);
  const endStr = toDateString(endDate);

  const { data, error } = await supabase
    .from('submissions')
    .select('order_date')
    .eq('house_id', houseId)
    .gte('order_date', startDate)
    .lte('order_date', endStr);

  if (error) throw error;
  return (data || []).map((r) => r.order_date);
}

export async function loadHouseSubmissions(houseId) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('house_id', houseId);

  if (error) throw error;
  return data || [];
}

export async function loadAllSubmissions(date) {
  const orderDate = toDateString(date);
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('order_date', orderDate);

  if (error) throw error;

  const byHouse = {};
  for (const row of data) {
    byHouse[row.house_id] = {
      lunch: row.lunch,
      dinner: row.dinner,
      lunchTime: row.lunch_time,
      dinnerTime: row.dinner_time,
      dailyHeadcount: row.daily_headcount,
      notes: row.notes || '',
      submittedAt: row.submitted_at,
    };
  }
  return byHouse;
}

export async function loadAllHouses() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'house')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function deleteHouse(houseId) {
  const { error } = await supabase.rpc('delete_user_completely', { user_id: houseId });
  if (error) throw error;
}

// ===== MENU ITEMS =====

export async function loadMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function loadAllMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addMenuItem({ name, category, tags }) {
  const { data, error } = await supabase
    .from('menu_items')
    .insert({ name, category, tags })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMenuItem(id, updates) {
  const { error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMenuItem(id) {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ===== SUGGESTIONS =====

export async function loadSuggestions() {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*, profiles(house_name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function loadHouseSuggestions(houseId) {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('house_id', houseId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function submitSuggestion({ houseId, suggestionText, category }) {
  const { data, error } = await supabase
    .from('suggestions')
    .insert({
      house_id: houseId,
      suggestion_text: suggestionText,
      category,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSuggestionStatus(id, status) {
  const { error } = await supabase
    .from('suggestions')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function clearReviewedSuggestions() {
  const { error } = await supabase
    .from('suggestions')
    .delete()
    .in('status', ['approved', 'dismissed']);
  if (error) throw error;
}

// ===== SITE CONTENT =====

export async function loadSiteContent(key) {
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.content || null;
}

export async function saveSiteContent(key, content) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, content, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}
