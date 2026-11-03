---
title: "Common Issues & Troubleshooting"
description: Solutions to the most common beginner hiccups, networking gotchas, bootloader issues, and maintenance tips for Arch Linux.
---

Even experienced Linux users run into occasional quirks. Here are answers and step-by-step remedies for the most frequent beginner scenarios.

---

## 1. "I rebooted and there is no internet connection!"

### Scenario A: NetworkManager was installed, but Wi-Fi isn't connected
Run the interactive terminal interface:
```bash
nmtui
```
Navigate to **Activate a connection**, choose your Wi-Fi SSID, and enter your password.

### Scenario B: You forgot to enable or install NetworkManager
If commands like `nmcli` or `nmtui` report `command not found`, you didn't install `networkmanager` during the base installation.

**The Fix:**
1. Plug your Arch USB installer back in and reboot into the live environment.
2. Mount your root partition:
   ```bash
   mount /dev/nvme0n1p3 /mnt
   ```
3. Enter chroot:
   ```bash
   arch-chroot /mnt
   ```
4. Install and enable NetworkManager:
   ```bash
   pacman -S networkmanager
   systemctl enable NetworkManager
   ```
5. Exit chroot, unmount, and reboot:
   ```bash
   exit
   umount -R /mnt
   reboot
   ```

---

## 2. "The system boots directly into BIOS or Windows, skipping GRUB"

### Why this happens:
Your motherboard's UEFI boot order still has the Windows Boot Manager or default drive prioritized over GRUB.

### The Fix:
1. Power on your computer and immediately tap your **BIOS setup key** (<kbd>F2</kbd>, <kbd>Del</kbd>, or <kbd>F12</kbd>).
2. Navigate to the **Boot Priority** or **Boot Order** tab.
3. Look for the entry labeled **GRUB** or **arch** and move it to the **#1 priority spot**.
4. Disable **Fast Boot** in BIOS if enabled.
5. Save changes and exit (<kbd>F10</kbd> in most BIOS interfaces).

---

## 3. "Pacman error: unable to lock database /var/lib/pacman/db.lck exists"

### Why this happens:
Pacman uses a lockfile to ensure two package management operations never write to disk at the same time. If your terminal crashed or was closed while pacman was downloading, the lockfile remained behind.

### The Fix:
First, ensure that pacman is not running in the background:
```bash
ps aux | grep pacman
```

If no pacman process is active, delete the lockfile:
```bash
sudo rm /var/lib/pacman/db.lck
```

Now you can run your `pacman` command again safely.

---

## 4. "Signature is unknown trust / Keyring error"

### Why this happens:
Arch Linux package maintainers frequently rotate cryptographic PGP signing keys. If your system hasn't been updated in several months, pacman may not recognize newer keys.

### The Fix:
Update the keyring package first before performing a full system upgrade:
```bash
sudo pacman -Sy archlinux-keyring
sudo pacman -Syu
```

---

## 5. "Bluetooth does not work or turn on"

By default, the Bluetooth service is not enabled.

### The Fix:
Install the Bluetooth stack and enable the daemon:
```bash
sudo pacman -S bluez bluez-utils
sudo systemctl enable --now bluetooth
```
*(If you are using KDE Plasma or GNOME, the Bluetooth applet in your system tray will now function immediately).*

---

## 6. Maintenance Best Practices

To keep your Arch Linux installation healthy indefinitely:

1. **Check Arch Linux News Before Updating**:
   Visit [archlinux.org](https://archlinux.org). On the rare occasion that an update requires manual intervention (such as migrating a configuration path), it is always announced on the front page.
2. **Never Run Partial Upgrades**:
   Always run `sudo pacman -Syu`. Never run `pacman -Sy` followed by `pacman -S package` without upgrading the rest of your system, as this can cause mismatched library versions.
3. **Clean Orphaned Packages Periodically**:
   Packages that were installed as dependencies but are no longer needed can be listed and removed with:
   ```bash
   sudo pacman -Rns $(pacman -Qtdq)
   ```
4. **Use Timeshift or Btrfs Snapshots**:
   Before trying experimental software or major system overhauls, consider setting up [Timeshift](https://github.com/linuxmint/timeshift) to take quick system restore snapshots.
