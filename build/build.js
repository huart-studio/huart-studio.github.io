// 휴아트 스튜디오 웹사이트 만들기: build/site.json(사업자 정보·게임 목록) + 아래 글 → 저장소 맨 위의 HTML
//   /            스튜디오 홈(게임 목록·사업자 정보)   /en/  영어
//   /idle-mandate/  천명: 삼국 방치 영웅전 소개       /idle-mandate/en/  영어
//   /privacy.html   개인정보처리방침(스튜디오의 모든 게임) /en/privacy.html  영어
// 새 게임을 추가하면 site.json의 games에 한 줄 넣고, 게임 소개 페이지는 아래 gamePage처럼 만들면 됩니다.
//   node build/build.js                  → 저장소 맨 위에 HTML을 다시 씀 (style.css·img/는 그대로 씀)
//   node build/build.js --preview <폴더>  → 미리보기용 (클로드 아티팩트 형식, 한국어 첫 페이지)
// 만든 뒤 커밋·푸시하면 GitHub Pages가 main 브랜치를 그대로 보여 줍니다. 다른 저장소가 필요 없습니다.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'site.json'), 'utf8'));

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const L = (v, lang) => (v && typeof v === 'object' ? v[lang] || v.ko || '' : v || '');
const YEAR = new Date().getFullYear();

// 장마다 대표 전장 그림 (img/zone-N.webp, N은 1부터)
const CHAPTER_ART = [3, 6, 9, 12, 15, 19, 22];
// 천명의 장·전장 이름 (게임의 ZONES와 영어 번역에서 옮겨 적음. 게임에서 바뀌면 여기도 고칠 것)
const CHAPTERS = {
  ko: [
    ['황건적의 난', ['탁현 들판', '청주성', '광종']],
    ['반동탁 연합', ['사수관', '호로관', '낙양']],
    ['군웅할거', ['계교', '완성', '하비성', '수춘']],
    ['관도대전', ['백마', '관도']],
    ['형주 쟁탈과 적벽', ['신야', '장판파', '적벽']],
    ['삼국정립', ['동관', '정군산', '번성', '이릉']],
    ['남정과 북벌', ['남만', '가정', '오장원']],
  ],
  en: [
    ['Yellow Turban Rebellion', ['Zhuo County Fields', 'Qingzhou Castle', 'Guangzong']],
    ['Coalition Against Dong Zhuo', ['Sishui Gate', 'Hulao Gate', 'Luoyang']],
    ['Rise of the Warlords', ['Jieqiao', 'Wancheng', 'Xiapi Castle', 'Shouchun']],
    ['Battle of Guandu', ['Baima', 'Guandu']],
    ['Jingzhou and Red Cliffs', ['Xinye', 'Changban', 'Red Cliffs']],
    ['Three Kingdoms Stand', ['Tong Pass', 'Mount Dingjun', 'Fancheng', 'Yiling']],
    ['Southern and Northern Campaigns', ['Nanman', 'Jieting', 'Wuzhang Plains']],
  ],
};

