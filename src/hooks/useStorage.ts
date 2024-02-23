export const useStorage = () => {
  const getItem = (name: string) => {
    const res = localStorage.getItem(name) as string
    return res
  }
  const setItem = (name: string, value: string) => {
    localStorage.setItem(name, value)
  }
  const clear = () => {
    localStorage.clear()
  }
  return {
    getItem,
    setItem,
    clear
  }
}
