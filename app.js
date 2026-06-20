const STORAGE_KEY = "my-keep-lite-v3";

const foodDb = [
  { key: "胡辣汤", kcal: 280, unit: "碗" },
  { key: "烩面", kcal: 820, unit: "碗" },
  { key: "烧饼", kcal: 280, unit: "个" },
  { key: "水煎包", kcal: 120, unit: "个" },
  { key: "蒸面条", kcal: 560, unit: "份" },
  { key: "卤面", kcal: 620, unit: "份" },
  { key: "羊肉汤", kcal: 460, unit: "碗" },
  { key: "豆腐脑", kcal: 180, unit: "碗" },
  { key: "油条", kcal: 240, unit: "根" },
  { key: "包子", kcal: 210, unit: "个" },
  { key: "鸡蛋", kcal: 70, unit: "个" },
  { key: "粽子", kcal: 280, unit: "个" },
  { key: "米饭", kcal: 230, unit: "碗" },
  { key: "馒头", kcal: 220, unit: "个" },
  { key: "鸭腿", kcal: 260, unit: "只" },
  { key: "鸡腿", kcal: 230, unit: "只" },
  { key: "鸡爪", kcal: 75, unit: "个" },
  { key: "鸭肉", kcal: 240, unit: "份" },
  { key: "牛肉", kcal: 250, unit: "100g" },
  { key: "鸡胸", kcal: 165, unit: "100g" },
  { key: "鱼", kcal: 180, unit: "份" },
  { key: "青菜", kcal: 80, unit: "份" },
  { key: "西瓜", kcal: 1200, unit: "个" },
  { key: "苹果", kcal: 95, unit: "个" },
  { key: "香蕉", kcal: 110, unit: "根" },
  { key: "牛奶", kcal: 155, unit: "250ml" }
];

const muscleOrder = ["胸", "背", "腿", "肩臂", "核心"];
const planBook = {
  "胸": {
    lift: "高位推胸",
    key: "bench",
    accessories: ["蝴蝶机夹胸 3 组", "飞鸟 3 组", "卧推 3 组"]
  },
  "背": {
    lift: "高位下拉",
    key: "row",
    accessories: ["划船 4 组", "引体向上 3 组"]
  },
  "腿": {
    lift: "深蹲",
    key: "squat",
    accessories: ["腿屈伸 4 组", "夹腿机内收/外展 各 3 组"]
  },
  "肩臂": {
    lift: "肱二弯举",
    key: "",
    accessories: ["轻重量热身 1 组", "最后一组做到还剩 1-2 次力竭余量"]
  },
  "核心": {
    lift: "坐姿卷腹机",
    key: "",
    accessories: ["平板支撑 3 组", "动作慢一点，顶峰收缩停 1 秒"]
  }
};

const exerciseCatalog = [
  { id: "chest-press", name: "高位推胸", muscle: "胸", icon: "chestPress", profileKey: "bench", sets: 4, reps: 10, duration: 35 },
  { id: "pec-deck", name: "蝴蝶机夹胸", muscle: "胸", icon: "pecDeck", sets: 3, reps: 12, duration: 25 },
  { id: "fly", name: "飞鸟", muscle: "胸", icon: "fly", sets: 3, reps: 12, duration: 25 },
  { id: "bench", name: "卧推", muscle: "胸", icon: "bench", profileKey: "bench", sets: 4, reps: 10, duration: 45 },
  { id: "pulldown", name: "高位下拉", muscle: "背", icon: "pulldown", profileKey: "row", ratio: 0.9, sets: 4, reps: 12, duration: 30 },
  { id: "row", name: "划船", muscle: "背", icon: "row", profileKey: "row", sets: 4, reps: 10, duration: 35 },
  { id: "pullup", name: "引体向上", muscle: "背", icon: "pullup", sets: 4, reps: 6, duration: 35 },
  { id: "biceps-curl", name: "肱二弯举", muscle: "肩臂", icon: "curlMachine", sets: 3, reps: 12, duration: 25 },
  { id: "ab-crunch", name: "坐姿卷腹机", muscle: "核心", icon: "abCrunch", sets: 4, reps: 12, duration: 25 },
  { id: "hip-machine", name: "夹腿机", muscle: "腿", icon: "hipMachine", sets: 3, reps: 15, duration: 25 },
  { id: "leg-extension", name: "腿屈伸", muscle: "腿", icon: "legExtension", sets: 4, reps: 12, duration: 30 },
  { id: "squat", name: "深蹲", muscle: "腿", icon: "squat", profileKey: "squat", sets: 4, reps: 8, duration: 45 },
  { id: "legpress", name: "腿举", muscle: "腿", icon: "legExtension", profileKey: "squat", ratio: 1.5, sets: 4, reps: 12, duration: 35 }
];

