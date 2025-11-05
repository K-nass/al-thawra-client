import { apiClient } from "@/api/client";
import DataTableHeader from "../DataTableSection/DataTableHeader";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../Loader/Loader";
import UserCard from "./UserCard/UserCard";

export interface UserInterface {
  id: string;
  name: string;
  imgSrc: string;
  date: string;
}
export default function LatestUsersSection() {

  async function fetchLatestUsers(): Promise<UserInterface[]> {
    const res = await apiClient.get("/recentUsers");
    return res.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["latestUsers"],
    queryFn: fetchLatestUsers,
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <DataTableHeader
        label="Latest Users"
        description="Recently registered users"
      />
      <div className="p-6">
        <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
          {isLoading ? (
            <Loader />
          ) : (
            data?.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </div>
      </div>
    </div>
  );
}


