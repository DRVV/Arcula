"use client";

import React, { useState } from 'react';

export default function Chat({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState('');

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  return (
    <div className="chat">
      <input
        placeholder="Ask the coordinator…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
      />
      <button onClick={submit}>Send</button>
    </div>
  );
}

