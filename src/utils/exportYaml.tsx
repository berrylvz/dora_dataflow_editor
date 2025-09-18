import { Node, Edge } from '@xyflow/react';
import yaml from 'js-yaml';
import {NodeData} from "../LBR";

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
                inputs[edgeLabel] = `${srcLabel}/${edgeLabel}`;
            });

        yamlNodes.push({
            id: n.data.label,
            inputs: Object.keys(inputs).length ? inputs : undefined,
            outputs: outputs.length ? outputs : undefined,
            path: n.data?.path || `${n.data?.label}.py`,
            build: n.data?.build,
            args: n.data?.args,
            machine: n.data?.machine,
            deploy: n.data?.deploy,
            env: n.data?.env,

        });
    });

    return yaml.dump({ nodes: yamlNodes }, { indent: 2, lineWidth: -1 });
}

export function downloadYaml(content: string, filename = 'flow.yaml') {
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}