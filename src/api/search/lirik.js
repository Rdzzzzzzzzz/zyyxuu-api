const axios = require('axios')
const cheerio = require('cheerio')

async function LirikByPonta(query) {
  let url = 'https://lirik-lagu.net/search/' + encodeURIComponent(query.trim().replace(/\s+/g, '+')) + '.html'
  let { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  let $ = cheerio.load(data)
  let first = $('.card-body.list_main .title-list a').first()
  if (!first.length) return null
  let title = first.text().trim()
  let link = 'https://lirik-lagu.net' + first.attr('href')
  let { data: detail } = await axios.get(link, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  let $$ = cheerio.load(detail)
  let lirik = $$('.post-read.lirik_lagu, #lirik_lagu').first()
  lirik.find('script,style,div[align="center"],ins,.mt-3.pt-3,.artis,.tags,.adsbygoogle').remove()
  let html = lirik.html()
  if (!html) return null
  let text = cheerio.load(html.replace(/<br\s*\/?>/gi, '\n')).text()
  let lines = text.split('\n').map(v => v.trim()).filter(v => v)
  let result = []
  for (let i = 0; i < lines.length; i++) {
    if (/^(.*|.*)$/.test(lines[i]) && i > 0) result.push('')
    result.push(lines[i])
  }
  return { title, link, lirik: result.join('\n') }
}

module.exports = function (app) {
  app.get('/search/lirik', async (req, res) => {
    try {
      const { apikey, query } = req.query
      if (!global.apikey.includes(apikey)) return res.json({ status: false, error: 'Apikey invalid' })
      if (!query) return res.json({ status: false, error: 'Query is required' })
      const result = await LirikByPonta(query)
      if (!result) return res.json({ status: false, error: 'Lirik tidak ditemukan' })
      res.json({
        status: true,
        result
      })
    } catch (err) {
      res.status(500).json({ status: false, error: err.message })
    }
  })
}