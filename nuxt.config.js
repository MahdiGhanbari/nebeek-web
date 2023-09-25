module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'نبیک',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "با موتور جستجوی نبیک می توانید درون کتاب های فارسی را جستجو نمایید" },
      { hid: 'keywords', name: 'keywords', content: 'book, article, magazine, newspaper, nebeek'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'}
    ]
  },
  router: {
    base: '/'
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/material.css',
    '~/assets/css/main.css',
    '~/assets/css/cut.css'
  ],
  build: {
    postcss: [
      require('lost')(),
      require('postcss-nested')(),
      require('postcss-cssnext')(),
    ],
    vendor: ['axios', 'vue-chartjs']
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#337dcc' },
  plugins: [{src: '~/plugins/chart.js', ssr: false}],
  env: {
    apiBaseUrl: process.env.BASE_URL || 'http://localhost:8000/'
  }
}
