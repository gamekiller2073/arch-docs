---
title: "Step 5: Bootloader & Microcode"
description: Install processor microcode for stability, set up the GRUB bootloader for UEFI, and generate boot configurations.
---

A computer doesn't know how to run the Linux kernel on its own; it requires a **bootloader** to locate the kernel, load CPU microcode fixes, pass boot parameters, and initiate the OS.

Make sure you are still inside the `arch-chroot` prompt (`[root@archiso /]#`).

---

## 1. Install Processor Microcode

CPUs have hardware bugs and security vulnerabilities (such as Spectre and Meltdown) that are patched dynamically during early boot using **microcode**.

### Check Your CPU Vendor:
```bash
grep "model name" /proc/cpuinfo | head -n 1
```

### Install the Matching Microcode Package:

- **For Intel Processors**:
  ```bash
  pacman -S intel-ucode
  ```

- **For AMD Processors**:
  ```bash
  pacman -S amd-ucode
  ```

> [!NOTE]
> When the bootloader configuration is generated later in this step, it will automatically detect the installed microcode and prepend it to the initramfs boot chain.

---

## 2. Choosing a Bootloader: Why GRUB?

While tools like `systemd-boot` and `Limine` exist, **GRUB (Grand Unified Bootloader)** remains the gold standard for beginners:
- Universally supported by all UEFI hardware.
- Automatically generates boot entries for all installed kernels.
- Supports dual-boot detection (via `os-prober`).
- Provides a visible countdown menu with fallback rescue entries.

---

## 3. Install GRUB and `efibootmgr`

Install GRUB along with `efibootmgr`, which is the user-space utility used to register boot entries in your motherboard's UEFI NVRAM:

```bash
pacman -S grub efibootmgr
```

*(Optional: If you are dual-booting alongside an existing Windows installation on the same machine, also install `os-prober` and `dosfstools`: `pacman -S os-prober dosfstools`).*

---

## 4. Install the GRUB EFI Binaries

Now, install the GRUB binaries directly into your mounted EFI system partition (`/boot`):

```bash
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
```

### Explanation of Arguments:
- `--target=x86_64-efi`: Instructs GRUB to build 64-bit UEFI binaries.
- `--efi-directory=/boot`: Tells GRUB where your FAT32 EFI System Partition is mounted.
- `--bootloader-id=GRUB`: Creates an EFI directory named `GRUB` in `/boot/EFI/` and registers a boot entry named "GRUB" inside your motherboard's NVRAM.

You should see:
```text
Installation finished. No error reported.
```

---

## 5. Generate the GRUB Configuration File

With the EFI binaries installed, generate GRUB's configuration file (`grub.cfg`):

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

You should see output similar to:
```text
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/intel-ucode.img /boot/initramfs-linux.img
Found fallback initrd image(s) in /boot: initramfs-linux-fallback.img
done
```

> [!TIP]
> Notice how GRUB automatically picked up your CPU microcode (`intel-ucode.img` or `amd-ucode.img`) and paired it with your `linux` kernel image!

---

With your bootloader successfully installed, your disk is now fully bootable. Proceed to [Step 6: Reboot & First Boot](/installation/first-boot/)!
