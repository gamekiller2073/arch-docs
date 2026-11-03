---
title: "Step 1: Boot & Live Environment"
description: Master the Arch Linux live prompt, configure keyboard maps, verify UEFI mode, and establish a network connection.
---

When the installer boots, you are logged in automatically as the `root` superuser inside a lightweight RAM-disk environment:

```text
root@archiso ~ #
```

In this environment, you have access to standard command-line tools to partition disks, format filesystems, and bootstrap your system onto your drive.

---

## 1. Set the Keyboard Layout

By default, the live environment uses the US keyboard layout (`us`). If you use an alternative layout (such as German, UK, French, or Dvorak), list the available layouts and set yours:

```bash
# Optional: find your layout code
localectl list-keymaps | grep -i de

# Load your layout (e.g., German 'de-latin1', UK 'uk', or French 'fr')
loadkeys de-latin1
```

If you use a standard US keyboard, you can skip this step.

---

## 2. Verify Boot Mode (UEFI)

Ensure that your machine booted in native UEFI mode rather than legacy BIOS compatibility mode:

```bash
ls /sys/firmware/efi/efivars
```

- **If the command lists a directory full of variable files**: You are successfully booted in UEFI mode. Continue!
- **If the directory does not exist**: Your machine booted in Legacy BIOS (CSM) mode. Reboot, open your BIOS settings, disable CSM/Legacy boot, and ensure you select the UEFI USB boot entry.

---

## 3. Connect to the Internet

Arch requires an active internet connection to download base system packages during installation.

### Option A: Wired Ethernet
If you connected an Ethernet cable, network discovery is usually automatic via DHCP. Verify your connection:

```bash
ping -c 3 archlinux.org
```

If you see `3 packets transmitted, 3 received, 0% packet loss`, you are connected and can proceed to Step 4!

### Option B: Wireless Wi-Fi with `iwctl`
The Arch ISO includes `iwd` (Internet Wireless Daemon). Use the interactive `iwctl` shell to connect:

```bash
# Launch interactive iwd prompt
iwctl
```

Inside the `[iwd]#` prompt:

```text
# 1. Identify your wireless device name (usually wlan0)
[iwd]# device list

# 2. Trigger a scan for nearby networks
[iwd]# station wlan0 scan

# 3. List available Wi-Fi networks
[iwd]# station wlan0 get-networks

# 4. Connect to your Wi-Fi SSID
[iwd]# station wlan0 connect "YourNetworkName"

# 5. Type your Wi-Fi password when prompted, then exit iwd
[iwd]# exit
```

Test your connection:

```bash
ping -c 3 archlinux.org
```

> [!TIP]
> If `ping` fails, check `ip link` to ensure your interface is `UP`. You can also run `resolvectl status` to confirm DNS resolution is operating correctly.

---

## 4. Synchronize the System Clock

Ensure your system clock is accurate using Network Time Protocol (NTP). An inaccurate clock can cause SSL certificate validation errors when downloading packages from mirrors:

```bash
timedatectl
```

Check that `NTP service: active` (or `System clock synchronized: yes`). If not, enable NTP explicitly:

```bash
timedatectl set-ntp true
```

---

## Summary Checklist

Before proceeding to partitioning, ensure:
- [x] Booted in UEFI mode (`/sys/firmware/efi/efivars` exists)
- [x] Keyboard layout is comfortable for you
- [x] `ping -c 3 archlinux.org` responds successfully
- [x] System clock is synchronized via NTP

Next step: [Step 2: Partitioning & Formatting](/installation/partitioning/)!
