const { scsearch } = require("api-dylux");

module.exports = function (app) {
    app.get('/search/soundcloud', async (req, res) => {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ status: false, error: 'Query is required' });
        }
        try {
            const scResults = await scsearch(q);
            const scTracks = scResults.map(track => ({
                title: track.title,
                artist: track.artist,
                views: track.views,
                release: track.release,
                duration: track.duration,
                imageUrl: track.thumb || null,
                link: track.url
            }));

            res.status(200).json({
                status: true,
                result: scTracks
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};