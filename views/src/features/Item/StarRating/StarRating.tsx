export const StarRating = () => {
  const rating = 4.4;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const starFill = Math.min(Math.max(rating - (i - 1), 0), 1) * 100;
    stars.push(
      <span
        key={i}
        className={`star ${starFill === 100 ? 'full' : 'partial'}`}
        style={{ '--star-fill': `${starFill}%` } as React.CSSProperties}
      >
        ★
      </span>
    );
  }

  return <div className="star-rating">{stars}</div>;
};