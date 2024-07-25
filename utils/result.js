export const addResult = async (token, data) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/result/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "JWT-Token": token },
            body: JSON.stringify({ data })
        });

        const res = await req.json();
        return res;

    } catch (error) {
        return { type: "error", message: "Something went wrong." };
    }
};

export const removeResult = async (token, _id) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/result/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "JWT-Token": token },
            body: JSON.stringify({ data: _id })
        });

        const res = await req.json();
        return res;

    } catch (error) {
        return { type: "error", message: "Something went wrong." };
    }
};



export const searchResults = async (token, query = null) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/result/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "JWT-Token": token
            },
            body: (query) ? JSON.stringify({data: query}) : null
        });

        const res = await req.json();
        if (res.type === "error") console.log("Error: " + res.message);
        return res;

    } catch (error) {
        console.log(error.toString());
        return { type: "error", message: "Something went wrong." };

    }
};
