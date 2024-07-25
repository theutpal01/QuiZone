import { getUser } from "./user";


export const verifyUser = async (query) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/verify`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: query })
        });

        const res = await req.json();
        if (res.type === "error") console.log("Error: " + res.message)
        return res;

    } catch (error) {
        console.log(error.toString());
        return { type: "error", message: "Something went wrong." }
    }
};


export const checkReq = async (query) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/check`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: query })
        });

        const res = await req.json();
        if (res.type === "error") console.log("Error: " + res.message)
        return res;

    } catch (error) {
        console.log(error.toString());
        return { type: "error", message: "Something went wrong", data: null }
    }
};


export const changePassword = async (_id, password) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/change`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: { "password": password, "_id": _id } })
        });

        const res = await req.json();
        return res;

    } catch (error) {
        return { type: "error", message: "Something went wrong." }
    }
};


export const login = async (form) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: form })
        });

        const res = await req.json();
        return res;
        
    } catch (error) {
        return { type: "error", "message": "Something went wrong." }
    }
};


export const register = async (form) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { ...form, "verification_url": `${process.env.NEXT_PUBLIC_URL}/auth/verify` } })
        });

        const res = await req.json();
        return res;

    } catch (error) {
        return { type: "error", "message": "Something went wrong." }
    }
};


export const reset = async (form) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/reset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: { ...form, reset_url: `${process.env.NEXT_PUBLIC_URL}/auth/change` } })
        });

        const res = await req.json();
        return res;
        
    } catch (error) {
        return { type: "error", "message": "Something went wrong." };
    }
};


export const getToken = async (req) => {
    if (req.headers.cookie && req.headers.cookie.includes("user")) {
        return req.headers.cookie.split("user=")[1].split(";")[0];
    }
    console.log("Error: " + "JWT Token is missing.")
    return null
};



export default async function getServerSideProps(context) {

    try {
        const token = await getToken(context.req);
        if (token !== undefined && token) {
            const res = await getUser(token);

            if (res.type === "success") {
                return { props: { auth: { user: res.data, token } } };
            } else {
                return { props: { auth: { user: null, token: null } } };
            }

        } else {
            if (context.resolvedUrl === "/") {
                return { props: { auth: { user: null, token: null } } }

            } else {
                return {
                    redirect: {
                        destination: '/auth/login',
                        permanent: false,
                    },
                    props: {},
                };
            }
        }
    } catch (error) {
        console.log(error.toString());
        return {
            props: { auth: { user: null, token: null } }
        }
    }
}