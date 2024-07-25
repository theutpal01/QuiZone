import { Card, styled } from '@mui/material';
import TableTemplate from './TableTemplate';


const FormatCard = styled(Card)(
	({ theme }) => `
	background-color: ${theme.palette.common.white};
	transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 10px;
	box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%);
    overflow: hidden;
  `
);

function ManageTempelate({ classes, subjects, role, title, headCells, rows, type, handleEdit, handleDelete }) {
	return (
		<FormatCard>
			<TableTemplate classes={classes} subjects={subjects} role={role} title={title} headCells={headCells} rows={rows} type={type} handleEdit={handleEdit} handleDelete={handleDelete} />
		</FormatCard>
	);
}

export default ManageTempelate;