const T = {
  ko: {
    langName: '한국어', other: 'en', otherName: 'English', otherHref: 'en/',
    title: '천명: 삼국 방치 영웅전',
    desc: '나만의 장수로 황건적의 난부터 오장원까지 22개 전장을 평정하는 삼국지 방치형 RPG. 장수 60명을 모아 변신하세요.',
    eyebrow: '삼국지 방치형 RPG',
    h1: '켜 두면 싸우고, 돌아오면 강해져 있는 삼국지',
    lead: '나만의 장수를 만들어 황건적의 난부터 오장원의 마지막 결전까지 22개 전장을 평정하세요. 앱을 꺼 두어도 싸움은 계속됩니다.',
    soon: '출시 예정', now: '지금 받기',
    langs: '한국어 · English · 简体中文 · 日本語',
    routeEyebrow: '7장 · 22개 전장', routeH: '도원결의에서 오장원까지',
    routeLead: '삼국지 이야기 순서대로 전장이 열립니다. 전장마다 그 시대의 장수가 보스로 기다립니다.',
    chapter: n => `제${n}장`,
    routeNote: '무료 체험은 제2장 낙양(동탁)까지, 정식판은 22개 전장 모두 즐길 수 있습니다.',
    featEyebrow: '게임 특징', featH: '장수를 모으고, 변신하고, 천하를 차지하라',
    features: [
      ['guanyu', '나만의 장수', '이름과 직업(맹장·궁수·책사), 나라(위·촉·오·군웅)를 골라 캐릭터를 만듭니다. 레벨이 오를 때마다 능력치를 직접 나눕니다.'],
      ['caocao', '장수 60명으로 변신', '관우·조조·주유·여포… 장수카드를 착용하면 그 장수의 능력치와 특수기술로 싸웁니다. 전용 소환수와 무기카드까지 모으면 혼연일체.'],
      ['zhugeliang', '꺼 두어도 계속되는 싸움', '앱을 닫은 동안에도 사냥은 이어지고, 돌아오면 그동안 모은 골드와 장비를 한 번에 받습니다.'],
      ['lvbu', '매일 할 거리', '성 12곳을 공성하는 천하 점령, 주마다 바뀌는 토벌전, 연무장 상성 대결과 천하 명장록 순위.'],
      ['zhouyu', '영구 성장', '본진 건설, 전설의 보패 8종, 백성에서 승상까지 관직 승진, 관성대의 별자리, 그리고 천하통일로 이어지는 회차.'],
      ['zhaoyun', '보스와 직접 겨루기', '보스의 큰 공격을 제때 막으면 반격. 화면을 지나가는 황금 수레를 잡으면 보너스를 얻습니다.'],
    ],
    shotsEyebrow: '스크린샷', shotsH: '손안의 삼국지',
    shots: [['01-battle', '전장'], ['03-heroes', '장수카드'], ['05-conquest', '천하 점령'], ['06-observatory', '관성대']],
    dealH: '무료로 시작하고, 마음에 들면 한 번만 구매',
    dealLead: '제2장(낙양 동탁)까지 무료로 즐기고, 정식판을 한 번 구매하면 모든 전장과 콘텐츠가 열립니다. 진행은 그대로 이어집니다.',
    chips: ['<b>광고</b> 없음', '<b>가챠 과금</b> 없음', '<b>에너지 제한</b> 없음', '<b>4개 언어</b> 지원', '<b>오프라인</b> 플레이'],
    studioEyebrow: '개발사',
    studioLead: s => `${s}는 PC·모바일 게임과 유아·초등 교육 프로그램을 만드는 스튜디오입니다. 첫 작품 「천명: 삼국 방치 영웅전」을 Steam과 Google Play에 출시할 준비를 하고 있습니다. 문의와 버그 제보는 아래 이메일로 보내 주세요.`,
    homeEyebrow: '게임 · 교육 콘텐츠 스튜디오', homeTitle: s => `${s} 스튜디오`,
    homeLead: '오래 곁에 두고 즐길 수 있는 게임과, 유아·초등 아이들이 놀이하며 배우는 교육 프로그램을 만듭니다.',
    eduEyebrow: '교육 프로그램', eduH: '놀이하며 배우는 유아·초등 교육',
    eduLead: '아이들이 스스로 즐겁게 배울 수 있도록, 게임을 만들어 온 경험을 교육 프로그램에 담고 있습니다.',
    edu: [['🧸', '유아 (만 3~7세)', '그림과 소리로 익히는 놀이 학습', 'edu-kids.jpg'], ['🎒', '초등 (1~6학년)', '게임처럼 도전하며 쌓는 기초 학습', 'edu-school.jpg']],
    eduSoon: '준비 중', eduNote: '첫 교육 프로그램을 준비하고 있습니다. 새 소식은 이 페이지에서 알려 드립니다.',
    gamesEyebrow: '게임', gamesH: '우리가 만든 게임', more: '게임 소개 보기', nextGame: '다음 게임을 준비하고 있습니다', nextGameLead: '새 소식은 이 페이지에서 알려 드립니다.',
    madeBy: s => `개발 · ${s}`, contactH: '문의',
    info: { studio: '상호', owner: '대표자', biz: '사업자등록번호', mail: '통신판매업 신고번호', address: '주소', email: '이메일' },
    todo: '입력 필요',
    privacy: '개인정보처리방침',
    privacyTitle: '개인정보처리방침',
    privacyDate: d => `시행일: ${d}`,
    privacyIntro: s => `${s}가 만든 게임(현재 「천명: 삼국 방치 영웅전」, 이하 "게임")은 이용자의 개인정보를 수집하지 않습니다. 이 방침은 게임의 PC(Steam)·안드로이드(Google Play) 버전에 적용됩니다.`,
    privacyItems: e => [
      ['수집하는 정보', '없습니다. 게임은 회원 가입이나 로그인을 요구하지 않으며, 이름·연락처·위치·기기 식별자 등 어떤 개인정보도 수집하거나 서버로 보내지 않습니다.'],
      ['게임 저장 데이터', '캐릭터 이름과 진행 상황은 이용자의 기기 안에만 저장되며(Steam 버전은 이용자가 켠 경우 Steam 클라우드에 동기화), 앱을 삭제하면 함께 지워집니다. 개발자는 이 데이터에 접근할 수 없습니다.'],
      ['결제', '정식판 구매는 Google Play 결제 시스템 또는 Steam으로 처리됩니다. 결제 정보는 각 회사가 처리하며 개발자는 카드 번호 등 결제 정보를 받지 않습니다. <a href="https://policies.google.com/privacy">Google 개인정보처리방침</a> · <a href="https://store.steampowered.com/privacy_agreement/">Steam 개인정보 보호정책</a>'],
      ['광고·분석', '광고와 사용자 분석 도구를 사용하지 않습니다.'],
      ['아동', '게임은 13세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보도 수집하지 않습니다.'],
      ['변경', '이 방침이 바뀌면 이 페이지에 알립니다.'],
      ['문의', e],
    ],
    home: '홈',
  },
  en: {
    langName: 'English', other: 'ko', otherName: '한국어', otherHref: '../',
    title: 'Idle Mandate: Three Kingdoms',
    desc: 'A Three Kingdoms idle RPG. Forge your own hero, collect 60 generals and conquer 22 battlefields from the Yellow Turban Rebellion to the Wuzhang Plains.',
    eyebrow: 'Three Kingdoms Idle RPG',
    h1: 'It fights while you’re away. You come back stronger.',
    lead: 'Forge your own hero and conquer 22 battlefields, from the Yellow Turban Rebellion to the final clash at the Wuzhang Plains. The battle goes on even when the app is closed.',
    soon: 'Coming soon', now: 'Get it now',
    langs: 'Korean · English · Simplified Chinese · Japanese',
    routeEyebrow: '7 chapters · 22 battlefields', routeH: 'From the Peach Garden to the Wuzhang Plains',
    routeLead: 'Battlefields open in the order of the Three Kingdoms story, each guarded by a general of that era.',
    chapter: n => `Chapter ${n}`,
    routeNote: 'The free trial covers up to Chapter 2 (Dong Zhuo at Luoyang). The full game unlocks all 22 battlefields.',
    featEyebrow: 'Features', featH: 'Collect generals, transform, rule the realm',
    features: [
      ['guanyu', 'Your own hero', 'Pick a name, a class (Warrior, Archer, Strategist) and a kingdom (Wei, Shu, Wu, Warlords). Spend stat points yourself on every level-up.'],
      ['caocao', 'Transform into 60 generals', 'Guan Yu, Cao Cao, Zhou Yu, Lü Bu… Equip a Hero Card to fight with that general’s stats and Special Skill. Add their Spirit Beast and Weapon Card for Perfect Unity.'],
      ['zhugeliang', 'The battle never stops', 'Hunting continues while the app is closed. Come back and collect the gold and gear you earned in one go.'],
      ['lvbu', 'Something new every day', 'Besiege 12 cities in Conquest, fight Weekly Raids, duel in the Training Arena and climb the Hall of Generals.'],
      ['zhouyu', 'Permanent progression', 'Build your Headquarters, collect 8 legendary Relics, rise from Commoner to Chancellor, light the constellations — then Unify the Realm.'],
      ['zhaoyun', 'Face the bosses', 'Parry a boss’s heavy attack at the right moment to counter-strike, and catch the Golden Cart as it rolls by.'],
    ],
    shotsEyebrow: 'Screenshots', shotsH: 'The Three Kingdoms in your pocket',
    shots: [['01-battle', 'Battlefield'], ['03-heroes', 'Hero Cards'], ['05-conquest', 'Conquest'], ['06-observatory', 'Observatory']],
    dealH: 'Start free. Buy once if you like it.',
    dealLead: 'Play free through Chapter 2 (Dong Zhuo at Luoyang). One purchase unlocks every battlefield and all content, and your progress carries over.',
    chips: ['<b>No</b> ads', '<b>No</b> gacha payments', '<b>No</b> energy timers', '<b>4</b> languages', '<b>Offline</b> play'],
    studioEyebrow: 'Studio',
    studioLead: s => `${s} is a studio making PC and mobile games and learning programs for young children and elementary students. Our first title, Idle Mandate: Three Kingdoms, is coming to Steam and Google Play. For support or bug reports, email us at the address below.`,
    homeEyebrow: 'Games · Learning studio', homeTitle: s => `${s} Studio`,
    homeLead: 'We make games you can keep coming back to, and learning programs where young children and elementary students learn through play.',
    eduEyebrow: 'Learning programs', eduH: 'Learning through play for kids',
    eduLead: 'We bring what we have learned from making games into programs that help children enjoy learning on their own.',
    edu: [['🧸', 'Early years (ages 3–7)', 'Play-based learning with pictures and sound', 'edu-kids.jpg'], ['🎒', 'Elementary (grades 1–6)', 'Core skills built through game-like challenges', 'edu-school.jpg']],
    eduSoon: 'In the works', eduNote: 'Our first learning program is in the works. News will be posted on this page.',
    gamesEyebrow: 'Games', gamesH: 'Our games', more: 'See the game', nextGame: 'Our next game is in the works', nextGameLead: 'News will be posted on this page.',
    madeBy: s => `Made by ${s}`, contactH: 'Contact',
    info: { studio: 'Company', owner: 'Representative', biz: 'Business registration no.', mail: 'Mail-order business no.', address: 'Address', email: 'Email' },
    todo: 'To be added',
    privacy: 'Privacy Policy',
    privacyTitle: 'Privacy Policy',
    privacyDate: d => `Effective date: ${d}`,
    privacyIntro: s => `Games made by ${s} (currently Idle Mandate: Three Kingdoms, “the Game”) do not collect any personal information. This policy applies to the PC (Steam) and Android (Google Play) versions of the Game.`,
    privacyItems: e => [
      ['Information we collect', 'None. The Game requires no account or sign-in, and it does not collect or transmit any personal data such as names, contact details, location or device identifiers.'],
      ['Save data', 'Your character name and progress are stored only on your device (synced to Steam Cloud if you enable it on Steam) and are deleted when you uninstall the app. The developer has no access to this data.'],
      ['Payments', 'Purchases of the full game are processed by Google Play Billing or Steam. Payment information is handled by those companies; the developer never receives card numbers or other payment details. <a href="https://policies.google.com/privacy">Google Privacy Policy</a> · <a href="https://store.steampowered.com/privacy_agreement/">Steam Privacy Policy</a>'],
      ['Ads and analytics', 'The Game uses no advertising or analytics tools.'],
      ['Children', 'The Game is not directed at children under 13 and does not knowingly collect their personal information.'],
      ['Changes', 'Any changes to this policy will be posted on this page.'],
      ['Contact', e],
    ],
    home: 'Home',
  },
};

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;600&family=Jua&family=Marcellus&family=Song+Myung&display=swap">';

