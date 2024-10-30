import React, { useRef } from 'react';
  import ReactQuill from 'react-quill';
  import 'react-quill/dist/quill.snow.css';

  function MarkdownEditor({ content, setContent }) {
    const editorRef = useRef(null);

    const handleEditorChange = (value) => {
      setContent(value);
    };

    const insertContentAtCursor = (htmlContent) => {
      const quill = editorRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.clipboard.dangerouslyPasteHTML(range.index, `<p><br></p>${htmlContent}`);
      } else {
        quill.clipboard.dangerouslyPasteHTML(quill.getLength(), `<p><br></p>${htmlContent}`);
      }
    };

    return (
      <div>
        <h2>Editor</h2>
        <div className="toolbar">
          <button onClick={() => handleOptionClick('Rewrite')}>Rewrite</button>
          <button onClick={() => handleOptionClick('Expand')}>Expand</button>
          <button onClick={() => handleOptionClick('Summarize')}>Summarize</button>
        </div>
        <ReactQuill
          ref={editorRef}
          value={content}
          onChange={handleEditorChange}
          style={{ height: '80vh' }}
        />
      </div>
    );
  }

  export default MarkdownEditor;
