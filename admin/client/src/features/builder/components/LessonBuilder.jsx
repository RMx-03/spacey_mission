import React from 'react';
import { ReactFlow, MiniMap, Controls, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from '../nodeRegistry';

const LessonBuilder = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectionChange,
}) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onSelectionChange={onSelectionChange}
      nodeTypes={nodeTypes}
      fitView
      className="bg-gray-50"
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.type === 'narration') return '#3b82f6'; // blue
          if (n.type === 'choice') return '#10b981'; // green
          if (n.type === 'quiz') return '#f59e0b'; // yellow
          if (n.type === 'gameInteraction') return '#ef4444'; // red
          if (n.type === 'aiTrigger') return '#8b5cf6'; // purple
          return '#999';
        }}
        nodeColor={() => '#fff'}
        nodeBorderRadius={4}
        pannable
        bgColor='#ADD8E6'
      />
      <Controls />
      <Background color="#ccc" variant={BackgroundVariant.Cross}/>
    </ReactFlow>
  );
};

export default LessonBuilder;
