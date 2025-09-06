import { db } from '../../../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

/**
 * Fetches the design of a specific lesson, including its nodes and edges, from Firestore.
 * @param {string} lessonId - The ID of the lesson to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the lesson design object (lesson data, nodes, and edges), or null if not found.
 */
export const getLessonDesign = async (lessonId) => {
  try {
    // 1. Fetch the main lesson document
    const lessonDocRef = doc(db, 'lessons', lessonId);
    const lessonDocSnap = await getDoc(lessonDocRef);

    if (!lessonDocSnap.exists()) {
      console.error(`No lesson found with ID: ${lessonId}`);
      return null;
    }

    const lessonData = { id: lessonDocSnap.id, ...lessonDocSnap.data() };

    // 2. Fetch subcollections in parallel for better performance
    const nodesCollectionRef = collection(db, 'lessons', lessonId, 'nodes');
    const edgesCollectionRef = collection(db, 'lessons', lessonId, 'edges');

    const [nodesSnapshot, edgesSnapshot] = await Promise.all([
      getDocs(nodesCollectionRef),
      getDocs(edgesCollectionRef),
    ]);

    const nodes = nodesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const edges = edgesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Combine and return the complete lesson design
    return {
      ...lessonData,
      nodes,
      edges,
    };
  } catch (error) {
    console.error(`Error fetching lesson design for lessonId ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Fetches only the main data (like title, description) of a specific lesson,
 * without its nodes and edges. This is more efficient for display purposes like in a navbar.
 * @param {string} lessonId - The ID of the lesson to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the lesson data object, or null if not found.
 */
export const getLessonMetadata = async (lessonId) => {
  try {
    const lessonDocRef = doc(db, 'lessons', lessonId);
    const lessonDocSnap = await getDoc(lessonDocRef);

    if (!lessonDocSnap.exists()) {
      console.warn(`No lesson metadata found for ID: ${lessonId}`);
      return null;
    }

    return { id: lessonDocSnap.id, ...lessonDocSnap.data() };
  } catch (error) {
    console.error(`Error fetching lesson metadata for lessonId ${lessonId}:`, error);
    throw error;
  }
};
