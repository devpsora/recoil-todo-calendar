import React, { useEffect } from 'react';
import styled from '@emotion/styled/macro';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { Todo, selectedTodoState, todoListState } from './atom';
import { todoStatisticsModalOpenState } from "../TodoStatisticsModal/atom";

const EtcItem = styled.li`
  padding: 2px 4px;
  margin: 0;
  font-size: 10px;
  cursor: pointer;
`;

const TodoItem = styled.li<{ done?: boolean; selected?: boolean; }>`
  max-width: 100px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ done, selected }) => selected ? 'rgba(112, 71, 235, 1)' : done ? 'transparent' :  'rgba(112, 71, 235, 0.4)'};
  padding: 2px 4px;
  margin: 0;
  border-radius: 8px;
  font-size: 10px;
  text-decoration: ${({ done }) => done && 'line-through'};
  cursor: pointer;
`;

const Base = styled.ul`
  list-style: none;
  margin: 36px 0 0 0;
  padding: 0;
  width: 100%;
  height: 60px;
  ${TodoItem} + ${TodoItem} {
    margin-top: 1px;
  }
  ${TodoItem} + ${EtcItem} {
    margin-top: 1px;
  }
`;

interface Props {
  items: Array<Todo>;
}

const MAX_TODO_LIST_LENGTH = 3;

const TodoList: React.FC<Props> = ({ items }) => {
  const [selectedTodo, setSelectedTodo] = useRecoilState(selectedTodoState); // 선택한 할일
  const setTodoStatisticsModalOpen = useSetRecoilState(todoStatisticsModalOpenState); // 통계 모달창 상태값
  
  const handleClick = (event: React.SyntheticEvent<HTMLLIElement>, todo: Todo) => {
    event.stopPropagation();
    setSelectedTodo(selectedTodo?.id === todo.id && selectedTodo.date === todo.date ? null : todo);
  }

  // 통계 모달창 열기
  const handleTodoStatisticsModalOpen = (event: React.SyntheticEvent<HTMLLIElement>) => {
    event.stopPropagation();
    setTodoStatisticsModalOpen(true);
  }
  
  return (
    <Base>
      {
        items.slice(0, MAX_TODO_LIST_LENGTH).map((item, index) => (
          <TodoItem
            key={item.id}
            done={item.done}
            selected={item.date === selectedTodo?.date && item.id === selectedTodo?.id}
            onClick={(event: React.SyntheticEvent<HTMLLIElement>) => handleClick(event, item)}>
            { item.date.getDate() + item.content}
          </TodoItem>
        ))
      }
      {items.length > MAX_TODO_LIST_LENGTH && (
        <EtcItem onClick={handleTodoStatisticsModalOpen}>{`그 외 ${items.length - MAX_TODO_LIST_LENGTH}개...`}</EtcItem>
      )}
    </Base>
  )
}

export default TodoList;
