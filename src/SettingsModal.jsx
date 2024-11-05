import React, { useState } from 'react';

function SettingsModal({ apiKey, tavilyKey, onApiKeyChange, onTavilyKeyChange, onSave, onClose }) {
  const [isEditing, setIsEditing] = useState(false);

  const maskApiKey = (key) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Settings</h2>
        <label>
          OpenAI API Key:
          <input
            type="text"
            value={isEditing ? apiKey : maskApiKey(apiKey)}
            onChange={onApiKeyChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            placeholder="Enter your OpenAI API key"
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Tavily API Key:
          <input
            type="text"
            value={isEditing ? tavilyKey : maskApiKey(tavilyKey)}
            onChange={onTavilyKeyChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            placeholder="Enter your Tavily API key"
            style={{ width: '100%' }}
          />
        </label>
        <div className="modal-actions">
          <button onClick={onSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
