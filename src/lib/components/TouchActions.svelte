<script>
  import { drag } from '$lib/dnd'
  import {
    HorizontalFence as HorizontalFenceIcon,
    HorizontalFenceImage,
    Pawn as PawnIcon,
    PawnImage,
    VerticalFence as VerticalFenceIcon,
    VerticalFenceImage
  } from '$lib/icons'
</script>

<div class="TouchActions">
  <div
    use:drag={{
      type: 'HorizontalFence',
      image: {
        component: HorizontalFenceImage,
        width: 70,
        height: 14
      }
    }}
  >
    <HorizontalFenceIcon />
  </div>
  <div
    use:drag={{
      type: 'Pawn',
      image: {
        component: PawnImage,
        width: 28,
        height: 28
      }
    }}
  >
    <PawnIcon />
  </div>
  <div
    use:drag={{
      type: 'VerticalFence',
      image: {
        component: VerticalFenceImage,
        width: 14,
        height: 70
      }
    }}
  >
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
    transition: 0.2s ease-in-out;
    width: 8vh;
  }
  .TouchActions div:global(.dragging) {
    background: var(--dark-color);
    box-shadow: 0 0 1vh var(--transparentcc-font-color);
    transform: scale(1.12);
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
