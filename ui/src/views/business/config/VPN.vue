<template>
  <div class="iframe-container">
    <iframe
      src="https://www.baidu.com"
      frameborder="0"
      width="100%"
      height="100%"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
    ></iframe>
  </div>
</template>

<style scoped>
.iframe-container {
  width: 100%;
  height: calc(100vh - 64px - 24px * 2);
  padding: 24px;
  background: #f0f2f5;
}

iframe {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
