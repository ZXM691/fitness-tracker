(function () {
	async function _getClientAndUser() {
		const client = window.FTAuth?.client;
		const user = await window.FTAuth?.getUser?.();
		return { client, user };
	}
	function _todayDate() {
		const d = new Date();
		return d.toISOString().slice(0, 10); // YYYY-MM-DD
	}
	// 读取今日训练（优先 Supabase，失败时回退空数组）
	async function getToday() {
		try {
			const { client, user } = await _getClientAndUser();
			if (!client || !user) return [];
			const today = _todayDate();
			const { data, error } = await client
				.from('workouts')
				.select('id, exercise_name, duration_minutes')
				.eq('user_id', user.id)
				.eq('workout_date', today)
				.order('created_at', { ascending: true });
			if (error) throw error;
			return (data || []).map(r => ({
				id: r.id,
				name: r.exercise_name,
				duration: Number(r.duration_minutes || 0)
			}));
		} catch (e) {
			console.warn('加载今日训练失败：', e);
			return [];
		}
	}
	// 添加训练（将简化表单映射到表字段）
	async function add(item) {
		const name = (item?.name || '').trim();
		const duration = Number(item?.duration) || null;
		if (!name) return null;
		const { client, user } = await _getClientAndUser();
		if (!client || !user) {
			alert('未登录，无法保存到云端');
			return null;
		}
		const row = {
			user_id: user.id,
			exercise_name: name,
			sets: 1,
			reps: 0,
			weight: 0,
			duration_minutes: duration,
			workout_date: _todayDate()
		};
		const { data, error } = await client.from('workouts').insert(row).select().single();
		if (error) {
			alert('保存训练失败：' + error.message);
			return null;
		}
		return {
			id: data.id,
			name: data.exercise_name,
			duration: Number(data.duration_minutes || 0)
		};
	}
	window.FTWorkouts = { getToday, add };
})();


