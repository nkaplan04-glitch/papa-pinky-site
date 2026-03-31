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
