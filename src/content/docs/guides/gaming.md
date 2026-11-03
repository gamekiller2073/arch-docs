---
title: The Complete Guide to Gaming on Arch
description: Turn your Arch Linux installation into a high-performance gaming rig with Steam, Proton GE, Heroic, MangoHud, GameMode, and Gamescope.
---

Arch Linux has become the premier distribution for PC gaming. In fact, Valve chose an Arch Linux base for **SteamOS** on the Steam Deck because of its rolling release model, cutting-edge graphics drivers, and lean footprint.

In this guide, you will learn how to configure your system for gaming, achieve maximum frame rates, and run Windows games seamlessly.

---

## 1. Enable 32-Bit Repositories (`multilib`)

Many games (and Steam itself) are 32-bit applications that require 32-bit libraries to function.

Open `/etc/pacman.conf`:

```bash
sudo nano /etc/pacman.conf
```

Uncomment the `[multilib]` repository:

```ini
[multilib]
Include = /etc/pacman.d/mirrorlist
```

Save and exit (<kbd>Ctrl+O</kbd>, <kbd>Enter</kbd>, <kbd>Ctrl+X</kbd>), then synchronize the database:

```bash
sudo pacman -Syu
```

---

## 2. Install 32-Bit Graphics Drivers & Vulkan

Vulkan is the high-efficiency graphics API used by DXVK and VKD3D to translate DirectX 9/10/11/12 calls into Linux-native instructions.

Install both the 64-bit and 32-bit Vulkan drivers for your GPU:

### For AMD Radeon:
```bash
sudo pacman -S mesa lib32-mesa vulkan-radeon lib32-vulkan-radeon
```

### For Intel (Integrated & Arc):
```bash
sudo pacman -S mesa lib32-mesa vulkan-intel lib32-vulkan-intel
```

### For NVIDIA:
```bash
sudo pacman -S nvidia-utils lib32-nvidia-utils
```

---

## 3. Installing & Configuring Steam

Install Steam from the official repository:

```bash
sudo pacman -S steam
```

When prompted for font providers, select `noto-fonts` or `ttf-liberation`.

### Enable Steam Play (Proton) for All Windows Games

By default, Steam only enables Proton for Valve-verified titles. You should enable it for your entire library:

1. Open Steam and go to **Steam** (top left) → **Settings**.
2. Select **Compatibility** from the left sidebar.
3. Toggle on **Enable Steam Play for supported titles**.
4. Toggle on **Enable Steam Play for all other titles**.
5. Set "Run other titles with:" to the latest stable **Proton** version (e.g., Proton 9.0 or Proton Experimental).
6. Click **OK** and restart Steam.

Now you can click "Install" on virtually any Windows title in your library!

---

## 4. Install Proton-GE (GloriousEggroll)

**Proton GE** is a community-built version of Proton maintained by Thomas Crider (GloriousEggroll), a Red Hat engineer. It incorporates experimental patches, proprietary video codecs (needed for in-game cutscenes and FMVs), and game-specific bug fixes weeks before they arrive in official Proton.

### The Easy Way: Using ProtonPlus
Install the GUI manager `protonplus` via AUR:

```bash
paru -S protonplus
```

1. Launch **ProtonPlus**.
2. Select **Steam** as the runner.
3. Click **Install** on the latest `GE-Proton` release.
4. Restart Steam.
5. In Steam, right-click any game → **Properties** → **Compatibility** → check **Force the use of a specific Steam Play compatibility tool** → select **GE-Proton**.

---

## 5. Non-Steam Games: Epic, GOG & Lutris

You don't need Steam to game on Arch.

### Heroic Games Launcher (Epic Games & GOG)
Heroic is a blazingly fast, open-source native launcher for the Epic Games Store, GOG, and Amazon Prime Games:

```bash
paru -S heroic-games-launcher-bin
```

Heroic features built-in Wine and Proton management, cloud save syncing, and direct integration with MangoHud and GameMode.

### Lutris (Battle.net, EA App, Ubisoft, Emulators)
Lutris organizes all your games in one unified interface and provides one-click community installation scripts:

```bash
sudo pacman -S lutris wine-staging winetricks
```

---

## 6. Maximize Performance with GameMode & MangoHud

### Feral GameMode (Automatic System Optimization)
`gamemode` dynamically optimizes your system when a game launches by:
- Setting the CPU governor to `performance`.
- Increasing process I/O priority.
- Setting GPU clock performance modes.

Install GameMode:

```bash
sudo pacman -S gamemode lib32-gamemode
```

### MangoHud (FPS & Hardware Overlay)
MangoHud is an in-game HUD that monitors:
- FPS and frametime graph
- GPU temperature, clock speed, and VRAM usage
- CPU temperature and per-core utilization
- RAM usage

Install MangoHud and its companion GUI configurator, GOUtils/GOverlay:

```bash
sudo pacman -S mangohud lib32-mangohud goverlay
```

You can customize your HUD layout visually by opening `goverlay`.

### How to Apply in Steam Launch Options:
Right-click any game in Steam → **Properties** → enter this in **Launch Options**:

```text
mangohud gamemoderun %command%
```

---

## 7. Gamescope (Valve's Super-Compositor)

`gamescope` is Valve's Wayland micro-compositor. It isolates games into their own sandbox and brings game-changing features:
- **Upscaling with AMD FSR**: Render an intensive game at 1080p and cleanly upscale to 1440p or 4K.
- **Windowed-to-Fullscreen emulation**: Forces stubborn older games into borderless fullscreen.
- **Ultra-low latency frame limiting**: Frame capping without introducing VSync input lag.

Install Gamescope:

```bash
sudo pacman -S gamescope
```

### Example Steam Launch Option:
Render internally at 1080p and upscale to a 1440p monitor using FSR with an 80 FPS cap:

```text
gamescope -w 1920 -h 1080 -W 2560 -H 1440 -U -r 80 -- %command%
```

---

## 8. Controllers & Gamepads

Arch includes generic controller modules, but you should install `game-devices-udev` to grant non-root permissions for modern controllers:

```bash
sudo pacman -S game-devices-udev
```

- **PlayStation 4/5 DualShock & DualSense**: Plug-and-play via USB and Bluetooth. The trackpad and gyro work natively!
- **Xbox Wireless Controller (Bluetooth)**: Works out of the box with `bluez`.
- **Xbox Wireless USB Dongle**: Install the `xpadneo-dkms` driver from the AUR:
  ```bash
  paru -S xpadneo-dkms
  ```
- **Nintendo Switch Pro Controller**: Native support via kernel module.

---

## 9. Checking Game Compatibility

Before buying or installing a Windows game, check its status on the community databases:

- **[ProtonDB.com](https://www.protondb.com)**: Thousands of player reports, performance tweaks, and compatibility tiers (Platinum, Gold, Silver, Bronze, Borked).
- **[AreWeAntiCheatYet.com](https://areweanticheatyet.com)**: Comprehensive status of multiplayer anti-cheat games (Easy Anti-Cheat, BattlEye, Vanguard).

> [!NOTE]
> Titles using kernel-level rootkit anti-cheat tied exclusively to Windows drivers (such as *Valorant* or *Fortnite*) currently do not run under Linux. However, games like *Apex Legends*, *Helldivers 2*, *Elden Ring*, *Cyberpunk 2077*, *Baldur's Gate 3*, and *Counter-Strike 2* run natively or with exceptional performance under Proton!
