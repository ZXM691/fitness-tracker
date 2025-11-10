// 替换为你自己的 Supabase 项目信息
const SUPABASE_URL = 'https://iphtwnxrvpjocmapakkt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwaHR3bnhydnBqb2NtYXBha2t0Iiwicm9sZSIsInNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc1ODA3NCwiZXhwIjoyMDc4MzM0MDc0fQ.1OqVM-MRDoTyoXoXRJc1lTr3loisTO6Bm7kI9oAewGc';

(function () {
	// 需要在页面中通过 <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> 引入
	if (typeof window.supabase === 'undefined') {
		console.warn('Supabase SDK 未加载。请在 HTML 中引入 @supabase/supabase-js。');
	}
	const client = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

	async function signUp(email, password, fullName) {
		if (!client) {
			alert('Supabase SDK 未加载');
			return;
		}
		if (!email || !password) {
			alert('请输入邮箱与密码');
			return;
		}
		const { data, error } = await client.auth.signUp({ email, password });
		if (error) {
			alert('注册失败：' + error.message);
			return;
		}
		// 创建用户资料（若已拿到 user.id）
		try {
			const userId = data?.user?.id;
			if (userId && fullName) {
				await client.from('user_profiles').insert({
					user_id: userId,
					full_name: fullName
				});
			}
		} catch (e) {
			console.warn('创建用户资料失败：', e);
		}
		// 如果开启邮箱确认，则需要用户前往邮箱确认
		alert('注册成功。若开启邮箱验证，请前往邮箱完成确认。');
		return data;
	}

	async function signIn(email, password) {
		if (!client) {
			alert('Supabase SDK 未加载');
			return;
		}
		if (!email || !password) {
			alert('请输入邮箱与密码');
			return;
		}
		const { data, error } = await client.auth.signInWithPassword({ email, password });
		if (error) {
			alert('登录失败：' + error.message);
			return;
		}
		alert('登录成功');
		return data;
	}

	async function signOut() {
		if (!client) return;
		await client.auth.signOut();
		alert('已退出登录');
	}

	async function getUser() {
		if (!client) return null;
		const { data } = await client.auth.getUser();
		return data?.user || null;
	}

	window.FTAuth = { signUp, signIn, signOut, getUser, client };
})();
