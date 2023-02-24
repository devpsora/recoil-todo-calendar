import React, { useState, useEffect, useMemo } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import styled from '@emotion/styled/macro';

import { selectedDateState, selectedTodoState, todoListState } from '../../features/TodoList/atom';
import CalendarDay from "./CalendarDay";

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  padding: 8px 24px;
  font-size: 24px;
  font-weight: normal;
  text-align: center;
  color: #F8F7FA;
`;

const ArrowButton = styled.button<{ pos: 'left' | 'right' }>`
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #F8F7FA;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
  padding-block: 12px;
  > tr {
    > th {
      padding-block: 12px;
      font-weight: normal;
      color: #F8F7FA;
    }
  }
`;

const TableBody = styled.tbody`
  > tr {
    > td {
      width: 128px;
      height: 128px;
      box-sizing: border-box;
    }
  }
`;

const TableData = styled.td`
  text-align: center;
  color: #C9C8CC;
  padding: 8px;
  position: relative;
`;

const Base = styled.div<{isOn?: boolean}>`
  min-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  padding: 24px;
  height: calc(100vh - 48px);
  box-sizing: border-box;
  // background-color: ${({ isOn }) => isOn ? '#28272A' : '#E6E6E6'};
  background-color: '#28272A'
  ${Header} + ${Table} {
    margin-top: 36px;
  }
`;

const ToggleContainer = styled.div`
  position: relative;
  left: 47%;
  cursor: pointer;
`;

const ToggleBox = styled.div<{ isOn: boolean }>`
  width: 50px;
  height: 24px;
  border-radius: 30px;
  background-color: #7047EB;
`
const ToggleCircle = styled.div<{ isOn: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ isOn }) => isOn ? '27px' : '2px'};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgb(255,254,255);
  transition : 0.5s
`

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Calendar: React.FC = () => {
  const [isOn, setIsOn] = useState(false); // 모드설정

  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState); // 선택한 날짜
  const todoList = useRecoilValue(todoListState); // 전체 할일 목록

  const { year, month, /*date, */ firstDay, lastDay } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const date = selectedDate.getDate();

    return ({
      year,
      month,
      date,
      firstDay: new Date(year, month, 1),
      lastDay: new Date(year, month + 1, 0)
    })
  }, [selectedDate]);

  const handleMode = () => {
    setIsOn(!isOn);
  }
  
  const handleGoTo = (d: Date) => {
    setSelectedDate(d);
  }

  const pad = () => [...Array(firstDay.getDay()).keys()].map((p: number) => <TableData key={`pad_${p}`} />);

  const range = () => [...Array(lastDay.getDate()).keys()].map((d: number) => (
    <CalendarDay key={d} date={new Date(year, month, d + 1)} />
  ));

  const renderDays = () => {
    const items = [...pad(), ...range()];

    const weeks = Math.ceil(items.length / 7);

    return [...Array(weeks).keys()].map((week: number) => (
      <tr key={`week_${week}`}>
        {items.slice(week * 7, week * 7 + 7)}
      </tr>
    ));
  }

  // 할 일 삭제
  const removeTodo = useRecoilCallback(({ snapshot, set }) => () => {
    const todoList = snapshot.getLoadable(todoListState).getValue(); // 현재 스냅샷에 포함된 할일 목록 상태값
    const selectedTodo = snapshot.getLoadable(selectedTodoState).getValue(); // 선택한 날짜에 할일
    
    set(todoListState, todoList.filter(todo => todo.id !== selectedTodo?.id)); // 선택한 날짜의 할일을 제외한 나머지 할 일 목록을 다시 SET
  }, [selectedDate, todoList]);

  // 이전키 이벤트 발생 시 할 일 삭제
  useEffect(() => {
    const onBackspaceKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        removeTodo();
      }
    };
    window.addEventListener('keydown', onBackspaceKeyDown);

    return () => {
      window.removeEventListener('keydown', onBackspaceKeyDown);
    }
  }, [removeTodo]);

  return (
    <Base isOn={isOn}>
      <ToggleContainer onClick={handleMode}>
        <ToggleBox isOn={isOn} />
        <ToggleCircle isOn={isOn} />
      </ToggleContainer>
      <Header>
        <ButtonContainer>
          <ArrowButton pos="left" onClick={() => handleGoTo(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
            <BiChevronLeft />
          </ArrowButton>
          <Title>{`${MONTHS[month]} ${year}`}</Title>
          <ArrowButton pos="right" onClick={() => handleGoTo(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
            <BiChevronRight />
          </ArrowButton>
        </ButtonContainer>
      </Header>
      <Table>
        <TableHeader>
          <tr>
            {
              DAYS.map((day) => (
                <th key={day} align="center">{day}</th>
              ))
            }
          </tr>
        </TableHeader>
        <TableBody>
          {renderDays()}
        </TableBody>
      </Table>
    </Base>
  )
}

export default Calendar;
