---
title: Full Disk Encryption with LUKS
description: Secure your data against theft or loss by encrypting your Arch Linux installation with dm-crypt and LUKS2.
---

If you are installing Arch Linux on a laptop, **full disk encryption is essential**. Without encryption, anyone who finds or steals your laptop can plug in a 5-dollar USB drive and read every personal file, browser cookie, and saved password within seconds.

With **LUKS (Linux Unified Key Setup)**, your entire operating system and personal data are encrypted with industry-standard AES-256 encryption.

---

## 1. How LUKS Works

In a standard LUKS setup:
- The **EFI System Partition** (`/boot`) remains unencrypted so the motherboard firmware can load the bootloader and kernel.
- The **Root Partition** is formatted as a LUKS encrypted container.
- At boot time, the Linux kernel requests your passphrase, decrypts the container into a virtual block device (`/dev/mapper/cryptroot`), and mounts your files.

---

## 2. Partitioning for LUKS

During [Step 2: Partitioning](/installation/partitioning/), create only two partitions:

1. **Partition 1 (`nvme0n1p1`)**: 1 GiB `EFI System`
2. **Partition 2 (`nvme0n1p2`)**: Remainder of disk `Linux filesystem` (This will become the encrypted container)

---

## 3. Format and Open the LUKS Container

Initialize the container using `cryptsetup`:

```bash
cryptsetup luksFormat /dev/nvme0n1p2
```

> [!WARNING]
> You will be asked to type **`YES`** in capital letters to confirm. Choose a strong, memorable passphrase. **There is no backdoor or recovery mechanism if you forget this password.**

### Unlock the Container:
Open the container and map it to a virtual device named `cryptroot`:

```bash
cryptsetup open /dev/nvme0n1p2 cryptroot
```

This makes an unencrypted virtual block device available at `/dev/mapper/cryptroot`.

---

## 4. Format and Mount the Filesystems

Format the decrypted virtual device with `ext4` (or Btrfs):

```bash
mkfs.ext4 /dev/mapper/cryptroot
```

Mount the filesystems as normal:

```bash
# 1. Mount root
mount /dev/mapper/cryptroot /mnt

# 2. Format and mount the EFI boot partition
mkfs.fat -F 32 /dev/nvme0n1p1
mount --mkdir /dev/nvme0n1p1 /mnt/boot
```

Now proceed with [Step 3: Base System Installation](/installation/base-system/) as usual.

---

## 5. Configure Initramfs Hooks (`mkinitcpio.conf`)

Inside your `arch-chroot` environment during [Step 4](/installation/system-configuration/), you must teach the early boot environment to prompt for the decryption passphrase.

Open `/etc/mkinitcpio.conf`:

```bash
nano /etc/mkinitcpio.conf
```

Find the `HOOKS=(...)` line. Add **`keyboard`**, **`keymap`**, and **`encrypt`** before `filesystems`:

```text
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block encrypt filesystems fsck)
```

Save and re-generate the initramfs images:

```bash
mkinitcpio -P
```

---

## 6. Configure GRUB to Unlock the Disk

Find the UUID of your physical encrypted partition (`/dev/nvme0n1p2`):

```bash
blkid -s UUID -o value /dev/nvme0n1p2
```

*(Copy or write down this UUID string, e.g., `12345678-abcd-1234-abcd-1234567890ab`).*

Open `/etc/default/grub`:

```bash
nano /etc/default/grub
```

Edit the `GRUB_CMDLINE_LINUX_DEFAULT` variable to include `cryptdevice`:

```text
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet cryptdevice=UUID=YOUR-PARTITION-UUID:cryptroot root=/dev/mapper/cryptroot"
```

Save and exit, then recompile the GRUB configuration:

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

---

## 7. The Encrypted Boot Experience

When you reboot, the bootloader will pause and display a prompt:

```text
Enter passphrase for /dev/nvme0n1p2 (cryptroot):
```

Type your passphrase and press <kbd>Enter</kbd>. The container will decrypt and your Arch Linux desktop will load normally. If your device is ever lost or stolen, your data remains completely impenetrable!
