import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useUpdateNodeInternals } from '@xyflow/react';

const QuizInspector = ({ node, onNodeUpdate }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [formData, setFormData] = useState(node.data);

  useEffect(() => {
    const data = { ...node.data };
    // Data migration: if options are strings, convert them to the new answer object schema.
    if (data.options && Array.isArray(data.options) && typeof data.options[0] === 'string') {
      data.answers = data.options.map((optText, index) => ({
        id: nanoid(8),
        text: optText,
        correct: data.correctAnswer === optText, // Migrate old correctAnswer
      }));
      delete data.options; // Remove old fields
      delete data.correctAnswer;
    } else if (!data.answers) {
      data.answers = [];
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

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...(formData.answers || [])];
    newAnswers[index] = { ...newAnswers[index], text: value };
    const updatedData = { ...formData, answers: newAnswers };
    setFormData(updatedData);
  };

  const handleCorrectChange = (id) => {
    const newAnswers = (formData.answers || []).map(answer => ({
      ...answer,
      correct: answer.id === id,
    }));
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const addAnswer = () => {
    const newAnswer = { id: nanoid(8), text: 'New Answer', correct: (formData.answers || []).length === 0 };
    const newAnswers = [...(formData.answers || []), newAnswer];
    const updatedData = { ...formData, answers: newAnswers };
    setFormData(updatedData);
    onNodeUpdate(node.id, updatedData);
    updateNodeInternals(node.id);
  };

  const removeAnswer = (index) => {
    const newAnswers = (formData.answers || []).filter((_, i) => i !== index);
    // If the removed answer was the correct one, make the first one correct, if it exists.
    if (formData.answers[index]?.correct && newAnswers.length > 0) {
      newAnswers[0].correct = true;
    }
    const updatedData = { ...formData, answers: newAnswers };
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
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit: Quiz Block</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">Node Label</label>
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
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
          <input
            type="text"
            id="question"
            name="question"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.question || ''}
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
          <button onClick={addInput} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Add Input
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Answers</label>
          {(formData.answers || []).map((answer, index) => (
            <div key={answer.id} className="flex items-center gap-2 mt-1">
              <input
                type="radio"
                name="correctAnswer"
                checked={answer.correct}
                onChange={() => handleCorrectChange(answer.id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button onClick={() => removeAnswer(index)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
            </div>
          ))}
          <button onClick={addAnswer} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Answer</button>
        </div>
      </div>
    </div>
  );
};

export default QuizInspector;
