type AspectRatio = {
  width: number;
  height: number;
};

export type GridSize = {
  colSpan: number;
  rowSpan: number;
};

/**
 * Calculates optimal grid size based on aspect ratio
 * @param aspectRatio - The width and height of the image
 * @param manualSize - Optional manual size override
 * @param index - The index of the image in the array (for deterministic variety)
 */
export function calculateGridSize(
  aspectRatio: AspectRatio,
  manualSize?: string,
  index?: number
): GridSize {
  if (manualSize && manualSize !== "auto") {
    const sizeMap: Record<string, GridSize> = {
      small: { colSpan: 1, rowSpan: 2 },
      mediumWide: { colSpan: 2, rowSpan: 2 },
      mediumTall: { colSpan: 1, rowSpan: 2 },
      large: { colSpan: 2, rowSpan: 2 },
      extraWide: { colSpan: 3, rowSpan: 2 },
    };
    return sizeMap[manualSize] || { colSpan: 1, rowSpan: 2 };
  }

  const ratio = aspectRatio.width / aspectRatio.height;
  const variant = (index || 0) % 4;

  if (ratio >= 3) {
    return variant === 0 ? { colSpan: 3, rowSpan: 2 } : { colSpan: 2, rowSpan: 2 };
  }

  if (ratio >= 2) {
    if (variant === 0) return { colSpan: 3, rowSpan: 2 };
    if (variant === 1) return { colSpan: 2, rowSpan: 3 };
    if (variant === 2) return { colSpan: 2, rowSpan: 2 };
    return { colSpan: 1, rowSpan: 2 };
  }

  if (ratio >= 1.3) {
    if (variant === 0) return { colSpan: 3, rowSpan: 2 };
    if (variant === 1) return { colSpan: 2, rowSpan: 2 };
    if (variant === 2) return { colSpan: 2, rowSpan: 3 };
    return { colSpan: 1, rowSpan: 2 };
  }

  if (ratio >= 0.8) {
    if (variant === 0) return { colSpan: 3, rowSpan: 3 };
    if (variant === 1) return { colSpan: 1, rowSpan: 3 };
    if (variant === 2) return { colSpan: 2, rowSpan: 2 };
    return { colSpan: 1, rowSpan: 2 };
  }

  if (ratio >= 0.5) {
    if (variant === 0) return { colSpan: 1, rowSpan: 4 };
    if (variant === 1) return { colSpan: 1, rowSpan: 3 };
    if (variant === 2) return { colSpan: 1, rowSpan: 3 };
    return { colSpan: 1, rowSpan: 2 };
  }

  if (ratio >= 0.3) {
    return variant % 2 === 0 ? { colSpan: 1, rowSpan: 4 } : { colSpan: 1, rowSpan: 3 };
  }

  return { colSpan: 1, rowSpan: 5 };
}

/**
 * Optimizes grid layout to prevent gaps and fill rows/columns
 */
export function optimizeBentoLayout(sizes: GridSize[], columns: number): GridSize[] {
  const optimized = [...sizes];
  const maxRows = 100;
  const grid: boolean[][] = Array.from({ length: maxRows }, () => Array(columns).fill(false));
  const positions: Array<{ row: number; col: number }> = [];

  for (let i = 0; i < optimized.length; i++) {
    const current = optimized[i];
    if (current.colSpan > columns) current.colSpan = columns;

    let placed = false;
    for (let row = 0; row < maxRows && !placed; row++) {
      for (let col = 0; col <= columns - current.colSpan && !placed; col++) {
        let canPlace = true;
        for (let r = row; r < row + current.rowSpan && canPlace; r++) {
          for (let c = col; c < col + current.colSpan && canPlace; c++) {
            if (grid[r]?.[c]) canPlace = false;
          }
        }

        if (canPlace) {
          let availableSpace = 0;
          for (let c = col + current.colSpan; c < columns; c++) {
            if (!grid[row][c]) availableSpace++;
            else break;
          }
          if (availableSpace > 0 && availableSpace <= 2 && i < optimized.length - 1) {
            current.colSpan = Math.min(current.colSpan + availableSpace, columns);
          }

          for (let r = row; r < row + current.rowSpan; r++) {
            for (let c = col; c < col + current.colSpan; c++) {
              if (grid[r]) grid[r][c] = true;
            }
          }
          positions.push({ row, col });
          placed = true;
        }
      }
    }

    if (!placed) {
      current.colSpan = Math.max(1, current.colSpan - 1);
      i--;
    }
  }

  return optimized;
}

