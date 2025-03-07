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
            lineHeight: '1rem', // 行間を変更
            hr: {
              marginTop: "1rem",
              marginBottom: "2rem"
            },
            h1 :{
              marginTop: "5rem",
              marginBottom: "1rem"
            },
            h2 : {
              marginTop: "3rem",
              marginBottom: "1rem"
            },
            p: {
              margin: "1rem 0"
            }
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

