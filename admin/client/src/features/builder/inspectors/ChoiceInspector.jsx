import React, { useState, useEffect } from 'react';

const ChoiceInspector = ({ node, onNodeUpdate }) => {
  const [formData, setFormData] = useState(node.data);

  useEffect(() => {
    setFormData(node.data);
  }, [node.id, node.data]);

  const handlePanelBlur = (e) => {
    // If the newly focused element is outside this component, then save.
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
    newOptions[index] = value;
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
  };

  const addOption = () => {
    const newOptions = [...(formData.options || []), ''];
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    // Persist immediately on structural changes
    onNodeUpdate(node.id, updatedData);
  };

  const removeOption = (index) => {
    const newOptions = (formData.options || []).filter((_, i) => i !== index);
    const updatedData = { ...formData, options: newOptions };
    setFormData(updatedData);
    // Persist immediately on structural changes
    onNodeUpdate(node.id, updatedData);
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
          <label className="block text-sm font-medium text-gray-700">Options</label>
          {(formData.options || []).map((option, index) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={option}
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