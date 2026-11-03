// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://gamekiller2073.github.io',
	base: '/arch-docs',
	integrations: [
		starlight({
			title: 'ArchDocs',
			logo: {
				src: './src/assets/arch-logo.svg',
			},
			description: 'A beginner-friendly, detailed guide to installing and mastering Arch Linux without archinstall.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/archlinux' },
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Why Arch Linux?', slug: 'introduction/why-arch' },
						{ label: 'What You Can Do With Arch', slug: 'introduction/what-you-can-do' },
						{ label: 'Prerequisites & Preparation', slug: 'introduction/prerequisites' },
					],
				},
				{
					label: 'Manual Installation Guide',
					items: [
						{ label: '1. Boot & Live Environment', slug: 'installation/live-environment' },
						{ label: '2. Partitioning & Formatting', slug: 'installation/partitioning' },
						{ label: '3. Base System Installation', slug: 'installation/base-system' },
						{ label: '4. System Configuration', slug: 'installation/system-configuration' },
						{ label: '5. Bootloader & Microcode', slug: 'installation/bootloader' },
						{ label: '6. Reboot & First Boot', slug: 'installation/first-boot' },
					],
				},
				{
					label: 'Post-Installation Essentials',
					items: [
						{ label: 'User Accounts & Sudo', slug: 'post-install/users-and-sudo' },
						{ label: 'Pacman & The AUR', slug: 'post-install/pacman-and-aur' },
						{ label: 'Drivers, Audio & Desktops', slug: 'post-install/desktop-and-graphics' },
					],
				},
				{
					label: 'In-Depth Guides',
					items: [
						{ label: 'Gaming on Arch Linux', slug: 'guides/gaming' },
						{ label: 'Btrfs & Instant Rollback Snapshots', slug: 'guides/btrfs-and-snapshots' },
						{ label: 'The Art of "Ricing" (Hyprland & Dotfiles)', slug: 'guides/ricing-and-customization' },
						{ label: 'Laptop Power Management', slug: 'guides/laptop-power-management' },
						{ label: 'Dual-Booting with Windows', slug: 'guides/dual-booting' },
						{ label: 'Full Disk Encryption (LUKS)', slug: 'guides/disk-encryption-luks' },
						{ label: 'System Maintenance Checklist', slug: 'guides/maintenance-checklist' },
					],
				},
				{
					label: 'Reference & Troubleshooting',
					items: [
						{ label: 'Pacman Command Reference', slug: 'reference/pacman-cheatsheet' },
						{ label: 'Common Issues & FAQ', slug: 'reference/faq' },
					],
				},
			],
		}),
	],
});
