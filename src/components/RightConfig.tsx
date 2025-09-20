import React, {useState, useEffect} from 'react';
import {Node} from '@xyflow/react';
import './RightConfig.css';
import EnvEditor from "./EnvEditor.tsx";
import {NodeData} from "../page";

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
        if (node) setDraft({...node.data, timeValue: node.data.timeValue, timeUnit: node.data.timeUnit });
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
    node.type === 'Timer' ? (
        <aside className="right-config">
            <section className="right-config__body">
                <div className="field">
                    <label>Time Value</label>
                    <input 
                        type="number" 
                        value={draft.timerValue} 
                        onChange={(e) => setDraft({...draft, timerValue: parseInt(e.target.value)})}
                    />
                </div>
                <div className="field">
                    <label>Time Unit</label>
                    <select 
                        value={draft.timeUnit} 
                        onChange={(e) => setDraft({...draft, timeUnit: e.target.value})}
                    >
                        <option value="millis">Milliseconds</option>
                        <option value="secs">Seconds</option>
                    </select>
                </div>
            </section>

            <footer className="right-config__footer">
                <button className="btn-save" onClick={handleSave}>
                    Save
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                    Delete Node
                </button>
            </footer>
        </aside>
    ) : (
        <aside className="right-config">
            <header className="right-config__header">
                <h3>Node Config</h3>
                <button className="btn-close" onClick={onClose}>
                    ✕
                </button>
            </header>

            <section className="right-config__body">
                <div className="field">
                    <label>Node ID</label>
                    <input value={draft.label} onChange={(e) => setDraft({...draft, label: e.target.value})}/>
                </div>

                {/* ===== 固定文本 ===== */}
                {['machine', 'build', 'path', 'args'].map((key) => (
                    <div className="field" key={key}>
                        <label>{key}</label>
                        <input value={draft[key]} onChange={(e) => setDraft({...draft, [key]: e.target.value})}/>
                    </div>
                ))}

                <div className="field">
                    <label>Input Edges</label>
                    <div className="readonly-list">{node.data.inputs?.join(', ') || 'None'}</div>
                </div>

                <div className="field">
                    <label>Output Edges</label>
                    <div className="readonly-list">{node.data.outputs?.join(', ') || 'None'}</div>
                </div>

                {/* ===== 动态 env ===== */}
                <div className="field">
                    <label>Env</label>
                    <EnvEditor
                        env={draft.env || {}}
                        onChange={(newEnv) =>setDraft({...draft, env: newEnv})
                        }
                    />
                </div>
            </section>

            <footer className="right-config__footer">
                <button className="btn-save" onClick={handleSave}>
                    Save
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                    Delete Node
                </button>
            </footer>
        </aside>
    )
    )
};

export default RightConfig;