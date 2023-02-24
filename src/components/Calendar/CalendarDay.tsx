import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from '@emotion/styled/macro';

import TodoList from '../../features/TodoList/Index';

import { filteredTodoListState, selectedDateState } from '../../features/TodoList/atom';
import { isSameDay } from '../../utils/index';
import { todoFormModalOpenState } from '../../features/TodoFormModal/atom';
import { todoStatisticsModalOpenState } from '../../features/TodoStatisticsModal/atom';

const TableData = styled.td`
  text-align: center;
  color: #C9C8CC;
  padding: 8px;
  position: relative;
`;

const DisplayDate = styled.div<{ isToday?: boolean; isSelected?: boolean; }>`
  color: ${({ isToday }) => isToday && '#F8F7FA'};
  background-color: ${({ isToday, isSelected }) => isSelected ? '#7047EB' : isToday ? '#313133' : ''};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  align-self: flex-end;
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
`;

const Container = styled.div``;

interface Props {
  date: Date;
}

const CalendarDay: React.FC<Props> = ({ date }) => {
  const today = new Date();
  
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState); // 선택한 날짜
  const todoList = useRecoilValue(filteredTodoListState(date)); // 선택한 날짜의 할일 목록
  
  const setTodoFormModalOpen = useSetRecoilState(todoFormModalOpenState);
  const setTodoStatisticsModalOpen = useSetRecoilState(todoStatisticsModalOpenState);

  // 할일 목록 모달창 열기
  const handleTodoFormModalOpen = (d: number) => {
    handleDateSelect(d);
    setTodoFormModalOpen(true);
  };

  // 선택한 날짜로 상태값 업데이트
  const handleDateSelect = (d: number) => {
    setSelectedDate(new Date(selectedDate.setDate(d)));
  }

  // 할일 통계 모달창 열기
  const handleTodoStatisticsModalOpen = (event: React.SyntheticEvent<HTMLDivElement>, d: number) => {
    event.stopPropagation();
    setTodoStatisticsModalOpen(true);
  }

  return (
    <TableData
      key={`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
      align="center"
      onDoubleClick={() => handleTodoFormModalOpen(date.getDate())}
    >
      <Container>
        <DisplayDate
          isSelected={isSameDay(selectedDate, date)}
          isToday={isSameDay(date, today)}
          onClick={() => handleDateSelect(date.getDate())}
          onDoubleClick={(e) => handleTodoStatisticsModalOpen(e, date.getDate())}
        >
          {date.getDate()}
        </DisplayDate>
        <TodoList
          items={todoList}
        />
      </Container>
    </TableData>
  )
}

export default CalendarDay;
