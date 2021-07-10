import React from 'react';
import { Container } from 'reactstrap';

import Header from './Header';

import './index.css';

interface Props {
  children: React.ReactNode;
}

function Base({ children }: Props) {
  return (
    <main className="h-100">
      <Header></Header>
      <div className="mb-4"></div>
      <Container>{children}</Container>
    </main>
  );
}

export default Base;