let state = loadState();
let currentPhotoData = "";
let activeExerciseFilter = "全部";
let selectedExercise = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profile: null, workouts: [], cardios: [], swims: [], foods: [] };
    const parsed = JSON.parse(raw);
    return {
      profile: parsed.profile || null,
      workouts: parsed.workouts || [],
      cardios: parsed.cardios || [],
      swims: parsed.swims || [],
      foods: parsed.foods || []
    };
  } catch {
    return { profile: null, workouts: [], cardios: [], swims: [], foods: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayISO() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10);
}

function dateFromISO(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysBetween(later, earlier) {
  const a = dateFromISO(later);
  const b = dateFromISO(earlier);
  return Math.round((a - b) / 86400000);
}

function formatDate(value) {
  const date = dateFromISO(value);
  return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric", weekday: "short" });
}

function startOfWeekISO() {
  const now = dateFromISO(todayISO());
  const day = now.getDay() || 7;
  now.setDate(now.getDate() - day + 1);
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10);
}

function inCurrentWeek(record) {
  return record.date >= startOfWeekISO() && record.date <= todayISO();
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundHalf(value) {
  return Math.max(0, Math.round(value * 2) / 2);
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("is-visible");
  window.setTimeout(() => el.classList.remove("is-visible"), 1800);
}

function initDates() {
  $$('input[type="date"]').forEach((input) => {
    if (!input.value) input.value = todayISO();
  });
}

function initTabs() {
  $$(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      $$(".nav-button").forEach((item) => item.classList.toggle("is-active", item === button));
      $$(".view").forEach((section) => section.classList.toggle("is-active", section.id === `view-${view}`));
    });
  });
}

function exerciseIcon(type) {
  const common = 'viewBox="0 0 96 96" aria-hidden="true" focusable="false"';
  const icons = {
    bench: `<svg ${common}><path d="M19 66h58" /><path d="M28 66l9-25h31l8 25" /><path d="M18 36h60" /><path d="M24 30v12M72 30v12" /><path d="M39 41l-9 14h32" /></svg>`,
    chestPress: `<svg ${common}><path d="M22 66h52" /><path d="M30 66V34h22l14 14" /><path d="M52 48h25" /><path d="M63 39v18" /><circle cx="40" cy="26" r="6" /><path d="M39 34l-9 16" /></svg>`,
    pecDeck: `<svg ${common}><path d="M24 72h48" /><path d="M34 72V34h28v38" /><path d="M34 42L19 29" /><path d="M62 42l15-13" /><path d="M29 49h38" /><circle cx="48" cy="25" r="6" /></svg>`,
    fly: `<svg ${common}><path d="M24 68h48" /><circle cx="48" cy="27" r="6" /><path d="M48 35v24" /><path d="M48 43L25 34" /><path d="M48 43l23-9" /><path d="M25 34l-5-8" /><path d="M71 34l5-8" /></svg>`,
    pullup: `<svg ${common}><path d="M20 22h56" /><path d="M31 22v13M65 22v13" /><path d="M35 44c8-9 18-9 26 0" /><path d="M48 43v30" /><path d="M48 55l-15 12M48 55l15 12" /></svg>`,
    squat: `<svg ${common}><path d="M26 28h44" /><path d="M36 28l-8 31h23" /><path d="M56 59l15 15" /><path d="M44 35l18 18" /><circle cx="40" cy="20" r="6" /></svg>`,
    deadlift: `<svg ${common}><path d="M15 70h66" /><path d="M24 62v16M72 62v16" /><path d="M32 38h32" /><path d="M39 38l-7 23h32l-7-23" /><circle cx="48" cy="26" r="6" /></svg>`,
    row: `<svg ${common}><path d="M20 67h58" /><path d="M30 52h32" /><path d="M37 32l-12 20h40" /><path d="M58 34l14 13" /><circle cx="40" cy="24" r="6" /></svg>`,
    pulldown: `<svg ${common}><path d="M25 22h46" /><path d="M48 22v38" /><path d="M34 40l14 20 14-20" /><path d="M34 72h28" /><circle cx="48" cy="50" r="6" /></svg>`,
    shoulder: `<svg ${common}><path d="M30 29h36" /><path d="M34 29v17M62 29v17" /><path d="M37 55h22" /><path d="M48 42v34" /><path d="M48 55l-14 13M48 55l14 13" /><circle cx="48" cy="33" r="6" /></svg>`,
    dumbbell: `<svg ${common}><path d="M28 48h40" /><path d="M20 38v20M28 34v28M68 34v28M76 38v20" /><circle cx="48" cy="48" r="6" /></svg>`,
    curlMachine: `<svg ${common}><path d="M27 72h42" /><path d="M36 72V38h24v34" /><path d="M34 48h28" /><path d="M33 57c10-10 20-10 30 0" /><circle cx="48" cy="28" r="6" /><path d="M63 57l10-11" /></svg>`,
    abCrunch: `<svg ${common}><path d="M25 72h46" /><path d="M34 72V44h27l10 17" /><path d="M42 44c4 14 13 22 27 24" /><path d="M35 38l-10-9" /><path d="M61 44l10-13" /><circle cx="45" cy="31" r="6" /></svg>`,
    hipMachine: `<svg ${common}><path d="M23 72h50" /><path d="M35 72V37h26v35" /><path d="M48 40v28" /><path d="M36 55H22" /><path d="M60 55h14" /><path d="M35 48l-12-9" /><path d="M61 48l12-9" /><circle cx="48" cy="29" r="6" /></svg>`,
    legExtension: `<svg ${common}><path d="M21 72h54" /><path d="M33 72V41h22l12 16" /><path d="M45 53h28" /><path d="M73 47v20" /><circle cx="43" cy="31" r="6" /><path d="M36 42l-10 14" /></svg>`,
    core: `<svg ${common}><path d="M27 62h42" /><path d="M34 62l8-26h19l8 26" /><path d="M42 36l-8-12M60 36l8-12" /><path d="M48 42v20" /><circle cx="51" cy="27" r="6" /></svg>`
  };
  return icons[type] || icons.dumbbell;
}

