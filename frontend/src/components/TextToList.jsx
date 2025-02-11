const TextToList = ({ text, className = "" }) => {
    if (!text) return null;
    
    const items = text.split('\n').filter(item => item.trim());
    
    if (items.length === 0) return null;
  
    return (
      <ul className={`list-disc pl-5 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="mb-1">{item.trim()}</li>
        ))}
      </ul>
    );
  };
  
  export default TextToList;