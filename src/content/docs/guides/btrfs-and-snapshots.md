---
title: Btrfs & Instant Rollback Snapshots
description: Never fear a broken update again. Learn how Btrfs subvolumes, Snapper, and grub-btrfs give you instant system restore directly from the boot menu.
---

The biggest anxiety beginners face with a rolling release distribution like Arch is: *"What if an update breaks my system?"*

With **Btrfs** (B-tree File System) and **Snapper**, this fear completely vanishes. If an update or experimental package breaks your desktop, you simply select a snapshot in your boot menu and boot into your working system from 5 minutes ago!

---

## 1. What Makes Btrfs Special?

Unlike traditional filesystems like `ext4`, Btrfs is a modern **Copy-on-Write (CoW)** filesystem.

### Key Advantages:
- **Instant Snapshots**: Creating a snapshot takes 0.01 seconds and consumes zero additional disk space until files are modified.
- **Subvolumes**: Act like independent partitions within a single storage pool—no need to resize partition boundaries.
- **Transparent Compression**: Compresses files with `zstd` on the fly, saving 20–40% disk space while speeding up read times on SSDs.
- **Data Integrity**: Built-in checksumming detects and reports silent data corruption (bit rot).

---

## 2. Recommended Btrfs Subvolume Layout

When installing Arch with Btrfs, we create distinct subvolumes within our root partition:

| Subvolume | Mount Point | Purpose |
| :--- | :--- | :--- |
| `@` | `/` | System root files, libraries, and binaries. |
| `@home` | `/home` | Your personal documents, games, and downloads. *(Kept separate so restoring a system snapshot does not erase recent personal files!)* |
| `@snapshots` | `/.snapshots` | Where restore snapshots are stored. |
| `@var_log` | `/var/log` | System logs *(exempt from system rollbacks so logs are preserved across crashes)*. |

### How to Format and Create Subvolumes (During Step 2 of Installation):

```bash
# 1. Format root partition as Btrfs
mkfs.btrfs -f -L "ArchRoot" /dev/nvme0n1p3

# 2. Mount temporarily to create subvolumes
mount /dev/nvme0n1p3 /mnt
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
btrfs subvolume create /mnt/@snapshots
btrfs subvolume create /mnt/@var_log
umount /mnt

# 3. Mount subvolumes with zstd compression enabled
mount -o noatime,compress=zstd,subvol=@ /dev/nvme0n1p3 /mnt
mount --mkdir -o noatime,compress=zstd,subvol=@home /dev/nvme0n1p3 /mnt/home
mount --mkdir -o noatime,compress=zstd,subvol=@snapshots /dev/nvme0n1p3 /mnt/.snapshots
mount --mkdir -o noatime,compress=zstd,subvol=@var_log /dev/nvme0n1p3 /mnt/var/log
mount --mkdir /dev/nvme0n1p1 /mnt/boot
```

---

## 3. Install & Configure Snapper

**Snapper** is an automated snapshot management utility developed by SUSE.

Install Snapper:

```bash
sudo pacman -S snapper
```

### Initialize the Root Configuration:

```bash
# Unmount .snapshots temporarily so snapper can initialize its config
sudo umount /.snapshots
sudo rm -rf /.snapshots

# Create snapper root config
sudo snapper -c root create-config /

# Re-link your Btrfs subvolume to /.snapshots
sudo rm -rf /.snapshots
sudo mkdir /.snapshots
sudo mount -a

# Set correct permissions so only root can modify snapshots
sudo chmod 750 /.snapshots
```

---

## 4. Automatic Snapshots on Every Update (`snap-pac`)

Now, automate snapshots so that **every time you run `pacman -Syu` or install/remove a package**, a pre-update and post-update snapshot is created:

```bash
sudo pacman -S snap-pac
```

That's it! `snap-pac` hooks into pacman automatically. Whenever pacman modifies software on your drive, you will see:

```text
:: Running pre-transaction hooks...
(1/1) Performing snapper pre snapshots for the following configurations...
==> root: 14
...
:: Running post-transaction hooks...
(1/1) Performing snapper post snapshots for the following configurations...
==> root: 15
```

---

## 5. Boot Directly into Snapshots from GRUB (`grub-btrfs`)

The ultimate recovery tool is being able to boot directly into a snapshot from your BIOS/GRUB screen:

```bash
# 1. Install grub-btrfs
sudo pacman -S inotify-tools
paru -S grub-btrfs

# 2. Enable the grub-btrfs daemon to auto-update GRUB when new snapshots occur
sudo systemctl enable --now grub-btrfsd
```

Now, when you reboot your PC, your GRUB bootloader will show a new entry:

```text
Arch Linux
Advanced options for Arch Linux
Arch Linux snapshots ->
    [2026-11-03 14:30] pre pacman: upgrade
    [2026-11-03 12:15] boot snapshot
```

---

## 6. How to Perform an Instant Rollback

If an update breaks something, you have two simple ways to roll back:

### Method A: From the Boot Menu (Emergency)
1. Turn on your computer and select **Arch Linux snapshots** in the GRUB menu.
2. Pick the snapshot taken immediately before the problematic update.
3. Your machine boots right into that working snapshot!
4. Once booted, open a terminal and make the rollback permanent:
   ```bash
   sudo snapper rollback
   sudo reboot
   ```

### Method B: From the Terminal
List all existing snapshots:

```bash
sudo snapper list
```

Identify the snapshot number you want to revert to (e.g., `#14`), and run:

```bash
sudo snapper rollback 14
sudo reboot
```

Your system is instantly restored to its exact previous state. You never have to worry about a broken update again!
