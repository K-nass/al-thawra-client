export default function DashboardProfileCard() {
  return (
    <div className="flex items-center p-4 mt-3">
      <img
        alt="Admin avatar"
        className="w-12 h-12 rounded-full mr-4"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgqjBozK-2CFNV5Un5GUKQHKbH-wXFh3bx3tbX2bt6GR7-tLTqtA7BYKOjOZ526ROZkbImZywzgWH8x-Ru8yIdZqbdREALhpkn9rEfVvBIvg-mssHKH7xN_pEnq3A7x1Oq1Yz6qVlxCqx6axwUnkKnnopVh8PCMN8iMSl6kfwyMu8tva9qq3ZnzHvDq6gekyLQAmuRawBf48UMRWc2Orkf-l2GX5Ywx4yD6OM1TovHK4PQybN8jHWWtJc-6Ei6MMbF7TpMY7A6TJn4"
      />
      <div>
        <p className="font-semibold text-white">admin</p>
        <div className="flex items-center text-xs text-green-400">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
          online
        </div>
      </div>
    </div>
  );
}
