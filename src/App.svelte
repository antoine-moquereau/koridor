<script>
  import { PopOver, Router, SplashScreen } from './components'
  import { Header, Theme } from './layouts'
  import { Congratulations, Game, Home } from './pages'
  import { currentPage } from './stores'
</script>

<Theme>
  <Header />
  <Router
    current={$currentPage}
    routes={{ Congratulations, Game, Home }}
  />
  <PopOver />
  <SplashScreen />
</Theme>
