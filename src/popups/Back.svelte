<script>
  import { Button } from '../components'
  import { page, popup } from '../stores'

  function handleCancel() {
    popup.set({ component: undefined })
  }
  function handleConfirm() {
    popup.set({ component: undefined })
    page.set('Home')
  }
</script>

<section>
  <p>Are you sure you want to quit the game ?</p>
  <nav>
    <Button class='Button' on:click={handleCancel}>
      No<span>, <br />I wanna finnish the party</span>
    </Button>
    <Button class='Button' on:click={handleConfirm}>
      Yes<span>, <br />I capitulate</span>
    </Button>
  </nav>
</section>

<style>
  section, nav {
    align-items: center;
    display: flex;
    margin: auto;
  }
  section {
    background: var(--light-color);
    border: 1px solid var(--normal-color);
    border-radius: 2vh;
    box-shadow: 0 0 1vh var(--dark-color);
    color: var(--font-color);
    flex-direction: column;
    font-size: 2vh;
    max-width: 86vw;
    padding: 4vh 2vh 1vh;
    text-align: center;
  }
  nav :global(.Button) {
    margin: 2vh;
  }

  @media (max-aspect-ratio: 3/4) {
    nav :global(.Button) {
      margin: 3vw;
      padding: 3vw;
      width: 22vw;
    }
    span {
      display: none;
    }
  }
</style>
