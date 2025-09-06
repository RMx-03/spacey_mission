import { nanoid } from 'nanoid';

// Node Components
import NarrationNode from './nodes/NarrationNode';
import QuizNode from './nodes/QuizNode';
import ChoiceNode from './nodes/ChoiceNode';
import AITriggerNode from './nodes/AITriggerNode';
import GameInteractionNode from './nodes/GameInteractionNode';

// Inspector Components
import NarrationInspector from './inspectors/NarrationInspector';
import QuizInspector from './inspectors/QuizInspector';
import ChoiceInspector from './inspectors/ChoiceInspector';
import AITriggerInspector from './inspectors/AITriggerInspector';
import GameInteractionInspector from './inspectors/GameInteractionInspector';

/**
 * Maps node types to their React components.
 * This is passed directly to the <ReactFlow /> component.
 */
export const nodeTypes = {
  narration: NarrationNode,
  quiz: QuizNode,
  choice: ChoiceNode,
  aiTrigger: AITriggerNode,
  gameInteraction: GameInteractionNode,
};

/**
 * Maps node types to their inspector panel components.
 * The InspectorPanel uses this to dynamically render the correct editor.
 */
export const inspectorTypes = {
  narration: NarrationInspector,
  quiz: QuizInspector,
  choice: ChoiceInspector,
  aiTrigger: AITriggerInspector,
  gameInteraction: GameInteractionInspector,
};

/**
 * Defines the initial data for each node type when created.
 * The NodePalette uses this to create new nodes.
 * All nodes share a base schema and have stable IDs for options/answers.
 */
export const nodeCreator = {
  narration: () => ({
    type: 'narration',
    data: { label: 'New Narration', text: '', inputs: [{ id: nanoid(8) }], outputs: [{ id: nanoid(8) }] },
  }),
  quiz: () => ({
    type: 'quiz',
    data: { label: 'New Quiz', question: '', answers: [{ id: nanoid(8), text: 'Answer 1', correct: true }, { id: nanoid(8), text: 'Answer 2', correct: false }], inputs: [{ id: nanoid(8) }] },
  }),
  choice: () => ({
    type: 'choice',
    data: { label: 'New Choice', prompt: 'Make a choice:', options: [{ id: nanoid(8), text: 'Path A' }, { id: nanoid(8), text: 'Path B' }], uiStyle: 'buttons', inputs: [{ id: nanoid(8) }] },
  }),
  aiTrigger: () => ({
    type: 'aiTrigger',
    data: { label: 'AI Analysis', ai_action: 'analyze_behavior', fallback_text: "Spacey says: 'You've got this, let's keep going!'", inputs: [{ id: nanoid(8) }], outputs: [{ id: nanoid(8) }] },
  }),
  gameInteraction: () => ({
    type: 'gameInteraction',
    data: {
      label: 'New Game',
      game_id: '',
      prompt: '',
      configuration: {},
      options: [{ id: nanoid(8), text: 'Success' }, { id: nanoid(8), text: 'Failure' }],
      inputs: [{ id: nanoid(8) }],
    },
  }),
};
