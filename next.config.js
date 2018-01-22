const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  exportPathMap: function() {
    return {
      '/': { page: '/' }
    }
  },
  assetPrefix: isProd ? '/pgts-verify-tool' : ''
}