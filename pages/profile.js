import { getToken } from '../utils/auth';
import { getUser, updateProfile } from '../utils/user';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Container } from '@mui/material';

import HeaderLayout from '../src/layouts/HeaderLayout';
import Scrollbar from '../src/components/Scrollbar';
import ProfileCover from '../src/content/Management/Users/ProfileCover';
import Error from '../src/components/Error';


const Profile = ({ name, classes, bioLength, auth, profile, router, logout }) => {
    const [userBtn, setUserBtn] = useState(true);
    const [form, setForm] = useState({});
    const [letterLimit, setLetterLimit] = useState(0);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "", open: false });

    useEffect(() => {
        if (auth.user) {
            setUserBtn(true);
            setForm({ 
                name: (auth.user.name || ""), 
                bio: (auth.user.bio || ""), 
                gender: (auth.user.gender || ""),
                ...auth.user.role === "user" && {class: auth.user.class}
            });
            setLetterLimit((auth.user.bio.length || 0))

        }
    }, [auth.user, profile.user]);



    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })

        if (e.target.name === "bio") {
            setLetterLimit(e.target.value.length);
        }
    };


    const showAlert = (type, message) => {
        setAlert({ type, message, open: true });
        setTimeout(() => {
            setAlert({ type: "", message: "", open: false });
        }, 1500);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form && (!form.name || !form.gender || !form.bio || (auth.user.role === "user") ? !form.class : null))
            return showAlert("error", "Please fill all the fields.");

        setLoading(true);

        const res = await updateProfile(auth.token, auth.user._id, form);

        if (res.type === "success") {
            auth.user = { ...auth.user, ...form }
            profile.user = { ...profile.user, ...form }
            setTimeout(() => {
                setLoading(false);
                document.getElementById("edit-profile").style.display = "none";
                setUserBtn(true);
            }, 1500);
        }
        else {
            setTimeout(() => {
                setLoading(false);
            }, 1500);
        }
        showAlert(res.type, res.message);
    };


    const handleEdit = (e) => {
        if (e.target.innerText === "Edit Profile" && userBtn) {
            const element = document.getElementById("edit-profile");
            element.style.display = 'block';
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "end" });
            setUserBtn(false);
        }
    }


    const handleHideBox = (id) => {
        setUserBtn(true);
        document.getElementById(id).style.display = "none";
    }

    if (!auth.user) {
        return <Error router={router} name={name} image="404" error="The page you were looking for doesn't exist." />
    }
    else {
        return (
            <>
                <Head>
                    <title>{`Profile | ${name}`}</title>
                </Head>

                <HeaderLayout name={name} auth={auth} logout={logout} />
                <Scrollbar>
                    <Container maxWidth={"md"}>
                        <ProfileCover
                            spectator={profile.user._id !== auth.user._id}
                            classes={classes}
                            user={profile.user}
                            coverImg="/static/images/covers/profile.jpg"
                            maxLength={bioLength}
                            loading={loading}
                            form={form}
                            limit={letterLimit}
                            alert={alert}
                            handleEdit={handleEdit}
                            handleChange={handleChange}
                            handleHideBox={handleHideBox}
                            handleSubmit={handleSubmit} />
                    </Container>
                </Scrollbar>
            </>
        );
    }
}

export default Profile;


export async function getServerSideProps(context) {
    try {
        const query = context.query;
        const token = await getToken(context.req);

        if (token !== undefined) {
            const auth = await getUser(token);

            if (JSON.stringify(query) !== "{}") {
                const res = await getUser(token, query._id);

                if (auth.type === "success" && res.type === "success") {
                    return {
                        props: {
                            auth: { user: auth.data, token },
                            profile: { user: res.data }
                        }
                    }
                } else {
                    return {
                        props: {
                            auth: { user: null, token: null },
                            profile: { user: null }
                        }
                    };
                }
            }
            else {
                return {
                    props: {
                        auth: { user: null, token: null },
                        profile: { user: null }
                    }
                };
            }
        } else {

            return {
                redirect: {
                    destination: '/auth/login',
                    permanent: false,
                },
                props: {},
            };
        }
    } catch (error) {
        console.log(error.toString());
        return {
            props: {
                auth: { user: null, token: null },
                profile: { user: null }
            }
        };
    }
}
