// 휴아트 스튜디오 웹사이트 만들기: build/site.json(사업자 정보·게임 목록) + 아래 글 → 저장소 맨 위의 HTML
//   /                 스튜디오 홈(게임 목록·사업자 정보)   /en/  영어
//   /chef-survivor/   셰프 서바이버 소개                 /chef-survivor/en/  영어
//   /privacy.html     개인정보처리방침(스튜디오의 모든 게임) /en/privacy.html  영어
// 새 게임을 추가하면 site.json의 games에 한 줄 넣고, 게임 소개 페이지는 아래 gamePage처럼 만들면 됩니다.
//   node build/build.js                  → 저장소 맨 위에 HTML을 다시 씀 (style.css·img/는 그대로 씀)
//   node build/build.js --preview <폴더>  → 미리보기용 (클로드 아티팩트 형식, 한국어 첫 페이지)
// 만든 뒤 커밋·푸시하면 GitHub Pages가 main 브랜치를 그대로 보여 줍니다. 다른 저장소가 필요 없습니다.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'site.json'), 'utf8'));
const chef = cfg.games.find(g => g.id === 'chef-survivor');

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const L = (v, lang) => (v && typeof v === 'object' ? v[lang] || v.ko || '' : v || '');
const YEAR = new Date().getFullYear();

// 셰프 서바이버 레시피 진화 8종: 그림(img/chef/recipe-*.webp), 요리, 조리도구, 재료 (게임의 이름 그대로)
const RECIPES = {
  ko: [
    ['julienne', '채썰기 폭풍', '식칼', '향신료'],
    ['wok', '웍 토네이도', '프라이팬', '미끄럼 방지화'],
    ['bbq', '바비큐 파티', '불판', '시식'],
    ['meringue', '머랭 폭풍', '거품기', '설탕'],
    ['pastry', '페이스트리 롤러', '밀대', '버터'],
    ['salt-rain', '소금 결정 비', '소금통', '레몬'],
    ['hotpot', '전골 폭발', '냄비 뚜껑', '육수'],
    ['brulee', '크렘 브륄레', '토치', '설탕'],
  ],
  en: [
    ['julienne', 'Julienne Storm', 'Kitchen Knife', 'Spice'],
    ['wok', 'Wok Tornado', 'Frying Pan', 'Non-slip Shoes'],
    ['bbq', 'BBQ Party', 'Hot Grill', 'Taste Test'],
    ['meringue', 'Meringue Storm', 'Whisk', 'Sugar'],
    ['pastry', 'Pastry Roller', 'Rolling Pin', 'Butter'],
    ['salt-rain', 'Salt Crystal Rain', 'Salt Shaker', 'Lemon'],
    ['hotpot', 'Hotpot Blast', 'Pot Lid', 'Broth'],
    ['brulee', 'Creme Brulee', 'Torch', 'Sugar'],
  ],
};

