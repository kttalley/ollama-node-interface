import { Ollama } from 'ollama';
import * as fs from 'fs';

const ollama = new Ollama({ host: 'http://llm.kristiantalley.com' });

async function main() {
  const args = process.argv.slice(2);

  let model = 'llava-phi3:latest'; // Default model if argument is not provided
  let messages = [];

  // Parse arguments to detect --codellama argument or specific model
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--codellama') {
      // Set model to 'codellama:7b'
      model = 'codellama:7b';
    } else if (args[i].startsWith('--')) {
      // Handle other model arguments
      model = args[i].slice(2); // Remove '--' prefix
    } else {
      // Treat other arguments as user messages
      messages.push({ role: 'user', content: args[i] });
    }
  }

  // Check if there are no user messages provided
  if (messages.length === 0) {
    throw new Error('Message is required.');
  }

  // Initial chat request
  const response = await ollama.chat({
    model: model,
    messages: messages,
  });

  console.log('Response:', response); // Log initial response to inspect its structure

  const fileName = new Date().toISOString().replace(/:/g, '-') + '-ollama-response.json';

  fs.writeFileSync(fileName, JSON.stringify(response));

  
  
  /* TO DO: chaining prompts */
  // Combine existing message from `response.message` and new messages from `messages` array
  // const updatedMessages = [
  //   { role: 'assistant', content: response.message.content }, // Include existing message from `response.message`
  //   ...messages, // Include new messages from `messages` array
  // ];

  // console.log('Updated Messages:', updatedMessages); // Log updated messages to verify its structure

  // // Update the chat model with the combined messages and send a new request to the Ollama API
  // const updatedResponse = await ollama.chat({
  //   model: response.model,
  //   messages: updatedMessages,
  // });

  // fs.writeFileSync(`${fileName}-updated.json`, JSON.stringify(updatedResponse));
}

main();
