import { describe, it, expect, beforeEach } from 'vitest'
import { game } from './game' // Assuming game store is exported from game.js
import { get } from 'svelte/store' // To get store values

// Note: MAX_HISTORY_SIZE is 50 in game.js. Hardcoding here for test purposes.
const MAX_HISTORY_SIZE = 50;

describe('Game Store - History, Undo, Redo', () => {
  beforeEach(() => {
    game.set(2) // Initialize with 2 players before each test
  })

  describe('History Recording', () => {
    it('should record pawn moves in history', () => {
      const initialState = get(game);
      game.move(10); // Example move
      const stateAfterMove = get(game);
      expect(stateAfterMove.history.length).toBe(1);
      expect(stateAfterMove.history[0]).not.toEqual(stateAfterMove); // Snapshot vs current
      // Check if the snapshot is similar to initial state (excluding history/future)
      const historyEntry = { ...stateAfterMove.history[0] };
      const expectedInitialSnapshot = { ...initialState };
      delete expectedInitialSnapshot.history;
      delete expectedInitialSnapshot.future;
      expect(historyEntry).toEqual(expectedInitialSnapshot);
    });

    it('should record horizontal fence placements in history', () => {
      game.move(10); // Initial move to populate history once
      const stateAfterMove1 = get(game);
      game.placeHorizontalFence(20); // Example fence placement
      const stateAfterFence = get(game);
      expect(stateAfterFence.history.length).toBe(2);
      // Check if the second history entry is a snapshot of the state after the first move
      const historyEntry2 = { ...stateAfterFence.history[1] };
      const expectedSnapshot = { ...stateAfterMove1 };
      delete expectedSnapshot.history; // history in snapshot is the game's history *at that time*
      delete expectedSnapshot.future; // future in snapshot is the game's future *at that time*
      // The actual snapshot mechanism deletes history/future from the object being snapshotted
      const snapshotTaken = { ...stateAfterMove1 };
      delete snapshotTaken.history;
      delete snapshotTaken.future;
      expect(historyEntry2).toEqual(snapshotTaken);
    });

    it('should record vertical fence placements in history', () => {
      game.move(10);
      game.placeHorizontalFence(20);
      const stateAfterMove2 = get(game);
      game.placeVerticalFence(30); // Example fence placement
      const stateAfterFence2 = get(game);
      expect(stateAfterFence2.history.length).toBe(3);
      const historyEntry3 = { ...stateAfterFence2.history[2] };
      const snapshotTaken = { ...stateAfterMove2 };
      delete snapshotTaken.history;
      delete snapshotTaken.future;
      expect(historyEntry3).toEqual(snapshotTaken);
    });
  });

  describe('Undo Functionality', () => {
    it('should undo moves correctly and manage history/future arrays', () => {
      const initialState = JSON.parse(JSON.stringify(get(game))); // Deep clone for comparison
      delete initialState.history;
      delete initialState.future;

      game.move(10); // Move 1
      const stateAfterMove1 = JSON.parse(JSON.stringify(get(game)));
      delete stateAfterMove1.history;
      delete stateAfterMove1.future;


      game.move(20); // Move 2
      let currentGame = get(game);
      expect(currentGame.history.length).toBe(2);

      // Undo Move 2
      game.undo();
      currentGame = get(game);
      let currentGameStateComparable = JSON.parse(JSON.stringify(currentGame));
      delete currentGameStateComparable.history;
      delete currentGameStateComparable.future;

      expect(currentGameStateComparable).toEqual(stateAfterMove1);
      expect(currentGame.history.length).toBe(1);
      expect(currentGame.future.length).toBe(1);

      // Undo Move 1
      game.undo();
      currentGame = get(game);
      currentGameStateComparable = JSON.parse(JSON.stringify(currentGame));
      delete currentGameStateComparable.history;
      delete currentGameStateComparable.future;

      expect(currentGameStateComparable).toEqual(initialState);
      expect(currentGame.history.length).toBe(0);
      expect(currentGame.future.length).toBe(2);

      // Try to undo again (should do nothing)
      const stateBeforeExtraUndo = JSON.parse(JSON.stringify(get(game)));
      game.undo();
      const stateAfterExtraUndo = JSON.parse(JSON.stringify(get(game)));
      expect(stateAfterExtraUndo).toEqual(stateBeforeExtraUndo);
      expect(get(game).history.length).toBe(0);
      expect(get(game).future.length).toBe(2);
    });
  });

  describe('Redo Functionality', () => {
    it('should redo moves correctly and manage history/future arrays', () => {
      const initialState = JSON.parse(JSON.stringify(get(game)));
      delete initialState.history;
      delete initialState.future;

      game.move(10); // Move 1
      const stateAfterMove1 = JSON.parse(JSON.stringify(get(game)));
      delete stateAfterMove1.history;
      delete stateAfterMove1.future;

      game.move(20); // Move 2
      const stateAfterMove2 = JSON.parse(JSON.stringify(get(game)));
      delete stateAfterMove2.history;
      delete stateAfterMove2.future;

      // Undo both moves
      game.undo();
      game.undo();

      let currentGame = get(game);
      expect(currentGame.history.length).toBe(0);
      expect(currentGame.future.length).toBe(2);
      let currentGameStateComparable = JSON.parse(JSON.stringify(currentGame));
      delete currentGameStateComparable.history;
      delete currentGameStateComparable.future;
      expect(currentGameStateComparable).toEqual(initialState);


      // Redo Move 1
      game.redo();
      currentGame = get(game);
      currentGameStateComparable = JSON.parse(JSON.stringify(currentGame));
      delete currentGameStateComparable.history;
      delete currentGameStateComparable.future;
      expect(currentGameStateComparable).toEqual(stateAfterMove1);
      expect(currentGame.history.length).toBe(1);
      expect(currentGame.future.length).toBe(1);

      // Redo Move 2
      game.redo();
      currentGame = get(game);
      currentGameStateComparable = JSON.parse(JSON.stringify(currentGame));
      delete currentGameStateComparable.history;
      delete currentGameStateComparable.future;
      expect(currentGameStateComparable).toEqual(stateAfterMove2);
      expect(currentGame.history.length).toBe(2);
      expect(currentGame.future.length).toBe(0);

      // Try to redo again (should do nothing)
      const stateBeforeExtraRedo = JSON.parse(JSON.stringify(get(game)));
      game.redo();
      const stateAfterExtraRedo = JSON.parse(JSON.stringify(get(game)));
      expect(stateAfterExtraRedo).toEqual(stateBeforeExtraRedo);
      expect(get(game).history.length).toBe(2);
      expect(get(game).future.length).toBe(0);
    });
  });

  describe('New Move Clears Future', () => {
    it('should clear the future array when a new move is made after an undo', () => {
      game.move(10); // Move 1
      game.move(20); // Move 2
      game.undo();   // Undo Move 2. Future now has 1 entry.

      let currentGame = get(game);
      expect(currentGame.future.length).toBe(1);

      game.move(30); // New Move 3

      currentGame = get(game);
      expect(currentGame.future.length).toBe(0);
      expect(currentGame.history.length).toBe(2); // History: Initial, Move 1, New Move 3
    });
  });

  describe('History Size Limit', () => {
    it('should cap history length at MAX_HISTORY_SIZE', () => {
      for (let i = 0; i < MAX_HISTORY_SIZE + 5; i++) {
        game.move(i); // Make MAX_HISTORY_SIZE + 5 moves
      }
      const currentGame = get(game);
      expect(currentGame.history.length).toBe(MAX_HISTORY_SIZE);
    });

    it('should cap future length at MAX_HISTORY_SIZE when undoing', () => {
      for (let i = 0; i < MAX_HISTORY_SIZE + 5; i++) {
        game.move(i);
      }
      // Now undo all of them (or more, up to MAX_HISTORY_SIZE times for future)
      for (let i = 0; i < MAX_HISTORY_SIZE + 5; i++) {
        game.undo();
      }
      const currentGame = get(game);
      // After undoing MAX_HISTORY_SIZE moves, history will be empty, future will be MAX_HISTORY_SIZE
      // If we undo more than MAX_HISTORY_SIZE valid undos, future should still be MAX_HISTORY_SIZE
      expect(currentGame.future.length).toBe(MAX_HISTORY_SIZE);
      expect(currentGame.history.length).toBe(0); // All undoable moves are undone
    });
  });
});
