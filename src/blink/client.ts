import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'ui-polish-pro-410y0dwf',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_RsiaPuFtKtYZoVYDuQnbse5WZtpi3TKY',
  authRequired: false,
  auth: { mode: 'managed' },
})
