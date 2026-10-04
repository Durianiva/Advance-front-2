// # category-filter
function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="class-category-container">
      <ul className="class-category">
        {categories.map((cat) => (
          <li
            key={cat.key}
            className={activeCategory === cat.key ? "active" : ""}
            onClick={() => onSelectCategory(cat.key)}
          >
            {cat.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryFilter;
