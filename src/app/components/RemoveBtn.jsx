'use client';
import { useRouter } from "next/navigation";
import { HiOutlineTrash } from "react-icons/hi";

export default function RemoveBtn({ id }) {
    const router = useRouter();
    const removeDream = async () => {
        const confirmed = confirm("Are you sure you want to delete this dream?");

        if (confirmed) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:300";
            const request = await fetch(`${baseUrl}/api/dreams?id=${id}`, { 
                method: "DELETE",
            });

            if (request.ok) {
                router.refresh();
            } else {
                throw new Error(`HTTP error, failed to delete dream. Status: ${request.status}`);
            }
        }
    }

    return (
        <button onClick={removeDream} className="text-red-400">
            <HiOutlineTrash size={24} />
        </button>
    )
}
