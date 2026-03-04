export function TVPageSkeleton() {
  return (
    <div>
      {/* Featured video skeleton */}
      <div>
        <div></div>
        <div>
          <div></div>
          <div>
            <div></div>
            <div></div>
          </div>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Related videos skeleton */}
      <div>
        <div></div>
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div></div>
              <div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Episodes skeleton */}
      <div>
        <div></div>
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div></div>
              <div>
                <div></div>
                <div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