// 디자인 요청 그림(build/DESIGN.md)이 img/에 있으면 쓰고, 없으면 지금 모양 그대로
const hasImg = f => fs.existsSync(path.join(root, 'img', f));

// 페이지마다: r = 사이트 맨 위까지의 상대 경로, where = 'studio' | 'game' | 'privacy'
const PATHS = { studio: ['', 'en/'], game: ['idle-mandate/', 'idle-mandate/en/'], privacy: ['privacy.html', 'en/privacy.html'] };
const href = (r, where, lang) => r + PATHS[where][lang === 'ko' ? 0 : 1];
const absUrl = (where, lang) => (cfg.siteUrl ? cfg.siteUrl.replace(/\/$/, '') + '/' + PATHS[where][lang === 'ko' ? 0 : 1] : '');

function doc(lang, r, where, title, desc, body, ogImg = 'og.jpg') {
  const theme = where === 'game' ? '' : ' class="studio-page"'; // 스튜디오 홈·개인정보처리방침은 밝은 휴아트 색, 게임 페이지는 그 게임 분위기
  if (where !== 'game' && hasImg('og-studio.jpg')) ogImg = 'og-studio.jpg';
  const og = cfg.siteUrl ? cfg.siteUrl.replace(/\/$/, '') + '/img/' + ogImg : r + 'img/' + ogImg;
  const canonical = absUrl(where, lang);
  return `<!doctype html>
<html lang="${lang}"${theme}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(og)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">\n` : ''}${cfg.siteUrl ? `<link rel="alternate" hreflang="ko" href="${esc(absUrl(where, 'ko'))}"><link rel="alternate" hreflang="en" href="${esc(absUrl(where, 'en'))}">\n` : ''}<link rel="icon" href="${r}img/${where !== 'game' && hasImg('huart-symbol-64.png') ? 'huart-symbol-64.png' : 'favicon.png'}">${where !== 'game' && hasImg('huart-symbol.png') ? `<link rel="apple-touch-icon" href="${r}img/huart-symbol.png">` : ''}
${FONTS}
<link rel="stylesheet" href="${r}style.css">
</head>
<body>
${body}
</body>
</html>
`;
}

function bar(lang, r, where) {
  const studio = L(cfg.studio, lang);
  return `<header class="bar"><div class="wrap">
  <a class="brand" href="${href(r, 'studio', lang)}">${hasImg('huart-symbol.png') ? `<img class="brand-symbol" src="${r}img/huart-symbol-64.png" alt="" width="40" height="40">` : `<img src="${r}img/huart-logo-sm.webp" alt="" width="80" height="40">`}${esc(studio)}</a>
  <nav class="lang" aria-label="Language">${lang === 'ko' ? `<b>한국어</b><a href="${href(r, where, 'en')}" hreflang="en">English</a>` : `<a href="${href(r, where, 'ko')}" hreflang="ko">한국어</a><b>English</b>`}</nav>
