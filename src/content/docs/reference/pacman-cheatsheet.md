---
title: Pacman Complete Command Reference
description: The ultimate cheatsheet for pacman commands, flags, database querying, file ownership searches, and Rosetta stone comparisons with apt and dnf.
---

Pacman's short flags can look cryptic at first. This comprehensive reference breaks down every common operation, file lookup, and comparison with Ubuntu (`apt`) and Fedora (`dnf`).

---

## 1. Primary Operating Modes

Pacman commands always begin with a capital letter indicating the primary mode of operation:
- **`-S` (Sync)**: Works with remote repositories (install, update, search).
- **`-R` (Remove)**: Removes packages and their files.
- **`-Q` (Query)**: Inspects the local database of installed software.
- **`-F` (Files)**: Searches the remote database for specific files.
- **`-U` (Upgrade/Local)**: Installs packages from local archive files.

---

## 2. Sync (`-S`) Commands

| Command | Action |
| :--- | :--- |
| `sudo pacman -Syu` | Refresh repo databases and upgrade all out-of-date packages. |
| `sudo pacman -Syyu` | Force refresh repo databases (even if up-to-date) and upgrade. |
| `sudo pacman -S <pkg>` | Install one or more packages from remote repositories. |
| `sudo pacman -Sw <pkg>` | Download a package into cache without installing it. |
| `pacman -Ss <keyword>` | Search remote package names and descriptions. |
| `pacman -Si <pkg>` | View detailed repository info (dependencies, packager, size). |

---

## 3. Removal (`-R`) Commands

| Command | Action |
| :--- | :--- |
| `sudo pacman -R <pkg>` | Remove the package (leaves dependencies and configs). |
| `sudo pacman -Rs <pkg>` | Remove the package and any dependencies not used elsewhere. |
| **`sudo pacman -Rns <pkg>`** | **(Recommended)** Clean removal: removes package, unused dependencies, and configuration backups. |
| `sudo pacman -Rdd <pkg>` | Force removal of a package even if other packages depend on it (use with extreme caution). |

---

## 4. Query (`-Q`) Local Database

| Command | Action |
| :--- | :--- |
| `pacman -Q` | List every installed package on your system. |
| `pacman -Qe` | List packages **explicitly installed** by you (excludes dependencies). |
| `pacman -Qd` | List packages installed as dependencies. |
| `pacman -Qm` | List foreign packages (installed from the **AUR** or manually). |
| `pacman -Qn` | List native packages (installed from official repositories). |
| `pacman -Qtd` | List orphaned packages (dependencies no longer needed). |
| `pacman -Qi <pkg>` | View local package information and install date. |
| `pacman -Ql <pkg>` | List every file installed on disk by a package. |
| `pacman -Qo /path/to/file` | **Who owns this file?** Tells you which package installed a specific file or binary. |

---

## 5. Finding Packages by File Name (`-F`)

Have you ever tried to run a command like `dig` or `pstree` and received `command not found`? You can find which uninstalled package provides that file:

```bash
# 1. Update the files database
sudo pacman -Fy

# 2. Search for the command
pacman -F dig
```

Output:
```text
extra/bind 9.20.2-1
    usr/bin/dig
```

Now you know to run `sudo pacman -S bind`!

---

## 6. Rosetta Stone: Pacman vs. APT vs. DNF

For users migrating from Ubuntu, Debian, or Fedora:

| Action | Arch Linux (`pacman`) | Ubuntu / Debian (`apt`) | Fedora (`dnf`) |
| :--- | :--- | :--- | :--- |
| **Update repo index** | `pacman -Sy` | `apt update` | `dnf check-update` |
| **Full system upgrade** | `pacman -Syu` | `apt update && apt upgrade` | `dnf upgrade` |
| **Install package** | `pacman -S <pkg>` | `apt install <pkg>` | `dnf install <pkg>` |
| **Clean uninstall** | `pacman -Rns <pkg>` | `apt purge --autoremove <pkg>` | `dnf remove <pkg>` |
| **Search packages** | `pacman -Ss <word>` | `apt search <word>` | `dnf search <word>` |
| **Show package info** | `pacman -Si <pkg>` | `apt show <pkg>` | `dnf info <pkg>` |
| **Which package owns file?** | `pacman -Qo <file>` | `dpkg -S <file>` | `dnf provides <file>` |
| **Clear package cache** | `pacman -Sc` | `apt clean` | `dnf clean all` |
| **Remove orphaned packages**| `pacman -Rns $(pacman -Qtdq)` | `apt autoremove` | `dnf autoremove` |
