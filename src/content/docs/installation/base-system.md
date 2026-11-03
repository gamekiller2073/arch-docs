---
title: "Step 3: Base System Installation"
description: Optimize download mirrors, install the Linux kernel and core base packages with pacstrap, and generate the filesystem table (fstab).
---

Now comes the pivotal moment: downloading and bootstrapping the real Arch Linux operating system into your newly mounted `/mnt` filesystem.

---

## 1. Optimize Your Download Mirrors (Optional but Recommended)

Arch Linux mirrors are servers hosted across the world that store package files. By default, the live medium includes an extensive list, but ranking them by speed ensures swift downloads:

```bash
# Example: Sort the 10 fastest HTTPS mirrors in your region (e.g. Germany, US, UK, Netherlands)
reflector --latest 10 --protocol https --sort rate --save /etc/pacman.d/mirrorlist
```

> [!TIP]
> If you don't know your country code or prefer automatic detection, you can run:
> ```bash
> reflector --latest 10 --sort rate --save /etc/pacman.d/mirrorlist
> ```

---

## 2. Install the Base Packages with `pacstrap`

The `pacstrap` command installs packages onto the target disk at `/mnt`. 

Run the following command:

```bash
pacstrap -K /mnt base base-devel linux linux-firmware networkmanager nano neovim sudo
```

### What Each Package Does (And Why It Matters):

| Package | Purpose & Importance |
| :--- | :--- |
| **`base`** | The fundamental skeleton: GNU coreutils, `bash`, `pacman`, system libraries, and core filesystem directories. |
| **`base-devel`** | Compilers, `gcc`, `make`, `patch`, and build utilities. Crucial later for compiling software from the AUR. |
| **`linux`** | The actual Linux kernel—the engine that manages your CPU, RAM, and hardware. *(Alternative: `linux-lts` for long-term stability or `linux-zen` for desktop responsiveness).* |
| **`linux-firmware`** | Binary firmware blobs for Wi-Fi adapters, Bluetooth radios, GPUs, and motherboards. **Never omit this**, or your hardware will not function. |
| **`networkmanager`** | The network daemon and CLI tools (`nmcli`, `nmtui`). **The #1 beginner mistake is forgetting this package**, leaving you unable to connect to the internet after rebooting! |
| **`nano` / `neovim`** | Terminal text editors so you can edit configuration files inside your new install. |
| **`sudo`** | Allows your regular user to run administrative commands safely. |

> [!NOTE]
> The `-K` flag initializes an empty pacman keyring on the target and copies host keys to it, ensuring verified signature security.

This download takes 1–5 minutes depending on your internet speed.

---

## 3. Generate the Filesystem Table (`fstab`)

The `/etc/fstab` file tells your Linux system which disk partitions to mount automatically at boot time.

Generate this file using `genfstab`:

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

The `-U` flag specifies **UUIDs** (Universally Unique Identifiers) instead of static device names (like `/dev/nvme0n1p3`). UUIDs ensure that even if you plug in an external drive or change drive ports later, your partitions will always be identified correctly.

### Verify the `fstab` File

Inspect the contents of the generated file:

```bash
cat /mnt/etc/fstab
```

You should see entries corresponding to your root partition (`/`), boot partition (`/boot`), and swap partition:

```text
# /dev/nvme0n1p3
UUID=a1b2c3d4-...    /          ext4      rw,relatime    0 1

# /dev/nvme0n1p1
UUID=1234-ABCD       /boot      vfat      rw,relatime... 0 2

# /dev/nvme0n1p2
UUID=e5f6g7h8-...    none       swap      defaults       0 0
```

If the file looks empty or malformed, do not proceed—re-run the `genfstab` command.

---

With your base system in place and filesystem mounts recorded, head to [Step 4: System Configuration](/installation/system-configuration/)!
