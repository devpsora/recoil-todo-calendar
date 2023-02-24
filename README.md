# 리액트 투두 캘린더

## 프로젝트 생성 및 설치

```
mkdir react-todo-calendar
cd ./react-todo-calendar
npx create-react-app ./ --template typescript
```

`필요한 모듈 설치`

```
npm i recoil axios
npm i @emotion/styled @emotion/react react-icons uuid
```

## 스타일 지정

**전역스타일**

> @emotion/react 모듈 사용하는 방법

`globalStyle.ts`

```
import { css } from '@emotion/react';

export const globalStyle = css`
  html, body {
    background-color: #19181A;
    margin: 0;
    font-family: sans-serif, serif, "Apple SD Gothic Neo";
  }
`;
```

`App.tsx`

```
import { Global } from '@emotion/react';
import styled from '@emotion/styled/macro';

 /**** 생략 ****/
 const App: React.FC = () => (
  <RecoilRoot>
    <Global styles={globalStyle} />
    <Container>
     /* 생략 */
    </Container>
  </RecoilRoot>
)
```

## recoil 참고

1. `useRecoilState = useRecoilValue + useSetRecoilState`

```
const [data, setData] = useRecoilState(state);

const data = useRecoilValue(state);
const setData = useSetRecoilState(state);
```

### todo

1. 다크 모드 설정
2. 할 일 체크
3. 할 일 수정
4. DB 연동