const T = {
  ko: {
    langName: '한국어', other: 'en', otherName: 'English', otherHref: 'en/',
    title: '셰프 서바이버',
    desc: '폭주한 식재료 몬스터를 요리해서 진정시키는 셰프의 10분 생존기. 조리도구에 재료를 더하면 레시피가 완성되어 요리 필살기로 진화합니다.',
    eyebrow: '요리 서바이버 액션',
    h1: '오늘 밤 영업, 10분만 버티면 된다',
    lead: '전설의 레스토랑 창고에서 식재료들이 폭주했습니다. 움직이기만 하면 조리도구가 알아서 요리합니다. 조리도구에 맞는 재료를 더해 레시피를 완성하세요.',
    soon: '출시 예정', now: '지금 받기',
    langs: '한국어 · English',
    recipeEyebrow: '레시피 진화 8종', recipeH: '조리도구 + 재료 = 요리 필살기',
    recipeLead: '조리도구를 최고 레벨까지 키우고 짝이 되는 재료를 가지고 있으면, 요리 이름 그대로의 필살기로 진화합니다.',
    recipeNote: '조리도구 8종 · 재료 8종 · 레시피 8종',
    featEyebrow: '게임 특징', featH: '짧게 한 판, 길게 키우는 재미',
    features: [
      ['head-idle', '셰프 4명', '저마다 다른 조리도구로 시작하는 셰프 4명. 셰프마다 가장 높은 난이도 클리어 기록이 남습니다.'],
      ['cabbage-king', '스테이지와 보스', '채소밭과 정육점. 5분과 10분에 거대 호박, 양배추 왕, 통돼지 구이 같은 보스가 나타납니다.'],
      ['tomato-soup', '나만의 식당', '판에서 모은 재료로 식당 메뉴를 열고, 수익으로 셰프 훈련과 영구 강화를 합니다.'],
      ['star', '별 난이도 · 무한 영업', '별 1~5 난이도와 끝없이 강해지는 무한 영업. 날짜마다 모두가 같은 조건으로 겨루는 일일 도전.'],
      ['chest', '엘리트와 레시피 상자', '금테를 두른 엘리트를 잡으면 레시피 상자가 떨어집니다. 완성할 수 있는 레시피가 맨 앞에 나옵니다.'],
      ['recipe-wok', '폭력 대신 요리', '쓰러뜨리는 대신 요리합니다. 밝고 귀여운 그림이라 누구나 편하게 즐길 수 있습니다.'],
    ],
    shotsEyebrow: '스크린샷', shotsH: '저녁 영업 미리 보기',
    shots: [['gameplay', '채소밭 영업'], ['evolved', '레시피 진화'], ['levelup', '레벨업 선택'], ['butcher', '정육점 스테이지'], ['restaurant', '식당'], ['book', '레시피 도감']],
    dealH: '무료로 즐기고, 광고는 원할 때만',
    dealLead: '광고는 부활이나 보상 2배가 필요할 때 직접 골라서 봅니다. 광고 제거를 한 번 구매하면 광고 없이 바로 보상을 받습니다. PC(Steam) 버전에는 광고가 없습니다.',
    chips: ['<b>강제 광고</b> 없음', '<b>가챠 과금</b> 없음', '<b>에너지 제한</b> 없음', '<b>한국어 · 영어</b>', '<b>오프라인</b> 플레이'],
    studioEyebrow: '개발사',
    studioLead: s => `${s}는 PC·모바일 게임과 유아·초등 교육 프로그램을 만드는 스튜디오입니다. 첫 작품 「셰프 서바이버」를 Google Play와 Steam에 출시할 준비를 하고 있습니다. 문의와 버그 제보는 아래 이메일로 보내 주세요.`,
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
    privacyIntro: s => `이 방침은 ${s}가 만든 게임(현재 「셰프 서바이버」, 이하 "게임")의 PC(Steam)·안드로이드(Google Play) 버전에 적용됩니다. 게임은 회원 가입이나 로그인을 요구하지 않으며, 개발자가 이름·이메일·연락처 같은 개인정보를 직접 수집하지 않습니다.`,
    privacyItems: e => [
      ['게임 저장 데이터', '게임 진행 상황(골드, 재료, 기록, 설정)은 이용자의 기기 안에만 저장되며 개발자의 서버로 보내지 않습니다(Steam 버전은 이용자가 켠 경우 Steam 클라우드에 동기화). 앱을 삭제하면 함께 지워지며, 개발자는 이 데이터에 접근할 수 없습니다.'],
      ['광고 (Google AdMob, 안드로이드 버전)', '이용자가 직접 고른 경우에만 보상형 광고를 보여 주기 위해 Google AdMob을 사용합니다. AdMob은 광고 제공, 노출 빈도 제한, 부정 행위 방지, 광고 성과 측정을 위해 광고 ID, 기기 정보, IP 주소(대략적 위치), 광고 상호작용 정보를 수집할 수 있습니다. 유럽 경제 지역·영국 등 동의가 필요한 지역에서는 처음 실행할 때 동의 여부를 묻고, 게임의 설정 &gt; "광고 개인정보 설정"에서 언제든 바꿀 수 있습니다. 기기 설정에서 광고 ID를 재설정하거나 맞춤 광고를 끌 수도 있습니다. <a href="https://policies.google.com/technologies/partner-sites">Google이 정보를 사용하는 방식</a>. PC(Steam) 버전에는 광고가 없습니다.'],
      ['결제', '"광고 제거" 등 게임 안 구매는 Google Play 결제 시스템 또는 Steam으로 처리됩니다. 결제 정보는 각 회사가 처리하며 개발자는 카드 번호 등 결제 정보를 받지 않고, 게임은 구매 여부만 확인합니다. <a href="https://policies.google.com/privacy">Google 개인정보처리방침</a> · <a href="https://store.steampowered.com/privacy_agreement/">Steam 개인정보 보호정책</a>'],
      ['분석', '사용자 분석 도구를 사용하지 않습니다.'],
      ['아동', '게임은 13세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 알면서 수집하지 않습니다.'],
      ['보관 및 삭제', '기기 안의 게임 데이터는 앱을 삭제하면 지워집니다. 광고 관련 정보는 Google의 정책에 따라 처리됩니다.'],
      ['변경', '이 방침이 바뀌면 새 시행일과 함께 이 페이지에 알립니다.'],
      ['문의', e],
    ],
    home: '홈',
  },
  en: {
    langName: 'English', other: 'ko', otherName: '한국어', otherHref: '../',
    title: 'Chef Survivor',
    desc: 'A chef’s 10-minute fight to calm runaway ingredient monsters by cooking them. Add the right ingredient to a kitchen tool and it evolves into a signature recipe.',
    eyebrow: 'Cooking survivor action',
    h1: 'Survive ten minutes of dinner service',
    lead: 'The ingredients in a legendary restaurant’s pantry have gone wild. Just move — your kitchen tools cook on their own. Pair each tool with the right ingredient to complete its recipe.',
    soon: 'Coming soon', now: 'Get it now',
    langs: 'Korean · English',
    recipeEyebrow: '8 recipe evolutions', recipeH: 'Kitchen tool + ingredient = signature dish',
    recipeLead: 'Max out a kitchen tool while holding its matching ingredient, and it evolves into a special move named after the dish.',
    recipeNote: '8 kitchen tools · 8 ingredients · 8 recipes',
    featEyebrow: 'Features', featH: 'Quick runs, long-term growth',
    features: [
      ['head-idle', 'Four chefs', 'Four chefs, each starting with a different kitchen tool. Every chef keeps a record of the highest difficulty cleared.'],
      ['cabbage-king', 'Stages and bosses', 'The Vegetable Garden and the Butcher Shop. At 5 and 10 minutes, bosses like the Giant Pumpkin, the Cabbage King and the Roast Pig show up.'],
      ['tomato-soup', 'Your own restaurant', 'Unlock menu dishes with the ingredients you bring back, and spend the profits on chef training and permanent upgrades.'],
      ['star', 'Star difficulty · Endless service', 'Difficulty from 1 to 5 stars, an endless mode that keeps getting harder, and a Daily Challenge where everyone plays the same setup.'],
      ['chest', 'Elites and recipe chests', 'Gold-trimmed elites drop recipe chests, and any recipe you can complete is offered first.'],
      ['recipe-wok', 'Cooking, not violence', 'You cook your foes instead of knocking them out. Bright, cute art that anyone can enjoy.'],
    ],
    shotsEyebrow: 'Screenshots', shotsH: 'A look at dinner service',
    shots: [['gameplay', 'Vegetable Garden'], ['evolved', 'Recipe evolutions'], ['levelup', 'Level-up choices'], ['butcher', 'Butcher Shop stage'], ['restaurant', 'Restaurant'], ['book', 'Recipe Book']],
    dealH: 'Free to play. Ads only when you want them.',
    dealLead: 'You choose to watch an ad only when you want a revive or double rewards. Buy Remove Ads once to get those rewards instantly with no ads. The PC (Steam) version has no ads.',
    chips: ['<b>No</b> forced ads', '<b>No</b> gacha payments', '<b>No</b> energy timers', '<b>Korean · English</b>', '<b>Offline</b> play'],
    studioEyebrow: 'Studio',
    studioLead: s => `${s} is a studio making PC and mobile games and learning programs for young children and elementary students. Our first title, Chef Survivor, is coming to Google Play and Steam. For support or bug reports, email us at the address below.`,
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
    privacyIntro: s => `This policy applies to the PC (Steam) and Android (Google Play) versions of games made by ${s} (currently Chef Survivor, “the Game”). The Game requires no account or sign-in, and the developer does not directly collect personal information such as your name, email or contacts.`,
    privacyItems: e => [
      ['Save data', 'Game progress (gold, ingredients, records, settings) is stored only on your device and is never sent to our servers (synced to Steam Cloud if you enable it on Steam). It is deleted when you uninstall the app, and the developer has no access to it.'],
      ['Advertising (Google AdMob, Android version)', 'The Game uses Google AdMob to show rewarded ads, only when you choose to watch one. AdMob may collect your advertising ID, device information, IP address (approximate location) and ad interaction data to serve ads, limit frequency, prevent fraud and measure performance. Where consent is required (e.g. the EEA and the UK), you are asked on first launch and can change your choice at any time in the Game’s Settings &gt; “Ad Privacy Options”. You can also reset your advertising ID or opt out of personalized ads in your device settings. <a href="https://policies.google.com/technologies/partner-sites">How Google uses data</a>. The PC (Steam) version has no ads.'],
      ['Payments', 'In-game purchases such as “Remove Ads” are processed by Google Play Billing or Steam. Payment information is handled by those companies; the developer never receives card numbers or other payment details, and the Game only checks whether an item was purchased. <a href="https://policies.google.com/privacy">Google Privacy Policy</a> · <a href="https://store.steampowered.com/privacy_agreement/">Steam Privacy Policy</a>'],
      ['Analytics', 'The Game uses no analytics tools.'],
      ['Children', 'The Game is not directed at children under 13 and does not knowingly collect their personal information.'],
      ['Retention and deletion', 'Game data on your device is deleted when you uninstall the app. Advertising data is handled under Google’s policies.'],
      ['Changes', 'Any changes to this policy will be posted on this page with a new effective date.'],
      ['Contact', e],
    ],
    home: 'Home',
  },
};

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;600&family=Jua&display=swap">';

