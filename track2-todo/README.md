# Track 2-2 — JavaScript Todo 리스트

## 시연 영상

> 

https://github.com/user-attachments/assets/12155b0b-d50f-4f44-a796-0e4a76dccaae


> 
> 영상에 포함되어야 할 동작:
> - 할 일 추가
> - 할 일 수정 (모달 창)
> - 할 일 삭제
> - 완료/미완료 토글
> - 필터 (전체/미완료/완료)
> - 정렬 변경

## 파일 구조

```
track2-todo/
├── index.html
├── css/style.css
└── js/todo.js
```

## 실행 방법

`index.html`을 브라우저에서 열면 바로 실행됩니다.

## 주요 기능

- **추가**: 텍스트 + 마감일 입력
- **수정**: 수정 버튼 클릭 → 모달 창에서 수정
- **삭제**: 삭제 버튼 클릭 → 확인 후 삭제
- **조회**: 전체/미완료/완료 필터, 최신순/오래된순/이름순/마감일순 정렬
- 데이터는 localStorage에 저장되어 새로고침 후에도 유지
