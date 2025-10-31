import { type ComponentType, useState, useCallback } from "react";
import { Stack, Card, Text, Box, Button } from "@sanity/ui";
import { set, unset, type ObjectInputProps } from "sanity";

interface GridPosition {
  columnStart?: number;
  columnSpan?: number;
  rowStart?: number;
  rowSpan?: number;
}

const COLUMNS = 5;
const VISIBLE_ROWS = 10;

const GridPositionInputComponent: ComponentType<ObjectInputProps> = (props) => {
  const { value = {}, onChange } = props;
  
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const currentValue = value as GridPosition;

  const toggleCell = useCallback((col: number, row: number) => {
    const cellKey = `${col}-${row}`;
    const newSelected = new Set(selectedCells);
    
    if (newSelected.has(cellKey)) {
      newSelected.delete(cellKey);
    } else {
      newSelected.add(cellKey);
    }
    
    setSelectedCells(newSelected);
    
    // Calculate bounding box from selected cells
    if (newSelected.size > 0) {
      const cells = Array.from(newSelected).map(key => {
        const [c, r] = key.split('-').map(Number);
        return { col: c, row: r };
      });
      
      const minCol = Math.min(...cells.map(c => c.col));
      const maxCol = Math.max(...cells.map(c => c.col));
      const minRow = Math.min(...cells.map(c => c.row));
      const maxRow = Math.max(...cells.map(c => c.row));
      
      const colSpan = Math.min(maxCol - minCol + 1, 4); // Max 4 columns
      const rowSpan = maxRow - minRow + 1;
      
      onChange(set({
        columnStart: minCol,
        columnSpan: colSpan,
        rowStart: minRow,
        rowSpan: rowSpan,
      }));
    } else {
      onChange(unset());
    }
  }, [selectedCells, onChange]);

  const handleClear = useCallback(() => {
    setSelectedCells(new Set());
    onChange(unset());
  }, [onChange]);

  // Initialize selected cells from current value
  const getCurrentSelection = () => {
    if (currentValue.columnStart && currentValue.rowStart) {
      const cells = new Set<string>();
      const colStart = currentValue.columnStart;
      const colSpan = currentValue.columnSpan || 1;
      const rowStart = currentValue.rowStart;
      const rowSpan = currentValue.rowSpan || 1;
      
      for (let c = colStart; c < colStart + colSpan; c++) {
        for (let r = rowStart; r < rowStart + rowSpan; r++) {
          cells.add(`${c}-${r}`);
        }
      }
      return cells;
    }
    return selectedCells;
  };

  const displayCells = selectedCells.size > 0 ? selectedCells : getCurrentSelection();
  
  const isCellSelected = (col: number, row: number) => {
    return displayCells.has(`${col}-${row}`);
  };

  const getSelectionInfo = () => {
    if (currentValue.columnStart && currentValue.rowStart) {
      const colStart = currentValue.columnStart;
      const colSpan = currentValue.columnSpan || 1;
      const rowStart = currentValue.rowStart;
      const rowSpan = currentValue.rowSpan || 1;
      return {
        colStart,
        colEnd: colStart + colSpan - 1,
        rowStart,
        rowEnd: rowStart + rowSpan - 1,
        colSpan,
        rowSpan,
      };
    }
    return null;
  };

  const info = getSelectionInfo();

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Click cells to select position (Max 4 columns wide)
          </Text>
          
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
              gridTemplateRows: `repeat(${VISIBLE_ROWS}, 1fr)`,
              gap: "4px",
              userSelect: "none",
              aspectRatio: `${COLUMNS} / ${VISIBLE_ROWS}`,
            }}
          >
            {Array.from({ length: VISIBLE_ROWS * COLUMNS }, (_, i) => {
              const col = (i % COLUMNS) + 1;
              const row = Math.floor(i / COLUMNS) + 1;
              const selected = isCellSelected(col, row);
              
              return (
                <div
                  key={i}
                  onClick={() => toggleCell(col, row)}
                  style={{
                    backgroundColor: selected ? "#4f46e5" : "#f3f4f6",
                    border: selected ? "2px solid #312e81" : "1px solid #d1d5db",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                />
              );
            })}
          </Box>

          {info && (
            <Card padding={3} tone="primary" border>
              <Text size={1} weight="semibold">
                📍 Position: Column {info.colStart}-{info.colEnd} ({info.colSpan} wide) × Row {info.rowStart}-{info.rowEnd} ({info.rowSpan} tall)
              </Text>
            </Card>
          )}

          <Button tone="critical" text="Clear Selection" onClick={handleClear} />
        </Stack>
      </Card>
    </Stack>
  );
};

export default GridPositionInputComponent;
