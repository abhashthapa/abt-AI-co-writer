import React from 'react';

function NotesSidebar({ toc }) {
  return (
    <div>
      <h2>Table of Contents</h2>
      <ul className="toc-list">
        {toc.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default NotesSidebar;