function recommendedMuscle() {
  if (!state.profile) return "";
  const decision = chooseTarget(state.profile);
  return decision.mode === "train" ? decision.target : "";
}

function renderExerciseFilters() {
  const filters = ["全部", ...muscleOrder];
  $("#exerciseFilters").innerHTML = filters
    .map(
      (filter) =>
        `<button class="filter-chip ${filter === activeExerciseFilter ? "is-active" : ""}" type="button" data-filter="${filter}">${filter}</button>`
    )
    .join("");
}

function renderExerciseGrid() {
  const grid = $("#exerciseGrid");
  if (!grid) return;
  const target = recommendedMuscle();
  const items = exerciseCatalog.filter((item) => activeExerciseFilter === "全部" || item.muscle === activeExerciseFilter);
  grid.innerHTML = items
    .map(
      (item) => `
        <button class="action-card" type="button" data-exercise-id="${item.id}">
          <span class="action-icon">${exerciseIcon(item.icon)}</span>
          <strong>${item.name}</strong>
          <small>${item.muscle}${item.muscle === target ? " · 今日建议" : ""}</small>
        </button>
      `
    )
    .join("");
}

function initExerciseLibrary() {
  renderExerciseFilters();
  renderExerciseGrid();

  $("#exerciseFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeExerciseFilter = button.dataset.filter;
    renderExerciseFilters();
    renderExerciseGrid();
  });

  $("#exerciseGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-exercise-id]");
    if (!button) return;
    const exercise = exerciseCatalog.find((item) => item.id === button.dataset.exerciseId);
    if (exercise) openWorkoutSheet(exercise);
  });

  $("#closeWorkoutSheet").addEventListener("click", closeWorkoutSheet);
  $("#workoutSheet").addEventListener("click", (event) => {
    if (event.target.id === "workoutSheet") closeWorkoutSheet();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeWorkoutSheet();
  });
}

function defaultExerciseWeight(exercise) {
  const previous = latestExerciseRecord(exercise.name);
  if (previous?.weight) return previous.weight;
  const profile = state.profile || {};
  const base = numberValue(profile[exercise.profileKey]);
  if (!base) return "";
  return roundHalf(base * (exercise.ratio || 1));
}

