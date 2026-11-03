---
title: "Step 6: Reboot & First Boot"
description: Cleanly unmount filesystems, reboot out of the live environment, and log into your newly installed Arch Linux operating system.
---

Congratulations! You have partitioned your disks, installed the Linux kernel, configured your system, and installed a bootloader—all with your own hands.

Now it's time to test your build.

---

## 1. Exit the Chroot Environment

Leave the chroot session by typing:

```bash
exit
```

Your prompt will revert to the live ISO environment:

```text
root@archiso ~ #
```

---

## 2. Unmount Partitions Cleanly

Before rebooting, it is critical to unmount all filesystems. This forces any pending write caches in memory to commit to disk, preventing filesystem corruption:

```bash
umount -R /mnt
```

> [!TIP]
> If `umount` complains that a target is busy, ensure you are not currently inside a directory located under `/mnt` (`pwd` should say `/root`).

---

## 3. Reboot the Computer

Restart the system:

```bash
reboot
```

**Immediately remove your USB flash drive** as your computer restarts, so it does not boot back into the installer medium.

---

## 4. The First Boot Experience

Once your motherboard POSTs, you should be greeted by the **GRUB Boot Menu**:

```text
                               GNU GRUB version 2.12
 *Arch Linux
  Advanced options for Arch Linux
```

Press <kbd>Enter</kbd> (or wait 5 seconds). The kernel will initialize, systemd services will start, and you will see the login prompt:

```text
Arch Linux 6.x.x-arch1-1 (tty1)

arch-machine login:
```

### Log In:
1. At `login:`, type **`root`** and press <kbd>Enter</kbd>.
2. Enter the root password you created in Step 4.

You are now in your live, installed Arch Linux system!

---

## 5. Verify Your Internet Connection

### If you are on Wired Ethernet:
NetworkManager automatically acquires an IP address:

```bash
ping -c 3 archlinux.org
```

### If you are on Wireless Wi-Fi:
Because you installed and enabled `networkmanager`, use the friendly terminal graphical interface `nmtui`:

```bash
nmtui
```

1. Select **Activate a connection**.
2. Select your Wi-Fi network and press <kbd>Enter</kbd>.
3. Enter your Wi-Fi password.
4. Select **Back** → **Quit**.

Test your connection again:

```bash
ping -c 3 archlinux.org
```

---

## What's Next?

Right now, your installation is a minimal text-only system without regular user accounts or a graphical desktop.

Head over to the **Post-Installation** guides to set up:
1. **[User Accounts & Sudo](/arch-docs/post-install/users-and-sudo/)** *(Never run your daily tasks as root!)*
2. **[Pacman & The AUR](/arch-docs/post-install/pacman-and-aur/)** *(Supercharge your software repository access)*
3. **[Drivers, Audio & Desktops](/arch-docs/post-install/desktop-and-graphics/)** *(Install KDE, GNOME, or Hyprland, GPU drivers, and PipeWire sound)*
