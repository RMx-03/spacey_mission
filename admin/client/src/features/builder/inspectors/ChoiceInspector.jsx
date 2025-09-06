import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useUpdateNodeInternals } from '@xyflow/react';

const ChoiceInspector = ({ node, onNodeUpdate }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [formData, setFormData] = useState(node.data);

  useEffect(() => {
    const data = { ...node.data };
    // Data migration: if options are strings, convert them to objects with unique IDs.
    if (data.options && data.options.length > 0 && typeof data.options[0] === 'string') {
      data.options = data.options.map((optText) => ({
        id: nanoid(8),
        text: optText,
      }));
    }
    // Data migration for inputs
    if (!data.inputs) data.inputs = [{ id: nanoid(8) }];
    setFormData(data);
  }, [node.id, node.data]);

  const handlePanelBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onNodeUpdate(node.id, formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], text: value };
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
  };

  const addOption = () => {
    const newOption = { id: nanoid(8), text: 'New Option' };
    const newOptions = [...(formData.options || []), newOption];
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
    updateNodeInternals(node.id);
  };

  const removeOption = (index) => {
    const newOptions = (formData.options || []).filter((_, i) => i !== index);
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
    updateNodeInternals(node.id);
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

  return (
    <div onBlur={handlePanelBlur}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: Choice Block</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
          <textarea
            id="prompt"
            name="prompt"
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.prompt || ''}
            onChange={handleChange}
          />
        </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Inputs</label>
        {(formData.inputs || []).map((input, index) => (
          <div key={input.id || index} className="flex items-center justify-between gap-2 mt-1 bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Input {index + 1}</span>
            <button onClick={() => removeInput(index)} className="text-red-500 hover:text-red-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={(formData.inputs || []).length <= 1}>&times;</button>
          </div>
        ))}
        <button onClick={addInput} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          Add Input
        </button>
      </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Options</label>
          {(formData.options || []).map((option, index) => (
            <div key={option.id || index} className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={option.text || ''}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={`Option ${index + 1}`}
              />
              <button onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
            </div>
          ))}
          <button onClick={addOption} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Option</button>
        </div>
        <div>
          <label htmlFor="uiStyle" className="block text-sm font-medium text-gray-700">UI Style</label>
          <select
            id="uiStyle"
            name="uiStyle"
            value={formData.uiStyle || 'buttons'}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="buttons">Buttons</option>
            <option value="dropdown">Dropdown</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChoiceInspector;