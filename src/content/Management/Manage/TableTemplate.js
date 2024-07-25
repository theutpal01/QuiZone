import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Tooltip, Divider, Box, FormControl, InputLabel, Card, IconButton, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableContainer, Select, MenuItem, Typography, useTheme, CardHeader } from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


function UserField({ row, handleEdit, handleDelete }) {
	const theme = useTheme();
	return (

		<Fragment key={row._id}>
			<TableRow hover>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.name}
					</Typography>
					<Typography variant="body2" color="text.secondary" noWrap>
						{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(row.timestamp))}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.email}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{(row.gender !== "") ? row.gender.charAt(0).toUpperCase() + row.gender.slice(1) : 'Not specified'}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.role.charAt(0).toUpperCase() + row.role.slice(1)}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{(row.classNumber !== "Null") ? `Class ${row.classNumber}` : row.classNumber}
					</Typography>
				</TableCell>

				<TableCell>
					{getStatusLabel((row.verified))}
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" sx={{ whiteSpace: 'pre' }} gutterBottom noWrap>
						{row.bio}
					</Typography>
				</TableCell>

				<TableCell align="right">
					<Tooltip title="Edit Row" arrow>
						<IconButton sx={{ '&:hover': { background: theme.colors.primary.lighter }, color: theme.palette.primary.main }} color="inherit" size="small" onClick={() => handleEdit(row._id)}>
							<EditTwoToneIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					{(row.role !== "admin") &&
						<Tooltip title="Delete Row" arrow>
							<IconButton sx={{ '&:hover': { background: theme.colors.error.lighter }, color: theme.palette.error.main }} color="inherit" size="small" onClick={() => handleDelete(row._id)} >
								<DeleteTwoToneIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					}
				</TableCell>
			</TableRow>
		</Fragment >
	);
}


function QuizField({ subjects, role, row, handleEdit, handleDelete }) {
	const [open, setOpen] = useState(false);
	const theme = useTheme();

	return (
		<Fragment key={row._id}>
			<TableRow hover>

				<TableCell>
					<IconButton size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.name}
					</Typography>
					<Typography variant="body2" color="text.secondary" noWrap>
						{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(row.timestamp))}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{(row.classNumber !== "Null") ? `Class ${row.classNumber}` : row.classNumber}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{subjects[row.subject]}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap >
						{row.code}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.createdby[0] || "Unknown"}
					</Typography>
					<Typography variant="body2" color="text.secondary" noWrap>
						{row.createdby[1] || ""}
					</Typography>
				</TableCell>

				<TableCell>
					{getStatusLabel((row.active))}
				</TableCell>

				<TableCell align="right">
					{role === "manager" &&
						<Tooltip title="Edit Row" arrow>
							<IconButton sx={{ '&:hover': { background: theme.colors.primary.lighter }, color: theme.palette.primary.main }} color="inherit" size="small" onClick={() => handleEdit(row._id)}>
								<EditTwoToneIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					}
					<Tooltip title="Delete  Row" arrow>
						<IconButton sx={{ '&:hover': { background: theme.colors.error.lighter }, color: theme.palette.error.main }} color="inherit" size="small" onClick={() => handleDelete(row._id)}>
							<DeleteTwoToneIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>

			<TableRow>

				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h4" py={1} gutterBottom component="div">
								{`Total Questions: ${row.questions.length}`}
							</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Question</TableCell>
										<TableCell>Option A</TableCell>
										<TableCell>Option B</TableCell>
										<TableCell>Option C</TableCell>
										<TableCell>Option D</TableCell>
										<TableCell>Answer</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.questions.map((question, index) => (
										<TableRow key={index}>
											<TableCell component="th" scope="row">
												{question.question}
											</TableCell>
											<TableCell>{question.option1}</TableCell>
											<TableCell>{question.option2}</TableCell>
											<TableCell>{question.option3}</TableCell>
											<TableCell>{question.option4}</TableCell>
											<TableCell>{question.answer}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</Fragment>
	);
}


