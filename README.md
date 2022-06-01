## DebaTalk

디베이톡 (Debatalk) 백엔드 레포지토리 입니다!

```
2022-04-04 ~ ing...
```

<br />

로컬서버 시작

```
npm run start:dev
or
yarn start:dev
```

<br />

## 🔖 commit message style

| message  | descripton                                                                                   |
| -------- | -------------------------------------------------------------------------------------------- |
| feat     | 새로운 기능 추가                                                                             |
| fix      | 버그 수정                                                                                    |
| test     | Test 관련한 코드의 추가, 수정                                                                |
| refactor | 코드를 리펙토링                                                                              |
| chore    | (코드의 수정 없이) 설정을 변경                                                               |
| docs     | 문서의 수정                                                                                  |
| style    | (코드의 수정 없이) 스타일(style)만 변경<br />(들여쓰기 같은 포맷이나 세미콜론을 빼먹은 경우) |

<br />

## ⚙ settings

settings.json

```json
  "workbench.iconTheme": "material-icon-theme",
  "material-icon-theme.activeIconPack": "nest",
```

node -v

```
v16.14.2
```

.env

```
MONGODB_URI=...

PORT=...
ORIGIN=...
SERVER_URI=...

MODE=...

JWT_SECRET=...

SWAGGER_USER=...
SWAGGER_PASSWORD=...
```

<br />

### todo-list

- [x] debate-post schema 생성
- [x] debate-post 생성, 조회, 특정 조회
- [ ] debate-post 수정, 삭제, 좋아요 싫어요 등등 추가
- [ ] debate-post common api 작성
- [ ] 대댓글 기능 추가
- [ ] report schema 생성, 기능 추가
- [ ] community 추가
- [ ] 알림기능 추가
