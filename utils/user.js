
export const searchUsers = async (token, query = null) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "JWT-Token": token
            },
            body: (query) ? query : null
        });

        const res = await req.json();
        return res;

    } catch (error) {
        return { type: "error", message: "Something went wrong." };

    }
}


export const sendMessage = async (form) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: form })
        });

        const res = await req.json();
        return res;

    } catch (error) {
        return { type: "error", message: "Something went wrong." };
    }
};


export const updateProfile = async (token, _id, form) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/updateprofile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "JWT-Token": token
            },
            body: JSON.stringify({ data: { _id: _id, data: form } })
        });

        const res = await req.json();
        return res;

    } catch (error) {
        return { type: "error", message: "Something went wrong." };
    }
};


export const addUser = async (token, data) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/add`, {
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

export const removeUser = async (token, _id) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/remove`, {
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


export const getUser = async (token, _id = null) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/get`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "JWT-Token": token
            },
            body: (_id) ? JSON.stringify({ data: _id }) : null
        });
        const res = await req.json();
        return res;
    } catch (error) {
        return { type: "error", message: "Something went wrong." };
    }
};


export const getStatus = async (_id) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/getstatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: (_id) ? JSON.stringify({ data: _id }) : null
        });
        const res = await req.json();
        return res;
    } catch (error) {
        return { type: "error", message: "Something went wrong." };
    }
}