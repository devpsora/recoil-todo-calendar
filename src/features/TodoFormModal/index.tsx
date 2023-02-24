import React, { useRef, useEffect } from 'react';
import styled from '@emotion/styled/macro';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuidv4} from 'uuid';

import { todoInputState, todoFormModalOpenState } from './atom';
import Modal from '../../components/Modal/Index';
import { inputDateState, selectedDateState, todoListState } from '../TodoList/atom';
import { getSimpleDateFormat } from '../../utils/index';

const Container = styled.div`
  width: 100vw;
  max-width: 386px;
  padding: 8px;
`;

const Date = styled.small`
  display: block;
  color: #C9C8CC;
`;

const InputTodo = styled.input`
  padding: 16px 24px;
  border: none;
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  color: #C9C8CC;
  caret-color: #C9C8CC;
`;

const Card = styled.div`
  width: 100%;
  max-width: 370px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  box-sizing: border-box;
  background-color: #19181A;
  ${Date} + ${InputTodo} {
    margin-top: 24px;
  }
;
`;

const TodoFormModal: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [todo, setTodo] = useRecoilState(todoInputState);
  const selectedDate = useRecoilValue(selectedDateState); // 화면에서 선택한 날짜
  const [inputDate, setInputDate] = useRecoilState(inputDateState); // 할일 목록에 입력할 날짜
  const todoList = useRecoilValue(todoListState);

  const [isOpen, setIsOpen] = useRecoilState(todoFormModalOpenState); // 모달창 상태값

  // 팝업이 열린 상태인 경우 입력창에 포커스
  useEffect(() => {
    isOpen && inputRef.current?.focus();
  }, [isOpen]);
  
  // 할일 목록 입력창 리셋
  const reset = () => {
    setTodo('');
    inputRef.current?.focus();
  }

  // 팝업 닫기
  const handleClose = () => setIsOpen(false);

  // 할일 추가
  const addTodo = useRecoilCallback(({ snapshot, set }) => () => {
    const todoList = snapshot.getLoadable(todoListState).getValue();
    // 입력할 날짜 데이터를 업데이트한 후에 신규 할 일을 등록한다...
    setInputDate(selectedDate);
    // 신규 할 일
    const newTodo = { id: uuidv4(), content: todo, done: false, date: inputDate };
    
    set(todoListState, [...todoList, newTodo]);
  }, [todo, inputDate, todoList]);

  // 키 이벤트
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
      reset();
      handleClose();
    }
  }

  // 입력창의 값이 변경되면 발생하는 이벤트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container>
        <Card>
          <Date>{getSimpleDateFormat(selectedDate)}</Date>
          <InputTodo ref={inputRef} placeholder="새로운 이벤트" onKeyPress={handleKeyPress} value={todo} onChange={handleChange} />
        </Card>
      </Container>
    </Modal>
  )
}

export default TodoFormModal;
