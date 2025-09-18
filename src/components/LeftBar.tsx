import React, {useState} from 'react';
import './LeftBar.css';
import {buildYaml, downloadYaml} from "../utils/exportYaml";
import {Edge} from "@xyflow/react";

export interface NodeMeta {
    type: string;
    label: string;
    color: string; // 节点主色，后续可映射到背景
    icon?: string; // 可选 emoji 或 svg
}

const NODE_TYPES: NodeMeta[] = [
    {type: 'input', label: '输入', color: '#63b3ed', icon: '🔵'},
    {type: 'process', label: '处理', color: '#68d391', icon: '⚙️'},
    {type: 'decision', label: '判断', color: '#f6ad55', icon: '🔀'},
    {type: 'output', label: '输出', color: '#fc8181', icon: '🟥'},
];

interface LeftBarProps {
    nodes: Node[];
    edges: Edge[];
    onDropNode: (type: string) => void; // 兼容旧回调，实际位置由画布 drop 决定
    onClear?: () => void;
}

const LeftBar: React.FC<LeftBarProps> = ({nodes, edges, onDropNode, onClear}) => {
    const [search, setSearch] = useState('');

    // 过滤
    const filtered = NODE_TYPES.filter((n) =>
        n.label.toLowerCase().includes(search.trim().toLowerCase())
    );

    // 拖拽开始
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
        e.dataTransfer.setData('application/reactflow-node-type', type);
        e.dataTransfer.effectAllowed = 'move';
    };

    // 拖结束（其实没啥用，留着可扩展）
    const handleDragEnd = () => {
        // do nothing
    };

    const handleExport = () => {
        const yamlStr = buildYaml(nodes, edges);
        downloadYaml(yamlStr);
    };

    return (
        <aside className="left-bar">
            <header className="left-bar__header">
                <h3>节点库</h3>
                <input
                    className="left-bar__search"
                    placeholder="搜索节点…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </header>

            <section className="left-bar__list">
                {filtered.map((meta) => (
                    <div
                        key={meta.type}
                        className="node-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, meta.type)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onDropNode(meta.type, {x: 10, y: 10})} // 点击也能直接放入画布（给个默认位置）
                    >
                        <span className="node-card__icon">{meta.icon}</span>
                        <span className="node-card__label">{meta.label}</span>
                    </div>
                ))}
            </section>

            <footer className="left-bar__footer">
                <button className="btn-clear" onClick={onClear}>
                    清空画布
                </button>
                <button className="btn-export" onClick={handleExport}>
                    导出 YAML
                </button>
            </footer>
        </aside>
    );
};

export default LeftBar;