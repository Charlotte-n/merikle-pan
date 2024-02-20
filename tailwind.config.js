/** @type {import('tailwindcss').Config}**/
//tailwindcss的配置
export default {
  important: true,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  plugins: [],
  corePlugins: {
    preflight: false
  },
  theme: {
    // fix tailwind line-height
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px',
      '7xl': '72px'
    },
    //进行响应式
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '920px',
      xl: '1280px'
    }
  }
}
