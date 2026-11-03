---
title: The Art of "Ricing" (Hyprland, Waybar & Dotfiles)
description: Master the art of Linux desktop customization. Learn the components of a modern Wayland rice and manage your dotfiles with Git.
---

In the Linux community, **"ricing"** refers to visually and functionally customizing your desktop environment to achieve peak aesthetics, efficiency, and personal expression. Arch Linux is the global epicenter of this craft.

In this guide, you will learn the anatomy of a modern **Wayland rice** and how to version-control your configurations with Git.

---

## 1. The Anatomy of a Modern Wayland Rice

Rather than relying on a heavy pre-bundled desktop environment (like GNOME or macOS), a customized rice combines lightweight, focused tools that communicate with each other:

| Component | Popular Wayland Tools | Purpose |
| :--- | :--- | :--- |
| **Compositor (WM)** | **Hyprland**, Sway | Tiles your windows, handles animations, workspace gestures, and keyboard shortcuts. |
| **Status Bar** | **Waybar** | Displays workspaces, clock, battery, volume, network, and system stats. |
| **App Launcher** | **Wofi**, **Rofi-Wayland** | Search and launch applications with a keyboard shortcut. |
| **Notifications** | **Dunst**, **SwayNC** | Notification banners and control center toggles. |
| **Wallpaper Daemon** | **swww**, **hyprpaper** | Manages wallpapers with smooth transition effects. |
| **Terminal Emulator** | **Kitty**, **Alacritty**, **Foot** | Fast, GPU-accelerated terminal. |
| **Lock Screen & Idle** | **hyprlock**, **hypridle** | Aesthetic lock screen with PAM integration and sleep management. |

---

## 2. Installing the Core Suite

Install Hyprland and its primary companion applications:

```bash
# Core compositor and tools
sudo pacman -S hyprland waybar kitty rofi-wayland dunst polkit-kde-agent

# Wallpaper daemon & screenshot tools
sudo pacman -S swww grim slurp wl-clipboard brightnessctl
```

---

## 3. Supercharging Your Terminal

Your terminal will be your most frequently used application. Let's make it look and feel modern.

### Install Zsh & Fastfetch
```bash
sudo pacman -S zsh fastfetch ttf-jetbrains-mono-nerd
```

### Install Starship (The Cross-Shell Prompt)
**Starship** is a fast, highly customizable prompt that displays Git branch status, programming language versions, battery levels, and execution time:

```bash
sudo pacman -S starship
```

Add Starship to your `~/.bashrc` or `~/.zshrc`:

```bash
echo 'eval "$(starship init bash)"' >> ~/.bashrc
```

Now, whenever you open a terminal, you will see a clean, informative prompt with icons!

---

## 4. Popular Color Schemes

Unifying the color palette across your terminal, window borders, text editor, and wallpaper creates a cohesive look:

- **Catppuccin** (Soothing pastel palette: Mocha, Macchiato, Frappé, Latte)
- **Tokyo Night** (Clean, deep neon cyberpunk aesthetic)
- **Gruvbox** (Warm, retro earthy tones)
- **Nord** (Arctic, north-bluish clean design)
- **Dracula** (High-contrast dark theme)

Most tools (Waybar, Kitty, Neovim, VSCode) have official theme files available for these palettes.

---

## 5. Managing Your Dotfiles with a Bare Git Repo

Configuration files in Linux live in hidden "dotfiles" (such as `~/.config/hypr/hyprland.conf` or `~/.bashrc`).

Instead of copying files manually or using complicated symlink tools, the most elegant method is the **Bare Git Repository** technique:

### Step 1: Initialize the Bare Repository
Run this once in your home directory:

```bash
git init --bare $HOME/.dotfiles
```

### Step 2: Create a Shell Alias
Add this alias to your `~/.bashrc`:

```bash
alias dotfiles='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
```

Reload your shell:
```bash
source ~/.bashrc
```

### Step 3: Configure the Repository to Ignore Untracked Files
By default, Git will try to track every file in your home directory. Hide untracked files:

```bash
dotfiles config --local status.showUntrackedFiles no
```

### Step 4: Track, Commit, and Push Your Configs
Now you can track any configuration file just like a regular Git project:

```bash
# Add your Hyprland configuration
dotfiles add ~/.config/hypr/hyprland.conf

# Add your Waybar configuration
dotfiles add ~/.config/waybar/

# Commit the changes
dotfiles commit -m "feat: Add Hyprland and Waybar configs"

# Push to your GitHub repository
dotfiles remote add origin git@github.com:yourusername/dotfiles.git
dotfiles branch -M main
dotfiles push -u origin main
```

When setting up a new computer in the future, you can simply clone your repository into a bare repo and restore your entire personalized desktop in seconds!