</div></header>`;
}

function footer(t, lang, r, where) {
  const other = lang === 'ko' ? 'en' : 'ko';
  return `<footer><div class="wrap">
  <span>© ${YEAR} ${esc(L(cfg.studio, lang))}</span>
  <nav><a href="${href(r, 'studio', lang)}">${esc(L(cfg.studio, lang))}</a><a href="${href(r, 'privacy', lang)}">${t.privacy}</a><a href="${href(r, where, other)}" hreflang="${other}">${T[other].langName}</a></nav>
</div></footer>`;
}

function store(t, url, name) {
  return url ? `<a class="store" href="${esc(url)}"><small>${t.now}</small><b>${name}</b></a>` : `<span class="store soon"><small>${t.soon}</small><b>${name}</b></span>`;
}

function infoRow(t, label, value, optional) {
  if (!value && optional) return '';
  return `<dt>${label}</dt><dd>${value ? esc(value) : `<em class="todo">${t.todo}</em>`}</dd>`;
}

// 스튜디오 홈: 로고, 게임 목록, 사업자 정보
function studioHome(lang) {
  const t = T[lang], r = lang === 'ko' ? '' : '../', studio = L(cfg.studio, lang);
  const games = (cfg.games || []).map(g => `
    <a class="game-card" href="${href(r, 'game', lang)}">
      <img src="${r}img/${esc(g.image)}" alt="" width="920" height="430">
      <div><small>${esc(L(g.platforms, lang))} · ${esc(L(g.status, lang))}</small><h3>${esc(L(g.title, lang))}</h3><p>${esc(L(g.tagline, lang))}</p><span class="more">${t.more} →</span></div>
    </a>`).join('');
  const body = `${bar(lang, r, 'studio')}
