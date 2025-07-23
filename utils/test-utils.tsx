import { render, RenderOptions } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ReactElement } from 'react'
import 'jest-axe/extend-expect'

// Custom render function for accessibility testing
export const renderWithA11y = (ui: ReactElement, options?: RenderOptions) => {
  return render(ui, options)
}

// Accessibility test helper function
export const testA11y = async (container: HTMLElement) => {
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// Export everything from @testing-library/react
export * from '@testing-library/react'