function openWorkoutSheet(exercise) {
  selectedExercise = exercise;
  const form = $("#actionWorkoutForm");
  form.reset();
  form.elements.date.value = todayISO();
  form.elements.exercise.value = exercise.name;
  form.elements.muscle.value = exercise.muscle;
  form.elements.weight.value = defaultExerciseWeight(exercise);
  form.elements.sets.value = exercise.sets;
  form.elements.reps.value = exercise.reps;
  form.elements.duration.value = exercise.duration;
  form.elements.effort.value = 6;
  $("#sheetExerciseIcon").innerHTML = exerciseIcon(exercise.icon);
  $("#sheetExerciseMuscle").textContent = exercise.muscle;
  $("#sheetExerciseName").textContent = exercise.name;
  $("#sheetExerciseHint").textContent = defaultExerciseWeight(exercise)
    ? "已按档案带入常用重量，可以直接改"
    : "没有档案重量，按今天实际情况填写";
  $("#workoutSheet").hidden = false;
  document.body.classList.add("sheet-open");
}

function closeWorkoutSheet() {
  $("#workoutSheet").hidden = true;
  document.body.classList.remove("sheet-open");
  selectedExercise = null;
}

function initProfileForm() {
  const form = $("#profileForm");
  if (state.profile) {
    Object.entries(state.profile).forEach(([key, value]) => {
      const input = form.elements[key];
      if (input) input.value = value;
    });
    setProfilePhotoPreview(state.profile.avatarImage || "", state.profile.avatar || "green");
  }

  $("#profilePhoto").addEventListener("change", handleProfilePhoto);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    state.profile = Object.fromEntries(data.entries());
    saveState();
    render();
    toast("档案已保存");
  });

  $("#profileBadge").addEventListener("click", () => {
    const profileTab = $('#tab-profile');
    profileTab?.click();
  });
}

function handleProfilePhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 240;
      const side = Math.min(image.width, image.height);
      const sx = Math.round((image.width - side) / 2);
      const sy = Math.round((image.height - side) / 2);
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      context.drawImage(image, sx, sy, side, side, 0, 0, size, size);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.72);
      $("#profileForm").elements.avatarImage.value = dataUrl;
      setProfilePhotoPreview(dataUrl, $("#profileForm").elements.avatar.value);
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function setProfilePhotoPreview(dataUrl, avatar = "green") {
  const preview = $("#profilePhotoPreview");
  preview.className = `avatar-preview ${avatarClass(avatar)}${dataUrl ? " has-photo" : ""}`;
  preview.style.backgroundImage = dataUrl ? `url("${dataUrl}")` : "";
}

function initRecordForms() {
  initExerciseLibrary();

  $("#actionWorkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    state.workouts.unshift({
      id: uid(),
      date: data.date,
      muscle: data.muscle,
      exercise: data.exercise.trim(),
      weight: numberValue(data.weight),
      sets: numberValue(data.sets),
      reps: numberValue(data.reps),
      duration: numberValue(data.duration),
      effort: numberValue(data.effort),
      createdAt: Date.now()
    });
    saveState();
    closeWorkoutSheet();
    initDates();
    render();
    toast(`${selectedExercise?.name || data.exercise} 已保存`);
  });

  $("#cardioForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    state.cardios.unshift({
      id: uid(),
      date: data.date,
      duration: numberValue(data.duration),
      incline: numberValue(data.incline),
      speed: numberValue(data.speed),
      intensity: data.intensity,
      createdAt: Date.now()
    });
    saveState();
    event.currentTarget.reset();
    initDates();
    event.currentTarget.elements.duration.value = 30;
    event.currentTarget.elements.incline.value = 15;
    event.currentTarget.elements.speed.value = 4.5;
    event.currentTarget.elements.intensity.value = "中等";
    render();
    toast("爬坡已保存");
  });

  $("#swimForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    state.swims.unshift({
      id: uid(),
      date: data.date,
      duration: numberValue(data.duration),
      distance: numberValue(data.distance),
      intensity: data.intensity,
      createdAt: Date.now()
    });
    saveState();
    event.currentTarget.reset();
    initDates();
    render();
    toast("游泳已保存");
  });

  const foodForm = $("#foodForm");
  foodForm.elements.name.addEventListener("input", updateFoodEstimate);
  foodForm.elements.portion.addEventListener("change", updateFoodEstimate);
  foodForm.elements.calories.addEventListener("input", () => {
    $("#foodEstimateLine").textContent = "已使用你手动输入的热量。";
  });

  foodForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(foodForm).entries());
    const estimated = estimateFood(data.name, data.portion);
    const calories = numberValue(data.calories) || estimated.total;
    state.foods.unshift({
      id: uid(),
      date: data.date,
      meal: data.meal,
      name: data.name.trim(),
      portion: numberValue(data.portion),
      calories,
      caloriesManual: Boolean(data.calories),
      photo: currentPhotoData,
      createdAt: Date.now()
    });
    saveState();
    foodForm.reset();
    currentPhotoData = "";
    $(".photo-box").classList.remove("has-image");
    $("#photoPreview").src = "";
    initDates();
    updateFoodEstimate();
    render();
    toast("饮食已保存");
  });

  $("#foodPhoto").addEventListener("change", handleFoodPhoto);
}

