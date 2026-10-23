# 휴아트 웹사이트 디자인 요청 시트

그림을 만들어 주시면 `img/`에 아래 **파일 이름**으로 넣고 `node build/build.js` 하면 자동으로 적용됩니다
(없는 그림은 지금 모양 그대로). 모든 크기는 **1600×900 이하**. 크기·비워 둘 자리를 표시한 가이드 그림: 천명 저장소(huart-studio/Game_threekingdom)의 `art/sheets/huart-site/1~5_*.png`

## 공통 스타일 (모든 그림에 같이 붙이기)
> glossy 3D cartoon style like a mobile game logo, soft clay/plastic toy look, rounded chunky shapes,
> thick dark brown outlines, candy colors — sunshine yellow #FFC928, sky blue #1E9BFF, leaf green #5CC83B, warm orange #FF9A1F,
> dark near-black background #121014 with soft colored glow, cheerful and friendly, clean composition, no text, no letters, no watermark

- 사이트 바탕이 **거의 검정(#121014)** 이라 그림 바탕도 어둡게, 가장자리는 바탕색으로 자연스럽게 사라지게
- **그림 안에 글자를 넣지 마세요** (한국어·영어 페이지에 같이 쓰고, 글자는 사이트에서 올림)
- 휴아트 로고의 노랑·파랑·초록·주황을 주로 써서 로고와 한 세트처럼

---

## 1. 휴아트 심볼 (정사각 아이콘) — 필수
| 항목 | 값 |
|---|---|
| 파일 | `huart-symbol.png` |
| 크기 | **900 × 900**, PNG **투명 배경** |
| 쓰는 곳 | 브라우저 탭 아이콘(파비콘), 사이트 머리글, 유튜브·SNS 프로필, 스토어 개발자 아이콘 |
| 주의 | 작게(16~32px) 줄여도 알아볼 수 있게 단순하게. 가운데 꽉 차게, 가장자리 여백 8% 정도 |

프롬프트:
> A cute round mascot icon based on the Korean character "휴" from the HuArt logo: a smiling sunny-yellow blob face with closed happy eyes and pink cheeks, a small shining star above, simple and bold, centered, readable at tiny sizes, transparent background, glossy 3D cartoon, thick dark brown outline

## 2. 스튜디오 홈 첫 화면 배경 — 추천
| 항목 | 값 |
|---|---|
| 파일 | `studio-hero.jpg` |
| 크기 | **1600 × 900**, JPG |
| 쓰는 곳 | 스튜디오 홈 맨 위 (제목·소개 글이 **왼쪽 절반**에 올라감) |
| 주의 | **왼쪽 55%는 비워 두고 어둡게**, 그림 요소는 오른쪽에. 폰에서는 좌우가 잘려 보일 수 있음 |

프롬프트:
> Wide dark night-sky banner for a game and kids-education studio. On the right side: floating playful objects — a white game controller with colorful buttons, an open storybook with a green sprout, colorful building blocks, a pencil, stars and small planets in yellow, blue and green, gentle glowing light. The left half is empty dark space (#121014) for text. Glossy 3D cartoon toys, soft glow, dreamy and cheerful, no text

## 3. 공유 썸네일 (카카오톡·SNS 미리보기) — 추천
| 항목 | 값 |
|---|---|
| 파일 | `og-studio.jpg` |
| 크기 | **1200 × 630**, JPG |
| 쓰는 곳 | 사이트 주소를 카톡·페이스북 등에 붙였을 때 뜨는 그림 |
| 주의 | **가운데 700 × 360 정도를 비워 두세요** — 제가 휴아트 로고를 합성합니다 (로고를 직접 넣으셔도 됨) |

프롬프트:
> Dark background banner with a soft glowing circle in the center left empty for a logo, surrounded by cheerful floating 3D toy objects around the edges: game controller, open book with sprout, stars, colorful blocks, crayons, in yellow, blue, green and orange, glossy cartoon style, no text

## 4. 교육 카드 — 유아 — 추천
| 항목 | 값 |
|---|---|
| 파일 | `edu-kids.jpg` |
| 크기 | **1600 × 750**, JPG |
| 쓰는 곳 | 교육 프로그램 → "유아 (만 3~7세)" 카드 위쪽 그림 |
| 주의 | 사이트에서 위아래가 조금 잘리므로(2.14:1) 주인공은 가운데에 |

프롬프트:
> Cute scene for preschool learning through play: a happy little animal character (bear cub) playing with colorful alphabet and number blocks, shape toys, a xylophone and picture cards, bright candy colors on a dark background with soft spotlight glow, glossy 3D clay cartoon, warm and safe feeling, no text, no real letters on blocks (use simple shapes instead)

## 5. 교육 카드 — 초등 — 추천
| 항목 | 값 |
|---|---|
| 파일 | `edu-school.jpg` |
| 크기 | **1600 × 750**, JPG |
| 쓰는 곳 | 교육 프로그램 → "초등 (1~6학년)" 카드 위쪽 그림 |
| 주의 | 사이트에서 위아래가 조금 잘리므로(2.14:1) 주인공은 가운데에 |

프롬프트:
> Cheerful scene for elementary school learning like a game: a small backpack character or friendly robot climbing a path of glowing quiz stepping stones, with a trophy star, a magnifying glass, a globe and a notebook, progress-bar-like rainbow path, bright yellow, blue and green on a dark background, glossy 3D cartoon, adventurous and fun, no text

---

## 이미 있는 것 (새로 안 만들어도 됨)
- 휴아트 로고(가로형): `art/brand/huart-logo.png`
- 천명 게임 페이지 그림 전부 (키 아트·전장·장수·스크린샷)
