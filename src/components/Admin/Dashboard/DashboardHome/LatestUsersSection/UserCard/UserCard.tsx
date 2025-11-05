import type { UserInterface } from "../LatestUsersSection";

export default function UserCard({ user }: { user: UserInterface }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full mx-auto mb-2 overflow-hidden flex items-center justify-center bg-slate-200">
        <img
          className="w-full h-full object-cover"
          src={user.imgSrc}
          alt={`${user.name} picture`}
        />
      </div>
      <p className="font-medium text-sm">{user.name}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{user.date}</p>
    </div>
  );
}
