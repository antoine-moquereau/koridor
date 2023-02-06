<script context="module">
  import { crossfadeTransition } from './../../../utilities'

  const [sendPawn, receivePawn] = crossfadeTransition()
</script>

<script>
  /**
   * @type {number | undefined}
   */
  let key = undefined
  export { key as player }
</script>

<div class={`Pawn${key}`} in:receivePawn|local={{ key }} out:sendPawn|local={{ key }} />

<style>
  .Pawn1,
  .Pawn2,
  .Pawn3,
  .Pawn4 {
    border-radius: 50%;
    height: 58%;
    position: absolute;
    right: 21%;
    top: 21%;
    width: 58%;
  }
  .Pawn1 {
    background: rgb(40 40 190);
    box-shadow: 0 0 1vh rgb(20 20 95 / 40%);
  }
  .Pawn2 {
    background: rgb(190 40 40);
    box-shadow: 0 0 1vh rgb(95 20 20 / 40%);
  }
  .Pawn3 {
    background: rgb(190 160 40);
    box-shadow: 0 0 1vh rgb(95 80 20 / 40%);
  }
  .Pawn4 {
    background: rgb(40 160 40);
    box-shadow: 0 0 1vh rgb(20 80 20 / 40%);
  }
</style>
