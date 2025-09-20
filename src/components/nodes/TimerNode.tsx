import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

type TimerNodeData = {
  label: string;
  timeUnit: 'ms' | 's';
  timerValue: number;
};

type Props = NodeProps & { 
  data: TimerNodeData,
  selected?: boolean 
};

const TimerNode: React.FC<Props> = ({ data, selected }: Props) => {
  return (
    <div className={`timer-node ${selected ? 'selected' : ''}`}>
      {/* <Handle type="target" position={Position.Left} /> */}
      <div className="timer-node__body">
        <div className="timer-node__label">{data?.label || 'Timer'}</div>
        <div className="timer-node__value">{data?.timerValue} {data?.timeUnit}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TimerNode;