import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useUpdateNodeInternals } from '@xyflow/react';

const NarrationInspector = ({ node, onNodeUpdate }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [formData, setFormData] = useState(node.data);

  useEffect(() => {
    const data = { ...node.data };
    // Data migration
    if (!data.inputs) data.inputs = [{ id: nanoid(8) }];
    if (!data.outputs) data.outputs = [{ id: nanoid(8) }];
    setFormData(data);
  }, [node.id, node.data]);

  const handlePanelBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onNodeUpdate(node.id, formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    <div className="space-y-4" onBlur={handlePanelBlur}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: Narration Block</h3>
      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700">Node Label</label>
        <input
          type="text"
          id="label"
          name="label"
          value={formData.label || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">Narration Text</label>
        <textarea
          id="text"
          name="text"
          rows="8"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.text || ''}
          onChange={handleChange}
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
  );
};

export default NarrationInspector;
