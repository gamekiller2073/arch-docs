---
title: "Step 2: Partitioning & Formatting"
description: Learn how block devices work, partition your drive using the friendly cfdisk tool, format filesystems, and mount your target directories.
---

Partitioning is where many beginners feel intimidated, but with the right conceptual model and the interactive `cfdisk` tool, it is straightforward and safe.

---

## 1. Identify Your Storage Drive

Check your system's disks using `lsblk`:

```bash
lsblk
```

You will see output similar to this:

```text
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0         7:0    0 800.5M  1 loop /run/archiso/airootfs
sda           8:0    1  14.9G  0 disk                 <-- USB Installer
nvme0n1     259:0    0 512.1G  0 disk                 <-- Target NVMe SSD
```

### Drive Naming Conventions:
- **NVMe SSDs**: Named `/dev/nvme0n1`. Its partitions are numbered `/dev/nvme0n1p1`, `/dev/nvme0n1p2`, etc.
- **SATA SSDs & HDDs**: Named `/dev/sda` or `/dev/sdb`. Its partitions are numbered `/dev/sda1`, `/dev/sda2`, etc.

> [!CAUTION]
> Double-check the disk size to make sure you target your **intended drive** and NOT your USB installer flash drive! In this guide, we assume the target disk is `/dev/nvme0n1`. If your disk is `/dev/sda`, adapt the command names accordingly.

---

## 2. The Recommended Partition Layout (UEFI/GPT)

For a modern UEFI system, we recommend a clean 3-partition layout:

| Partition | Suggested Size | Filesystem | Type | Mount Point | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Partition 1** | `1 GiB` (1024M) | FAT32 | EFI System | `/mnt/boot` | Holds the bootloader and Linux kernels. |
| **Partition 2** | `4 GiB` to `8 GiB` | Swap | Linux swap | None (swapon) | Virtual memory & hibernation space. |
| **Partition 3** | Remainder | ext4 | Linux filesystem | `/mnt` | Root directory (`/`) holding all files and apps. |

---

## 3. Interactive Partitioning with `cfdisk`

`cfdisk` is a user-friendly, menu-driven partition editor. Launch it on your target drive:

```bash
# Replace /dev/nvme0n1 with your disk identifier
cfdisk /dev/nvme0n1
```

### Walkthrough:
1. **Select Label Type**: If prompted, choose **`gpt`** and press <kbd>Enter</kbd>.
2. **Create EFI System Partition**:
   - Highlight **Free space** → select **`[ New ]`** → press <kbd>Enter</kbd>.
   - Partition size: Type `1G` and press <kbd>Enter</kbd>.
   - Highlight the newly created partition → select **`[ Type ]`** → choose **`EFI System`** (often option #1).
3. **Create Swap Partition**:
   - Highlight remaining **Free space** → select **`[ New ]`**.
   - Partition size: Type `4G` (or `8G`) and press <kbd>Enter</kbd>.
   - Select **`[ Type ]`** → choose **`Linux swap`**.
4. **Create Root Partition**:
   - Highlight remaining **Free space** → select **`[ New ]`**.
   - Partition size: Accept the default (press <kbd>Enter</kbd> to allocate all remaining free space).
   - Select **`[ Type ]`** → choose **`Linux filesystem`** (or `Linux root (x86-64)`).
5. **Commit the Changes**:
   - Select **`[ Write ]`** from the bottom menu.
   - Type **`yes`** and press <kbd>Enter</kbd> to write the partition table to the disk.
   - Select **`[ Quit ]`** to exit `cfdisk`.

Confirm your new partition table:

```bash
lsblk /dev/nvme0n1
```

You should now see three partitions: `nvme0n1p1`, `nvme0n1p2`, and `nvme0n1p3`.

---

## 4. Format the Partitions

Creating partitions simply carves up disk boundaries; formatting builds the filesystem structures inside them.

### A. Format the EFI Partition (FAT32)
The UEFI specification mandates a FAT32 filesystem for the EFI System Partition:
```bash
mkfs.fat -F 32 /dev/nvme0n1p1
```

### B. Format and Enable Swap
Initialize the swap space and turn it on:
```bash
mkswap /dev/nvme0n1p2
swapon /dev/nvme0n1p2
```

### C. Format the Root Partition (ext4)
Initialize the primary root partition with the robust `ext4` filesystem:
```bash
mkfs.ext4 /dev/nvme0n1p3
```

---

## 5. Mount the Filesystems

To install Arch, we must mount our newly formatted partitions into the live system under `/mnt`.

```bash
# 1. Mount the root partition to /mnt
mount /dev/nvme0n1p3 /mnt

# 2. Mount the EFI partition to /mnt/boot
mount --mkdir /dev/nvme0n1p1 /mnt/boot
```

> [!NOTE]
> The `--mkdir` flag creates the `/mnt/boot` directory automatically if it does not yet exist.

### Verify the Mounts

Run `lsblk` to verify that everything is mounted properly:

```bash
lsblk
```

Expected mountpoints:
- `nvme0n1p1` → `/mnt/boot`
- `nvme0n1p2` → `[SWAP]`
- `nvme0n1p3` → `/mnt`

With your partitions ready and mounted, proceed to [Step 3: Base System Installation](/installation/base-system/)!
