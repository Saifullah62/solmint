declare module 'openai' {
  export default class OpenAI {
    constructor(options: { apiKey: string | undefined; dangerouslyAllowBrowser?: boolean });
    
    chat: {
      completions: {
        create: (options: {
          model: string;
          messages: Array<{
            role: 'user' | 'assistant' | 'system';
            content: string;
          }>;
          temperature?: number;
          max_tokens?: number;
        }) => Promise<{
          choices: Array<{
            message: {
              role: string;
              content: string;
            };
          }>;
        }>;
      };
    };
  }
}
