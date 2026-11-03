---
title: "Pacman & The AUR"
description: Master Arch's native package manager pacman, enable multilib and parallel downloads, and tap into the vast Arch User Repository (AUR).
---

Arch Linux uses **Pacman** as its package manager. Pacman is exceptionally fast, lightweight, and uses straightforward commands.

---

## 1. Pacman Cheatsheet

Here are the essential commands you will use daily:

| Action | Command | Explanation |
| :--- | :--- | :--- |
| **System Upgrade** | `sudo pacman -Syu` | Synchronizes repositories and updates every package. |
| **Install Package** | `sudo pacman -S git` | Downloads and installs one or more packages. |
| **Clean Remove** | `sudo pacman -Rns package` | Removes the package **and** any dependencies not used by other packages. |
| **Search Repositories** | `pacman -Ss keyword` | Searches remote databases for matching package names or descriptions. |
| **View Package Info** | `pacman -Si package` | Displays version, license, dependencies, and size of a package. |
| **List Installed Apps** | `pacman -Qe` | Lists all packages explicitly installed by you. |
| **Clean Old Cache** | `sudo pacman -Sc` | Frees up disk space by clearing downloaded `.pkg.tar.zst` files. |

> [!TIP]
> Always use `pacman -Rns` instead of plain `pacman -R`. The `-n` flag ignores backup configuration files, and `-s` removes orphaned dependencies, preventing disk clutter.

---

## 2. Supercharge `/etc/pacman.conf`

Make pacman faster, more readable, and enable 32-bit application support (vital for **Steam** and **Wine**):

```bash
sudo nano /etc/pacman.conf
```

### Improvements to Enable:

1. **Enable Colors & Parallel Downloads**:
   Locate the `[options]` section and uncomment:
   ```ini
   Color
   VerbosePkgLists
   ParallelDownloads = 5
   ```
   *(Bonus: add `ILoveCandy` on its own line under `Color` to turn the progress bar into an animated Pac-Man eating power pellets!)*

2. **Enable Multilib (32-bit software)**:
   Scroll down to find `[multilib]`. Uncomment both lines:
   ```ini
   [multilib]
   Include = /etc/pacman.d/mirrorlist
   ```

Save and exit (<kbd>Ctrl+O</kbd>, <kbd>Enter</kbd>, <kbd>Ctrl+X</kbd>).

Update your repositories with the new settings:

```bash
sudo pacman -Syu
```

---

## 3. What is the Arch User Repository (AUR)?

The official Arch repositories contain thousands of curated packages. However, for specialized software (Google Chrome, Spotify, Visual Studio Code, Discord, proprietary drivers), users turn to the **AUR**.

The AUR does not store pre-compiled binaries; it stores **`PKGBUILD` scripts**. When you install a package from the AUR, your system:
1. Clones the build script.
2. Downloads source code from upstream.
3. Compiles the software locally.
4. Packages it into an Arch archive and installs it via `pacman`.

---

## 4. Installing an AUR Helper (`paru` or `yay`)

While you can compile AUR packages manually using `makepkg -si`, an **AUR helper** automates searching, dependency resolution, and updating.

Two great choices written in modern languages:
- **`paru`** (Written in Rust, feature-rich)
- **`yay`** (Written in Go, popular and battle-tested)

### Install `paru`:

```bash
# 1. Install git if not already installed
sudo pacman -S --needed base-devel git

# 2. Clone the paru build script
git clone https://aur.archlinux.org/paru.git

# 3. Enter directory and build
cd paru
makepkg -si

# 4. Clean up the build folder
cd .. && rm -rf paru
```

> [!CAUTION]
> **NEVER run an AUR helper with `sudo`!**
> Run `paru -S package` or `yay -S package` as your normal user. The helper will prompt you for your `sudo` password only when it passes compiled packages to `pacman`.

---

## 5. Using Your AUR Helper

AUR helpers drop seamlessly into your workflow. You can use `paru` (or `yay`) for both official packages and AUR packages:

```bash
# Update everything (official repos + all AUR packages)
paru

# Install a package from the AUR (e.g. Visual Studio Code)
paru -S visual-studio-code-bin

# Install Spotify
paru -S spotify
```

Now you have access to the largest catalog of Linux software on earth!