function updateFoodEstimate() {
  const form = $("#foodForm");
  const name = form.elements.name.value;
  const portion = form.elements.portion.value;
  const result = estimateFood(name, portion);
  if (!name.trim()) {
    $("#foodEstimateLine").textContent = "输入食物名后会按本地食物库估算。";
    return;
  }
  if (result.total > 0) {
    $("#foodEstimateLine").textContent = `估算 ${result.total} kcal：${result.matches.join("、")}`;
    if (!form.elements.calories.value) form.elements.calories.placeholder = result.total;
  } else {
    $("#foodEstimateLine").textContent = "本地食物库没匹配到，先手动填热量。";
  }
}

function estimateFood(name, portionValue) {
  const text = name.trim();
  const portion = numberValue(portionValue) || 1;
  if (!text) return { total: 0, matches: [] };

  const matches = [];
  let total = 0;
  foodDb.forEach((item) => {
    if (!text.includes(item.key)) return;
    const count = inferCount(text, item);
    const kcal = Math.round(item.kcal * count * portion);
    total += kcal;
    matches.push(`${item.key}${formatCount(count)} ${kcal}kcal`);
  });
  return { total, matches };
}

function inferCount(text, item) {
  const key = item.key;
  const index = text.indexOf(key);
  const before = text.slice(Math.max(0, index - 12), index);
  const after = text.slice(index + key.length, index + key.length + 8);

  const fraction = parseFraction(before);
  if (fraction) return fraction;

  const unitCount = parseMetricCount(before, item.unit);
  if (unitCount) return unitCount;

  const chineseBefore = parseChineseCountBefore(before);
  if (chineseBefore) return chineseBefore;

  const numericBefore = parseNumericCountBefore(before);
  if (numericBefore) return numericBefore;

  const fractionAfter = parseFractionAfter(after);
  if (fractionAfter) return fractionAfter;

  const chineseAfter = parseChineseCountAfter(after);
  if (chineseAfter) return chineseAfter;

  const numericAfter = parseNumericCountAfter(after);
  if (numericAfter) return numericAfter;
  return 1;
}

function parseFraction(text) {
  if (text.includes("1/4") || text.includes("四分之一")) return 0.25;
  if (text.includes("1/3") || text.includes("三分之一")) return 1 / 3;
  if (text.includes("3/4") || text.includes("四分之三")) return 0.75;
  if (text.includes("一半") || text.includes("半个") || text.includes("半份")) return 0.5;
  return 0;
}

function parseFractionAfter(text) {
  if (/^(1\/4|四分之一)/.test(text)) return 0.25;
  if (/^(1\/3|三分之一)/.test(text)) return 1 / 3;
  if (/^(3\/4|四分之三)/.test(text)) return 0.75;
  if (/^(一半|半个|半份)/.test(text)) return 0.5;
  return 0;
}

function parseMetricCount(text, unit) {
  const volume = text.match(/(\d+(?:\.\d+)?)\s*(毫升|ml|mL|ML)$/);
  if (volume && unit === "250ml") return Number(volume[1]) / 250;

  const weight = text.match(/(\d+(?:\.\d+)?)\s*(克|g|G)$/);
  if (weight && unit === "100g") return Number(weight[1]) / 100;
  return 0;
}

