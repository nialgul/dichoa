# Choa Manager Secure - 개발 진행 사항

## Phase 1: 데이터베이스 스키마 및 서버 라우터 구축

### 스키마 설계
- [x] Discord 사용자 정보 테이블 (discordUsers)
- [x] 서버 설정 테이블 (serverSettings)
- [x] 문의 테이블 (inquiries)
- [x] 디스코드 웹훅 설정 테이블 (webhookSettings)

### 서버 라우터
- [x] Discord OAuth 콜백 처리
- [x] 관리자 전용 프로시저 (adminProcedure)
- [x] 문의 CRUD 라우터
- [x] 서버 설정 라우터
- [x] 웹훅 알림 라우터

---

## Phase 2: 디스코드 OAuth 인증 및 관리자 접근 제어

### OAuth 구현
- [x] Discord OAuth 환경 변수 설정
- [x] OAuth 콜백 URL 처리
- [x] 세션 관리 (JWT 기반 쿠키)
- [x] HTTPS 전용 쿠키 설정

### 접근 제어
- [x] Role 기반 인증 (admin/user)
- [x] 관리자 승인 시스템
- [x] 비관리자 접근 차단

---

## Phase 3: 관리자 대시보드 UI 및 레이아웃

### 대시보드 레이아웃
- [x] 모바일 반응형 사이드바
- [x] 햄버거 메뉴 (모바일)
- [x] 터치 친화적 UI 요소

### 페이지 구성
- [x] 로그인 페이지 (기존 Manus OAuth 사용)
- [x] 대시보드 홈
- [x] 서버 선택 페이지
- [x] 봇 설정 관리 페이지
- [x] 문의 목록 페이지
- [x] 문의 상세 페이지

---

## Phase 4: 문의 시스템 및 디스코드 웹훅 통합

### 문의 시스템
- [x] 문의 시작 버튼 및 폼
- [x] 문의 제목, 내용, 이메일 입력
- [x] 문의 DB 저장
- [x] 문의 목록 조회
- [x] 문의 상세 조회
- [x] 문의 종료 기능 (관리자만)
- [x] 문의 종료 버튼 (관리자 노출)

### 디스코드 웹훅
- [x] 문의 접수 알림 (Embed 형식)
- [x] 문의 종료 알림 (Embed 형식)
- [x] !문의종료 명령어 처리
- [x] 웹훅 설정 관리

---

## Phase 5: 전체 기능 검증 및 Render 배포

### 검증
- [ ] 모바일 반응형 테스트
- [ ] OAuth 로그인 흐름 테스트
- [ ] 관리자 접근 제어 테스트
- [ ] 문의 CRUD 기능 테스트
- [ ] 디스코드 웹훅 알림 테스트
- [ ] 보안 세션 관리 테스트

### 배포
- [ ] 최종 체크포인트 생성
- [ ] Render 배포 설정
- [ ] 사용자에게 결과 전달

---

## 주요 기술 스택

- **Frontend**: React 19, TailwindCSS 4, TypeScript
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Discord OAuth 2.0, Manus OAuth (기존)
- **Session**: JWT 기반 쿠키
- **Webhooks**: Discord Webhook API

---

## 구현된 기능

### 1. 데이터베이스 스키마
- `discordUsers`: Discord 계정 정보 및 OAuth 토큰 저장
- `serverSettings`: 서버별 봇 설정 저장
- `inquiries`: 사용자 문의 저장
- `webhookSettings`: Discord 웹훅 알림 설정

### 2. 서버 라우터 (tRPC)
- `discord.getServers`: 사용자의 Discord 서버 목록 조회
- `serverSettings.get/update`: 서버 설정 조회 및 수정
- `inquiries.create/list/get/close`: 문의 CRUD 및 종료
- `webhookSettings.get/update`: 웹훅 설정 관리

### 3. 프론트엔드 페이지
- `Home.tsx`: 랜딩 페이지 및 기능 소개
- `Dashboard.tsx`: 관리자 대시보드 메인
- `InquiriesPage.tsx`: 문의 관리 페이지

### 4. 보안 기능
- Admin 프로시저로 관리자 전용 기능 보호
- Role 기반 접근 제어 (admin/user)
- JWT 기반 세션 관리
- HTTPS 전용 쿠키 설정

---

## 보안 체크리스트

- [x] HTTPS 전용 쿠키 설정
- [x] CSRF 보호 (tRPC 기본)
- [x] XSS 방지 (React 기본)
- [x] SQL Injection 방지 (Drizzle ORM)
- [ ] Rate Limiting (향후 추가)
- [x] 권한 검증 (모든 관리자 작업)

---

## 스타일 가이드

- 미니멀한 모던 디자인
- 연한 그레이 배경 (#f3f4f6)
- 깔끔한 산세리프 폰트
- 파란색 강조 색상
- 모바일 우선 반응형 디자인

---

## 다음 단계

1. ✅ 데이터베이스 및 서버 구현 완료
2. ✅ 프론트엔드 UI 구현 완료
3. ⏳ 최종 테스트 및 체크포인트 생성
4. ⏳ Render 배포 설정 및 배포
