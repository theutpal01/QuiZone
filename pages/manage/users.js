import { getToken } from '../../utils/auth';
import { searchUsers, addUser, removeUser, getUser, updateProfile } from '../../utils/user';
import { useEffect, useState } from 'react';

import Head from 'next/head';
import { Container, Grid, Typography, FormControl, Stack, TextField, MenuItem, FormControlLabel, Switch, CircularProgress, Box } from '@mui/material';

import Error from '../../src/components/Error';
import HeaderLayout from '../../src/layouts/HeaderLayout';
import Scrollbar from '../../src/components/Scrollbar';
import PageHeader from '../../src/content/Management/Manage/PageHeader';
import PageTitleWrapper from '../../src/components/PageTitleWrapper';
import ManageTemplate from '../../src/content/Management/Manage/ManageTemplate';
import DialogForm from '../../src/components/DialogForm';
import Alert from '../../src/components/AlertBox';


function Users({ name, classes, bioLength, auth, users, alertStatus, router, logout }) {
    const { alert, showAlert } = alertStatus;
    const [loading, setLoading] = useState(false);
    const [showClass, setShowClass] = useState(false);
    const [type, setType] = useState("");
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [form, setForm] = useState({});
    const [letterLimit, setLetterLimit] = useState(0);
    const [rows, setRows] = useState([]);


    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'gender',
            numeric: false,
            disablePadding: false,
            label: 'Gender',
        },
        {
            id: 'role',
            numeric: false,
            disablePadding: false,
            label: 'Role',
        },
        {
            id: 'class',
            numeric: false,
            disablePadding: false,
            label: 'Class',
        },
        {
            id: 'verified',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
        {
            id: 'bio',
            numeric: false,
            disablePadding: false,
            label: 'Bio',
        },
        {
            id: 'actions',
            numeric: true,
            disablePadding: false,
            label: 'Actions',
        },
    ];


    const createData = (_id, name, email, gender, role, classNumber, verified, bio, timestamp) => {
        return {
            _id, name, email, gender, role, classNumber, verified, bio, timestamp
        };
    }

    // FOR EDIT BUTTON
    const handleEdit = async (_id) => {
        setType("edit");
        setLoading(true);
        const res = await getUser(auth.token, _id);

        if (res.type === "success") {
            setTitle(`Edit User: ${res.data.name}`)
            setForm({ _id: res.data._id, name: res.data.name, role: res.data.role, class: res.data.class, gender: res.data.gender, bio: res.data.bio, verified: res.data.verified });
            setLetterLimit(res.data.bio.length);
            setOpen(true);
        } else {
            showAlert("error", "Something went wrong.");
        }
        setLoading(false);
    }

    // FOR CLOSE BUTTON
    const handleDelete = async (_id) => {
        const res = await removeUser(auth.token, _id);
        showAlert(res.type, res.message)
        if (res.type === "success") {
            setRows(rows => rows.filter(row => row._id !== _id));
        }
    }

    const handleClick = () => {
        setType("add");
        setTitle("Add User")
        setOpen(true);
        setForm({ ...form, verified: false })
    }

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: (e.target.name === "verified") ? e.target.checked : e.target.value
        })
        if (e.target.name === "bio") {
            setLetterLimit(e.target.value.length);
        }
    }

    const handleSave = async (e) => {
        setLoading(true);
        e.preventDefault();
        let classNumber = form.class;

        if (form._id === undefined) {
            if (form && (!form.name || !form.email || !form.password || !form.role || (form.role === "user") ? !form.class : null))
                return showAlert("error", "Please fill all the fields.");

            if ((classNumber === undefined) || (classNumber && form.role !== "user"))
                classNumber = "Null";

            const res = await addUser(auth.token, { ...form, class: classNumber })

            if (res.type === "success") {

                const response = await getUser(auth.token, res.data);

                if (res.type === "success") {
                    const users = rows;
                    users.push({ ...response.data, verified: (response.data.verified) ? "Verified" : "Unverified", classNumber });
                    setRows(users);
                    showAlert("success", "Added the user successfully.");
                    setTitle("");
                    setForm({});
                    setType("");
                    setOpen(false);
                } else {
                    showAlert(res.type, res.message);
                }
            }
            else {
                showAlert(res.type, res.message);
            }
        }
        else {
            const _id = form._id;
            delete form._id;
            if (form && (!form.name || !form.role || !form.class))
                return showAlert("error", "Please fill all the fields.");

            if (form.role !== "user") {
                classNumber = "Null";
            }
            const res = await updateProfile(auth.token, _id, { ...form, class: classNumber });

            if (res.type === "success") {
                const updatedItems = [...rows];
                const index = updatedItems.findIndex(item => item._id === _id);

                if (index !== -1) {
                    const updatedItem = { ...updatedItems[index], ...form, verified: (form.verified) ? "Verified" : "Unverified", classNumber };
                    updatedItems[index] = updatedItem;
                    setRows(updatedItems);
                    showAlert("success", "Updated the user successfully.");
                    setTitle("");
                    setForm({});
                    setType("");
                    setOpen(false);
                } else {
                    showAlert("error", "Something went wrong.");
                    setForm({ ...form, _id });
                }
            }
            else {
                showAlert(res.type, res.message);
                setForm({ ...form, _id });
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        if (form.role === "user") {
            setShowClass(true);
        } else {
            setShowClass(false);
        }
    }, [form.role])


    useEffect(() => {
        setRows((prevRows) => [...prevRows, ...users.map((user) => {
            return createData(
                user._id,
                user.name,
                user.email,
                user.gender,
                user.role,
                user.class,
                ((user.verified) ? "Verified" : "Unverified"),
                user.bio,
                user.timestamp
            )
        })]);
    }, []);


    if (!auth.user || (auth.user && auth.user.role !== "admin")) {
        return <Error router={router} name={name} image="404" error="The page you were looking for doesn't exist." />
    }
    else {

        return (
            <>
                <Head>
                    <title>Manage Users | {name}</title>
                </Head>
                <HeaderLayout name={name} auth={auth} logout={logout} />
                <Scrollbar>

                    <PageTitleWrapper>
                        <PageHeader
                            name={auth.user.name}
                            heading={"Users"}
                            subtitle={"these are all registered users."}
                            btnText={"Create User"}
                            showBtn={true}
                            handleClick={handleClick} />
                    </PageTitleWrapper>

                    <Container sx={{ pb: 4 }}>
                        {(!rows || (rows && rows.length === 0)) &&
                            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                                <Typography variant="body1">No Users found</Typography>
                            </Container>
                        }

                        {rows && rows.length > 0 &&
                            <Container maxWidth="lg">

                                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>

                                    <Grid item xs={12}>
                                        <ManageTemplate role={auth.user.role} title={"Manage Users"} headCells={headCells} rows={rows} type={"users"} handleEdit={handleEdit} handleDelete={handleDelete} />
                                    </Grid>

                                </Grid>
                            </Container>
                        }
                    </Container>
                </Scrollbar>

                {(alert.type && alert.message) && <Alert alert={alert} />}

                {loading && <Box sx={{ zIndex: 9999, position: 'absolute', top: 0, left: 0, display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128, 128, 128, 0.5)' }}>
                    <CircularProgress variant="determinate" />
                </Box>}

                <DialogForm open={open} title={title} data={form} changesBtnText={"Save"} handleSave={handleSave} handleClose={() => { setForm({}), setType(""), setOpen(false) }} >
                    <FormControl id="loginForm" variant="outlined" fullWidth={true}>
                        <Stack spacing={2}>
                            <TextField label="Name" name="name" variant="outlined" value={form.name || ""} onChange={handleChange} />

                            {type === "add" && <TextField type="email" label="Email address" name="email" variant="outlined" value={form.email || ""} onChange={handleChange} />}

                            {title === "Add User" && <TextField type="password" label="Password" name="password" variant="outlined" value={form.password || ""} onChange={handleChange} />}

                            <TextField select onChange={handleChange} name="role" value={form.role || ""} label="Role">
                                <MenuItem key="admin" value={"admin"}>Admin</MenuItem>
                                <MenuItem key="manager" value={"manager"}>Manager</MenuItem>
                                <MenuItem key="user" value={"user"}>User</MenuItem>
                            </TextField>

                            {showClass &&
                                <TextField sx={{ textAlign: 'left' }} select onChange={handleChange} name="class" value={form.class || ""} label={"Class"}>
                                    <MenuItem key="" value="">None</MenuItem>
                                    {classes.map((classNumber => (
                                        <MenuItem key={classNumber} value={classNumber}>{`Class ${classNumber}`}</MenuItem>
                                    )))}
                                </TextField>
                            }

                            <FormControlLabel control={<Switch name="verified" checked={form.verified || false} onChange={handleChange} />} label="Verified" />


                            <TextField select onChange={handleChange} name="gender" value={form.gender || ""} label={"Gender (Optional)"}>
                                <MenuItem key="" value="">None</MenuItem>
                                <MenuItem key="male" value={"male"}>Male</MenuItem>
                                <MenuItem key="female" value={"female"}>Female</MenuItem>
                            </TextField>

                            <TextField variant='outlined' multiline rows={3} label={"Bio (Optional)"} name="bio" value={form.bio || ""} inputProps={{ maxLength: bioLength }} helperText={`${letterLimit}/${bioLength} letters`} onChange={handleChange} />

                        </Stack>
                    </FormControl>
                </DialogForm>
            </>
        );
    }
}

export default Users;


export async function getServerSideProps(context) {
    try {
        const token = await getToken(context.req);

        if (token !== undefined) {
            const res = await getUser(token);

            if (res.type === "success") {

                const response = await searchUsers(token);
                if (response.type === "success") {

                    return {
                        props: {
                            auth: { user: res.data, token },
                            users: response.data
                        }
                    };

                } else {
                    return {
                        props: {
                            auth: { user: res.data, token },
                            users: null
                        }
                    };
                }

            } else {
                return { props: { auth: { user: null, token: null }, users: null } };
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
        return { props: { auth: { user: null, token: null }, users: null } };
    }
}