function ResultField({ subjects, row, handleDelete }) {
	const [open, setOpen] = useState(false);
	const theme = useTheme();

	return (
		<Fragment key={row._id}>
			<TableRow hover>

				<TableCell>
					<IconButton size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.name}
					</Typography>
					<Typography variant="body2" color="text.secondary" noWrap>
						{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(row.timestamp))}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.email}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{`Class ${row.classNumber}`}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.quizName[0]}
					</Typography>
					<Typography variant="body2" color="text.secondary" noWrap>
						{row.quizName[1]}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{subjects[row.subject]}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap >
						{row.score}
					</Typography>
				</TableCell>

				<TableCell>
					<Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
						{row.grade}
					</Typography>
				</TableCell>

				<TableCell align="right">
					<Tooltip title="Delete  Row" arrow>
						<IconButton sx={{ '&:hover': { background: theme.colors.error.lighter }, color: theme.palette.error.main }} color="inherit" size="small" onClick={() => handleDelete(row._id)}>
							<DeleteTwoToneIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>

			<TableRow>

				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h4" py={1} gutterBottom component="div">
								{`Total Questions: ${Object.keys(row.answers).length}`}
							</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Question</TableCell>
										<TableCell>User's Answer</TableCell>
										<TableCell>Correct Answer</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{Object.values(row.answers).map((question, index) => (
										<TableRow key={index}>
											<TableCell component="th" scope="row">
												{question.question}
											</TableCell>
											<TableCell>{question.answer}</TableCell>
											<TableCell>{question.correctAnswer}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</Fragment>
	);
}


const getStatusLabel = (status) => {
	const map = {
		'Unverified': {
			text: 'Unverified',
			color: 'error'
		},
		'Inactive': {
			text: 'Inactive',
			color: 'error'
		},
		'Verified': {
			text: 'Verified',
			color: 'success'
		},
		'Active': {
			text: 'Active',
			color: 'success'
		},
	};

	if (status && map.hasOwnProperty(status)) {
		const { text, color } = map[status];
		return <Label color={color}>{text}</Label>;
	}
};

const applyFilters = (rows, filters, type) => {
	let filterData = "";
	if (filters.status !== "All") {

		if (type === "users") {
			filterData = rows.filter(function (item) {
				if (filters.status) {
					if (filters.status === item.verified || filters.status === item.role || filters.status === item.classNumber) {
						return true;
					}
				}
			})
		}
		else if (type === "quizzes") {
			filterData = rows.filter(function (item) {
				if (filters.status) {
					if (filters.status === item.active || filters.status === item.subject || filters.status === item.classNumber || filters.status === item.createdby[0]) {
						return true;
					}
				}
			})
		}
		else if (type === "results") {
			filterData = rows.filter(function (item) {
				if (filters.status) {
					if (filters.status === item.classNumber || filters.status === item.subject) {
						return true;
					}
				}
			})
		}

		return filterData;
	};
	return rows;
}

const applyPagination = (rows, page, limit) => {
	return rows.slice(page * limit, page * limit + limit);
};

const TableTemplate = ({ title, classes, subjects, role, headCells, rows, type, handleEdit, handleDelete }) => {

	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(5);
	const [filters, setFilters] = useState({ status: "All" });

	const handleStatusChange = (e) => {
		let value = null;
		value = e.target.value

		setFilters((prevFilters) => ({
			...prevFilters,
			status: value
		}));
	};

	const handlePageChange = (_event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredData = applyFilters(rows, filters, type);
	const paginatedData = applyPagination(filteredData, page, limit);
	return (
		<Card>
			<CardHeader
				action={
					<Box width={150}>
						<FormControl fullWidth={true} variant="outlined">
							<InputLabel>Filter</InputLabel>
							<Select value={filters.status || 'All'} onChange={handleStatusChange} label="Filter" autoWidth>
								<MenuItem key="All" value="All">All</MenuItem>
								{type !== "results" ? <MenuItem value="" disabled>Status:</MenuItem> : <MenuItem value="" disabled>Class:</MenuItem>}

								{type === "users" && [
									["Verified", "Unverified"].map(item => (
										<MenuItem key={item} value={item}>{item}</MenuItem>
									)),
									<MenuItem value="" disabled>Role:</MenuItem>,
									["admin", "manager", "user"].map(item => (
										<MenuItem key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</MenuItem>
									)),
									<MenuItem value="" disabled>Class:</MenuItem>,
									[...new Set(rows.map(item => item.classNumber))].filter(item => item !== "Null").map(item => (
										<MenuItem key={item} value={item}>{item}</MenuItem>
									))
								]}

								{type === "quizzes" && [
									["Active", "Inactive"].map(item => (
										<MenuItem key={item} value={item}>{item}</MenuItem>
									)),
									<MenuItem value="" disabled>Subject:</MenuItem>,
									[...new Set(rows.map(item => item.subject))].map(item => (
										<MenuItem key={item} value={item}>{subjects[item]}</MenuItem>
									)),
									<MenuItem value="" disabled>Class:</MenuItem>,
									[...new Set(rows.map(item => item.classNumber))].filter(item => item !== "Null").map(item => (
										<MenuItem key={item} value={item}>{item}</MenuItem>
									)),
									<MenuItem value="" disabled>Created by:</MenuItem>,
									[...new Set(rows.map(item => item.createdby[0]))].map(item => (
										<MenuItem key={item} value={item}>{item}</MenuItem>
									))
								]}

								{type === "results" && [
									[...new Set(rows.map(item => item.classNumber))].filter(item => item !== "Null").map(item => (
										<MenuItem key={item} value={item}>{item}</MenuItem>
									)),
									< MenuItem value="" disabled > Subject:</MenuItem>,
									[...new Set(rows.map(item => item.subject))].map(item => (
										<MenuItem key={item} value={item}>{subjects[item]}</MenuItem>
									))
								]}
							</Select>
						</FormControl>
					</Box>
				}
				title={title}
			/>
			<Divider />
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							{headCells.map((headCell) => (
								<TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} padding={headCell.disablePadding ? 'none' : 'normal'}>
									{headCell.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>

						{type === "users" &&
							paginatedData.map((row, index) => {
								return <UserField key={index} row={row} handleEdit={handleEdit} handleDelete={handleDelete} />
							})
						}

						{type === "quizzes" &&
							paginatedData.map((row, index) => {
								return <QuizField key={index} subjects={subjects} role={role} row={row} handleEdit={handleEdit} handleDelete={handleDelete} />
							})
						}

						{type === "results" &&
							paginatedData.map((row, index) => {
								return <ResultField key={index} subjects={subjects} row={row} handleDelete={handleDelete} />
							})
						}

					</TableBody>
				</Table>
			</TableContainer>
			<Box p={2}>
				<TablePagination component="div" count={filteredData.length} onPageChange={handlePageChange} onRowsPerPageChange={handleLimitChange} page={page} rowsPerPage={limit} rowsPerPageOptions={[5, 10, 25, 30]} />
			</Box>
		</Card >
	);
};

TableTemplate.propTypes = {
	title: PropTypes.string.isRequired,
	headCells: PropTypes.array.isRequired,
	rows: PropTypes.array.isRequired
};

TableTemplate.defaultProps = {
	title: "Manage",
	headCells: [],
	rows: []
};

export default TableTemplate;
