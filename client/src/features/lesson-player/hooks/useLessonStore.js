import { create } from 'zustand';
import { getLessonDesign } from '../services/lessonPlayerAPI';
import { devtools } from 'zustand/middleware';

/**
 * A Zustand store to manage the state for the active lesson player.
 * This ensures that lesson data is fetched only once and shared across components
 * like the LessonPage and the Navbar.
 */
const lessonStore = (set, get) => ({
  lesson: null,
  loading: true,
  error: null,
  currentNode: null, // To hold the full current node object
  history: [], // To hold all nodes that have been displayed
  userAnswers: new Map(), // To store user's answers for choices/quizzes

  /**
   * Sets the current node based on its ID.
   * @param {string} nodeId - The ID of the node to set as current.
   */
  setCurrentNode: (nodeId) => {
    const { lesson } = get();
    if (!lesson || !lesson.nodes) {
      set({ currentNode: null });
      return;
    }
    const node = lesson.nodes.find((n) => n.id === nodeId);
    set((state) => ({
      currentNode: node || null,
      // Only add the node to history if it's a valid node
      history: node ? [...state.history, node] : state.history,
    }));
  },

  /**
   * Records a user's answer for a given node.
   * @param {string} nodeId - The ID of the node (e.g., a choice or quiz node).
   * @param {any} answer - The user's answer.
   */
  recordAnswer: (nodeId, answer) => {
    set((state) => ({
      userAnswers: new Map(state.userAnswers).set(nodeId, answer),
    }));
  },

  /**
   * Advances the lesson to the next node based on the current node's outgoing edge.
   * Can accept a sourceHandle for nodes with multiple outgoing edges (like choices).
   * @param {string | null} sourceHandle - The handle of the specific choice/option taken.
   */
  advanceLesson: (sourceHandle = null) => {
    const { lesson, currentNode } = get();
    if (!lesson || !currentNode) return;

    let edge;

    if (sourceHandle !== null) {
      // If a specific sourceHandle is provided, find that exact edge.
      // Use loose equality for sourceHandle to accommodate different data types.
      edge = lesson.edges.find(
        (e) => e.source === currentNode.id && e.sourceHandle == sourceHandle,
      );
    } else {
      // If no sourceHandle is provided, we have a couple of strategies.
      const outgoingEdges = lesson.edges.filter((e) => e.source === currentNode.id);

      // 1. Prefer an edge that explicitly has no sourceHandle.
      edge = outgoingEdges.find((e) => e.sourceHandle == null);

      // 2. If no such edge exists, but there is only ONE outgoing edge,
      //    we assume it's the correct one, regardless of its sourceHandle.
      //    This makes single-exit nodes like Narration or Quiz more robust.
      if (!edge && outgoingEdges.length === 1) {
        edge = outgoingEdges[0];
      }
    }

    if (edge) {
      get().setCurrentNode(edge.target);
    } else {
      // Handle lesson end or nodes with no outgoing path
      console.warn(`Lesson ended or no outgoing edge found for sourceHandle: ${sourceHandle} from node ${currentNode.id}.`);
      set({ currentNode: null }); // Or set some 'finished' state
    }
  },

  /**
   * Fetches the complete lesson design, including nodes and edges.
   * @param {string} lessonId - The ID of the lesson to fetch.
   */
  fetchLesson: async (lessonId) => {
    // Prevent re-fetching if the lesson is already loaded.
    if (get().lesson?.id === lessonId) {
      return;
    }

    try {
      // Atomically reset the store for the new lesson, including history.
      set({ loading: true, error: null, lesson: null, currentNode: null, history: [] });
      const lessonData = await getLessonDesign(lessonId);

      if (lessonData) {
        // Find the starting node (a node that is not a target of any edge)
        const targetNodeIds = new Set(lessonData.edges.map((edge) => edge.target));
        let startNode = lessonData.nodes.find((node) => !targetNodeIds.has(node.id));

        if (!startNode && lessonData.nodes.length > 0) {
          // Fallback to the first node if no clear start node is found
          startNode = lessonData.nodes[0];
        }

        // Set the initial state atomically after fetching. This avoids race conditions.
        set({ lesson: lessonData, loading: false, currentNode: startNode || null, history: startNode ? [startNode] : [] });
      } else {
        set({ lesson: null, loading: false, error: 'Lesson not found.' });
      }
    } catch (err) {
      console.error('Failed to fetch lesson in store:', err);
      set({ error: 'Failed to load lesson.', loading: false });
    }
  },

  /**
   * Clears the lesson data from the store when navigating away.
   */
  clearLesson: () => {
    set({ lesson: null, loading: false, error: null, currentNode: null, history: [], userAnswers: new Map() });
  },
});

export const useLessonStore = create(
  devtools(lessonStore, { name: 'LessonPlayerStore' })
);
