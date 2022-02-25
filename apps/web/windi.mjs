import glob from 'glob'
import fs from 'fs'

const cssfile = glob.sync('./dist/assets/windicss.*.css')[0].replace('./dist', '')
const htmlfiles = glob.sync('./dist/**/index.html')

htmlfiles.map(file => {
  let html = fs.readFileSync(file, 'utf8').toString()
  html = html.replace(/<script.*src=.*windicss.*><\/script>/, `<link rel="stylesheet" href=".${cssfile}">`)
  fs.writeFileSync(file, html)
})
