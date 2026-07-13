# Choa Manager Secure - 개발 진행 사항

## Phase 1: 데이터베이스 스키마 및 서버 라우터 구축

### 스키마 설계
- [ ] Discord 사용자 정보 테이블 (discordUsers)
- [ ] 서버 설정 테이블 (serverSettings)
- [ ] 문의 테이블 (inquiries)
- [ ] 디스코드 웹훅 설정 테이블 (webhookSettings)

### 서버 라우터
- [ ] Discord OAuth 콜백 처리
- [ ] 관리자 전용 프로시저 (adminProcedure)
- [ ] 문의 CRUD 라우터
- [ ] 서버 설정 라우터
- [ ] 웹훅 알림 라우터

---

## Phase 2: 디스코드 OAuth 인증 및 관리자 접근 제어

### OAuth 구현
- [ ] Discord OAuth 환경 변수 설정
- [ ] OAuth 콜백 URL 처리
- [ ] 세션 관리 (JWT 기반 쿠키)
- [ ] HTTPS 전용 쿠키 설정

### 접근 제어
- [ ] Role 기반 인증 (admin/user)
- [ ] 관리자 승인 시스템
- [ ] 비관리자 접근 차단

---

## Phase 3: 관리자 대시보드 UI 및 레이아웃

### 대시보드 레이아웃
- [ ] 모바일 반응형 사이드바
- [ ] 햄버거 메뉴 (모바일)
- [ ] 터치 친화적 UI 요소

### 페이지 구성
- [ ] 로그인 페이지
- [ ] 대시보드 홈
- [ ] 서버 선택 페이지
- [ ] 봇 설정 관리 페이지
- [ ] 문의 목록 페이지
- [ ] 문의 상세 페이지

---

## Phase 4: 문의 시스템 및 디스코드 웹훅 통합

### 문의 시스템
- [ ] 문의 시작 버튼 및 폼
- [ ] 문의 제목, 내용, 이메일 입력
- [ ] 문의 DB 저장
- [ ] 문의 목록 조회
- [ ] 문의 상세 조회
- [ ] 문의 종료 기능 (관리자만)
- [ ] 문의 종료 버튼 (관리자 노출)

### 디스코드 웹훅
- [ ] 문의 접수 알림 (Embed 형식)
- [ ] 문의 종료 알림 (Embed 형식)
- [ ] !문의종료 명령어 처리
- [ ] 웹훅 설정 관리

---

## Phase 5: 전체 기능 검증 및 결과 전달

### 검증
- [ ] 모바일 반응형 테스트
- [ ] OAuth 로그인 흐름 테스트
- [ ] 관리자 접근 제어 테스트
- [ ] 문의 CRUD 기능 테스트
- [ ] 디스코드 웹훅 알림 테스트
- [ ] 보안 세션 관리 테스트

### 배포
- [ ] 최종 체크포인트 생성
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

## 보안 체크리스트

- [ ] HTTPS 전용 쿠키 설정
- [ ] CSRF 보호
- [ ] XSS 방지
- [ ] SQL Injection 방지
- [ ] Rate Limiting
- [ ] 권한 검증 (모든 관리자 작업)

---

## 스타일 가이드

- 미니멀한 스칸디나비안 감성
- 연한 쿨 그레이 배경
- 굵고 검은 산세리프 폰트 (메인)
- 얇고 가는 폰트 (서브타이틀)
- 소프트 파스텔 블루와 블러시 핑크 포인트
- 추상적 기하학 도형 활용
