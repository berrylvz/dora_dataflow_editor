import React, {useState, useEffect} from 'react';
import {Node} from '@xyflow/react';
import './RightConfig.css';

export type NodeData = {
    label: string;
    color?: string;
    remark?: string;
    [key: string]: any;
};

interface RightConfigProps {
    node: Node<NodeData> | null;
    onChange: (nodeId: string, newData: NodeData) => void;
    onClose: () => void;
    onDelete?: (nodeId: string) => void; // 可选：父组件提供删除逻辑
}

const RightConfig: React.FC<RightConfigProps> = ({node, onChange, onClose, onDelete}) => {
    const [label, setLabel] = useState('');
    const [color, setColor] = useState('#63b3ed');
    const [remark, setRemark] = useState('');

    // 每次打开抽屉，把节点数据同步到本地表单
    useEffect(() => {
        if (node) {
            setLabel(node.data.label || '');
            setColor(node.data.color || '#63b3ed');
            setRemark(node.data.remark || '');
        }
    }, [node]);

    if (!node) return null;

    const handleSave = () => {
        onChange(node.id, {...node.data, label, color, remark});
        onClose();
    };

    const handleDelete = () => {
        onDelete?.(node.id);
        onClose();
    };

    return (
        <aside className="right-config">
            <header className="right-config__header">
                <h3>节点配置</h3>
                <button className="btn-close" onClick={onClose}>
                    ✕
                </button>
            </header>

            <section className="right-config__body">
                <div className="field">
                    <label>节点名称</label>
                    <input value={label} onChange={(e) => setLabel(e.target.value)}/>
                </div>

                <div className="field">
                    <label>输入边</label>
                    <div className="readonly-list">{node.data.inputs?.join(', ') || '无'}</div>
                </div>

                <div className="field">
                    <label>输出边</label>
                    <div className="readonly-list">{node.data.outputs?.join(', ') || '无'}</div>
                </div>

                <div className="field">
                    <label>背景颜色</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)}/>
                </div>

                <div className="field">
                    <label>备注</label>
                    <textarea
                        rows={4}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="写点什么…"
                    />
                </div>
            </section>

            <footer className="right-config__footer">
                <button className="btn-save" onClick={handleSave}>
                    保存
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                    删除节点
                </button>
            </footer>
        </aside>
    );
};

export default RightConfig;