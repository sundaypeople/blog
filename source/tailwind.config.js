/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],  
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            fontSize: '1rem', // フォントサイズを変更
            lineHeight: '1', // 行間を変更
            // 他にも調整したいスタイルをここで指定
          },
        },
      },
    },
  },
  plugins: [
        require('@tailwindcss/typography'),
  ],
}

