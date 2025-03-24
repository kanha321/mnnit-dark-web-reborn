# Keyboard Shortcuts Reference

This document provides a comprehensive list of keyboard shortcuts available in the MNNIT Dark Web Reborn application. The application uses Vim-style key bindings for efficient keyboard-based navigation.

## Modes

The keyboard system operates in three distinct modes, inspired by Vim:

| Mode    | Description | How to Enter |
|---------|-------------|-------------|
| Normal  | Default navigation mode for moving around and executing commands | Press `Esc` from any other mode |
| Insert  | Mode for editing text content | Press `i` in Normal mode |
| Command | Mode for executing commands prefixed with `:` | Press `:` in Normal mode |

## Basic Navigation (Normal Mode)

| Key | Action |
|-----|--------|
| `k` | Move up |
| `j` | Move down |
| `h` | Move left |
| `l` | Move right |
| `Ctrl+b` | Page up (backward) |
| `Ctrl+f` | Page down (forward) |
| `0` | Go to start of line |
| `$` | Go to end of line |
| `g g` | Go to top of file/list |
| `G` | Go to bottom of file/list |
| `Space` | Select current item |
| `Enter` | Execute/open current item |

## File Explorer Shortcuts

| Key | Action |
|-----|--------|
| `o` | Open/close folder |
| `z o` | Expand folder and all subfolders |
| `z c` | Collapse folder and all subfolders |
| `-` | Go to parent directory |
| `R` | Refresh current directory |
| `a` | Add new file |
| `A` | Add new folder |
| `d d` | Delete selected item (press d twice) |
| `r` | Rename selected item |

## Editor Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+s` | Save file |
| `u` | Undo |
| `Ctrl+r` | Redo |
| `/` | Find in file |
| `n` | Find next match |
| `N` | Find previous match |
| `Ctrl+w` | Close current tab |
| `g t` | Next tab |
| `g T` | Previous tab |

## Command Mode

Enter Command mode by pressing `:` in Normal mode. Type a command and press Enter to execute.

| Command | Action |
|---------|--------|
| `:q` | Quit current view |
| `:w` | Save current file |
| `:wq` | Save and quit |
| `:q!` | Force quit (discard changes) |
| `:e` | Open file explorer |
| `:set` | Open settings |
| `:help` | Show help |

## Panel Focus

| Key | Action |
|-----|--------|
| `Ctrl+e` | Focus explorer |
| `Ctrl+p` | Focus editor |
| `Ctrl+t` | Focus terminal/panel |
| `Ctrl+w Ctrl+w` | Cycle focus between panes |

## VSCode Compatibility Shortcuts

These shortcuts are familiar to users coming from VSCode with Vim extension:

| Key | Action |
|-----|--------|
| `Ctrl+b` | Toggle sidebar |
| `Ctrl+Shift+p` | Command palette |
| `Ctrl+p` | Quick open file |

## Global Shortcuts

| Key | Action |
|-----|--------|
| `?` | Show keyboard shortcuts help |
| `Esc` | Return to Normal mode from any mode |

## Mode-specific Indicators

The current mode is displayed in the bottom-left corner of the screen:

- **NORMAL**: Standard navigation mode
- **INSERT**: Text editing mode
- **COMMAND**: Command entry mode

## Tips for Efficient Usage

1. **Stay in Normal mode** by default - this gives you access to all navigation shortcuts
2. **Switch to Insert mode** only when actively editing text
3. **Learn the most common shortcuts** first (`j`, `k` for navigation, `o` for opening folders, `Esc` to return to Normal mode)
4. **Use Command mode** for quick operations like saving (`:w`) or quitting (`:q`)
5. **Check the mode indicator** if you're unsure which mode you're in

## Customizing Shortcuts

Shortcuts can be customized by modifying the `keyboard-bindings.js` file in the `frontend/config` directory. After making changes, rebuild the application for them to take effect.
