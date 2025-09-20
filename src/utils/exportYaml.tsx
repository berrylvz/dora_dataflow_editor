import { Node, Edge } from '@xyflow/react';
import yaml from 'js-yaml';
import {NodeData} from "../page";

export function buildYaml(nodes: Node<NodeData>[], edges: Edge[]) {
    const yamlNodes: any[] = [];

    nodes.forEach((n) => {
        const inputs: Record<string, string> = {};
        const outputs: string[] = n.data?.outputs || [];

        // 收集入边
        edges
            .filter((e) => e.target === n.id)
            .forEach((e) => {
                const srcNode = nodes.find((nd) => nd.id === e.source);
                const srcLabel = srcNode?.data?.label || e.source;
                const edgeLabel = e.data?.label || srcLabel;

                // 处理 Timer 节点的特殊格式
                if (srcNode?.type === "Timer") {
                    const timerUnit = srcNode.data?.timeUnit || 'millis';
                    inputs[edgeLabel] = `dora/timer/${timerUnit}/${srcNode.data?.timerValue}`;
                } else {
                    inputs[edgeLabel] = `${srcLabel}/${edgeLabel}`;
                }

                // inputs[edgeLabel] = srcNode?.type == "Timer" ? `dora/timer/${srcNode.data.timeUnit}` : `${srcLabel}/${edgeLabel}`;
            });

        if (n.type == "Timer") return;
        
        yamlNodes.push({
            id: n.data.label,
            _unstable_deploy: n.data?.machine ? {
                machine: n.data?.machine,
            } : undefined,
            build: n.data?.build,
            path: n.data?.path || `${n.data?.label}.py`,
            args: n.data?.args,
            inputs: Object.keys(inputs).length ? inputs : undefined,
            outputs: outputs.length ? outputs : undefined,
            env: n.data?.env,

        });
    });

    return yaml.dump({ nodes: yamlNodes }, { indent: 2, lineWidth: -1 });
}

export function downloadYaml(content: string, filename = 'dataflow.yml') {
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}