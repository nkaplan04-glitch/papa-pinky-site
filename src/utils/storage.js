import { supabase } from './supabase';

function getOrderDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export async function loadSubmission(houseId) {
  const orderDate = getOrderDate();
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('house_id', houseId)
    .eq('order_date', orderDate)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function saveSubmission(houseId, submission) {
  const orderDate = getOrderDate();
  const row = {
    house_id: houseId,
    order_date: orderDate,
    breakfast: submission.breakfast,
    lunch: submission.lunch,
    dinner: submission.dinner,
    breakfast_time: submission.breakfastTime,
    lunch_time: submission.lunchTime,
    dinner_time: submission.dinnerTime,
    daily_headcount: submission.dailyHeadcount,
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

export async function loadAllSubmissions() {
  const orderDate = getOrderDate();
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('order_date', orderDate);

  if (error) throw error;

  const byHouse = {};
  for (const row of data) {
    byHouse[row.house_id] = {
      breakfast: row.breakfast || [],
      lunch: row.lunch,
      dinner: row.dinner,
      breakfastTime: row.breakfast_time,
      lunchTime: row.lunch_time,
      dinnerTime: row.dinner_time,
      dailyHeadcount: row.daily_headcount,
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
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', houseId);
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
