/**
 * Device Detection Utility
 * Detects mobile devices and provides responsive utilities
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  userAgent: string;
}

/**
 * Detect if the user is on a mobile device
 */
export function isMobile(userAgent: string): boolean {
  return /mobile|android|iphone|ipod|blackberry|windows phone/i.test(userAgent);
}

/**
 * Detect if the user is on a tablet
 */
export function isTablet(userAgent: string): boolean {
  return /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
}

/**
 * Detect if the user is on iOS
 */
export function isIOS(userAgent: string): boolean {
  return /iphone|ipad|ipod/i.test(userAgent);
}

/**
 * Detect if the user is on Android
 */
export function isAndroid(userAgent: string): boolean {
  return /android/i.test(userAgent);
}

/**
 * Get comprehensive device information
 */
export function getDeviceInfo(userAgent: string): DeviceInfo {
  const mobile = isMobile(userAgent);
  const tablet = isTablet(userAgent);
  
  return {
    isMobile: mobile && !tablet,
    isTablet: tablet,
    isDesktop: !mobile && !tablet,
    isIOS: isIOS(userAgent),
    isAndroid: isAndroid(userAgent),
    userAgent,
  };
}

/**
 * Determine if the user should be redirected to mobile site
 */
export function shouldRedirectToMobile(pathname: string, userAgent: string): boolean {
  // Don't redirect if already on mobile route
  if (pathname.startsWith('/m/')) {
    return false;
  }

  // Don't redirect API routes
  if (pathname.startsWith('/api/')) {
    return false;
  }

  // Don't redirect admin routes
  if (pathname.startsWith('/admin/')) {
    return false;
  }

  // Redirect if on mobile device
  return isMobile(userAgent) && !isTablet(userAgent);
}

/**
 * Get mobile route for a given pathname
 */
export function getMobileRoute(pathname: string): string {
  // Already a mobile route
  if (pathname.startsWith('/m/')) {
    return pathname;
  }

  // Add /m prefix
  return `/m${pathname}`;
}

/**
 * Get desktop route for a given pathname
 */
export function getDesktopRoute(pathname: string): string {
  // Already a desktop route
  if (!pathname.startsWith('/m/')) {
    return pathname;
  }

  // Remove /m prefix
  return pathname.replace(/^\/m/, '') || '/';
}

/**
 * Get viewport size constants for responsive design
 */
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

/**
 * Check if viewport matches breakpoint
 */
export function matchesBreakpoint(width: number, breakpoint: keyof typeof BREAKPOINTS): boolean {
  return width >= BREAKPOINTS[breakpoint];
}
