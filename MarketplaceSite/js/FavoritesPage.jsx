// ============================================================
// FavoritesPage — grid identical to home, with "remove" button
// ============================================================

function FavoritesPage({ listings, favorites, navigate, onToggleFavorite, onViewListing }) {
  const favListings = listings.filter(l => favorites.has(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anunțuri favorite</h1>
          <p className="text-sm text-gray-500 mt-1">
            {favListings.length} {favListings.length === 1 ? "anunț salvat" : "anunțuri salvate"}
          </p>
        </div>
        {favListings.length > 0 && (
          <button
            onClick={() => favListings.forEach(l => onToggleFavorite(l.id))}
            className="text-sm text-red-500 hover:text-red-600 font-semibold transition-colors"
          >
            Șterge toate
          </button>
        )}
      </div>

      {/* Empty state */}
      {favListings.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconsSVG name="heart" size={28} className="text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Niciun anunț salvat</h3>
          <p className="text-sm text-gray-500 mb-6">Apasă pe inimă pe orice anunț pentru a-l salva.</p>
          <button
            onClick={() => navigate("home")}
            className="bg-green-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
          >
            Descoperă anunțuri
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onView={onViewListing}
              onToggleFavorite={onToggleFavorite}
              isFavorite={true}
              showRemove={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

window.FavoritesPage = FavoritesPage;
