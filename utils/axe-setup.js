// Accessibility feedback setup for development environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    import('react').then((React) => {
      import('react-dom').then((ReactDOM) => {
        // Initialize axe-core for accessibility feedback
        axe.default(React, ReactDOM, 1000)
        console.log('🔍 Accessibility monitoring enabled - check console for violations')
      })
    })
  }).catch((error) => {
    console.warn('Could not load accessibility monitoring:', error)
  })
}