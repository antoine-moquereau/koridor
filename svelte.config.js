// import adapter from '@sveltejs/adapter-auto'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      precompress: true
    })
  }
}

export default config
