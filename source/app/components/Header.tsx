// Header.js or Header.jsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* コンテナ: 最大幅を設定し左右中央寄せ、内部余白を上下12px・左右16px付与 */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-3 px-4">
        {/* ロゴ部分：テキストロゴを大きく表示（フォントサイズXL、太字） */}
        <Link href="/" className="text-2xl font-bold text-gray-900">
          morimura-tech
        </Link>
        {/* ナビゲーションメニュー */}
        <nav className="flex space-x-6 text-lg">
          <Link href="/all" className="px-3 py-2 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors">
            記事一覧
          </Link>
          {/* <Link href="/pricing" className="px-3 py-2 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors">
            料金プラン
          </Link>
          <Link href="/contact" className="px-3 py-2 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors">
            お問い合わせ
          </Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
