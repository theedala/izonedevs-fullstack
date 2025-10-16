import React from 'react';
interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}
const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  title,
  className = ''
}) => {
  return <div className={`code-block overflow-hidden ${className}`}>
      {title && <div className="flex items-center px-4 py-2 bg-dark border-b border-primary/30">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-danger"></div>
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <div className="w-3 h-3 rounded-full bg-success"></div>
          </div>
          <div className="ml-4 text-xs text-white/60 font-mono">{title}</div>
        </div>}
      <pre className="overflow-x-auto p-4 text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>;
};
export default CodeBlock;