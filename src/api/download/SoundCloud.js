const { soundcloud } = require('jer-api');

module.exports = function (app) {
    app.get('/download/soundcloud', async (req, res) => {
        try {
            const { apikey, url } = req.query;
            if (!global.apikey.includes(apikey)) {
                return res.json({ status: false, error: 'Apikey invalid' });
            }
            if (!url) {
                return res.json({ status: false, error: 'Url is required' });
            }

            const result = await soundcloud(url);

            res.status(200).json({
                status: true,
                result: {
                    title: result.data.title,
                    downloadUrl: result.data.downloadUrl,
                    author: {
                        id: result.data.author.id,
                        username: result.data.author.username,
                        avatar: result.data.author.avatar_url,
                        profile: result.data.author.permalink_url,
                        followers: result.data.author.followers_count,
                        verified: result.data.author.verified
                    }
                }
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};