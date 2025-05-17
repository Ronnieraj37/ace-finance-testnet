'use client';
import React, { useEffect, useState } from 'react';
import styles from './desktop-only.module.scss';
import { ASSETS } from '@/constant/assets.constant';
import Image from 'next/image';
import { Laptop, DeviceMobile } from '@phosphor-icons/react';

function DesktopOnly({ children }: { children: React.ReactNode }) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Check screen size on mount and when window is resized
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 900);
		};

		// Initial check
		checkScreenSize();

		// Add event listener for window resize
		window.addEventListener('resize', checkScreenSize);

		// Cleanup event listener
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	if (isMobile) {
		return (
			<div className={styles.mobileWarning}>
				<div className={styles.mobileWarningContent}>
					<div className={styles.logoContainer}>
						<Image
							src={ASSETS.LOGO}
							alt='A$CE Finance'
							width={80}
							height={80}
							className={styles.logo}
						/>
						<h1 className={styles.title}>A$CE Finance</h1>
					</div>

					<div className={styles.deviceIcons}>
						<div className={styles.deviceIcon}>
							<DeviceMobile
								size={48}
								weight='light'
							/>
							<div className={styles.iconLabel}>Mobile</div>
						</div>
						<div className={styles.arrowIcon}>→</div>
						<div
							className={`${styles.deviceIcon} ${styles.activeDevice}`}>
							<Laptop
								size={64}
								weight='light'
							/>
							<div className={styles.iconLabel}>Desktop</div>
						</div>
					</div>

					<div className={styles.message}>
						<h2>Please use a larger screen</h2>
						<p>
							A$CE Finance is optimized for desktop experience.
							Please access our platform on a device with a screen
							width of at least 900px for the best experience.
						</p>
					</div>

					<div className={styles.footer}>
						© {new Date().getFullYear()} A$CE Finance. All rights
						reserved.
					</div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

export default DesktopOnly;
