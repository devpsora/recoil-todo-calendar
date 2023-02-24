import { atom, atomFamily, selectorFamily } from 'recoil';
import { isSameDay } from '../../utils/index';

export interface Todo {
  id: string;
  content: string;
  done: boolean;
  date: Date;
}

// 전체 할일 목록
export const todoListState = atom<Array<Todo>>({
  key: 'todoListState',
  default: [],
});

// 선택된 날짜
export const selectedDateState = atom<Date>({
  key: 'selectedDateState',
  default: new Date(),
});

// 할일 목록에 입력할 데이터(....선택된 날짜랑 동일하게 쓰니까 바인딩 오류로 계속 뻘짓함..^^*;;)
export const inputDateState = atom<Date>({
  key: 'inputDateState', 
  default: new Date(),
})

// 선택된 할일 
export const selectedTodoState = atom<Todo | null>({
  key: 'selectedTodoState',
  default: null,
});

// 선택한 날짜의 할일 목록
export const filteredTodoListState = atomFamily<Array<Todo>, Date>({
  key: 'filteredTodoListState',
  default: selectorFamily({
    key: 'filteredTodoListState/default',
    get: (selectedDate) => ({ get }) => {
      const todoList = get(todoListState);
      return todoList.filter(todo => isSameDay(todo.date, selectedDate));
    }
  })
})