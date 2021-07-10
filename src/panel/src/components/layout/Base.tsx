import React from 'react';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

function Base({ children }: Props) {
  return (
    <div>
      <Header></Header>
    </div>
  );
}

export default Base;
