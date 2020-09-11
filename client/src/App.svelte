<script>
  import './App.css';
  import { onMount } from "svelte";
  let statusText = "Loading...";
  const streamEndpoint = "/api/stream";

  onMount(async () => {
    statusText = "Requesting stream...";
    fetch(streamEndpoint)
      .then(response => response.body)
      .then(readableStream => {

        const streamReader = readableStream.getReader();

        return new ReadableStream({
          async start(controller) {
            while (true) {
              const { done, value } = await streamReader.read();
              const stringVal = new TextDecoder("utf-8").decode(value);
              statusText = 'Stream data: ' + stringVal;
              if (done) {
                break;
              }
              controller.enqueue(value);
            }
            controller.close();
            streamReader.releaseLock();
          }
        });
      })
      .then(rs => new Response(rs))
      .then(response => response.text())
      .then(text => (statusText = "Connection ended. Final stream data: " + text))
      .catch(err => {
        statusText = err;
      });
  });
</script>

<main>
  <h1>Consuming readable stream</h1>
  <p class="data-text">{statusText}</p>
</main>
