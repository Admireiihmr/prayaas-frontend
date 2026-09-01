import { useEffect, useState } from 'react'

export function useResponsive() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  )

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return {
    width,
    isMobile: width <= 480,
    isTablet: width <= 768,
    isLaptop: width <= 1024,
    isDesktop: width > 1024,
  }
}
