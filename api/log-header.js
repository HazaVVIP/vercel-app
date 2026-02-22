// api/log-header.js
export default function handler(req, res) {
    const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        allHeaders: req.headers,
        query: req.query
    };

    // Cetak di log Vercel agar bisa kamu lihat
    console.log("=== INCOMING SSRF PROBE ===");
    console.log(JSON.stringify(logData, null, 2));

    // Berikan respon gambar transparan agar server n8n tidak curiga
    const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': img.length,
        'X-Detection': 'SSRF-Probe-Success'
    });
    res.end(img);
}
