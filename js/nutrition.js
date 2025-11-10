(function () {
	async function _getClientAndUser() {
		const client = window.FTAuth?.client;
		const user = await window.FTAuth?.getUser?.();
		return { client, user };
	}
	function _todayDate() {
		return new Date().toISOString().slice(0, 10);
	}
	// 读取今日餐食
	async function getToday() {
		try {
			const { client, user } = await _getClientAndUser();
			if (!client || !user) return [];
			const today = _todayDate();
			const { data, error } = await client
				.from('nutrition')
				.select('id, food_name, calories')
				.eq('user_id', user.id)
				.eq('consumed_at', today)
				.order('created_at', { ascending: true });
			if (error) throw error;
			return (data || []).map(r => ({
				id: r.id,
				name: r.food_name,
				calories: Number(r.calories || 0)
			}));
		} catch (e) {
			console.warn('加载今日餐食失败：', e);
			return [];
		}
	}
	// 添加餐食（UI 只收集名称与卡路里，其他字段走默认）
	async function add(item) {
		const name = (item?.name || '').trim();
		const calories = Number(item?.calories) || 0;
		if (!name) return null;
		const { client, user } = await _getClientAndUser();
		if (!client || !user) {
			alert('未登录，无法保存到云端');
			return null;
		}
		const row = {
			user_id: user.id,
			food_name: name,
			calories,
			protein: null,
			carbs: null,
			fats: null,
			meal_type: 'snack',
			consumed_at: _todayDate()
		};
		const { data, error } = await client.from('nutrition').insert(row).select().single();
		if (error) {
			alert('保存餐食失败：' + error.message);
		 return null;
		}
		return {
			id: data.id,
			name: data.food_name,
			calories: Number(data.calories || 0)
		};
	}
	window.FTNutrition = { getToday, add };
})();