function parseChineseCountBefore(text) {
  const patterns = [
    [/两(个|份|只|块|根|碗|盒)?$/, 2],
    [/二(个|份|只|块|根|碗|盒)?$/, 2],
    [/三(个|份|只|块|根|碗|盒)?$/, 3],
    [/四(个|份|只|块|根|碗|盒)?$/, 4],
    [/五(个|份|只|块|根|碗|盒)?$/, 5],
    [/一(个|份|只|块|根|碗|盒)?$/, 1]
  ];
  const match = patterns.find(([pattern]) => pattern.test(text));
  return match ? match[1] : 0;
}

function parseChineseCountAfter(text) {
  const patterns = [
    [/^两(个|份|只|块|根|碗|盒)?/, 2],
    [/^二(个|份|只|块|根|碗|盒)?/, 2],
    [/^三(个|份|只|块|根|碗|盒)?/, 3],
    [/^四(个|份|只|块|根|碗|盒)?/, 4],
    [/^五(个|份|只|块|根|碗|盒)?/, 5],
    [/^一(个|份|只|块|根|碗|盒)?/, 1]
  ];
  const match = patterns.find(([pattern]) => pattern.test(text));
  return match ? match[1] : 0;
}

function parseNumericCountBefore(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(个|份|只|块|根|碗|盒)$/);
  return match ? Number(match[1]) : 0;
}

function parseNumericCountAfter(text) {
  const match = text.match(/^(\d+(?:\.\d+)?)\s*(个|份|只|块|根|碗|盒)/);
  return match ? Number(match[1]) : 0;
}

function formatCount(count) {
  if (Math.abs(count - 1) < 0.01) return "";
  const rounded = Math.round(count * 100) / 100;
  return ` x${rounded}`;
}

function foodCalories(food) {
  if (food.caloriesManual) return numberValue(food.calories);
  const estimated = estimateFood(food.name || "", food.portion || 1).total;
  return estimated || numberValue(food.calories);
}

function handleFoodPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 520;
      const scale = Math.min(1, maxWidth / image.width);
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      currentPhotoData = canvas.toDataURL("image/jpeg", 0.58);
      $("#photoPreview").src = currentPhotoData;
      $(".photo-box").classList.add("has-image");
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function latestWorkout() {
  return [...state.workouts].sort((a, b) => {
    if (a.date === b.date) return (b.createdAt || 0) - (a.createdAt || 0);
    return b.date.localeCompare(a.date);
  })[0];
}

function latestExerciseRecord(exerciseName) {
  return [...state.workouts]
    .filter((workout) => workout.exercise === exerciseName && numberValue(workout.weight) > 0)
    .sort((a, b) => {
      if (a.date === b.date) return (b.createdAt || 0) - (a.createdAt || 0);
      return b.date.localeCompare(a.date);
    })[0];
}

function workoutLoad(workout) {
  if (!workout) return "normal";
  const volume = numberValue(workout.sets) * numberValue(workout.reps);
  if (numberValue(workout.effort) >= 8 || volume >= 90 || numberValue(workout.duration) >= 90) return "high";
  if (numberValue(workout.effort) <= 4 && numberValue(workout.duration) <= 45) return "low";
  return "normal";
}

function chooseTarget(profile) {
  const today = todayISO();
  const last = latestWorkout();
  const weekWorkouts = state.workouts.filter(inCurrentWeek);
  const weeklyLimit = numberValue(profile.daysPerWeek) || 4;

  if (last && daysBetween(today, last.date) === 0) {
    return { target: "恢复", reason: "今天已经有训练记录，剩下以拉伸、补水和早点睡为主。", mode: "done" };
  }

  if (last && daysBetween(today, last.date) === 1 && workoutLoad(last) === "high") {
    return { target: "恢复", reason: `昨天${last.muscle}练得偏多，今天建议休息或只做轻松游泳。`, mode: "rest" };
  }

  if (weekWorkouts.length >= weeklyLimit && (!last || daysBetween(today, last.date) <= 2)) {
    return { target: "恢复", reason: `本周已练 ${weekWorkouts.length} 次，接近你的每周目标。`, mode: "rest" };
  }

  const counts = Object.fromEntries(muscleOrder.map((muscle) => [muscle, 0]));
  weekWorkouts.forEach((workout) => {
    if (counts[workout.muscle] !== undefined) counts[workout.muscle] += 1;
  });

  const avoid = last && daysBetween(today, last.date) <= 2 ? last.muscle : "";
  const candidates = muscleOrder
    .filter((muscle) => muscle !== avoid)
    .sort((a, b) => counts[a] - counts[b] || muscleOrder.indexOf(a) - muscleOrder.indexOf(b));

  const target = candidates[0] || "腿";
  const reason = avoid ? `最近练过${avoid}，今天先换成${target}。` : `本周${target}训练较少，今天补这一块。`;
  return { target, reason, mode: "train" };
}

