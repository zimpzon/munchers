import React, { Component, useState } from 'react';

function TextMultiline(): JSX.Element {
  const [json, setJson] = useState('it works');

  return (
    <>
      <textarea value={json} />
    </>
  );
}

export default TextMultiline;
