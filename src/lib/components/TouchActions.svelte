<script>
  import {
    HorizontalFence as HorizontalFenceIcon,
    Pawn as PawnIcon,
    VerticalFence as VerticalFenceIcon
  } from '$lib/icons'
</script>

<div class="TouchActions">
  <div>
    <HorizontalFenceIcon />
  </div>
  <div>
    <PawnIcon />
  </div>
  <div>
    <VerticalFenceIcon />
  </div>
</div>

<style>
  .TouchActions {
    color: var(--font-color);
    display: none;
    justify-content: space-evenly;
    margin: 88.75vh calc((100vw - 57.75vh) / 2) 0;
    position: fixed;
    width: 57.75vh;
  }

  .TouchActions div {
    background: var(--normal-color);
    border: none;
    border-radius: 22%;
    box-shadow: 0 0 0.7vh var(--transparent99-font-color);
    height: 8vh;
    padding: 1vh;
    width: 8vh;
  }

  @media (max-aspect-ratio: 5/8) {
    .TouchActions {
      margin: calc(max(calc((100vh - 112.75vw) / 2), 14vh) + 112.75vw + 4.625vw) 4.625vw 0;
      width: 90.75vw;
    }

    .TouchActions div {
      height: 15vw;
      padding: 1vw;
      width: 15vw;
    }
  }

  @media (hover: none) {
    .TouchActions {
      display: flex;
    }
  }
</style>
