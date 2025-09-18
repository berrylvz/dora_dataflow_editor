import React, {useState, useEffect} from 'react';
import {Node} from '@xyflow/react';
import './RightConfig.css';
import EnvEditor from "./EnvEditor";
import {NodeData} from "../LBR";

interface RightConfigProps {
    node: Node<NodeData> | null;
    onChange: (nodeId: string, newData: NodeData) => void;
    onClose: () => void;
    onDelete?: (nodeId: string) => void; // 可选：父组件提供删除逻辑
}

const RightConfig: React.FC<RightConfigProps> = ({node, onChange, onClose, onDelete}) => {
    /* 1. 整份 data 做副本 */
    const [draft, setDraft] = useState<NodeData>({});

    useEffect(() => {
        if (node) setDraft(node.data);
    }, [node]);

    if (!node) return null;

    /* 2. 统一字段修改 */
    const update = <K extends keyof NodeData>(key: K, value: NodeData[K]) => {
        setDraft({ ...draft, [key]: value });
    };

    /* 3. 保存 */
    const handleSave = () => {
        onChange(node.id, draft);
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
                    <input value={draft.label} onChange={(e) => setDraft({...draft, label: e.target.value})}/>
                </div>

                <div className="field">
                    <label>输入边</label>
                    <div className="readonly-list">{node.data.inputs?.join(', ') || '无'}</div>
                </div>

                <div className="field">
                    <label>输出边</label>
                    <div className="readonly-list">{node.data.outputs?.join(', ') || '无'}</div>
                </div>

                {/* ===== 固定文本 ===== */}
                {['path', 'build', 'args', 'machine', 'deploy'].map((key) => (
                    <div className="field" key={key}>
                        <label>{key}</label>
                        <input value={draft[key]} onChange={(e) => setDraft({...draft, [key]: e.target.value})}/>
                    </div>
                ))}

                {/* ===== 动态 env ===== */}
                <div className="field">
                    <label>环境变量 (env)</label>
                    <EnvEditor
                        env={draft.env || {}}
                        onChange={(newEnv) =>setDraft({...draft, env: newEnv})
                        }
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