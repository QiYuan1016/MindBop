
// Supabase 初始化
const SUPABASE_URL = "https://btepmshcbkgjgmevhezp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZXBtc2hjYmtnamdtZXZoZXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTM4NTksImV4cCI6MjA3MTIyOTg1OX0.YuX_ZBkhJO5LHuXGZtamvHlE0M_MjhrWUr3TILiRZ5U";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 页面跳转函数
function goToPage(page) {
  window.location.href = page;
}

// 获取当前登录用户
function getCurrentUser() {
  return supabase.auth.user();
}

// 注册
async function registerUser(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) { alert(error.message); return null; }
  return user;
}

// 登录
async function loginUser(email, password) {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) { alert(error.message); return null; }
  return user;
}

// 获取用户积分
async function getPoints(userId) {
  const { data, error } = await supabase
    .from('points')
    .select('points')
    .eq('user_id', userId)
    .single();
  if (error) { console.log(error); return 0; }
  return data ? data.points : 0;
}

// 完成任务
async function completeTask(userId, taskName, score = 10) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ user_id: userId, task_name: taskName, status: 'completed', score }]);
  if (error) { alert(error.message); return; }
  // 更新积分
  const { data: pointData, error: pointError } = await supabase
    .from('points')
    .upsert({ user_id: userId, points: score }, { onConflict: 'user_id' });
  if (pointError) { console.log(pointError); }
  alert(`Task ${taskName} completed! +${score} pts`);
}

// 解锁成就
async function unlockAchievement(userId, achievementName) {
  await supabase.from('achievements').upsert({ user_id: userId, achievement_name: achievementName, stars: 1 }, { onConflict: ['user_id', 'achievement_name'] });
}

// 放置装饰品
async function placeDecoration(userId, itemName, size = 1) {
  await supabase.from('decorations').upsert({ user_id: userId, item_name: itemName, size }, { onConflict: ['user_id', 'item_name'] });
}

// 获取排行榜
async function getRanking() {
  const { data, error } = await supabase
    .from('points')
    .select('points, users(username)')
    .order('points', { ascending: false })
    .limit(20);
  if (error) { console.log(error); return []; }
  return data;
}


