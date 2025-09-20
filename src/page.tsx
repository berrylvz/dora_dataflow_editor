import React, {useState, useCallback, useEffect} from 'react';
import {
    ReactFlowProvider,
    Node,
    Edge,
    addEdge,
    Connection,
    useNodesState,
    useEdgesState,
    applyNodeChanges,
    applyEdgeChanges,

} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './page.css';

import LeftBar from './components/LeftBar.tsx';
import FlowCanvas from "./components/FlowCanvas.tsx";
import RightConfig from "./components/RightConfig.tsx";


/* ------------------ 类型定义 ------------------ */
export type NodeData = {
    label: string;
    inputs?: string[];   // 流入边名称
    outputs?: string[];  // 流出边名称
    // 以后可以任意扩展：颜色、图标、脚本……
    [key: string]: any;
    path?: string;
    build?: string;
    args?: string;
    env?: Record<string, string>; // 动态 key/value
    machine?: string; // 新加

    timerValue?: number;
    timeUnit?: string;
};

/* ------------------ 子组件接口（先空着） ------------------ */
interface LeftBarProps {
    onDropNode: (type: string) => void; // 左侧把节点拖到画布时调用
}

interface RightConfigProps {
    node: Node<NodeData> | null;
    onChange: (nodeId: string, newData: NodeData) => void; // 修改节点数据
    onClose: () => void; // 关闭抽屉
}

interface FlowCanvasProps {
    nodes: Node<NodeData>[];
    edges: Edge[];
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (conn: Connection) => void;
    onNodeClick: (node: Node<NodeData>) => void;
    onDropNode: (type: string, position: { x: number; y: number }) => void;
}

/* ------------------ 主页面 ------------------ */
function page() {
    // const [nodes, setNodes, onNodesChange] = useNodesState([]);
    // const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
    const [showRight, setShowRight] = useState(false);


    // 清空函数包一下传进去
    const handleClear = useCallback(() => {
        setNodes([]);
        setEdges([]);
    }, [setNodes, setEdges]);

    // 节点点击 -> 打开右侧配置栏
    const handleNodeClick = useCallback((node: Node<NodeData>) => {
        setSelectedNode(node);
        setShowRight(true);
    }, []);

    // 点击画布空白处 -> 关闭右侧栏
    const handleCanvasClick = useCallback(() => {
        setShowRight(false);
        setSelectedNode(null);
    }, []);

    // 关闭右侧栏
    const closeRight = useCallback(() => {
        setShowRight(false);
        setSelectedNode(null);
    }, []);

    // 左侧拖入新节点（位置由画布内 drop 事件给出）
    const handleDropNode = useCallback(
        (type: string, position: { x: number; y: number }) => {
            const newNode: Node<NodeData> = {
                id: `${type}_${+new Date()}`,
                type,
                position,
                data: {label: type, timerValue: 1, timeUnit: "millis"},
            };
            setNodes((nds) => (nds ? nds.concat(newNode) : [newNode]));
        },
        [setNodes]
    );

    // 在其他 useCallback 函数后添加 handleDeleteNode 函数
    const handleDeleteNode = useCallback(
        (nodeId: string) => {
            // 删除节点
            setNodes((nds) => nds.filter((n) => n.id !== nodeId));
            // 删除与该节点相关的边
            setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
            // 关闭右侧配置面板
            setShowRight(false);
            setSelectedNode(null);
        },
        [setNodes, setEdges]
    );

    // 右侧修改节点属性
    // 在 import 部分添加 useCallback 的导入
    // import React, {useState, useCallback, useEffect} from 'react';
    
    // 修改 handleNodeDataChange 函数
    const handleNodeDataChange = useCallback(
        (nodeId: string, newData: NodeData) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === nodeId ? {...n, data: newData} : n))
            );
        },
        [setNodes, nodes]
    );
    
    // 修改 useEffect 依赖项，添加 nodes
    useEffect(() => {
        const nodeIns: Record<string, string[]> = {};  // nodeId -> 输入边名
        const nodeOuts: Record<string, string[]> = {}; // nodeId -> 输出边名
    
        edges.forEach((e) => {
            const sourceNode = nodes.find((n) => n.id === e.source);
            if (!sourceNode) return;
            
            const sourceLabel = sourceNode.data.label;
            const edgeName = e.data?.label;
    
            // 输出
            if (!nodeOuts[e.source]) nodeOuts[e.source] = [];
            nodeOuts[e.source].push(edgeName);
    
            // 输入
            if (!nodeIns[e.target]) nodeIns[e.target] = [];
            nodeIns[e.target].push(sourceLabel + "/" + edgeName);
        });
    
        setNodes((nds) =>
            nds.map((n) => ({
                ...n,
                data: {
                    ...n.data,
                    inputs: nodeIns[n.id] || [],
                    outputs: nodeOuts[n.id] || [],
                },
            }))
        );
    }, [edges]); // 添加 nodes 依赖
    
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    const handleEdgeLabelChange = (edgeId: string, label: string) => {
        setEdges((eds) =>
            eds.map((e) =>
                e.id === edgeId ? { ...e, data: { ...e.data, label, onLabelChange: handleEdgeLabelChange } } : e
            )
        );
    };
    const onConnect = useCallback(
        (params: Connection) => {
            const newEdge = {
                ...params,
                type: 'editable',
                id: params.source + "-" + params.target,
                data: { label: '', onLabelChange: handleEdgeLabelChange },
            };
            setEdges((eds) => eds.concat(newEdge));
        },
        [edges, handleEdgeLabelChange]
    );


    return (
        <div className="app">
            <ReactFlowProvider children={undefined}>
                <LeftBar
                    nodes={nodes}
                    edges={edges}
                    onDropNode={handleDropNode}
                    onClear={handleClear}
                />
                <FlowCanvas
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={handleNodeClick}
                    onDropNode={handleDropNode}
                    onCanvasClick={handleCanvasClick}
                />
                
                
                {/* // 在 RightConfig 组件中添加 onDelete 属性 */}
                {showRight && (
                    <RightConfig
                        node={selectedNode}
                        onChange={handleNodeDataChange}
                        onClose={closeRight}
                        onDelete={handleDeleteNode}  // 添加这一行
                    />
                )}
            </ReactFlowProvider>
        </div>
    );
}

export default page;