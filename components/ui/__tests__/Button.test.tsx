/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
// require the component at runtime to avoid Jest parsing TSX files with unexpected token in some environments
const Button = require('../Button').default

test('renders button with children', () => {
  // avoid JSX in test file to bypass transform edge-cases
  render(React.createElement(Button, null, 'Click me'))
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
