import { create } from "zustand";

interface MatchingAnswer {
  leftIndex: number;
  rightIndex: number;
}

interface FillInBlankAnswer {
  index: number;
  value: string;
}

interface DragDropAnswer {
  draggableIndex: number;
  dropzoneIndex: number;
}

interface PreviewState {
  // Matching
  matchingAnswers: Record<string, MatchingAnswer[]>;
  setMatchingAnswer: (
    blockId: string,
    leftIndex: number,
    rightIndex: number
  ) => void;
  clearMatchingAnswers: (blockId: string) => void;

  // Fill in Blank
  fillInBlankAnswers: Record<string, FillInBlankAnswer[]>;
  setFillInBlankAnswer: (blockId: string, index: number, value: string) => void;
  clearFillInBlankAnswers: (blockId: string) => void;

  // Multiple Choice
  multipleChoiceAnswers: Record<string, number>;
  setMultipleChoiceAnswer: (blockId: string, index: number) => void;
  clearMultipleChoiceAnswers: (blockId: string) => void;

  // Drag and Drop
  dragDropAnswers: Record<string, DragDropAnswer[]>;
  setDragDropAnswer: (
    blockId: string,
    draggableIndex: number,
    dropzoneIndex: number
  ) => void;
  clearDragDropAnswers: (blockId: string) => void;

  // Clear all
  clearAll: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  matchingAnswers: {},
  fillInBlankAnswers: {},
  multipleChoiceAnswers: {},
  dragDropAnswers: {},

  setMatchingAnswer: (blockId, leftIndex, rightIndex) =>
    set((state) => {
      const current = state.matchingAnswers[blockId] || [];
      const existing = current.find((a) => a.leftIndex === leftIndex);

      if (existing) {
        return {
          matchingAnswers: {
            ...state.matchingAnswers,
            [blockId]: current.map((a) =>
              a.leftIndex === leftIndex ? { ...a, rightIndex } : a
            ),
          },
        };
      }

      return {
        matchingAnswers: {
          ...state.matchingAnswers,
          [blockId]: [...current, { leftIndex, rightIndex }],
        },
      };
    }),

  clearMatchingAnswers: (blockId) =>
    set((state) => ({
      matchingAnswers: { ...state.matchingAnswers, [blockId]: [] },
    })),

  setFillInBlankAnswer: (blockId, index, value) =>
    set((state) => {
      const current = state.fillInBlankAnswers[blockId] || [];
      const existing = current.find((a) => a.index === index);

      if (existing) {
        return {
          fillInBlankAnswers: {
            ...state.fillInBlankAnswers,
            [blockId]: current.map((a) =>
              a.index === index ? { ...a, value } : a
            ),
          },
        };
      }

      return {
        fillInBlankAnswers: {
          ...state.fillInBlankAnswers,
          [blockId]: [...current, { index, value }],
        },
      };
    }),

  clearFillInBlankAnswers: (blockId) =>
    set((state) => ({
      fillInBlankAnswers: { ...state.fillInBlankAnswers, [blockId]: [] },
    })),

  setMultipleChoiceAnswer: (blockId, index) =>
    set((state) => ({
      multipleChoiceAnswers: {
        ...state.multipleChoiceAnswers,
        [blockId]: index,
      },
    })),

  clearMultipleChoiceAnswers: (blockId) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [blockId]: _, ...rest } = state.multipleChoiceAnswers;
      return { multipleChoiceAnswers: rest };
    }),

  setDragDropAnswer: (blockId, draggableIndex, dropzoneIndex) =>
    set((state) => {
      const current = state.dragDropAnswers[blockId] || [];
      const existing = current.find((a) => a.draggableIndex === draggableIndex);

      if (existing) {
        return {
          dragDropAnswers: {
            ...state.dragDropAnswers,
            [blockId]: current.map((a) =>
              a.draggableIndex === draggableIndex ? { ...a, dropzoneIndex } : a
            ),
          },
        };
      }

      return {
        dragDropAnswers: {
          ...state.dragDropAnswers,
          [blockId]: [...current, { draggableIndex, dropzoneIndex }],
        },
      };
    }),

  clearDragDropAnswers: (blockId) =>
    set((state) => ({
      dragDropAnswers: { ...state.dragDropAnswers, [blockId]: [] },
    })),

  clearAll: () =>
    set({
      matchingAnswers: {},
      fillInBlankAnswers: {},
      multipleChoiceAnswers: {},
      dragDropAnswers: {},
    }),
}));
