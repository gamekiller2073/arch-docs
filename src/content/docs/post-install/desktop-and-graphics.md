---
title: "Drivers, Audio & Desktops"
description: Configure graphics drivers, modern PipeWire audio, system fonts, and install your choice of desktop environment or tiling window manager.
---

Your base system is primed. Now, let's transform your command-line terminal into a stunning graphical workstation.

---

## 1. Graphics & Video Drivers

Linux graphics run via the open-source **Mesa** stack for AMD and Intel, or proprietary drivers for NVIDIA.

### AMD (Radeon)
AMD provides top-tier open-source drivers integrated into the Linux kernel and Mesa:
```bash
sudo pacman -S mesa lib32-mesa vulkan-radeon lib32-vulkan-radeon
```

### Intel (Integrated & Arc GPUs)
```bash
sudo pacman -S mesa lib32-mesa vulkan-intel lib32-vulkan-intel
```

### NVIDIA (Dedicated GeForce / RTX)
For modern cards (GTX 900 series and newer):
```bash
sudo pacman -S nvidia nvidia-utils lib32-nvidia-utils
```
*(If you are using the `linux-lts` kernel, install `nvidia-lts` instead).*

---

## 2. Audio Server: PipeWire

**PipeWire** is the modern Linux standard for audio and video routing, replacing older PulseAudio and JACK servers with ultra-low latency:

```bash
sudo pacman -S pipewire pipewire-audio pipewire-pulse pipewire-alsa wireplumber
```

PipeWire runs as a user service automatically when your desktop environment launches.

---

## 3. Essential System Fonts

A fresh Arch install has no graphical fonts installed. Without fonts, web browsers and desktops will display blank squares (tofu).

Install a clean set of global fonts:

```bash
sudo pacman -S noto-fonts noto-fonts-cjk noto-fonts-emoji ttf-liberation
```

---

## 4. Choose Your Graphical Desktop

You can pick a full-featured Desktop Environment (DE) or a keyboard-centric Tiling Window Manager (WM). Choose **one** option below:

### Option A: KDE Plasma 6 (Recommended All-Rounder)
KDE Plasma is lightweight, deeply customizable, and has outstanding Wayland and multi-monitor support.

```bash
# 1. Install Plasma desktop, SDDM display manager, terminal, and file manager
sudo pacman -S plasma-meta sddm konsole dolphin

# 2. Enable the login display manager service
sudo systemctl enable sddm
```

### Option B: GNOME 47
GNOME offers a polished, minimalist workflow centered around workspaces and touchpad gestures.

```bash
# 1. Install GNOME suite and GDM display manager
sudo pacman -S gnome gdm

# 2. Enable the GDM login manager
sudo systemctl enable gdm
```

### Option C: XFCE (Lightweight & Traditional)
Ideal for older laptops or users who prefer a classic desktop experience using minimal RAM:

```bash
# 1. Install XFCE and LightDM display manager
sudo pacman -S xfce4 xfce4-goodies lightdm lightdm-gtk-greeter

# 2. Enable LightDM
sudo systemctl enable lightdm
```

### Option D: Hyprland (Wayland Tiling Window Manager)
For keyboard power-users who want smooth Wayland animations, blur effects, and tiling window management:

```bash
# Install Hyprland and standard desktop components
sudo pacman -S hyprland waybar kitty wofi dunst polkit-kde-agent
```
*(You can launch Hyprland directly from the TTY terminal by typing `Hyprland`, or launch it from a display manager like SDDM).*

---

## 5. Reboot Into Your New Graphical Desktop

Everything is installed and enabled. Reboot your machine:

```bash
sudo reboot
```

Your system will boot directly into your graphical login screen (SDDM, GDM, or LightDM). 

Enter your password, press <kbd>Enter</kbd>, and enjoy your tailor-made Arch Linux desktop!
