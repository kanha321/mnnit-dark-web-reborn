#!/bin/bash
# filepath: /home/kanhaji/mnnit-dark-web-reborn/cleanup.sh
# Cleanup script to remove redundant and unnecessary files

set -e # Exit on error

echo "Starting cleanup of redundant files..."

# These files are empty or redundant and can be safely removed
FILES_TO_REMOVE=(
  # Empty CSS files
  "frontend/css/utils/a11y.css"
  "frontend/css/utils/animations.css"
  "frontend/css/components/loading-indicator.css"
  "frontend/css/components/modal.css"
  "frontend/css/components/toast.css"
  "frontend/pages/file-browser/css/layout/index.css"
  "frontend/pages/file-browser/css/layout/grid.css"
  "frontend/pages/file-browser/css/layout/explorer.css"
  "frontend/pages/file-browser/css/layout/editor.css"
  "frontend/pages/file-browser/css/layout/panel.css"
  "frontend/pages/file-browser/css/layout/settings-panel.css"
  
  # Redundant CSS files
  "frontend/css/core/variables.css"
  "frontend/css/core/reset.css"
  "frontend/css/core/typography.css"
  "frontend/css/utils/flex.css"
  "frontend/css/utils/spacing.css"
  "frontend/css/layout/grid.css"
  "frontend/css/components/buttons.css"
  "frontend/css/components/file-explorer.css"
  "frontend/css/components/editor-area.css"
  "frontend/css/components/info-panel.css"
  "frontend/css/components/panels.css"
  "frontend/css/components/lists.css"
  "frontend/css/components/tabs.css"
  "frontend/css/design-system.css"
  "frontend/css/components/resize-handle.css"
  
  # Redundant JS files
  "frontend/js/app.js"
  "frontend/js/utils/keyboard.js"
  "frontend/js/core/state.js"
  "frontend/js/services/ThemeService.js"
  "frontend/js/services/UIService.js"
  "frontend/js/utils/errors.js"
  "frontend/js/services/MockAPIService.js"
  "frontend/js/components/Modal.js"
  "frontend/js/components/Toast.js"
  "frontend/utils/icon-initializer.js"
  
  # Test files
  "frontend/js/components/__tests__/Modal.test.js"
  "frontend/js/services/__tests__/ThemeService.test.js"
  
  # Unused config files
  "jsdoc.json"
  ".eslintrc.js"
  ".prettierrc.js"
  "jest.config.js"
  "webpack.config.js"
  "tests/setup.js"
  "tests/mocks/styleMock.js"
  "tests/mocks/fileMock.js"
  
  # Duplicate hover-preview.css (consolidated into editor.css)
  "frontend/pages/file-browser/css/hover-preview.css"
)

# Count how many files will be removed
TOTAL_FILES=${#FILES_TO_REMOVE[@]}
echo "Found $TOTAL_FILES files to remove"

# Remove files
REMOVED=0
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    rm "$file"
    echo "Removed: $file"
    REMOVED=$((REMOVED+1))
  else
    echo "Skipping (not found): $file"
  fi
done

echo "Cleanup complete. Removed $REMOVED out of $TOTAL_FILES files."

# Find and remove empty directories
echo "Removing empty directories..."
find frontend -type d -empty -delete

echo "Cleanup finished!"
exit 0