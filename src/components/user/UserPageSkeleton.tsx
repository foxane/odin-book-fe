function UserPageSkeleton() {
  return (
    <div className="space-y-3">
      {/* Background */}
      <div className="skeleton bg-base-200 aspect-video" />

      {/* User info */}
      <div className="flex gap-2">
        <span className="skeleton h-15 w-15 rounded-full" />

        <div className="flex w-full flex-col justify-around">
          <span className="skeleton h-5 w-28" />
          <span className="skeleton h-5 w-44" />
        </div>

        <span className="skeleton ms-auto mt-4 h-10 w-28" />
      </div>

      {/* BIo */}
      <span className="skeleton mx-5 block h-5 w-44" />
    </div>
  );
}

export default UserPageSkeleton;