function buildRecommendation() {
  const profile = state.profile;
  if (!profile) {
    return {
      title: "先填写身体档案",
      status: "待初始化",
      items: [
        ["先做这一步", "去“档案”填身高、体重、目标和几个常用工作重量。"],
        ["今天也可以练", "爬坡 30 分钟，坡度 15，速度 4.5；力量训练先选轻重量熟悉动作。"]
      ]
    };
  }

  const decision = chooseTarget(profile);
  if (decision.mode === "done") {
    return {
      title: "今天已记录训练",
      status: "已完成",
      items: [
        ["后续安排", decision.reason],
        ["饮食重点", foodAdvice(profile.goal)]
      ]
    };
  }

  if (decision.mode === "rest") {
    return {
      title: "今天建议恢复",
      status: "恢复日",
      items: [
        ["恢复原因", decision.reason],
        ["可选活动", "轻松游泳 20-30 分钟，或散步拉伸；不要硬上大重量。"],
        ["饮食重点", foodAdvice(profile.goal)]
      ]
    };
  }

  const plan = planBook[decision.target];
  const weightLine = buildWeightLine(profile, plan);
  return {
    title: `今天练${decision.target}`,
    status: profile.goal || "训练",
    items: [
      ["为什么", decision.reason],
      ["先做力量", "先活动关节，再用轻重量热身 1-2 组；不要先爬坡 30 分钟把力气耗掉。"],
      ["主训练", `${plan.lift}：${weightLine}`],
      ["辅助动作", plan.accessories.join("；")],
      ["最后爬坡", "力量结束后爬坡，默认 30 分钟，坡度 15，速度 4.5；当天想加量可记 40 分钟。"],
      ["收尾判断", "如果最后一组还能轻松多做 3 次，下次同动作加 2.5kg；如果动作变形，下次减 5%-10%。"]
    ]
  };
}

function buildWeightLine(profile, plan) {
  const goal = profile.goal || "保持";
  const config = {
    "减脂": { ratio: 0.75, sets: "3-4 组", reps: "12-15 次" },
    "增肌": { ratio: 0.9, sets: "4 组", reps: "8-12 次" },
    "保持": { ratio: 0.85, sets: "3-4 组", reps: "10-12 次" }
  }[goal] || { ratio: 0.85, sets: "3-4 组", reps: "10-12 次" };

  const previous = latestExerciseRecord(plan.lift);
  const base = numberValue(previous?.weight) || numberValue(profile[plan.key]);
  if (!plan.key && !base) return `${config.sets}，每组 ${config.reps}，先用能稳定完成的重量试一轮。`;
  if (!base) return `${config.sets}，每组 ${config.reps}，重量选能稳定完成且动作不变形的档位。`;
  const target = roundHalf(base * config.ratio);
  const source = previous?.weight ? "按上次记录" : "按档案重量";
  return `${target}kg 左右，${config.sets}，每组 ${config.reps}（${source}）`;
}

function foodAdvice(goal) {
  if (goal === "减脂") return "每餐先保证蛋白质，主食别完全断，油炸和甜饮尽量少。";
  if (goal === "增肌") return "训练后补一份蛋白质和主食，别只吃菜。";
  return "保持蛋白质稳定，晚饭别过量，第二天体感会更稳。";
}

function renderPlan() {
  const plan = buildRecommendation();
  $("#planTitle").textContent = plan.title;
  $("#planStatus").textContent = plan.status;
  $("#planDetails").innerHTML = plan.items
    .map(([title, body]) => `<div class="plan-item"><strong>${title}</strong><span>${body}</span></div>`)
    .join("");
}

function renderMetrics() {
  const weekWorkouts = state.workouts.filter(inCurrentWeek);
  const weekCardios = state.cardios.filter(inCurrentWeek);
  const weekSwims = state.swims.filter(inCurrentWeek);
  const calories = state.foods
    .filter((food) => food.date === todayISO())
    .reduce((sum, food) => sum + foodCalories(food), 0);
  $("#weekWorkoutCount").textContent = weekWorkouts.length;
  $("#weekCardioCount").textContent = weekCardios.length + weekSwims.length;
  $("#todayCalories").textContent = Math.round(calories);
}

