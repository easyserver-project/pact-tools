const fs = require("fs")
const packageJson = JSON.parse(fs.readFileSync("package.json", 'utf8'))
const [lMain, lMinor,lPatch] = process.argv[2] ? process.argv[2].split(".").map(d=>parseInt(d)) : "0.0.0"
const [pMain, pMinor,pPatch] = packageJson.version.split(".").map(d=>parseInt(d))
packageJson.version = (lMain===pMain && lMinor === pMinor) ? `${lMain}.${lMinor}.${lPatch+1}` : `${pMain}.${pMinor}.${pPatch}`
fs.writeFileSync("package.json",JSON.stringify(packageJson), 'utf8')
console.log(packageJson.version)