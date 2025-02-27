import Image from "next/image";
import Header from "./components/header";
import Footer from "./components/footer";
import fs from 'fs';



// export const getStaticProps = () => {
//   const posts = fs.readdirSync('posts');
//   console.log('files:', posts);
//   return {
//     props: {
//       posts: [],
//     },
//   };
// };


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
        <main className="flex-1 max-w-4xl w-full mx-auto">
          <div className="my-8">コンテンツ</div>
        </main>
      <Footer/>
    </div>
  );
}
