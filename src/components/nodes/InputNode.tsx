import React from 'react';
import { Handle, Position } from '@xyflow/react';

import type { NodeProps } from '@xyflow/react';

type Props = NodeProps & { selected?: boolean };
const InputNode: React.FC<Props> = ({ data, selected }: Props) => {
  return (
    <div className={`input-node ${selected ? 'selected' : ''}`}>
      <Handle type="source" position={Position.Right} />
      <div className="input-node__body">{data?.label || '输入'}</div>
    </div>
  );
};

export default InputNode;