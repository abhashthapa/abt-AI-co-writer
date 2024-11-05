import React, { useState } from 'react';
import { marked } from 'marked';

function AIChat({ apiKey, onContentInsert }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!apiKey) {
      alert('Please enter your OpenAI API key in the settings.');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: `You are a helpful assistant. Follow the user's instructions carefully.` },
            userMessage
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content.trim();
      const htmlResponse = marked(aiResponse);

      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: htmlResponse }]);
      setInput('');
    } catch (error) {
      console.error('Error interacting with OpenAI API:', error);
      alert('Failed to process the request. Please check your API key and try again.');
    }
  };

  const handleInsert = (content) => {
    const htmlContent = marked(content);
    onContentInsert(htmlContent);
  };

  return (
    <div>
      <h2>AI Chat</h2>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div dangerouslySetInnerHTML={{ __html: msg.content }} />
            {msg.role === 'assistant' && (
              <button onClick={() => handleInsert(msg.content)}>Insert</button>
            )}
          </div>
        ))}
      </div>
      <textarea
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type a command..."
        style={{ width: '100%', height: '60px', resize: 'none', overflowY: 'auto' }}
      />
      <button onClick={sendMessage} style={{ width: '100%', marginTop: '10px' }}>Send</button>
    </div>
  );
}

export default AIChat;
