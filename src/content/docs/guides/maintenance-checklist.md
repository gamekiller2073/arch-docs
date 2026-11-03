---
title: System Maintenance & Longevity Checklist
description: The proactive habits and commands that keep an Arch Linux system running fast, clean, and stable for years without reinstalling.
---

There is a myth that rolling-release distributions slowly degrade over time. In reality, with simple proactive maintenance habits, an Arch Linux installation can run uninterrupted for a decade.

Here is the recommended maintenance schedule.

---

## 1. Before You Update: The Golden Rule

> [!IMPORTANT]
> **Check the Arch Linux Homepage First!**
> Visit [archlinux.org](https://archlinux.org) or subscribe to its RSS feed before doing a major system upgrade. 
> 
> Once or twice a year, an upstream packaging change requires manual user intervention (e.g., merging a directory or adjusting an environment variable). The Arch team **always publishes exact copy-paste terminal instructions on the homepage** beforehand.

---

## 2. Performing Upgrades Safely

### Always Update the Entire System at Once
```bash
sudo pacman -Syu
```

### 🚫 The "Partial Upgrade" Danger:
**Never run `pacman -Sy` followed by `pacman -S package`** without upgrading the whole system (`-Syu`). 

If you install a new package that depends on a newer version of `glibc` or `openssl` while the rest of your system remains on older libraries, your applications or system binaries can crash.

---

## 3. Automate Package Cache Cleanup

By default, pacman preserves every downloaded package archive (`.pkg.tar.zst`) in `/var/cache/pacman/pkg/` so you can downgrade packages if necessary. Over several months, this directory can grow to 30+ GB!

Instead of clearing the cache completely, use **`paccache`** to automatically keep the 2–3 most recent versions and discard older ones.

### Install `pacman-contrib`:
```bash
sudo pacman -S pacman-contrib
```

### Enable the Automated Weekly Timer:
```bash
sudo systemctl enable --now paccache.timer
```

Now, systemd will automatically purge obsolete package archives once a week without any manual intervention!

---

## 4. Remove Orphaned Packages

When you install a piece of software, pacman installs its required dependencies. If you later remove that software without `-s`, the dependencies become "orphaned" packages taking up space.

### Check for Orphaned Packages:
```bash
pacman -Qtdq
```

### Remove All Orphans Cleanly:
```bash
sudo pacman -Rns $(pacman -Qtdq)
```

*(If no orphaned packages exist, pacman will simply report an error that no targets were specified).*

---

## 5. Handle `.pacnew` Configuration Files

When you update a package whose configuration file you have previously edited, pacman does not overwrite your file. Instead, it preserves your version and writes the upstream default with a `.pacnew` extension (e.g., `/etc/pacman.conf.pacnew`).

Ignoring these files can cause you to miss new features or syntax deprecations.

### Inspect and Merge with `pacdiff`:
```bash
# Uses nano (or set DIFFPROG=meld for a visual GUI comparison)
sudo DIFFPROG=nano pacdiff
```

For each file found, `pacdiff` lets you:
- **(V)iew** the differences side by side.
- **(M)erge** upstream changes into your config.
- **(O)verwrite** your config with the new default.
- **(R)emove** the `.pacnew` file if you prefer to keep your custom settings.

---

## 6. System Health Checks

Run these two commands once a month to inspect the underlying health of your system:

### A. Check for Failed Systemd Services:
```bash
systemctl --failed
```
If a service is listed in red, inspect its logs:
```bash
systemctl status <service-name>
```

### B. View High-Priority Kernel & System Errors:
```bash
journalctl -p 3 -xb
```
This filters your boot logs to show only errors (`priority 3` or higher), helping you spot failing hardware or misconfigured drivers early.

---

## Quick Reference Summary

| Frequency | Task | Command |
| :--- | :--- | :--- |
| **Weekly** | Check Arch News & Upgrade | Check [archlinux.org](https://archlinux.org) → `sudo pacman -Syu` |
| **Weekly (Auto)** | Clean package cache | Managed automatically by `paccache.timer` |
| **Monthly** | Remove unused dependencies | `sudo pacman -Rns $(pacman -Qtdq)` |
| **Monthly** | Merge configuration updates | `sudo DIFFPROG=nano pacdiff` |
| **Monthly** | Check failed services | `systemctl --failed` |
