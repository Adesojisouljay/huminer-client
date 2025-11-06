import "./index.css"

export const LoadingSkeleton = () => {
    return (
      <div className="single-post skeleton">
        <div className="skeleton-image" />
        <div className="skeleton-text title" />
        <div className="skeleton-text author" />
        <div className="skeleton-text content" />
        <div className="skeleton-stats">
          <div className="skeleton-stat" />
          <div className="skeleton-stat" />
          <div className="skeleton-stat" />
        </div>
      </div>
    );
  }
  