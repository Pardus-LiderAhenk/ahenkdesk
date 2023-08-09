<template>
  <div class="incoming-message-container">
    <h3>Gelen Mesaj</h3>
    <p class="incoming-message">{{ message }}</p>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'incoming-message',
  data() {
    return {
      // Data property to store the received message
      message: ''
    }
  },
  mounted() {
    // When the component is mounted, send a request to the main process to get data
    ipcRenderer.send('request-data-from-main');

    // Listen for the response from the main process and update the message property
    ipcRenderer.on('response-data-from-main', (event, data) => {
      this.message = data;
    });
  }
}
</script>

<style scoped>
.incoming-message-container {
  margin-top: 20px;
}

.incoming-message {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f5f5f5;
  font-size: 20px;
  line-height: 1.5;
}
</style>
