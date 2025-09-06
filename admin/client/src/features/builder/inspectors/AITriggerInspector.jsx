import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useUpdateNodeInternals } from '@xyflow/react';

const AITriggerInspector = ({ node, onNodeUpdate }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [formData, setFormData] = useState(node.data);

  useEffect(() => {
    const data = { ...node.data };
    // Data migration
    if (!data.inputs) data.inputs = [{ id: nanoid(8) }];
    if (!data.outputs) data.outputs = [{ id: nanoid(8) }];
    setFormData(data);
  }, [node.id, node.data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    // If the newly focused element is not a child of the panel, then save.
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onNodeUpdate(node.id, formData);
    }
  };

  const addInput = () => {
    const newInput = { id: nanoid(8) };
    const newInputs = [...(formData.inputs || []), newInput];
    const updatedData = { ...formData, inputs: newInputs };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
    updateNodeInternals(node.id);
  };

  const removeInput = (index) => {
    if (formData.inputs?.length <= 1) return;
    const newInputs = (formData.inputs || []).filter((_, i) => i !== index);
    const updatedData = { ...formData, inputs: newInputs };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
    updateNodeInternals(node.id);
  };

  const addOutput = () => {
    const newOutput = { id: nanoid(8) };
    const newOutputs = [...(formData.outputs || []), newOutput];
    const updatedData = { ...formData, outputs: newOutputs };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
    updateNodeInternals(node.id);
  };

  const removeOutput = (index) => {
    if (formData.outputs?.length <= 1) return;
    const newOutputs = (formData.outputs || []).filter((_, i) => i !== index);
    const updatedData = { ...formData, outputs: newOutputs };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
    updateNodeInternals(node.id);
  };

  return (
    <div onBlur={handleBlur}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: AI Trigger</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            id="label"
            name="label"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.label || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="ai_action" className="block text-sm font-medium text-gray-700">AI Action</label>
          <select
            id="ai_action"
            name="ai_action"
            value={formData.ai_action || 'analyze_behavior'}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="analyze_behavior">Analyze Behavior</option>
            <option value="summarize_decisions">Summarize Decisions</option>
            <option value="socratic_dialogue">Socratic Dialogue</option>
            <option value="provide_feedback">Provide Feedback</option>
          </select>
        </div>
        <div>
          <label htmlFor="fallback_text" className="block text-sm font-medium text-gray-700">Fallback Text (Optional)</label>
          <textarea
            id="fallback_text"
            name="fallback_text"
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.fallback_text || ''}
            onChange={handleChange}
            placeholder="e.g., Spacey says: 'You've got this!'"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Inputs</label>
          {(formData.inputs || []).map((input, index) => (
            <div key={input.id} className="flex items-center justify-between gap-2 mt-1 bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Input {index + 1}</span>
              <button onClick={() => removeInput(index)} className="text-red-500 hover:text-red-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={(formData.inputs || []).length <= 1}>&times;</button>
            </div>
          ))}
          <button onClick={addInput} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Input</button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Outputs</label>
          {(formData.outputs || []).map((output, index) => (
            <div key={output.id} className="flex items-center justify-between gap-2 mt-1 bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Output {index + 1}</span>
              <button onClick={() => removeOutput(index)} className="text-red-500 hover:text-red-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={(formData.outputs || []).length <= 1}>&times;</button>
            </div>
          ))}
          <button onClick={addOutput} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Output</button>
        </div>
      </div>
    </div>
  );
};

export default AITriggerInspector;