<main id="top">
<section class="studio-hero${hasImg('studio-hero.jpg') ? ' has-art' : ''}"${hasImg('studio-hero.jpg') ? ` style="--hero-art:url(${r}img/studio-hero.jpg)"` : ''}><div class="wrap">
  <p class="eyebrow">${t.homeEyebrow}</p>
  <h1>${esc(t.homeTitle(studio))}</h1>
  <p class="lead">${t.homeLead}</p>
  <nav class="hero-links"><a href="#games">${t.gamesEyebrow}</a><a href="#edu">${t.eduEyebrow}</a></nav>
</div></section>

<section id="games"><div class="wrap">
  <div class="head"><p class="eyebrow">${t.gamesEyebrow}</p><h2>${t.gamesH}</h2></div>
  <div class="games">${games}
    <div class="game-card next">${hasImg('next-game.jpg') ? `<img src="${r}img/next-game.jpg" alt="" width="920" height="430">` : ''}<div><h3>${t.nextGame}</h3><p>${t.nextGameLead}</p></div></div>
  </div>
</div></section>

<section id="edu" class="edu"><div class="wrap">
  <div class="head"><p class="eyebrow">${t.eduEyebrow}</p><h2>${t.eduH}</h2><p class="lead">${t.eduLead}</p></div>
  <div class="games">${t.edu.map(([ico, who, what, img]) => `
    <div class="game-card edu-card">${hasImg(img) ? `<img src="${r}img/${img}" alt="" width="920" height="430">` : ''}<div>${hasImg(img) ? '' : `<span class="edu-ico" aria-hidden="true">${ico}</span>`}<small>${t.eduSoon}</small><h3>${who}</h3><p>${what}</p></div></div>`).join('')}
  </div>
  <p class="route-note">${t.eduNote}</p>