function allEntries() {
  const workouts = state.workouts.map((item) => ({
    type: "训练",
    date: item.date,
    createdAt: item.createdAt,
    title: `${item.muscle}：${item.exercise}`,
    detail: `${item.weight ? `${item.weight}kg ` : ""}${item.sets || "-"}组 x ${item.reps || "-"}次，${item.duration || "-"}分钟，疲劳 ${item.effort || "-"}`
  }));
  const swims = state.swims.map((item) => ({
    type: "游泳",
    date: item.date,
    createdAt: item.createdAt,
    title: `游泳 ${item.duration} 分钟`,
    detail: `${item.distance || "-"} 米，强度 ${item.intensity}`
  }));
  const cardios = state.cardios.map((item) => ({
    type: "有氧",
    date: item.date,
    createdAt: item.createdAt,
    title: `爬坡 ${item.duration} 分钟`,
    detail: `坡度 ${item.incline || "-"}，速度 ${item.speed || "-"}，强度 ${item.intensity || "-"}`
  }));
  const foods = state.foods.map((item) => ({
    type: "饮食",
    date: item.date,
    createdAt: item.createdAt,
    title: `${item.meal || "饮食"}：${item.name}`,
    detail: `${Math.round(foodCalories(item))} kcal${item.photo ? "，含照片" : ""}`
  }));
  return [...workouts, ...cardios, ...swims, ...foods].sort((a, b) => {
    if (a.date === b.date) return (b.createdAt || 0) - (a.createdAt || 0);
    return b.date.localeCompare(a.date);
  });
}

function renderTimeline(selector, entries) {
  const el = $(selector);
  if (!entries.length) {
    el.innerHTML = `<div class="timeline-empty">还没有记录。</div>`;
    return;
  }
  el.innerHTML = entries
    .map(
      (entry) => `
        <div class="entry">
          <div class="entry-date">${formatDate(entry.date)}<br>${entry.type}</div>
          <div>
            <p class="entry-title">${entry.title}</p>
            <p class="entry-detail">${entry.detail}</p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderMuscleBars() {
  const counts = Object.fromEntries(muscleOrder.map((muscle) => [muscle, 0]));
  state.workouts.filter(inCurrentWeek).forEach((workout) => {
    if (counts[workout.muscle] !== undefined) counts[workout.muscle] += 1;
  });
  const max = Math.max(1, ...Object.values(counts));
  $("#muscleBars").innerHTML = muscleOrder
    .map(
      (muscle) => `
        <div class="bar-row">
          <span>${muscle}</span>
          <div class="bar-track"><div class="bar-fill" style="width: ${(counts[muscle] / max) * 100}%"></div></div>
          <strong>${counts[muscle]}</strong>
        </div>
      `
    )
    .join("");
}

function renderTodayText() {
  $("#todayText").textContent = formatDate(todayISO());
}

function avatarClass(value) {
  return `avatar-${value || "green"}`;
}

function renderProfileBadge() {
  const profile = state.profile || {};
  const avatar = $("#profileAvatar");
  $("#profileName").textContent = profile.name?.trim() || "未命名";
  avatar.className = `mini-avatar ${avatarClass(profile.avatar)}${profile.avatarImage ? " has-photo" : ""}`;
  avatar.style.backgroundImage = profile.avatarImage ? `url("${profile.avatarImage}")` : "";
}

function render() {
  renderTodayText();
  renderProfileBadge();
  renderMetrics();
  renderPlan();
  renderExerciseGrid();
  const entries = allEntries();
  renderTimeline("#recentTimeline", entries.slice(0, 5));
  renderTimeline("#historyTimeline", entries);
  renderMuscleBars();
}

function initReset() {
  $("#resetDemoBtn").addEventListener("click", () => {
    const ok = window.confirm("确定清空本机所有记录吗？");
    if (!ok) return;
    state = { profile: null, workouts: [], cardios: [], swims: [], foods: [] };
    saveState();
    $("#profileForm").reset();
    $("#profileForm").elements.avatarImage.value = "";
    setProfilePhotoPreview("", "green");
    render();
    toast("已清空");
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

function boot() {
  initDates();
  initTabs();
  initProfileForm();
  initRecordForms();
  initReset();
  render();
  registerServiceWorker();
}

boot();
