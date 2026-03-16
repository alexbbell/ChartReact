// @flow 
import * as React from 'react';

import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type NodeProps,
  Handle,
  Position,
//   Background,
//   Controls,

} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './../RFlow/styles.css'
import { companyDemoData  } from '../RFlow/RFlowData';
import { buildHOrgFlow, type HOrgFlowNode, type HOrgNodeData } from '../RFlow/HOrgFlowData';
import { CustomEdge } from '../RFlow/CustomEdge';


export const H2 = () => {
  const [nodes, setNodes] = React.useState<HOrgFlowNode[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const onNodesChange = React.useCallback((changes: NodeChange<HOrgFlowNode>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = React.useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = React.useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);



  React.useEffect( () => {
    const flow = buildHOrgFlow(companyDemoData);
    setNodes(flow.nodes);
    setEdges(flow.edges);
  }, [])
  

const CustomNode = ({ data }: NodeProps<Node<HOrgNodeData>>) => {
  const className = (data.colorScheme === 1)? 'companyItem blau' : 'companyItem dunkelblau'
    return (
        <div className={className}>1{data.title}
            <Handle type="target" position={Position.Left} />
            <div className='title' dangerouslySetInnerHTML={{ __html: data.title }} />
            {data.location && <div>{data.location}</div>}
            {
                
                <div className='bottom'>
                    {data.grundKapital !== 0 && <div>Grundkapital: {data.grundKapital}</div>}
                    {data.stammKapital !== 0 && <div>Stammkapital: {data.stammKapital}</div>}
                    
                </div>
            }
            <Handle type="source" position={Position.Left}
                style={{ top: '15%', background: 'red' }}
            />
        </div>
    );
};

const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

  return (
    <>
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        
        onConnect={onConnect}
        fitView
        />
    {/* <Background />
    <Controls /> */}
    </div>
        </>
  );
};