</div></section>

<section class="studio" id="studio"><div class="wrap">
  <div class="studio-card">
    <p class="eyebrow">${t.studioEyebrow}</p>
    <h2>${esc(studio)}</h2>
    <p class="lead">${esc(t.studioLead(studio))}</p>
    <dl class="info">
      ${infoRow(t, t.info.studio, studio)}
      ${infoRow(t, t.info.owner, L(cfg.owner, lang))}
      ${infoRow(t, t.info.biz, cfg.bizNumber)}
      ${infoRow(t, t.info.mail, cfg.mailOrderNumber, true)}
      ${infoRow(t, t.info.address, L(cfg.address, lang))}
      ${infoRow(t, t.info.email, cfg.email)}
    </dl>
  </div>
</div></section>
</main>
${footer(t, lang, r, 'studio')}`;
  return doc(lang, r, 'studio', t.homeTitle(studio), t.studioLead(studio), body);
}

// 천명: 삼국 방치 영웅전 소개
function gamePage(lang) {
  const t = T[lang], r = lang === 'ko' ? '../' : '../../', studio = L(cfg.studio, lang);
  const body = `${bar(lang, r, 'game')}
<main id="top">
<section class="hero"><div class="wrap">
  <p class="eyebrow">${t.eyebrow}</p>
  <img class="hero-logo" src="${r}img/logo.png" alt="${esc(t.title)}" width="900" height="300">
  <h1>${t.h1}</h1>
  <p class="lead">${t.lead}</p>
  <div class="stores">${store(t, cfg.steamUrl, 'Steam · PC')}${store(t, cfg.playUrl, 'Google Play · Android')}</div>
  <p class="langs">${t.langs} · <a href="${href(r, 'studio', lang)}">${esc(t.madeBy(studio))}</a></p>
</div></section>

<section><div class="wrap">
  <div class="head"><p class="eyebrow">${t.routeEyebrow}</p><h2>${t.routeH}</h2><p class="lead">${t.routeLead}</p></div>
  <div class="route" tabindex="0">${CHAPTERS[lang].map(([name, zones], i) => `
    <article class="chapter"><img src="${r}img/zone-${CHAPTER_ART[i]}.webp" alt="" width="640" height="342">
      <div><small>${t.chapter(i + 1)}</small><h3>${esc(name)}</h3><p>${zones.map(esc).join(' · ')}</p></div></article>`).join('')}
  </div>
  <p class="route-note">${t.routeNote}</p>
</div></section>

