---
title: Dual-Booting Safely with Windows
description: Set up a harmonious dual-boot system with Windows and Arch Linux, prevent clock desync, and configure GRUB with os-prober.
---

Dual-booting allows you to enjoy the best of both worlds: Arch Linux as your primary daily operating system, while keeping a Windows installation accessible for specialized software or anti-cheat games.

Here is how to set up dual-booting cleanly without data loss.

---

## 1. Golden Rules of Dual-Booting

1. **Two Separate Drives is Best**: If your computer has space for two physical SSDs, install Windows on Drive 1 and Arch Linux on Drive 2. This guarantees a Windows update can never accidentally overwrite your Linux bootloader.
2. **Shrink Windows Partitions Inside Windows**: Never use Linux tools like `gparted` to shrink an active Windows NTFS partition. Always open **Windows Disk Management** (`diskmgmt.msc`), right-click your `C:` drive, and select **Shrink Volume** to free up unallocated space.
3. **Suspend BitLocker**: If Windows Device Encryption or BitLocker is enabled, suspend or backup your BitLocker recovery key before altering partitions.

---

## 2. Fix the Windows Clock Desync Issue

Have you noticed that switching between Windows and Linux causes the clock to be hours off?

### Why this happens:
- **Linux** assumes your motherboard hardware clock is set to **UTC (Coordinated Universal Time)** and applies your timezone offset in software.
- **Windows** assumes your motherboard hardware clock is set to **Local Time**.

### The Solution:
Instruct Windows to use UTC time like the rest of the computing world. Boot into Windows, open **Command Prompt as Administrator**, and run:

```cmd
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /t REG_DWORD /d 1 /f
```

Restart Windows once. Your clock will now stay 100% in sync across both operating systems!

---

## 3. Configure GRUB to Detect Windows (`os-prober`)

By default, modern versions of GRUB disable automatic OS probing for security reasons. We can easily re-enable it:

### Step 1: Install `os-prober` and `dosfstools`
Boot into Arch Linux and run:

```bash
sudo pacman -S os-prober dosfstools
```

### Step 2: Enable OS Prober in GRUB
Open `/etc/default/grub` with root privileges:

```bash
sudo nano /etc/default/grub
```

Scroll to the bottom of the file and ensure this line exists and is **not commented out**:

```ini
GRUB_DISABLE_OS_PROBER=false
```

Save and exit (<kbd>Ctrl+O</kbd>, <kbd>Enter</kbd>, <kbd>Ctrl+X</kbd>).

### Step 3: Mount the Windows EFI Partition (If on a separate drive)
If Windows is on a separate drive, ensure its EFI system partition is mounted temporarily so `os-prober` can inspect it:

```bash
# Example: if Windows EFI partition is /dev/sdb1
sudo mount --mkdir /dev/sdb1 /mnt/windows_efi
```

### Step 4: Re-generate the GRUB Configuration
Run `grub-mkconfig`:

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

You should see output similar to:

```text
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/intel-ucode.img /boot/initramfs-linux.img
Found Windows Boot Manager on /dev/nvme0n1p1@/EFI/Microsoft/Boot/bootmgfw.efi
done
```

Reboot your machine (`sudo reboot`). Your GRUB boot menu will now present both **Arch Linux** and **Windows Boot Manager**!
