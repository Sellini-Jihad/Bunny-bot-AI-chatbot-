import { streamGemini } from './gemini-api.js';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');
let rabbit1 = document.getElementById('rabbit1');
let rabbit2 = document.getElementById('rabbit2');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    // Hide rabbit1 and show rabbit2
    rabbit1.classList.add('hidden');
    rabbit2.classList.remove('hidden');

    // Assemble the prompt by combining the text with the chosen image
    let contents = [
      {
        type: "text",
        text: promptInput.value,
      }
    ];

    // Call the gemini-pro-vision model, and get a stream of results
    let stream = streamGemini({
      model: 'gemini-pro',
      contents,
    });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new markdownit();
    for await (let chunk of stream) {
      buffer.push(chunk);
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};
