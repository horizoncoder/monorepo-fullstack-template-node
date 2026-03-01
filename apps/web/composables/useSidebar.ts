export function useSidebar() {
  const collapsed = useState('sidebar-collapsed', () => false)

  if (import.meta.client) {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      collapsed.value = saved === 'true'
    }
  }

  function toggle() {
    collapsed.value = !collapsed.value
    if (import.meta.client) {
      localStorage.setItem('sidebar-collapsed', String(collapsed.value))
    }
  }

  return { collapsed, toggle }
}
