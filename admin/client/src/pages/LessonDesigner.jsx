import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactFlowProvider,
  useReactFlow,
  useStore,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import LessonBuilder from '../features/builder/components/LessonBuilder';
import NodePalette from '../features/builder/components/NodePalette';
import InspectorPanel from '../features/builder/components/InspectorPanel';
import { nodeCreator } from '../features/builder/nodeRegistry';
import {
  addNodeToLesson,
  updateNodeInLesson,
  deleteNodeFromLesson,
  addEdgeToLesson,
  deleteEdgeFromLesson,
  subscribeToNodeUpdates,
  subscribeToEdgeUpdates,
} from '../features/builder/services/api';

// Centralizing initial state for the lesson builder
const initialNodes = [];
const initialEdges = [];

const LessonDesignerContent = () => {
  const { lessonId } = useParams();
  const [selectedNode, setSelectedNode] = useState(null);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const flowWidth = useStore((state) => state.width);
  const flowHeight = useStore((state) => state.height);
 
  useEffect(() => {
    if (!lessonId) {
      console.error('Lesson ID is missing!');
      return;
    }
    const unsubscribeNodes = subscribeToNodeUpdates(lessonId, setNodes);
    const unsubscribeEdges = subscribeToEdgeUpdates(lessonId, setEdges);
    return () => {
      unsubscribeNodes();
      unsubscribeEdges();
    };
  }, [lessonId, setNodes, setEdges]);

  const handleAddNode = useCallback(
    async (nodeType) => {
    // This logic places the new node in the center of the viewport.
    const position = screenToFlowPosition({
      x: flowWidth / 2,
      y: flowHeight / 2,
    });

    // Use the central node creator to get the new node's data structure
    const creator = nodeCreator[nodeType];
    if (!creator) return;

    const newNode = { ...creator(), position };

    try {
      await addNodeToLesson(lessonId, newNode);
    } catch (error) {
      console.error('Error adding node:', error);
    }
  },
  [screenToFlowPosition, flowWidth, flowHeight, lessonId]
);

  const onNodesChange = useCallback(
    (changes) => {
      // Use a functional update to get the latest state and avoid stale closures.
      setNodes((currentNodes) => {        
        const nextNodes = applyNodeChanges(changes, currentNodes);

        changes.forEach(async (change) => {
          if (change.type === 'position' && !change.dragging && change.position) {
            // Find the node in the *newly updated* array to get the correct position.
            const nodeToUpdate = nextNodes.find((n) => n.id === change.id);
            if (nodeToUpdate) {
              try {
                // Only update the position in Firestore.
                await updateNodeInLesson(lessonId, change.id, { position: nodeToUpdate.position });
              } catch (error) {
                console.error('Error updating node position:', error);
              }
            }
          } else if (change.type === 'remove') {
            // This handles deletion via keyboard (e.g., backspace).
            try {
              await deleteNodeFromLesson(lessonId, change.id);
            } catch (error) {
              console.error('Error deleting node:', error);
            }
          }
        });

        return nextNodes;
      });
    },
    [lessonId, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((currentEdges) => {
        const nextEdges = applyEdgeChanges(changes, currentEdges);

        changes.forEach(async (change) => {
          if (change.type === 'remove') {
            try {
              await deleteEdgeFromLesson(lessonId, change.id);
            } catch (error) {
              console.error('Error deleting edge:', error);
            }
          }
        });
        return nextEdges;
      });
    },
    [lessonId, setEdges]
  );

  const onConnect = useCallback(
    async (connection) => {
      try {
        // Let the onSnapshot listener handle adding the edge to the state.
        await addEdgeToLesson(lessonId, connection);
      } catch (error) {
        console.error('Error adding edge:', error);
      }
    },
    [lessonId]
  );

  // This callback is passed to the LessonBuilder to update the selected node
  // which in turn determines which sidebar panel to show.
  const handleSelectionChange = useCallback(({ nodes }) => {
    // We only show the inspector if a single node is selected
    setSelectedNode(nodes.length === 1 ? nodes[0] : null);
  }, []);

  // This function is now only responsible for persisting the final data.
  // The inspector component will handle the user input state and decide when to call this.
  const handleNodeUpdate = useCallback(
    async (nodeId, data) => {
      try {
        await updateNodeInLesson(lessonId, nodeId, { data });
      } catch (error) {
        console.error('Error updating node data:', error);
      }
    },
    [lessonId]
  );

  const handleDeleteNode = useCallback(async (nodeId) => {
    try {
      setSelectedNode(null); // Deselect node after deletion
      await deleteNodeFromLesson(lessonId, nodeId);
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  }, [lessonId]);

    return (
        <div className="flex h-screen w-full bg-gray-100 font-sans">
          {/* Left Sidebar */}
          <aside className="w-80 flex-shrink-0 bg-white shadow-lg p-4 overflow-y-auto border-r border-gray-200">
            {selectedNode ? (
              <InspectorPanel
                key={selectedNode.id} // Force re-mount on node change
                node={selectedNode}
                onNodeUpdate={handleNodeUpdate}
                onNodeDelete={handleDeleteNode}
              />
            ) : (
              <NodePalette onAddNode={handleAddNode} />
            )}
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-grow h-full">
            <LessonBuilder
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onSelectionChange={handleSelectionChange}
            />
          </main>
        </div>
    );
};

const LessonDesigner = () => {
  return (
    <ReactFlowProvider>
      <LessonDesignerContent />
    </ReactFlowProvider>
  );
};

export default LessonDesigner;