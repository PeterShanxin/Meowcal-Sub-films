export const CAST = [
  {name: '栗子', breed: '狸花猫', lang: 'zh-CN', label: '简体中文', fur: '#bc8150', dark: '#503e39', light: '#f3d8ae', eye: '#afdba5', sky: '#567d80', land: '#244e57', source: '新买的猫窝？我选纸箱。', translation: 'New bed? I choose the box.', prop: 'box'},
  {name: 'Momo', breed: '日本短尾猫', lang: 'ja-JP', label: '日本語', fur: '#f5e9d7', dark: '#31394c', light: '#f7eee2', eye: '#dcc377', sky: '#9994b9', land: '#5e6884', source: 'キーボードは、私のベッド。', translation: 'The keyboard is my bed.', prop: 'keyboard'},
  {name: 'Bori', breed: '韩国短毛猫', lang: 'ko-KR', label: '한국어', fur: '#da914d', dark: '#975333', light: '#f4ddbc', eye: '#8ab887', sky: '#698e99', land: '#345f71', source: '밥그릇이 비었어. 또.', translation: 'The bowl is empty. Again.', prop: 'bowl'},
  {name: 'Bean', breed: '英国短毛猫', lang: 'en-US', label: 'English', fur: '#8395ad', dark: '#50627a', light: '#c1ccda', eye: '#edbd66', sky: '#809896', land: '#3b5c64', source: 'New bed? I choose the box.', translation: '新猫窝？我选纸箱。', prop: 'box'},
  {name: 'Bleu', breed: '沙特尔猫', lang: 'fr-FR', label: 'Français', fur: '#637b91', dark: '#3a526e', light: '#a4b6c8', eye: '#ef9852', sky: '#b89496', land: '#755f7c', source: 'Ce rayon de soleil est à moi.', translation: '這束陽光是我的。', prop: 'sun'},
  {name: 'Fritz', breed: '德国卷毛猫', lang: 'de-DE', label: 'Deutsch', fur: '#ded0b0', dark: '#8a7968', light: '#f4e8d2', eye: '#9dbc8b', sky: '#849d95', land: '#466b68', source: 'Noch fünf Minuten schlafen.', translation: 'Five more minutes of sleep.', prop: 'pillow'},
] as const;

export const LANGUAGES = '简中 · 繁中 · 日本語 · 한국어 · English · Español · Français · Deutsch';
export const FONT = '"Segoe UI", "Microsoft YaHei", "Yu Gothic", "Malgun Gothic", sans-serif';
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (v: number) => {const p = clamp(v); return p * p * (3 - 2 * p);};
