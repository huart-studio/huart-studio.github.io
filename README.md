# 휴아트(HuArt) 웹사이트

https://huart-studio.github.io

구글 Play 조직 계정 인증과 스토어의 "웹사이트"·"개인정보처리방침" 주소로 쓰는 정적 사이트입니다.
이 저장소 하나로 만들고 올립니다. 게임 저장소는 필요 없습니다.

## 파일
- `build/site.json` — 상호·대표자·사업자등록번호·주소·이메일, 게임 목록. **사업자등록증과 똑같이** 적으세요 (구글이 대조함). 빈 칸은 페이지에 "입력 필요"로 보임
- `build/build.js` — 페이지 글(한국어·영어)과 HTML 틀. 게임 소개·개인정보처리방침 문구는 여기서 고침
- `build/DESIGN.md` — 사이트 그림 요청 시트
- `style.css`, `img/` — 디자인과 그림 (만들기 과정에서 그대로 씀). 게임 소개 그림은 `img/chef/` (셰프 서바이버 저장소의 아트·스크린샷에서 만듦)
- `index.html`, `en/`, `chef-survivor/`, `privacy.html` — 만들어진 결과물. **직접 고치지 말 것** (다시 만들면 덮어씀)
- `google5525f3c65b29d534.html` — Google Search Console 소유권 확인 파일. **지우면 인증이 풀림**

## 고친 뒤 올리기
1. `node build/build.js` (Node.js만 있으면 됨, 설치할 패키지 없음)
2. 커밋·푸시 → GitHub Pages가 main 브랜치를 그대로 보여 줌 (1분쯤 뒤 반영)

미리보기: `node build/build.js --preview <폴더>` → 그 폴더에 한국어 첫 페이지

## 도메인 (선택, 추천)
- 도메인을 사면(연 1~2만 원) 사이트 주소와 연락 이메일(`contact@도메인`)을 같은 이름으로 쓸 수 있어 조직 인증에 유리
- 도메인을 연결했으면 `build/site.json`의 `siteUrl`에 넣고 다시 만들기 (공유 미리보기 그림 주소가 정확해짐)

## 출시 후
- `steamUrl`, `playUrl`에 스토어 주소를 넣으면 "출시 예정" 버튼이 "지금 받기" 링크로 바뀜