// 디자인 요청 그림(build/DESIGN.md)이 img/에 있으면 쓰고, 없으면 지금 모양 그대로
const hasImg = f => fs.existsSync(path.join(root, 'img', f));

// 페이지마다: r = 사이트 맨 위까지의 상대 경로, where = 'studio' | 'game' | 'privacy'
const PATHS = { studio: ['', 'en/'], game: ['chef-survivor/', 'chef-survivor/en/'], privacy: ['privacy.html', 'en/privacy.html'] };
const href = (r, where, lang) => r + PATHS[where][lang === 'ko' ? 0 : 1];
const absUrl = (where, lang) => (cfg.siteUrl ? cfg.siteUrl.replace(/\/$/, '') + '/' + PATHS[where][lang === 'ko' ? 0 : 1] : '');

function doc(lang, r, where, title, desc, body, ogImg = 'og-studio.jpg') {
  const og = cfg.siteUrl ? cfg.siteUrl.replace(/\/$/, '') + '/img/' + ogImg : r + 'img/' + ogImg;
  const canonical = absUrl(where, lang);
  return `<!doctype html>
<html lang="${lang}" class="studio-page${where === 'game' ? ' game-page' : ''}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(og)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">\n` : ''}${cfg.siteUrl ? `<link rel="alternate" hreflang="ko" href="${esc(absUrl(where, 'ko'))}"><link rel="alternate" hreflang="en" href="${esc(absUrl(where, 'en'))}">\n` : ''}<link rel="icon" href="${r}img/huart-symbol-64.png"><link rel="apple-touch-icon" href="${r}img/huart-symbol.png">
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
  <a class="brand" href="${href(r, 'studio', lang)}"><img class="brand-symbol" src="${r}img/huart-symbol-64.png" alt="" width="40" height="40">${esc(studio)}</a>
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

