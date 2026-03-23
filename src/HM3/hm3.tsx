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
  Background,
  Controls,
//   Background,
//   Controls,

} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './../RFlow/styles.css'
import { CustomEdge } from '../RFlow/CustomEdge';
import { sortedRelations, spCompanies } from './companies';
import { type H3OrgNodeData, type HOrgFlowNode } from './h3OrgFlowData';
import { h3buildCompanyDiagram } from './g3OrgBuildCompanyDiag';



export const HM3 = () => {
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
    console.log('sortedRelation', sortedRelations)
    //const flow:HOrgFlowNode[] = h3buildHOrgFlow(spCompanies, relations);
    const { nodes, edges } = h3buildCompanyDiagram(spCompanies, sortedRelations);
    setNodes(nodes)

    setEdges(edges)
    // setEdges(flow.edges);
  }, [])
  

const CustomNode = ({ data }: NodeProps<Node<H3OrgNodeData>>) => {
  const parentIds = data.parentIds ?? [];
//console.log('parentIds', parentIds)
  return (
    <div className="companyItem">
      {data.logo && (
        <div
          style={{
            backgroundImage: `url(${data.logo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: 100,
            height: 100,
          }}
        />
      )}

      <div className="orgInfo">
        
        {parentIds.length <= 1 ? (
          <>
         <Handle type="target" position={Position.Top} id="target-single" />
          </>
        ) : (
          parentIds.map((parentId, index) => {
            const top = `${((index + 1) / (parentIds.length + 1)) * 100}%`;
            const pos = (index % 2 === 0) ? Position.Right:  Position.Right;
            return (
              <>
              <Handle
                key={parentId}
                type="target" 
                position={pos}
                id={`target-${parentId}`}
              style={{ top }}
              />
              </>
            );
          })
        )}


          {data.hasChild &&  (

            <Handle
              type="source"
              position={Position.Right}
              style={{ top: '25%', background: 'red' }}
            />
          )}
        <div>{data.id}</div>
        <div
          className="title"
          dangerouslySetInnerHTML={{ __html: data.title }} 
        />

        {data.city && (
          <div>
            {data.city} {data.participationType && <span>| {data.participationType}</span>}
          </div>
        )}

        <div className="bottom">
          {data.kapital !== '' && <div>{data.kapital}</div>}
        </div>

      </div>
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
        >
     <Background />
    <Controls /> 
    </ReactFlow>
    </div>
        </>
  );
};