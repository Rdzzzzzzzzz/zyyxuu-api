const ytdl = require('ytdl-core')
const yts = require('yt-search')

module.exports = function (app) {
  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, error: 'Url is required' })
      if (!ytdl.validateURL(url)) return res.json({ status: false, error: 'Invalid YouTube URL' })

      const info = await ytdl.getInfo(url)
      const format = ytdl.chooseFormat(info.formats, { quality: '18' }) // 360p mp4

      res.status(200).json({
        status: true,
        result: {
          title: info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails?.pop()?.url,
          duration: info.videoDetails.lengthSeconds,
          url: format.url
        }
      })
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`)
    }
  })

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, error: 'Url is required' })
      if (!ytdl.validateURL(url)) return res.json({ status: false, error: 'Invalid YouTube URL' })

      const info = await ytdl.getInfo(url)
      const format = ytdl.filterFormats(info.formats, 'audioonly')[0]

      res.status(200).json({
        status: true,
        result: {
          title: info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails?.pop()?.url,
          duration: info.videoDetails.lengthSeconds,
          url: format.url
        }
      })
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`)
    }
  })

  app.get('/download/ytsearch', async (req, res) => {
    try {
      const { query } = req.query
      if (!query) return res.json({ status: false, error: 'Query is required' })

      const search = await yts(query)
      const result = search.videos.slice(0, 5).map(v => ({
        title: v.title,
        url: v.url,
        duration: v.timestamp,
        views: v.views,
        published: v.ago,
        thumbnail: v.thumbnail
      }))

      res.status(200).json({ status: true, result })
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`)
    }
  })
}