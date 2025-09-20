import React, { useState } from 'react';

export default function EnvEditor({
    env,
    onChange,
}: {
    env: Record<string, string>;
    onChange: (env: Record<string, string>) => void;
}) {
    const [newKey, setNewKey] = useState('');
    const [adding, setAdding] = useState(false);

    const add = () => {
        setAdding(true);
        setNewKey('');
    };

    const confirmAdd = () => {
        if (newKey && !env.hasOwnProperty(newKey)) {
            onChange({ ...env, [newKey]: '' });
        }
        setAdding(false);
        setNewKey('');
    };

    const cancelAdd = () => {
        setAdding(false);
        setNewKey('');
    };

    const del = (k: string) => {
        const { [k]: _, ...rest } = env;
        onChange(rest);
    };

    const handleNewKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewKey(e.target.value);
    };

    return (
        <div className="env-box">
            {Object.entries(env).map(([k, v]) => (
                <div key={k} className="env-row">
                    <input
                        value={k}
                        disabled
                        className="env-key"
                        title="Double click to delete"
                        onDoubleClick={() => del(k)}
                    />
                    <input
                        value={v}
                        onChange={(e) => onChange({ ...env, [k]: e.target.value })}
                        className="env-val"
                    />
                    <button onClick={() => del(k)}>Delete</button>
                </div>
            ))}
            {adding ? (
                <div className="env-row">
                    <input
                        value={newKey}
                        onChange={handleNewKeyChange}
                        className="env-key"
                        placeholder="Key"
                    />
                    <input
                        value=""
                        disabled
                        className="env-val"
                        placeholder="Value"
                    />
                    <button onClick={confirmAdd}>Confirm</button>
                    <button onClick={cancelAdd}>Cancel</button>
                </div>
            ) : (
                <button onClick={add} className="btn-add">
                    + Add env
                </button>
            )}
        </div>
    );
}