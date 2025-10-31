import { type ComponentType, useState, useCallback, useMemo } from "react";
import { Stack, Card, Text, Box, Button } from "@sanity/ui";
import { set, unset, type ObjectInputProps, useFormValue } from "sanity";

interface GridPosition {
  columnStart?: number;
  columnSpan?: number;
  rowStart?: number;
  rowSpan?: number;
}

interface ImageItem {
  _key: string;
  position?: GridPosition;
}

const GridPositionInputComponent: ComponentType<ObjectInputProps> = (props) => {
  const { value = {}, onChange, path } = props;
  
  // Use Sanity's useFormValue hook to get the document context
  const document = useFormValue([]) as any;
  
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const currentValue = value as GridPosition;

  // Extract gallery configuration and other images from document context
  const { galleryColumns, galleryRows, occupiedCells, currentImageKey, debugInfo } = useMemo(() => {
    // Default values
    let cols = 5;
    let rows = 10;
    const occupied = new Set<string>();
    let currentKey = "";
    const debug: string[] = [];

    debug.push("=== GridPositionInput Debug ===");
    debug.push(`Document via useFormValue: ${!!document}`);
    debug.push(`Has path: ${!!path}`);
    
    // Try to extract from document
    if (!document || !path) {
      debug.push("❌ No document or path context available");
      debug.push("Using useFormValue([]) hook to get document.");
      if (!document) {
        debug.push("⚠️ useFormValue returned null/undefined");
        debug.push("Document may not be loaded yet or form context is missing.");
      }
      debug.push("Falling back to defaults (no occupied cell detection possible)");
      
      console.log(debug.join("\n"));
      
      return {
        galleryColumns: cols,
        galleryRows: rows,
        occupiedCells: occupied,
        currentImageKey: currentKey,
        debugInfo: debug.join("\n"),
      };
    }

    if (document && path) {
      debug.push(`Document type: ${document._type}`);
      debug.push(`Document has pageBlocks: ${!!document.pageBlocks}`);
      
      console.log("🔍 GridPositionInput - Document path:", path);
      console.log("🔍 GridPositionInput - Full document:", document);

      // Find the current image's _key
      // Path is like: ["pageBlocks", {_key: "..."}, "images", {_key: "..."}, "position"]
      const pathArray = Array.isArray(path) ? path : [];
      
      for (let i = 0; i < pathArray.length; i++) {
        const segment = pathArray[i];
        if (segment && typeof segment === "object" && "_key" in segment) {
          // Check if the previous segment is "images" to ensure we're getting the image's key
          if (i > 0 && pathArray[i - 1] === "images") {
            currentKey = segment._key;
            debug.push(`🔑 Current image key: ${currentKey}`);
            console.log("🔑 Current image key:", currentKey);
            break;
          }
        }
      }

      // Find the gallery block - walk through the path to find it
      // We're looking for the parent that contains both "images" array and "columns"/"rows"
      let galleryBlock: any = null;

      // Try to find the gallery in pageBlocks
      if (document.pageBlocks && Array.isArray(document.pageBlocks)) {
        debug.push(`📦 Checking ${document.pageBlocks.length} pageBlocks...`);
        
        // Find which pageBlock contains our image
        for (const block of document.pageBlocks) {
          debug.push(`  - Block type: ${block._type}, has images: ${!!block.images}`);
          
          if (block._type === "bentoGallery" && block.images && Array.isArray(block.images)) {
            debug.push(`    Found bentoGallery with ${block.images.length} images`);
            
            // List all image keys in this gallery
            const imageKeys = block.images.map((img: any) => img._key);
            debug.push(`    Image keys in gallery: ${imageKeys.join(", ")}`);
            
            // Check if this block contains our current image
            const hasCurrentImage = block.images.some((img: any) => img._key === currentKey);
            debug.push(`    Contains current image (${currentKey}): ${hasCurrentImage}`);
            
            if (hasCurrentImage || !currentKey) {
              // This is our gallery
              galleryBlock = block;
              debug.push(`✅ Using this gallery block`);
              console.log("📦 Found gallery block:", galleryBlock);
              break;
            }
          }
        }
      }

      // Also check if document itself is the gallery (for direct gallery editing)
      if (!galleryBlock && document._type === "bentoGallery") {
        galleryBlock = document;
        debug.push("📦 Document itself is the gallery");
        console.log("📦 Document itself is gallery:", galleryBlock);
      }

      if (galleryBlock) {
        cols = galleryBlock.columns || 5;
        rows = galleryBlock.rows || 10;
        debug.push(`📐 Gallery dimensions: ${cols}×${rows}`);
        console.log(`📐 Gallery dimensions: ${cols}×${rows}`);
        
        // Get all images in the gallery
        const images: ImageItem[] = galleryBlock.images || [];
        debug.push(`🖼️ Total images in gallery: ${images.length}`);
        console.log(`🖼️ Total images in gallery: ${images.length}`);
        
        // Calculate occupied cells from other images
        images.forEach((img: ImageItem, idx: number) => {
          debug.push(`  Image ${idx + 1}: _key=${img._key}`);
          
          // Skip the current image
          if (img._key === currentKey) {
            debug.push(`    ⏭️ This is the current image, skipping`);
            console.log(`⏭️ Skipping current image: ${img._key}`);
            return;
          }
          
          const pos = img.position;
          debug.push(`    Position: ${pos ? JSON.stringify(pos) : 'null'}`);
          
          if (pos?.columnStart && pos?.rowStart && pos?.columnSpan && pos?.rowSpan) {
            debug.push(`    📍 Occupies: col ${pos.columnStart}-${pos.columnStart + pos.columnSpan - 1}, row ${pos.rowStart}-${pos.rowStart + pos.rowSpan - 1}`);
            console.log(`📍 Image ${img._key} occupies: col ${pos.columnStart}-${pos.columnStart + pos.columnSpan - 1}, row ${pos.rowStart}-${pos.rowStart + pos.rowSpan - 1}`);
            
            // Mark all cells occupied by this image
            for (let c = pos.columnStart; c < pos.columnStart + pos.columnSpan; c++) {
              for (let r = pos.rowStart; r < pos.rowStart + pos.rowSpan; r++) {
                occupied.add(`${c}-${r}`);
              }
            }
          } else {
            debug.push(`    ⚠️ No valid position set`);
          }
        });
        
        debug.push(`🚫 Total occupied cells: ${occupied.size}`);
        console.log(`🚫 Total occupied cells: ${occupied.size}`);
        
        if (occupied.size > 0) {
          debug.push(`   Occupied cells: ${Array.from(occupied).join(", ")}`);
        }
      } else {
        debug.push("❌ Could not find gallery block in document");
        console.warn("⚠️ Could not find gallery block in document");
      }
    }

    // Log all debug info
    console.log(debug.join("\n"));

    return {
      galleryColumns: cols,
      galleryRows: rows,
      occupiedCells: occupied,
      currentImageKey: currentKey,
      debugInfo: debug.join("\n"),
    };
  }, [document, path]);

  const isCellOccupied = useCallback((col: number, row: number) => {
    return occupiedCells.has(`${col}-${row}`);
  }, [occupiedCells]);

  const toggleCell = useCallback((col: number, row: number) => {
    // Don't allow selecting occupied cells
    if (isCellOccupied(col, row)) {
      console.log(`❌ Cell ${col}-${row} is occupied, cannot select`);
      return;
    }

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
      
      const colSpan = maxCol - minCol + 1;
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
  }, [selectedCells, onChange, isCellOccupied]);

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
            Click cells to select position (Grid: {galleryColumns} columns × {galleryRows} rows)
          </Text>
          
          {occupiedCells.size > 0 && (
            <Text size={1} muted>
              ⚠️ Gray cells are occupied by other images
            </Text>
          )}
          
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${galleryColumns}, 1fr)`,
              gridAutoRows: "1fr",
              gap: "4px",
              userSelect: "none",
              maxHeight: "600px",
              overflow: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px",
              aspectRatio: `${galleryColumns} / ${galleryRows}`,
            }}
          >
            {Array.from({ length: galleryRows * galleryColumns }, (_, i) => {
              const col = (i % galleryColumns) + 1;
              const row = Math.floor(i / galleryColumns) + 1;
              const selected = isCellSelected(col, row);
              const occupied = isCellOccupied(col, row);
              
              // Determine cell appearance
              let backgroundColor = "#f3f4f6"; // Default
              let border = "1px solid #d1d5db";
              let cursor = "pointer";
              let opacity = 1;
              
              if (selected) {
                backgroundColor = "#4f46e5"; // Selected (blue)
                border = "2px solid #312e81";
              } else if (occupied) {
                backgroundColor = "#d1d5db"; // Occupied (light gray)
                border = "1px solid #9ca3af";
                cursor = "not-allowed";
                opacity = 0.6;
              }
              
              return (
                <div
                  key={i}
                  onClick={() => toggleCell(col, row)}
                  style={{
                    backgroundColor,
                    border,
                    borderRadius: "6px",
                    cursor,
                    opacity,
                    transition: "all 0.15s ease",
                    aspectRatio: "1 / 1",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected && !occupied) {
                      e.currentTarget.style.backgroundColor = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected && !occupied) {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  title={occupied ? "Cell occupied by another image" : undefined}
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
          
          {/* Debug Panel */}
          <Card padding={3} tone="caution" border style={{ marginTop: "8px" }}>
            <Text size={1} weight="semibold" style={{ marginBottom: "8px" }}>
              🔍 Debug Info
            </Text>
            <pre style={{ 
              fontSize: "10px", 
              fontFamily: "monospace", 
              whiteSpace: "pre-wrap", 
              wordBreak: "break-word",
              margin: 0,
              maxHeight: "200px",
              overflow: "auto",
            }}>
              {debugInfo}
            </pre>
          </Card>
        </Stack>
      </Card>
    </Stack>
  );
};

export default GridPositionInputComponent;
