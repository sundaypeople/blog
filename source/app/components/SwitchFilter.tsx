import Link from 'next/link';

const SwitchFilter = () => {
  return (
    <div className="flex space-x-4 mb-4 md:mb-0">
    <button
      onClick={() => setViewMode('articles')}
      className={`px-4 py-2 border ${
        viewMode === 'articles'
          ? 'bg-blue-600 text-white'
          : 'bg-white text-blue-600'
      }`}
    >
      記事一覧
    </button>
    <button
      onClick={() => setViewMode('groups')}
      className={`px-4 py-2 border ${
        viewMode === 'groups'
          ? 'bg-blue-600 text-white'
          : 'bg-white text-blue-600'
      }`}
    >
      グループ一覧
    </button>
  </div>
  );
};

export default SwitchFilter;