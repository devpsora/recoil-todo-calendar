import { atom } from 'recoil';

// 할일 데이터 상태값
export const todoInputState = atom<string>({
  key: 'todoInputState',
  default: ''
});

// 할일 등록 모달창의 상태값
export const todoFormModalOpenState = atom<boolean>({
  key: 'todoFormModalOpenState',
  default: false
});
