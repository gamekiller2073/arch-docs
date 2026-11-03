---
title: "User Accounts & Sudo Privileges"
description: Create a dedicated daily-driver user account, configure sudo privileges safely with visudo, and protect your root account.
---

In Linux, the `root` account possesses unrestricted power. Running daily applications, web browsers, or build scripts as root is a major security hazard—a single typo or malicious script could wipe your disk.

In this guide, we will create your regular user account and grant it administrative access via `sudo`.

---

## 1. Create a Non-Root User

Run the following command while logged in as `root`:

```bash
# Syntax: useradd -m -G wheel -s /bin/bash <username>
useradd -m -G wheel -s /bin/bash archuser
```

*(Replace `archuser` with your preferred username).*

### Breakdown of the Flags:
- **`-m`**: Creates the user's home directory (`/home/archuser`).
- **`-G wheel`**: Adds the user to the supplementary group `wheel`. In Arch Linux, members of the `wheel` group can be permitted to execute administrative commands using `sudo`.
- **`-s /bin/bash`**: Sets GNU Bash as the user's default login shell.

---

## 2. Set the User's Password

Set a secure password for your new user account:

```bash
passwd archuser
```

Type the password twice when prompted.

---

## 3. Configure `sudo` with `visudo`

To allow members of the `wheel` group to use `sudo`, we must edit the `/etc/sudoers` configuration file.

> [!CAUTION]
> **NEVER edit `/etc/sudoers` directly with a normal text editor!**
> Always use `visudo`. It performs syntax checking before saving. If you save a syntax error in `/etc/sudoers`, you will permanently break `sudo` privileges for all users on your machine.

Launch `visudo` with `nano`:

```bash
EDITOR=nano visudo
```

Scroll down until you locate this section:

```text
## Uncomment to allow members of group wheel to execute any command
# %wheel ALL=(ALL:ALL) ALL
```

Remove the `#` symbol in front of `%wheel ALL=(ALL:ALL) ALL`:

```text
%wheel ALL=(ALL:ALL) ALL
```

Save and exit:
- Press <kbd>Ctrl+O</kbd>, then press <kbd>Enter</kbd> to save.
- Press <kbd>Ctrl+X</kbd> to exit.

---

## 4. Test the New User Account

Switch to your newly created user account:

```bash
su - archuser
```

Your prompt will change from `#` (root) to `$` (standard user):

```text
[archuser@arch-machine ~]$
```

Test `sudo` by executing an administrative command:

```bash
sudo whoami
```

When prompted for your password, enter your **user's password** (not the root password).

If the command prints:

```text
root
```

Success! Your user account is properly configured with sudo privileges. You can now log out of root and log in as your regular user for all future tasks.
