<script>
  import { page } from '$app/stores'
</script>

<h1>Oops!</h1>
<p>Error {$page.status} {$page.error?.message}</p>
<a href="/">Home</a>

<style>
  :global(main) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  a {
    margin-top: 2rem;
  }
</style>
