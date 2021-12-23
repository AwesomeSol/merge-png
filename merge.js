const path = require('path')
const {readdir} = require('fs/promises')
const sharp = require('sharp')

const backgroundDir = "./Crypto Chibi/Backgrounds"
const characterDir = "./Crypto Chibi/Characters"
const outputDir = "./output"

async function compositeImages(bg, ch, output) {
  try {
    let bgMeta = await sharp(`${backgroundDir}/${bg}`).metadata();
    let chMeta = await sharp(`${characterDir}/${ch}`).metadata();
    if (chMeta.width > bgMeta.width || chMeta.height > bgMeta.height)
      return false
    console.log(`combine ${bg} ${ch}: ${output.toString().padStart(3, '0')}.png`)
    await sharp(`${backgroundDir}/${bg}`)
      .composite([
        {
          input: `${characterDir}/${ch}`,
          top: Math.floor((bgMeta.width - chMeta.width) / 2),
          left: Math.floor((bgMeta.height - chMeta.height) / 2),
        }
      ])
      .toFile(`${outputDir}/${output.toString().padStart(3, '0')}.png`)
    return true
  } catch (error) {
    console.log(error)
  }
  return false
}

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

async function main() {
  const bgImages = await readdir(backgroundDir)
  const chImages = await readdir(characterDir)
  let generated = 0
  while (generated < 100) {
    const bgIndex = between(0, bgImages.length)
    const chIndex = between(0, chImages.length)
    if (await compositeImages(bgImages[bgIndex], chImages[chIndex], generated))
      generated++
  }
}

main()
