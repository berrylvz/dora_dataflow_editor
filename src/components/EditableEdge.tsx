import {BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, getBezierPath} from '@xyflow/react';
import {useState, useRef, useEffect, useMemo} from 'react';

import "./EditableEdge.css"

export default function EditableLabelEdge(props: EdgeProps) {
    const {id, sourceX, sourceY, targetX, targetY, data} = props;

    /* -------- 路径 & 标签位置 -------- */
    const [path, labelX, labelY] = getBezierPath({sourceX, sourceY, targetX, targetY});

    /* -------- 本地编辑状态 -------- */
    const [text, setText] = useState(data?.label ?? '');
    const [editing, setEditing] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    /* -------- 保存 / 取消 -------- */
    const save = () => {
        data?.onLabelChange?.(id, text);
        setEditing(false);
    };
    const cancel = () => {
        setText(data?.label ?? '');
        setEditing(false);
    };

    const markerEnd = 'url(#arrowhead)';

    return (
        <>
            {/* 1. 渲染边本身 */}
            {/* <BaseEdge path={path}/> */}

            {/* 定义 marker */}
            <svg>
                <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="10"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,10 L10,5 z" fill="#222" />
                </marker>
                </defs>
            </svg>

            {/* 1. 渲染边本身，带箭头 */}
            <BaseEdge path={path} markerEnd={markerEnd} />

            {/* 2. 渲染可交互标签 */}
            <EdgeLabelRenderer>
                <div
                    className="edge-label"
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                >
                    {editing ? (
                        <input
                            ref={inputRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onBlur={save}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') save();
                                if (e.key === 'Escape') cancel();
                            }}
                            className="edge-input"
                        />
                    ) : (
                        <span onDoubleClick={() => setEditing(true)} className="edge-text">
                            {text || 'Double click to edit'}
                        </span>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

/* ---- 工具函数：计算贝塞尔路径 ---- */
// function getBezierPath({
//                            sourceX,
//                            sourceY,
//                            targetX,
//                            targetY,
//                        }: {
//     sourceX: number;
//     sourceY: number;
//     targetX: number;
//     targetY: number;
// }) {
//     const d = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
//     const offset = d / 2; // 简单对称控制点
//     const path = `M${sourceX},${sourceY} C${sourceX + offset},${sourceY} ${targetX - offset},${targetY} ${targetX},${targetY}`;
//     const labelX = (sourceX + targetX) / 2;
//     const labelY = (sourceY + targetY) / 2;
//     return [path, sourceX, sourceY, labelX, labelY] as const;
// }