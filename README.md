# KanbanBoard

> 드래그 앤 드롭을 지원하는 Trello 스타일의 칸반 보드 웹 앱

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css)

---

## 프로젝트 소개

KanbanBoard는 Next.js App Router 기반으로 구축된 칸반 보드 애플리케이션입니다.  
Trello와 유사한 UX를 목표로, 카드와 컬럼을 자유롭게 구성하고 드래그 앤 드롭으로 작업 흐름을 관리할 수 있습니다.  
별도의 백엔드 없이 localStorage에 상태를 저장하여 새로고침 후에도 데이터가 유지됩니다.

---

## 기능 설명

### 카드 (Card)
- **생성**: 컬럼 하단의 `+ Add a card` 버튼으로 인라인 입력 후 추가
- **조회 / 수정**: 카드 클릭 시 모달이 열리며 제목과 설명을 편집
  - `Cmd / Ctrl + Enter` 로 저장, `Escape` 로 닫기
- **삭제**: 카드 우측 상단의 `×` 버튼 (호버 시 노출)

### 컬럼 (Column)
- **생성**: 보드 우측 끝의 `+ Add a column` 버튼으로 인라인 입력 후 추가
- **이름 수정**: 컬럼 제목 더블클릭으로 인라인 편집
- **삭제**: 삭제 버튼 클릭 후 3초 내 재확인 (3초 후 자동 취소)
- **카드 수 뱃지**: 컬럼 헤더에 포함된 카드 수 실시간 표시

### 드래그 앤 드롭
- 카드를 같은 컬럼 내에서 순서 변경
- 카드를 다른 컬럼으로 이동
- 드래그 중인 카드는 점선 테두리로 표시, 드롭 영역은 하이라이트
- 드래그 오버레이(lifted card)로 자연스러운 시각적 피드백

### 데이터 지속성
- Zustand `persist` 미들웨어로 localStorage에 자동 저장
- 새로고침 후에도 보드 상태 복원

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| UI 라이브러리 | React 19 |
| 언어 | TypeScript 5 |
| 상태 관리 | Zustand 5 (persist 미들웨어) |
| 드래그 앤 드롭 | @dnd-kit/core, @dnd-kit/sortable |
| 스타일링 | Tailwind CSS v4 |
| 코드 품질 | ESLint 9, Prettier 3 |

---

## 구현 포인트

### 1. 정규화된 상태 구조 (Normalized State)

중첩 배열 대신 `Map<Id, Entity>` 형태로 상태를 관리합니다.  
카드 이동 시 해당 컬럼의 `cardIds`만 수정하면 되므로 불필요한 전체 재렌더링을 방지합니다.

```
BoardState
├── boards:  Map<BoardId, Board>
├── columns: Map<ColumnId, Column>   ← Column은 cardIds[]만 보유
└── cards:   Map<CardId, Card>
```

### 2. 드래그 중 모달 오픈 방지

카드 클릭과 드래그 종료가 같은 이벤트 흐름으로 처리되어, 드래그 후 모달이 열리는 문제가 발생합니다.  
`didDragRef` 플래그와 `requestAnimationFrame` 딜레이를 조합해 드래그 완료 직후 클릭 이벤트를 무시합니다.

```ts
// 드래그 종료 시 플래그 설정
didDragRef.current = true;
// 다음 프레임에서 플래그 해제 → 그 사이 발생하는 onClick 차단
requestAnimationFrame(() => { didDragRef.current = false; });
```

### 3. 컬럼 삭제 3초 확인 UX

즉각 삭제 대신 3초 카운트다운 동안 취소 가능한 두-단계 삭제 흐름을 구현합니다.  
`setTimeout` ref를 저장해 취소 시 타이머를 정리합니다.

### 4. `useInlineEditor` 커스텀 훅

카드 추가·컬럼 추가에서 공통으로 사용되는 인라인 에디터 로직(표시/숨김, 입력값, 제출/취소 핸들러)을 단일 훅으로 추상화했습니다.

### 5. Hydration Mismatch 방지

Zustand의 localStorage 복원은 클라이언트 사이드에서만 발생합니다.  
`useEffect`로 마운트 이후 hydration을 완료하고, 그 전까지는 빈 화면을 렌더링해 서버-클라이언트 불일치를 방지합니다.

### 6. 성능 최적화

- `Column`, `Card` 컴포넌트에 `React.memo` 적용
- `useMemo`로 컬럼 데이터 재계산 최소화
- `useCallback`으로 이벤트 핸들러 참조 안정화

---

## 실행 방법

### 사전 요구사항

- Node.js 18 이상
- npm / yarn / pnpm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/koreahghg/KanbanBoard.git
cd KanbanBoard

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속합니다.

### 빌드 및 프로덕션 실행

```bash
npm run build
npm start
```

### 코드 품질

```bash
# 린트 검사
npm run lint

# 코드 포맷팅
npm run format
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (Geist 폰트, 메타데이터)
│   ├── page.tsx            # 보드 페이지 (DnD 로직, 상태 연결)
│   └── globals.css         # 전역 스타일
├── components/
│   └── board/
│       ├── Column.tsx           # 컬럼 컨테이너
│       ├── Card.tsx             # 드래그 가능한 카드
│       ├── CardContent.tsx      # 카드 내용 렌더러
│       ├── CardDetailModal.tsx  # 카드 상세 편집 모달
│       ├── AddCard.tsx          # 카드 인라인 생성
│       └── AddColumn.tsx        # 컬럼 인라인 생성
├── hooks/
│   └── useInlineEditor.ts   # 인라인 에디터 공통 훅
├── store/
│   └── boardStore.ts        # Zustand 보드 상태 및 액션
├── types/
│   └── index.ts             # TypeScript 타입 정의
└── lib/
    ├── utils.ts             # UUID 생성 유틸
    └── dummyData.ts         # 초기 샘플 데이터
```
