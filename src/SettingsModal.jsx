import React from 'react';

  function SettingsModal({ apiKey, onApiKeyChange, onSave, onClose }) {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h2>Settings</h2>
          <label>
            OpenAI API Key:
            <input
              type="text"
              value={apiKey}
              onChange={onApiKeyChange}
              placeholder="Enter your API key"
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
