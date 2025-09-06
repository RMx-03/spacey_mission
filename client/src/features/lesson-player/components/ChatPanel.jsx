import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useLessonStore } from '../hooks/useLessonStore';
import NarrationBlock from './NarrationBlock';
import ChoiceBlock from './ChoiceBlock';
import GameInteractionBlock from './GameInteractionBlock';
import AITriggerBlock from './AITriggerBlock';
import QuizBlock from './QuizBlock';

// A map to associate node types with their corresponding components.
// This makes it easy to add new node types without changing the rendering logic.
const nodeComponentMap = {
  narration: NarrationBlock,
  choice: ChoiceBlock,
  gameInteraction: GameInteractionBlock,
  aiTrigger: AITriggerBlock,
  quiz: QuizBlock,
};

const ChatPanel = () => {
  const history = useLessonStore((state) => state.history);
  const currentNode = useLessonStore((state) => state.currentNode);
  const [messages, setMessages] = useState([]); // For user messages
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef(null);

  // Effect to scroll to the bottom of the chat when new messages or history items are added.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history, messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { id: Date.now(), text: inputValue, sender: 'user' }]);
      setInputValue('');
      // Here you would typically send the message to an AI service
    }
  };

  const renderNodeContent = (node, isActive) => {
    if (!node) {
      return (
        <div className="text-center text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-2" />
          <p>AI Tutor Chat</p>
          <p className="text-sm">The lesson will begin shortly.</p>
        </div>
      );
    }

    const Component = nodeComponentMap[node.type];

    if (Component) {
      // For choice blocks, isActive is crucial to enable/disable buttons.
      // For other blocks, it can be used for styling, like highlighting.
      return <Component node={node} isActive={isActive} />;
    }

    return (
      <div className="text-center text-gray-500">
        <p>Unsupported node type: {node.type}</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg h-full flex flex-col">
      <h2 className="text-lg font-bold text-cyan-green mb-4">Chat Panel</h2>
      <div
        ref={chatContainerRef}
        className={`flex-grow flex flex-col space-y-4 overflow-y-auto p-2 ${
          history.length === 0 && !currentNode ? 'justify-center items-center' : 'justify-start'
        }`}
      >
        {/* Show initial message if the lesson hasn't started */}
        {history.length === 0 && !currentNode && renderNodeContent(null, false)}

        {/* Render lesson history */}
        {history.map((node, index) => (
          <div key={`${node.id}-${index}`} className="self-start w-full">
            {renderNodeContent(node, node.id === currentNode?.id)}
          </div>
        ))}

        {/* Render user messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="max-w-xs md:max-w-md p-3 rounded-xl bg-blue-600 text-white self-end"
          >
             {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a question..."
          className="flex-grow p-2 rounded bg-gray-900/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-green"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 rounded-lg bg-cyan-green text-gray-900 hover:bg-cyan-green/80 disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={!inputValue.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
