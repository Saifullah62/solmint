declare module 'react-markdown' {
  import React from 'react';
  
  interface ReactMarkdownProps {
    children: string;
    components?: Record<string, React.ComponentType<any>>;
    className?: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    [key: string]: any;
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  
  export default ReactMarkdown;
}
