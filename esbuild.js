const esbuild = require('esbuild')
const liveServer = require("live-server") // dev server
const sveltePlugin = require('esbuild-svelte') // esbuild plugin svelte

function showUsage () {
  console.log('USAGE')
  console.log('node esbuild.js dev')
  console.log('node esbuild.js prod')
  process.exit(0)
}

if (process.argv.length < 3) {
  showUsage()
}

if (![ 'dev', 'prod' ].includes(process.argv[2])) {
  showUsage()
}

// production mode, or not
const production = (process.argv[2] === 'prod')

// esbuild watch in dev mode to rebuild out files
let watch = false
if (!production) {
  watch = {
    onRebuild(error) {
      if (error) console.error('esbuild: Watch build failed:', error.getMessage())
      else console.log('esbuild: Watch build succeeded')
    }
  }
}

// esbuild build options
// see: https://esbuild.github.io/api/#build-api
const options = {
  entryPoints: ['./src/main.js'],
  bundle: true,
  watch,
  format: 'iife',
  minify: production,
  sourcemap: false,
  outfile: './public/build/bundle.js', // and bundle.css
  plugins: [
    sveltePlugin()
  ]
}

// start web dev server
if (!production) {
  const params = {
    port: 8080, // Set the server port. Defaults to 8080.
    root: "./public", // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  }
  liveServer.start(params)
}

// esbuild dev + prod
esbuild.build(options).catch((err) => {
  console.error(err)
  process.exit(1)
})
