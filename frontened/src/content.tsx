import './index.css'

import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import React from 'react'  

const root = document.createElement('div')
root.id = '__LinkFixer_content_page'
document.body.append(root)

createRoot(root).render(
  <StrictMode>
    <button>Dummy Button</button>  
  </StrictMode>
)
