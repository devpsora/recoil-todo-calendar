import React from 'react';
import { Global } from '@emotion/react';
import styled from '@emotion/styled/macro';
import { globalStyle } from './globalStyle';
import { RecoilRoot } from 'recoil';

import Calendar from './components/Calendar/Index';
import TodoFormModal from './features/TodoFormModal';
import TodoStatisticsModal from './features/TodoStatisticsModal';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;

const App: React.FC = () => (
  <RecoilRoot>
    <Global styles={globalStyle} />
    <Container>
      {/** Calendar */}
      <Calendar />
    </Container>
    {/** Modal */}
    <TodoFormModal />
    <TodoStatisticsModal />
  </RecoilRoot>
)

export default App;
