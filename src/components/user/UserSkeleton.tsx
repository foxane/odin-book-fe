function UserSkeleton() {
  return (
    <div className="flex items-center gap-2 p-1">
      <span className="skeleton h-9 w-9 rounded-full"></span>
      <span className="skeleton h-5 grow"></span>
      <span className="skeleton ms-auto h-8 w-14"></span>
    </div>
  );
}

export default UserSkeleton;
