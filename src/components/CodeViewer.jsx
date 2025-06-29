import React from 'react'

const CodeViewer = ({ code }) => {
  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#dcdcdc",
        padding: "1rem",
        borderRadius: "8px",
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
        height: "200px",
        overflowY: "auto",
        marginTop: "20px",
      }}
    >
      {code || "// Generated code will appear here..."}
    
    </div>
  )
}

export default CodeViewer