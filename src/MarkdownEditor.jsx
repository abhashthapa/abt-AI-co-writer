import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { marked } from 'marked';

function MarkdownEditor({ apiKey, content, setContent }) {
  const editorRef = useRef(null);
  const [selection, setSelection] = useState(null);

  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleSelectionChange = (range, source, editor) => {
    if (range && range.length > 0) {
      const selectedText = editor.getText(range.index, range.length);
      setSelection({ text: selectedText, range });
    } else {
      setSelection(null);
    }
  };

  const handleAgentClick = async (agent) => {
    if (!selection || !apiKey) {
      alert('Please select text and ensure your API key is set.');
      return;
    }

    let prompt;
    switch (agent) {
      case 'Designer':
        prompt = `Generate a cover page design for the selected content: ${selection.text}`;
        break;
      case 'Proofreader':
        prompt = `Proofread the following content for repeated sections: ${selection.text}`;
        break;
      case 'Rewrite':
        prompt = `Rewrite the following text: ${selection.text}`;
        break;
      case 'Expand':
        prompt = `Expand on the following text: ${selection.text}`;
        break;
      case 'Summarize':
        prompt = `Summarize the following text: ${selection.text}`;
        break;
      default:
        return;
    }

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
            { role: 'system', content: `You are a helpful assistant. ${prompt}` }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const markdownResponse = data.choices[0].message.content.trim();
      const htmlResponse = marked(markdownResponse);

      // Insert the HTML content after the selected text
      const quill = editorRef.current.getEditor();
      const insertPosition = selection.range.index + selection.range.length;
      quill.clipboard.dangerouslyPasteHTML(insertPosition, `<p><br></p>${htmlResponse}`);
      setSelection(null);
    } catch (error) {
      console.error('Error interacting with OpenAI API:', error);
      alert('Failed to process the request. Please check your API key and try again.');
    }
  };

  return (
    <div>
      <h2>Editor</h2>
      <div className="toolbar">
        <button onClick={() => handleAgentClick('Designer')}>Designer</button>
        <button onClick={() => handleAgentClick('Proofreader')}>Proofreader</button>
        <button onClick={() => handleAgentClick('Rewrite')}>Rewrite</button>
        <button onClick={() => handleAgentClick('Expand')}>Expand</button>
        <button onClick={() => handleAgentClick('Summarize')}>Summarize</button>
      </div>
      <ReactQuill
        ref={editorRef}
        value={content}
        onChange={handleEditorChange}
        onChangeSelection={handleSelectionChange}
        style={{ height: '80vh' }}
      />
    </div>
  );
}

export default MarkdownEditor;
