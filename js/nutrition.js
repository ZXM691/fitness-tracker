(function () {
	const STORAGE_KEY = 'ft_meals';
	function _load() {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	}
	function _save(all) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
	}
	function _todayKey() {
		const d = new Date();
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		return `${yyyy}-${mm}-${dd}`;
	}
	function getToday() {
		const all = _load();
		return all[_todayKey()] || [];
	}
	function add(item) {
		const all = _load();
		const key = _todayKey();
		all[key] = all[key] || [];
		all[key].push({
			name: item.name,
			calories: Number(item.calories) || 0
		});
		_save(all);
	}
	window.FTNutrition = { getToday, add };
})();


