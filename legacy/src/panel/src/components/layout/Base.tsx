import React from 'react';
import { Container } from 'reactstrap';
import BreadCrumbs from './BreadCrumbs';

import Header from './Header';

import './index.css';

interface Props {
  children: React.ReactNode;
}

function Base({ children }: Props) {
  return (
    <main className="h-100">
      <Header></Header>
      <BreadCrumbs />
      <Container>{children}</Container>
    </main>
  );
}

export default Base;
