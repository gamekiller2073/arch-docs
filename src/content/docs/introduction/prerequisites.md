---
title: Prerequisites & Preparation
description: Prepare your machine, create bootable installation media, and check BIOS/UEFI settings before starting your Arch Linux manual installation.
---

Before diving into the terminal, take a few minutes to ensure your machine is prepared. Proper preparation prevents 90% of beginner headaches.

---

## 1. Hardware Requirements

- **Processor**: 64-bit x86_64 compatible CPU (Intel or AMD).
- **Memory (RAM)**: Minimum 2 GB (4 GB or more strongly recommended for a desktop environment).
- **Storage**: Minimum 20 GB free disk space (50 GB+ recommended if you plan on gaming or developing software).
- **Internet Connection**: Active Ethernet connection or a supported Wi-Fi adapter.
- **USB Drive**: A USB flash drive with at least 2 GB capacity (all contents will be overwritten).

> [!CAUTION]
> **BACK UP YOUR DATA!**
> During the installation, you will format disk partitions. Selecting the wrong drive will erase your existing files permanently. Copy any irreplaceable data to an external drive or cloud storage before proceeding.

---

## 2. UEFI vs. Legacy BIOS

Modern computers (manufactured after ~2011) use **UEFI** firmware and **GPT** (GUID Partition Table) partitioning, rather than older Legacy BIOS and MBR.

**This guide focuses exclusively on UEFI/GPT**, which is the modern standard.

---

## 3. BIOS / UEFI Settings Checklist

Restart your computer and enter your BIOS/UEFI setup (typically by tapping <kbd>F2</kbd>, <kbd>F12</kbd>, <kbd>Del</kbd>, or <kbd>Esc</kbd> when powering on):

### Disable "Secure Boot"
Arch Linux does not ship with pre-signed Microsoft Secure Boot keys out of the box. Locate the **Secure Boot** option in your BIOS security tab and set it to **Disabled**.

### Disable Windows "Fast Startup" (Dual-Boot Only)
If you plan to dual-boot alongside Windows, boot into Windows first and disable Fast Startup:
1. Open **Control Panel** → **Hardware and Sound** → **Power Options**.
2. Click **Choose what the power buttons do**.
3. Click **Change settings that are currently unavailable**.
4. Uncheck **Turn on fast startup (recommended)** and save changes.

> [!WARNING]
> Windows Fast Startup puts NTFS hard drive partitions into a hibernated state. If Linux attempts to mount a hibernated NTFS partition, it can lead to severe filesystem corruption.

### Set SATA Mode to AHCI
If your BIOS SATA controller is configured to **RAID** or **Intel RST**, switch it to **AHCI**. Linux kernel drivers interact natively with drives in AHCI mode.

---

## 4. Download the Official Arch Linux ISO

Always download the ISO from the official Arch website:
- Official Page: [archlinux.org/download](https://archlinux.org/download/)

You can download via Direct HTTP mirror or via BitTorrent (often faster and automatically checksum-verified).

### Verifying the Checksum (Optional but Recommended)
On Linux/macOS:
```bash
sha256sum archlinux-*.iso
```
On Windows PowerShell:
```powershell
Get-FileHash archlinux-*.iso -Algorithm SHA256
```
Compare the output against the SHA256 hash published on the Arch Linux download page.

---

## 5. Creating the Bootable USB

### Option A: Ventoy (Recommended)
[Ventoy](https://www.ventoy.net) is an open-source tool that allows you to simply drag-and-drop ISO files onto a formatted flash drive.
1. Install Ventoy onto your USB drive.
2. Copy `archlinux-x86_64.iso` directly into the USB drive.
3. Done! You can even store multiple ISOs on the same drive.

### Option B: Rufus (Windows)
1. Insert your USB flash drive and open Rufus.
2. Select your USB drive and choose the Arch ISO file.
3. Partition scheme: **GPT**, Target system: **UEFI (non-CSM)**.
4. When prompted after clicking Start, select **Write in DD Image mode**.

### Option C: `dd` Command (Linux/macOS)
```bash
# Identify your USB drive (e.g., /dev/sdb - DO NOT target your internal drive!)
lsblk

# Write the image (replace /dev/sdX with your actual USB device)
sudo dd bs=4M if=path/to/archlinux-x86_64.iso of=/dev/sdX status=progress oflag=sync
```

---

## 6. Booting into the Live ISO

1. Plug your prepared USB drive into your target machine.
2. Power on the computer and tap the **Boot Menu key** (Common keys: <kbd>F12</kbd> for Dell/Lenovo, <kbd>F11</kbd> for MSI/ASRock, <kbd>F8</kbd> for Asus, <kbd>F9</kbd> for HP).
3. Select your USB drive (make sure to select the **UEFI** entry if two options appear).
4. In the Arch boot menu, select **Arch Linux install medium (x86_64, UEFI)**.
5. After a series of boot messages, you will arrive at the root console prompt:

```text
root@archiso ~ #
```

You are now in the Arch Linux live environment! Proceed to [Step 1: Boot & Live Environment](/installation/live-environment/).
