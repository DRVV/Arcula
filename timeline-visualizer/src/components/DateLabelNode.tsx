import React from 'react';
import { format } from 'date-fns';

interface DateLabelNodeProps {
  data: {
    date: Date;
    label: string;
  };
}

export default function DateLabelNode({ data }: DateLabelNodeProps) {
  return (
    <div className="date-label-node pointer-events-none select-none">
      <div className="text-center">
        <span className="text-4xl font-semibold text-gray-300 whitespace-nowrap">
          {data.label}
        </span>
      </div>
    </div>
  );
}
