import React, { useState, useEffect } from 'react';
import SettingsModal from './SettingsModal';
import MarkdownEditor from './MarkdownEditor';
import AIChat from './AIChat';
import Dashboard from './Dashboard';
import NotesSidebar from './NotesSidebar';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [toc, setToc] = useState([]);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [bookTitle, setBookTitle] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openaiApiKey');
    const savedTavilyKey = localStorage.getItem('tavilyApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    if (savedTavilyKey) {
      setTavilyKey(savedTavilyKey);
    }
  }, []);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleTavilyKeyChange = (e) => {
    setTavilyKey(e.target.value);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const saveApiKey = () => {
    localStorage.setItem('openaiApiKey', apiKey);
    localStorage.setItem('tavilyApiKey', tavilyKey);
    toggleSettings();
  };

  const handleCreateBook = async (title) => {
    setIsDashboardVisible(false);
    setBookTitle(title);
    // Use AI to generate TOC based on the book title
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
            {
              role: 'system',
              content: `You are a helpful assistant. Organize the content and generate a table of contents for a book titled "${title}".`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const tocItems = data.choices[0].message.content.trim().split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim());
      setToc(tocItems);
    } catch (error) {
      console.error('Error generating TOC:', error);
      alert('Failed to generate the table of contents. Please check your API key and try again.');
    }
  };

  const handleSelectBook = (title) => {
    const bookData = JSON.parse(localStorage.getItem(`book-${title}`));
    setBookTitle(bookData.title);
    setEditorContent(bookData.content);
    setToc(bookData.toc);
    setIsDashboardVisible(false);
  };

  const handleContentInsert = (htmlContent) => {
    setEditorContent((prevContent) => prevContent + '\n' + htmlContent);
  };

  const handleSaveAndGoBack = () => {
    const bookData = {
      title: bookTitle,
      content: editorContent,
      toc,
    };
    localStorage.setItem(`book-${bookTitle}`, JSON.stringify(bookData));
    setIsDashboardVisible(true);
  };

  const handleDeleteBook = () => {
    localStorage.removeItem(`book-${bookTitle}`);
    setIsDashboardVisible(true);
  };

  return (
    <div className="container">
      {isDashboardVisible ? (
        <Dashboard onCreateBook={handleCreateBook} onSelectBook={handleSelectBook} onToggleSettings={toggleSettings} />
      ) : (
        <>
          <div className="header">
            <button className="icon-button" onClick={handleSaveAndGoBack}>
              <span className="material-icons-outlined">arrow_back</span>
              Save Changes and Go Back to Dashboard
            </button>
            <h1 style={{ flexGrow: 1, textAlign: 'center' }}>{bookTitle}</h1>
            <button className="icon-button" onClick={handleDeleteBook}>
              <span className="material-icons-outlined">delete</span>
            </button>
            <button className="icon-button" onClick={toggleSettings}>
              <span className="material-icons-outlined">settings</span>
            </button>
          </div>
          <div className="content">
            <div className="sidebar">
              <NotesSidebar toc={toc} />
            </div>
            <div className="editor">
              <MarkdownEditor apiKey={apiKey} content={editorContent} setContent={setEditorContent} />
            </div>
            <div className="chat">
              <AIChat apiKey={apiKey} onContentInsert={handleContentInsert} />
            </div>
          </div>
        </>
      )}
      {isSettingsOpen && (
        <SettingsModal
          apiKey={apiKey}
          tavilyKey={tavilyKey}
          onApiKeyChange={handleApiKeyChange}
          onTavilyKeyChange={handleTavilyKeyChange}
          onSave={saveApiKey}
          onClose={toggleSettings}
        />
      )}
    </div>
  );
}

export default App;
