import React from 'react';
import { Handle, Position } from '@xyflow/react';

import type { NodeProps } from '@xyflow/react';

type Props = NodeProps & { selected?: boolean };
const ProcessNode: React.FC<Props> = ({ data, selected }: Props) => {
  return (
    <div className={`input-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="input-node__body">{data?.label || '输入'}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ProcessNode;