<section><div class="wrap">
  <div class="head"><p class="eyebrow">${t.featEyebrow}</p><h2>${t.featH}</h2></div>
  <div class="features">${t.features.map(([h, name, text]) => `
    <article class="feature"><img src="${r}img/hero-${h}.webp" alt="" width="76" height="76"><div><h3>${name}</h3><p>${text}</p></div></article>`).join('')}
  </div>
</div></section>

<section><div class="wrap">
  <div class="head"><p class="eyebrow">${t.shotsEyebrow}</p><h2>${t.shotsH}</h2></div>
  <div class="shots" tabindex="0">${t.shots.map(([f, cap]) => `
    <figure><img src="${r}img/shot-${lang}-${f}.jpg" alt="${esc(cap)}" width="480" height="853"><figcaption>${cap}</figcaption></figure>`).join('')}
  </div>
</div></section>

<section class="deal"><div class="wrap">
  <div><h2>${t.dealH}</h2><p class="lead">${t.dealLead}</p></div>
  <div class="chips">${t.chips.map(c => `<span>${c}</span>`).join('')}</div>
</div></section>

<section class="contact"><div class="wrap">
  <h2>${t.contactH}</h2>
  <p class="lead">${cfg.email ? esc(cfg.email) : `<em class="todo">${t.todo}</em>`} · <a href="${href(r, 'studio', lang)}#studio">${esc(studio)}</a></p>
</div></section>
</main>
${footer(t, lang, r, 'game')}`;
  return doc(lang, r, 'game', `${t.title} | ${studio}`, t.desc, body);
}

function privacy(lang) {
  const t = T[lang], r = lang === 'ko' ? '' : '../', studio = L(cfg.studio, lang);
  const email = cfg.email ? esc(cfg.email) : `<em class="todo">${t.todo}</em>`;
  const body = `${bar(lang, r, 'privacy')}
<main class="doc"><div class="wrap"><article>
  <p class="eyebrow">${esc(studio)}</p>
  <h1>${t.privacyTitle}</h1>
  <p class="date">${t.privacyDate(cfg.privacyDate)}</p>
  <p>${esc(t.privacyIntro(studio))}</p>
  <ol>${t.privacyItems(email).map(([h, p]) => `<li><b>${h}</b><br>${p}</li>`).join('')}</ol>
  <p><a href="${href(r, 'studio', lang)}">← ${t.home}</a></p>
</article></div></main>
${footer(t, lang, r, 'privacy')}`;
  return doc(lang, r, 'privacy', `${t.privacyTitle} | ${studio}`, t.privacyIntro(studio), body);
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) fs.copyFileSync(path.join(src, f), path.join(dst, f));
}

const pages = [['index.html', studioHome('ko')], ['en/index.html', studioHome('en')], ['idle-mandate/index.html', gamePage('ko')], ['idle-mandate/en/index.html', gamePage('en')], ['privacy.html', privacy('ko')], ['en/privacy.html', privacy('en')]];
const pi = process.argv.indexOf('--preview');
if (pi > 0) {
  // 미리보기: 클로드 아티팩트는 <html>/<head>/<body> 없이 내용만 받음 (스튜디오 홈 한 장)
  const out = process.argv[pi + 1];
  fs.mkdirSync(out, { recursive: true });
  const html = studioHome('ko');
  const head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'))
    .replace(/<meta [^>]*>\n?/g, '').replace(/<link rel="(canonical|alternate)"[^>]*>/g, '').replace(/<title>.*<\/title>/, '<title>HuArt Studio</title>');
  const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
  fs.writeFileSync(path.join(out, 'index.html'), head + body);
  fs.copyFileSync(path.join(root, 'style.css'), path.join(out, 'style.css'));
  copyDir(path.join(root, 'img'), path.join(out, 'img'));
  console.log('미리보기: ' + out);
} else {
  for (const [f, html] of pages) { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), html); }
  fs.writeFileSync(path.join(root, '.nojekyll'), '');
  const missing = ['owner', 'bizNumber', 'address', 'email'].filter(k => !L(cfg[k], 'ko'));
  console.log('만듦: ' + pages.map(p => p[0]).join(', ') + (missing.length ? `\n  build/site.json에 아직 비어 있음: ${missing.join(', ')}` : ''));
}
