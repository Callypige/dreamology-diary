"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditDreamForm({ id, title, description }) {
    const [newTitle, setNewTitle] = useState(title);
    const [newDescription, setNewDescription] = useState(description);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const request = await fetch(`${baseUrl}/api/dreams/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify({ newTitle, newDescription }),
        });

        if (!request.ok) {
            throw new Error(`HTTP error! Status: ${request.status}`);
        }

        router.push("/");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input onChange={(e) => setNewTitle(e.target.value)} value={newTitle} className="text-black border border-slate-500 px-8 py-2"
                type="text"/>
            <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="text-black border border-slate-500 px-8 py-2 h-40 resize-y"
            placeholder="Enter dream description"
            />
            <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">Update dream</button>
        </form>
    ); 
}
