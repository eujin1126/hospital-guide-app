# 배포 가이드 - 병원길잡이

프론트엔드(Vercel) + 백엔드(Render) 배포 방법입니다.

---

## 프로젝트 구조

```
hospital-guide-app/
├── src/                  ← 프론트엔드 (React + Vite)
├── backend/              ← 백엔드 (Python FastAPI)
│   ├── main.py
│   ├── requirements.txt
│   └── render.yaml
├── vercel.json           ← Vercel 설정
├── .env.example          ← 환경변수 예시
└── package.json
```

---

## 1단계: GitHub에 코드 올리기

### 1-1. GitHub 계정에 새 저장소 만들기
1. https://github.com 접속 후 로그인
2. 우측 상단 `+` → `New repository` 클릭
3. Repository name: `hospital-guide-app` 입력
4. `Public` 선택 (무료 배포를 위해)
5. `Create repository` 클릭

### 1-2. 로컬에서 코드 푸시
터미널을 열고 아래 명령어를 순서대로 실행합니다:

```bash
cd d:\Kiro\hospital-guide-app
git init
git add .
git commit -m "초기 커밋: 병원길잡이 웹앱"
git branch -M main
git remote add origin https://github.com/본인아이디/hospital-guide-app.git
git push -u origin main
```

> `본인아이디` 부분을 실제 GitHub 아이디로 변경하세요.

---

## 2단계: 백엔드 배포 (Render)

### 2-1. Render 가입
1. https://render.com 접속
2. `Get Started for Free` → GitHub 계정으로 가입

### 2-2. 새 웹 서비스 만들기
1. 대시보드에서 `New +` → `Web Service` 클릭
2. `Build and deploy from a Git repository` 선택
3. 방금 올린 `hospital-guide-app` 저장소 연결

### 2-3. 설정 입력
| 항목 | 값 |
|------|-----|
| Name | `hospital-guide-api` |
| Region | `Singapore` (가까운 곳) |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### 2-4. 환경변수 설정
`Environment` 탭에서 추가:
| Key | Value |
|-----|-------|
| `ALLOWED_ORIGINS` | `https://본인앱이름.vercel.app` |

> Vercel 배포 후 실제 URL을 알게 되면 여기로 돌아와서 수정합니다.

### 2-5. 배포
`Create Web Service` 클릭 → 빌드가 시작됩니다 (2~3분 소요).

완료되면 이런 URL이 나옵니다:
```
https://hospital-guide-api-xxxx.onrender.com
```
이 URL을 메모해두세요!

### 2-6. 확인
브라우저에서 해당 URL을 열면:
```json
{"message": "병원길잡이 API 서버가 정상 작동 중입니다."}
```
이 보이면 성공입니다.

---

## 3단계: 프론트엔드 배포 (Vercel)

### 3-1. Vercel 가입
1. https://vercel.com 접속
2. `Sign Up` → GitHub 계정으로 가입

### 3-2. 새 프로젝트 만들기
1. 대시보드에서 `Add New...` → `Project` 클릭
2. `Import Git Repository`에서 `hospital-guide-app` 선택
3. `Import` 클릭

### 3-3. 설정 확인
Vercel이 자동으로 Vite를 감지합니다. 아래 설정을 확인:
| 항목 | 값 |
|------|-----|
| Framework Preset | `Vite` |
| Root Directory | `.` (기본값, 변경하지 않음) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 3-4. 환경변수 설정
`Environment Variables` 섹션에서 추가:
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://hospital-guide-api-xxxx.onrender.com` |

> 2단계에서 메모한 Render URL을 여기에 붙여넣기 합니다.

### 3-5. 배포
`Deploy` 클릭 → 빌드 시작 (1~2분 소요).

완료되면 이런 URL이 나옵니다:
```
https://hospital-guide-app-xxxx.vercel.app
```

---

## 4단계: CORS 연결 마무리

Vercel 배포 URL을 알았으니, Render로 돌아가서 환경변수를 업데이트합니다:

1. Render 대시보드 → `hospital-guide-api` 서비스 클릭
2. `Environment` 탭
3. `ALLOWED_ORIGINS` 값을 실제 Vercel URL로 수정:
   ```
   https://hospital-guide-app-xxxx.vercel.app
   ```
4. `Save Changes` → 서비스가 자동으로 재시작됩니다.

---

## 5단계: 동작 확인

배포된 Vercel URL에 접속해서 아래를 확인합니다:

1. 로그인 (EMP2024001 / 아무 비밀번호) → 대시보드 진입
2. 전체 환자 목록에서 검색
3. 환자 상세보기 → 검사 정보 확인
4. AI 안내문 생성 → 안내문 편집
5. 인쇄 미리보기

---

## 문제 해결

### "API 연결 안 됨"
- Render 대시보드에서 서비스가 `Live` 상태인지 확인
- Render 무료 플랜은 15분 비활동 시 슬립 모드에 들어갑니다. 첫 요청 시 30초 정도 기다리면 깨어남

### "CORS 에러"
- Render 환경변수 `ALLOWED_ORIGINS`에 Vercel URL이 정확히 들어가 있는지 확인
- URL 끝에 `/`가 없어야 합니다 (예: `https://app.vercel.app` O, `https://app.vercel.app/` X)

### "빌드 실패"
- Vercel: Build Command가 `npm run build`인지 확인
- Render: Root Directory가 `backend`인지 확인

---

## 로컬 개발 시

프론트엔드:
```bash
cd d:\Kiro\hospital-guide-app
npx vite --host
```

백엔드:
```bash
cd d:\Kiro\hospital-guide-app\backend
pip install -r requirements.txt
python main.py
```

두 서버를 동시에 켜면 `http://localhost:5173`에서 프론트, `http://localhost:8000`에서 API가 동작합니다.
