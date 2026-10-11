import { useMutation } from "@tanstack/react-query";

const createUser = async (user) => {
    let response;
    try {
        response = await fetch(`${import.meta.env.VITE_API_URL}users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
    } catch {
        throw new Error("Can't reach the signup server. Start the backend and make sure MongoDB is running, then try again.");
    }

    let result;
    try {
        result = await response.json();
    } catch {
        result = null;
    }

    if (!response.ok) {
        const error = result?.error;
        const message = Array.isArray(error)
            ? error.map((entry) => entry.msg).filter(Boolean).join(" ")
            : error?.message || error?.reason || result?.message;
        throw new Error(message || `Account creation failed (HTTP ${response.status}).`);
    }

    return result;
};

export function useSignup() {
   return useMutation({
        mutationFn: createUser,
         onSuccess: (response) => {
            // This callback is triggered if the mutation is successful
            console.log("User Created Successfully", response);
            },
            onError: (error) => {
            console.error("Error creating user:", error);
            },
    });
}