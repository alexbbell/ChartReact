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

} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { companyDemoData, type ICompanyListItem } from './RFlowData';

import './styles.css'
import { companiesToNodes } from './RFlowDataProcessing';
import type { HOrgFlowNode } from './HOrgFlowData';


export const RFlow = () => {
  const [nodes, setNodes] = React.useState<Node<ICompanyListItem>[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const onNodesChange = React.useCallback((changes: NodeChange<Node<ICompanyListItem>>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = React.useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = React.useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);


  React.useEffect( () => {
    const items:HOrgFlowNode[] = companiesToNodes(companyDemoData)
    setNodes([])
    
  }, [])
  

const CustomNode = ({ data }: NodeProps<Node<ICompanyListItem>>) => {
  const className = (data.CSColorScheme === 1)? 'companyItem blau' : 'companyItem dunkelblau'
  

  return (
    <div className={className}>
      <Handle type="target" position={Position.Left} />

      <div className='title'
        dangerouslySetInnerHTML={{__html:data.Title}}
      />
      {data.CSLocation && <div>{data.CSLocation}</div>}

{
  (data.CSGrundKapital !==0  || data.CSStammKapital !== 0) && data.CSAUVU &&
  <div className='bottom'>
  { data.CSGrundKapital !== 0 && <div>Grundkapital: {data.CSGrundKapital}</div>}
  { data.CSStammKapital !== 0 && <div>Stammkapital: {data.CSStammKapital}</div>}
  { data.CSAUVU && <div>{data.CSAUVU}</div>}
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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}

        onConnect={onConnect}
        fitView
      />
    </div>
  );
};