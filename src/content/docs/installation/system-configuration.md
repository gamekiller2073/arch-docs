---
title: "Step 4: System Configuration"
description: Chroot into your new Arch Linux environment, set your timezone, generate locales, configure networking, and set the root password.
---

Now that the core system files exist on your drive, you need to configure your operating system. To do this, you will enter a **chroot** environment.

---

## 1. Enter the Chroot Environment

A "chroot" (change root) isolates your current terminal session so that `/mnt` becomes the root directory (`/`). Any commands you run will execute directly inside your new installation rather than the USB installer.

Run:

```bash
arch-chroot /mnt
```

Your terminal prompt will change:

```text
[root@archiso /]#
```

You are now working *inside* your new Arch Linux installation!

---

## 2. Set Your Timezone

Create a symbolic link pointing to your geographical timezone:

```bash
# Syntax: ln -sf /usr/share/zoneinfo/Region/City /etc/localtime

# Examples:
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime
# or for Europe:
# ln -sf /usr/share/zoneinfo/Europe/Amsterdam /etc/localtime
# or for London:
# ln -sf /usr/share/zoneinfo/Europe/London /etc/localtime
```

> [!TIP]
> You can inspect available zones by running `ls /usr/share/zoneinfo/`.

Synchronize the hardware clock:

```bash
hwclock --systohc
```

This generates `/etc/adjtime` and keeps your hardware clock in sync with UTC.

---

## 3. Localization & Language

Locales define how your system formats dates, numbers, currency, and character sets.

### A. Uncomment Your Locale
Open `/etc/locale.gen` with `nano`:

```bash
nano /etc/locale.gen
```

Scroll through the file and uncomment (remove the leading `#`) from your preferred locales. At minimum, uncomment:

```text
en_US.UTF-8 UTF-8
```

*(You can also uncomment your local language, e.g., `de_DE.UTF-8 UTF-8`, `nl_NL.UTF-8 UTF-8`, etc.)*

Save and exit in nano: press <kbd>Ctrl+O</kbd>, then <kbd>Enter</kbd> to save, followed by <kbd>Ctrl+X</kbd> to exit.

### B. Generate the Locales
Compile the locales you just selected:

```bash
locale-gen
```

### C. Set the System Locale
Create `/etc/locale.conf` and set the primary language variable:

```bash
echo "LANG=en_US.UTF-8" > /etc/locale.conf
```

---

## 4. Network Configuration

### A. Set Your Hostname
Your hostname is the name your computer uses to identify itself on local networks:

```bash
# Choose any name you like, for example:
echo "arch-machine" > /etc/hostname
```

### B. Configure `/etc/hosts`
Open or create `/etc/hosts`:

```bash
nano /etc/hosts
```

Add the following lines (replacing `arch-machine` with the hostname you chose above):

```text
127.0.0.1   localhost
::1         localhost
127.0.1.1   arch-machine.localdomain arch-machine
```

Save and exit (<kbd>Ctrl+O</kbd>, <kbd>Enter</kbd>, <kbd>Ctrl+X</kbd>).

### C. Enable NetworkManager Service
You installed `networkmanager` in Step 3, but systemd services are disabled by default. You **must enable it now** so that your network interfaces automatically start up on reboot:

```bash
systemctl enable NetworkManager
```

> [!IMPORTANT]
> If you omit `systemctl enable NetworkManager`, you will boot into a system with no network connection, unable to install packages or connect to Wi-Fi without manually booting the ISO again.

---

## 5. Set the Root Password

Set a strong password for the root administrative user:

```bash
passwd
```

Type your chosen password twice (keystrokes will remain invisible for security).

---

Your system configuration is complete! Next, let's configure how the motherboard boots your kernel in [Step 5: Bootloader & Microcode](/arch-docs/installation/bootloader/).
