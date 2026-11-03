---
title: Laptop Power Management & Battery Life
description: Maximize battery life on your Arch Linux laptop with power profiles, hardware video acceleration, and hybrid GPU switching.
---

Unlike commercial operating systems that ship with pre-tuned power plans, a fresh Arch Linux installation does not impose background power-saving policies. If left unconfigured, your laptop CPU may stay at elevated clock speeds, dedicated GPUs will remain energized, and battery life can suffer.

With a few strategic tweaks, you can achieve battery life that matches or even exceeds Windows.

---

## 1. Choose a Power Management Daemon

You should install **one (and only one)** power management daemon. Running multiple power managers simultaneously causes conflicting policies.

### Option A: `power-profiles-daemon` (Recommended for KDE / GNOME)
This is the modern standard supported natively by both GNOME and KDE Plasma. It integrates directly into your desktop's battery menu slider:

```bash
sudo pacman -S power-profiles-daemon
sudo systemctl enable --now power-profiles-daemon
```

You can now toggle between **Power Saver**, **Balanced**, and **Performance** directly from your system tray or via the command line:

```bash
powerprofilesctl set power-saver
```

### Option B: `tlp` (Best for ThinkPads & Granular Control)
`tlp` is an advanced, automated background power manager that tunes disk spindown, PCI Express bus power states, Wi-Fi power saving, and audio powersave:

```bash
sudo pacman -S tlp tlp-rdw
sudo systemctl enable --now tlp
```

You can monitor your current battery status and power consumption with:

```bash
sudo tlp-stat -b
```

---

## 2. Hardware Video Decoding (Crucial for Battery Life)

Streaming 1080p or 4K video on YouTube can drain battery rapidly if your CPU has to decode the video in software. Enabling **Hardware Video Acceleration (VA-API)** offloads video decoding to the ultra-efficient ASIC decoder on your GPU.

### A. Install Drivers & Verification Tools:

```bash
sudo pacman -S libva-utils
```

- **For Intel (6th Gen Core / Skylake and newer)**:
  ```bash
  sudo pacman -S intel-media-driver
  ```
- **For AMD (Radeon)**:
  The driver is included inside `mesa`.

### B. Verify VA-API:
Run `vainfo` in your terminal:
```bash
vainfo
```
You should see a list of supported entry points like `VAProfileH264... : VAEntrypointVLD` and `VAProfileVP9... : VAEntrypointVLD`.

### C. Enable in Firefox:
1. Open Firefox and type `about:config` in the address bar.
2. Search for `media.ffmpeg.vaapi.enabled` and set it to **`true`**.
3. Now watching YouTube will draw mere fractions of a watt instead of heating up your CPU fans!

---

## 3. Hybrid Graphics (Intel/AMD + NVIDIA Optimus)

If your laptop has both an integrated GPU (iGPU) and a dedicated NVIDIA GPU (dGPU), leaving the NVIDIA card active 24/7 can cut your battery life in half.

### Dynamic Runtime Power Management (`prime-run`)
With the proprietary NVIDIA driver, your dGPU will automatically enter a deep low-power sleep state (`RTD3`) when not in use.

To run games or intensive 3D applications on the dedicated GPU:

```bash
# Install PRIME utility
sudo pacman -S nvidia-prime

# Run your game or app on the dedicated GPU
prime-run steam
```

When `steam` closes, the NVIDIA card automatically powers down, saving up to 15–20 Watts of battery power.

---

## 4. Battery Charge Thresholds

If you keep your laptop plugged into a charger at a desk most of the day, charging to 100% accelerates lithium-ion battery wear. Capping the charge at 80% can double your battery's lifespan.

### On ThinkPads:
Install `tp_smapi` or configure through `tlp`:
```ini
# /etc/tlp.conf
START_CHARGE_THRESH_BAT0=75
STOP_CHARGE_THRESH_BAT0=80
```

### On ASUS Laptops:
Set the limit via sysfs:
```bash
echo 80 | sudo tee /sys/class/power_supply/BAT0/charge_control_limit_max
```
*(KDE Plasma has a built-in battery charge limit slider in **System Settings → Power Management** if your hardware supports it).*