// 셰프 서바이버 소개
function gamePage(lang) {
  const t = T[lang], r = lang === 'ko' ? '../' : '../../', studio = L(cfg.studio, lang);
  const body = `${bar(lang, r, 'game')}
<main id="top">
<section class="hero" style="--hero-bg:url(${r}img/chef/hero-bg.jpg)"><div class="wrap">
  <p class="eyebrow">${t.eyebrow}</p>
  <img class="hero-logo" src="${r}img/chef/logo.webp" alt="${esc(t.title)}" width="900" height="497">
  <h1>${t.h1}</h1>
  <p class="lead">${t.lead}</p>
  <div class="stores">${store(t, chef.playUrl, 'Google Play · Android')}${store(t, chef.steamUrl, 'Steam · PC')}</div>
  <p class="langs">${t.langs} · <a href="${href(r, 'studio', lang)}">${esc(t.madeBy(studio))}</a></p>
</div></section>

<section><div class="wrap">
  <div class="head"><p class="eyebrow">${t.recipeEyebrow}</p><h2>${t.recipeH}</h2><p class="lead">${t.recipeLead}</p></div>
  <div class="recipes">${RECIPES[lang].map(([id, dish, tool, ing]) => `
    <article class="recipe"><img src="${r}img/chef/recipe-${id}.webp" alt="" width="128" height="122">
      <div><h3>${esc(dish)}</h3><p>${esc(tool)} + ${esc(ing)}</p></div></article>`).join('')}
  </div>
  <p class="route-note">${t.recipeNote}</p>
</div></section>

<section><div class="wrap">
  <div class="head"><p class="eyebrow">${t.featEyebrow}</p><h2>${t.featH}</h2></div>
  <div class="features">${t.features.map(([f, name, text]) => `
    <article class="feature"><img src="${r}img/chef/feat-${f}.webp" alt="" width="76" height="76"><div><h3>${name}</h3><p>${text}</p></div></article>`).join('')}
  </div>
</div></section>

<section><div class="wrap">
  <div class="head"><p class="eyebrow">${t.shotsEyebrow}</p><h2>${t.shotsH}</h2></div>
  <div class="shots" tabindex="0">${t.shots.map(([f, cap]) => `
    <figure><img src="${r}img/chef/shot-${f}.jpg" alt="${esc(cap)}" width="1280" height="720" loading="lazy"><figcaption>${cap}</figcaption></figure>`).join('')}
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
  return doc(lang, r, 'game', `${t.title} | ${studio}`, t.desc, body, 'chef/og.jpg');
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
  for (const f of fs.readdirSync(src, { withFileTypes: true })) {
    if (f.isDirectory()) copyDir(path.join(src, f.name), path.join(dst, f.name));
    else fs.copyFileSync(path.join(src, f.name), path.join(dst, f.name));
  }
}

const pages = [['index.html', studioHome('ko')], ['en/index.html', studioHome('en')], ['chef-survivor/index.html', gamePage('ko')], ['chef-survivor/en/index.html', gamePage('en')], ['privacy.html', privacy('ko')], ['en/privacy.html', privacy('en')]];
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
