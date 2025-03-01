function PostSkeleton() {
  return (
    <div className="card border-base-content/10 border">
      <div className="grid grid-rows-[3rem_5rem] p-3">
        <div className="items flex gap-3">
          <div className="skeleton bg-base-200 h-9 w-9 rounded-full"></div>
          <div className="h-full grow space-y-2">
            <p className="skeleton bg-base-200 h-3 w-20"></p>
            <p className="skeleton bg-base-200 h-3 w-20"></p>
          </div>
        </div>
        <div className="skeleton bg-base-200"></div>
      </div>
    </div>
  );
}

export default PostSkeleton;
