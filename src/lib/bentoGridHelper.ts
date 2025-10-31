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
  // If manual size is set, return that (but enforce minimum 2 rows)
  if (manualSize && manualSize !== "auto") {
    const sizeMap: Record<string, GridSize> = {
      small: { colSpan: 1, rowSpan: 2 }, // Changed from 1 to 2
      mediumWide: { colSpan: 2, rowSpan: 2 }, // Changed from 1 to 2
      mediumTall: { colSpan: 1, rowSpan: 2 },
      large: { colSpan: 2, rowSpan: 2 },
      extraWide: { colSpan: 3, rowSpan: 2 }, // Changed from 1 to 2
    };
    return sizeMap[manualSize] || { colSpan: 1, rowSpan: 2 }; // Changed default from 1 to 2
  }

  // Auto-calculate based on aspect ratio
  const ratio = aspectRatio.width / aspectRatio.height;
  
  // Use index for deterministic variety (not random)
  const variant = (index || 0) % 4; // 4 variants for variety

  // Ultra-wide (3:1 or wider) -> wide layouts (minimum 2 rows)
  if (ratio >= 3) {
    return variant === 0 ? { colSpan: 3, rowSpan: 2 } : { colSpan: 2, rowSpan: 2 };
  }
  
  // Wide landscape (2:1 to 3:1) -> mix of sizes (can span 3 columns)
  if (ratio >= 2) {
    if (variant === 0) {
      return { colSpan: 3, rowSpan: 2 }; // Extra wide (changed from 2 to 3)
    } else if (variant === 1) {
      return { colSpan: 2, rowSpan: 3 }; // Wide and tall
    } else if (variant === 2) {
      return { colSpan: 2, rowSpan: 2 }; // Wide
    } else {
      return { colSpan: 1, rowSpan: 2 }; // Tall-ish
    }
  }
  
  // Landscape (1.3:1 to 2:1) -> varied sizes (can span 3 columns)
  if (ratio >= 1.3) {
    if (variant === 0) {
      return { colSpan: 3, rowSpan: 2 }; // Extra wide (changed from 2 to 3)
    } else if (variant === 1) {
      return { colSpan: 2, rowSpan: 2 }; // Big square
    } else if (variant === 2) {
      return { colSpan: 2, rowSpan: 3 }; // Wide and tall (changed from 2 to 3 rows)
    } else {
      return { colSpan: 1, rowSpan: 2 }; // Tall
    }
  }
  
  // Square-ish (0.8 to 1.3) -> lots of variety (occasionally 3 columns)
  if (ratio >= 0.8) {
    if (variant === 0) {
      return { colSpan: 3, rowSpan: 3 }; // Extra large (changed from 2 to 3 cols)
    } else if (variant === 1) {
      return { colSpan: 1, rowSpan: 3 }; // Very tall
    } else if (variant === 2) {
      return { colSpan: 2, rowSpan: 2 }; // Big square
    } else {
      return { colSpan: 1, rowSpan: 2 }; // Tall
    }
  }
  
  // Portrait (0.5 to 0.8) -> tall layouts (3-4 rows)
  if (ratio >= 0.5) {
    if (variant === 0) {
      return { colSpan: 1, rowSpan: 4 }; // Extra tall
    } else if (variant === 1) {
      return { colSpan: 1, rowSpan: 3 }; // Very tall
    } else if (variant === 2) {
      return { colSpan: 1, rowSpan: 3 }; // Very tall
    } else {
      return { colSpan: 1, rowSpan: 2 }; // Tall
    }
  }
  
  // Tall portrait (< 0.5) -> very tall (4 rows!)
  if (ratio >= 0.3) {
    return variant % 2 === 0 ? { colSpan: 1, rowSpan: 4 } : { colSpan: 1, rowSpan: 3 };
  }
  
  // Ultra tall portrait (< 0.3) -> extremely tall
  return { colSpan: 1, rowSpan: 5 };
}

/**
 * Optimizes grid layout to prevent gaps
 * Aggressively adjusts sizes to fill the grid completely
 */
export function optimizeBentoLayout(sizes: GridSize[], columns: number): GridSize[] {
  // Clone the array
  const optimized = [...sizes];
  
  // Create a 2D grid to simulate placement
  const maxRows = 100;
  const grid: boolean[][] = Array.from({ length: maxRows }, () => Array(columns).fill(false));
  
  // Track positions for each item
  const positions: Array<{ row: number; col: number }> = [];
  
  // Place each item
  for (let i = 0; i < optimized.length; i++) {
    const current = optimized[i];
    
    // Clamp to grid width (allow full width now)
    if (current.colSpan > columns) {
      current.colSpan = columns;
    }
    
    // Find first available position
    let placed = false;
    for (let row = 0; row < maxRows && !placed; row++) {
      for (let col = 0; col <= columns - current.colSpan && !placed; col++) {
        // Check if position is available
        let canPlace = true;
        for (let r = row; r < row + current.rowSpan && canPlace; r++) {
          for (let c = col; c < col + current.colSpan && canPlace; c++) {
            if (grid[r]?.[c]) canPlace = false;
          }
        }
        
        if (canPlace) {
          // Calculate remaining space in this starting row
          let availableSpace = 0;
          for (let c = col + current.colSpan; c < columns; c++) {
            if (!grid[row][c]) availableSpace++;
            else break;
          }
          
          // If small gap would remain and we're not the last item, adjust
          if (availableSpace > 0 && availableSpace <= 2 && i < optimized.length - 1) {
            // Expand to fill the gap (allow full width now)
            const newColSpan = Math.min(current.colSpan + availableSpace, columns);
            current.colSpan = newColSpan;
          }
          
          // Place the item
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
      // Fallback: reduce size if couldn't place
      current.colSpan = Math.max(1, current.colSpan - 1);
      i--; // Retry this item
    }
  }
  
  return optimized;
}

