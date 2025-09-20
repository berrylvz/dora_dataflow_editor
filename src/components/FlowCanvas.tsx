import React, {useCallback, useEffect} from 'react';
import {
    ReactFlowProvider,
    Node,
    Edge,
    addEdge,
    Connection,
    useNodesState,
    useEdgesState,
    Background, MiniMap, ReactFlow,
    Controls, Panel, useReactFlow, ReactFlowInstance, NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './FlowCanvas.css';

/* ---------- 自定义节点类型（可扩展） ---------- */
import TimerNode from './nodes/TimerNode.tsx';
import CommNode from './nodes/Node.tsx';
// import DecisionNode from './nodes/DecisionNode.tsx';
// import OutputNode from './nodes/OutputNode.tsx';

// 在 nodeTypes 对象中添加新的节点类型
const nodeTypes: NodeTypes = {
    Timer: TimerNode,
    Node: CommNode,
    // decision: DecisionNode,
    // output: OutputNode,
};

import EditableEdge from './EditableEdge';

const edgeTypes = {
    editable: EditableEdge,
};

/* ---------- Props ---------- */
export interface FlowCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (conn: any) => void;
    onNodeClick: (node: Node) => void;
    onDropNode: (type: string, position: { x: number; y: number }) => void;
    onCanvasClick?: () => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = (
    {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onNodeClick,
        onDropNode,
        onCanvasClick,
    }
) => {
    const reactFlow = useReactFlow(); // 把屏幕坐标转成 RF 内部坐标


    const {fitView} = useReactFlow();          // ← 1. 拿到官方方法

    // useEffect(() => {
    //     fitView({padding: 0.2, duration: 300});  // ← 2. 自动居中/缩放
    // }, [nodes, fitView]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('application/reactflow-node-type');
            if (!type) return;

            // 计算放下位置
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const position = reactFlow.screenToFlowPosition({x: e.clientX - rect.left, y: e.clientY - rect.top});
            onDropNode(type, position);
        },
        [onDropNode]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // RF 会把选中的节点/边放在 window.__REACT_FLOW__ 里（内部 API，方便）
                const rf: ReactFlowInstance | undefined = (window as any).__REACT_FLOW__;
                if (!rf) return;
                const {getNodes, getEdges, setNodes, setEdges} = rf;
                const selectedNodes = getNodes().filter((n) => n.selected);
                const selectedEdges = getEdges().filter((e) => e.selected);
                if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

                setNodes(getNodes().filter((n) => !n.selected));
                setEdges(getEdges().filter((e) => !e.selected));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 添加处理画布点击的函数
    const handlePaneClick = useCallback(() => {
        if (onCanvasClick) {
            onCanvasClick();
        }
    }, [onCanvasClick]);

    return (
        <div className="flow-canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => onNodeClick(node)}
                onPaneClick={handlePaneClick} // 绑定点击事件
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{ type: 'editable' }}
                fitView
                // attributionPosition="bottom-left"
            >
                <Background gap={12} size={1}/>
                <MiniMap nodeStrokeWidth={3} zoomable pannable/>
                <Controls position="top-right"/>
                <Panel position="top-center" className="canvas-hint">
                    Drag nodes from the left to the canvas. Click on a node to configure it.
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;