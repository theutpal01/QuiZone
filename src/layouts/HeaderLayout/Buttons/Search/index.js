import { forwardRef, useState } from 'react';
import { Box, Divider, IconButton, InputAdornment, TextField, Tooltip, Typography, Dialog, DialogContent, DialogTitle, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

import Scrollbar from 'src/components/Scrollbar';
import UsersList from 'src/components/UsersList';


const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

const DialogWrapper = styled(Dialog)(
	() => `
    .MuiDialog-container {
        height: auto;
    }
    
    .MuiDialog-paperScrollPaper {
        max-height: calc(100vh - 64px)
    }
`
);

const SearchInputWrapper = styled(TextField)(
	({ theme }) => `
    background: ${theme.colors.alpha.white[100]};

    .MuiInputBase-input {
        font-size: ${theme.typography.pxToRem(17)};
    }
`
);

const DialogTitleWrapper = styled(DialogTitle)(
	({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(3)}
`
);

function HeaderSearch({ users, placeholder }) {
	const [openSearchResults, setOpenSearchResults] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [data, setData] = useState([]);
	const [open, setOpen] = useState(false);

	const handleData = (e) => {
		if (e.target.value !== "") {
			const sortedArray = users.filter(element => element.name.toLowerCase().startsWith(e.target.value.toLowerCase())).sort();
			setData(sortedArray);
		}
	}


	const handleSearchChange = (e) => {
		setSearchValue(e.target.value);

		if (e.target.value) {
			if (!openSearchResults) {
				setOpenSearchResults(true);
			}
		} else {
			setOpenSearchResults(false);
		}
	};


	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Tooltip arrow title="Search">
				<IconButton color="primary" onClick={handleClickOpen}>
					<SearchTwoToneIcon />
				</IconButton>
			</Tooltip>

			<DialogWrapper open={open} TransitionComponent={Transition} keepMounted maxWidth="md" fullWidth={true} scroll="paper" onClose={handleClose}>

				<DialogTitleWrapper>
					<SearchInputWrapper
						value={searchValue}
						autoFocus={true}
						onChange={handleSearchChange}
						onKeyUp={handleData}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchTwoToneIcon />
								</InputAdornment>
							)
						}}
						placeholder={placeholder}
						fullWidth={true}
						label="Search"
					/>
				</DialogTitleWrapper>
				<Divider />


				{openSearchResults && (
					<DialogContent>

						<Box sx={{ pt: 0, pb: 1 }} display="flex" justifyContent="space-between">
							<Typography variant="body2" component="span">
								Search results for{' '}
								<Typography sx={{ fontWeight: 'bold' }} variant="body1" component="span">
									{searchValue}
								</Typography>
							</Typography>
						</Box>

						<UsersList data={data} click={() => {setSearchValue(""); setData([]); setOpenSearchResults(false); setOpen(false)}} />
					</DialogContent>
				)}
			</DialogWrapper>
		</>
	);
}

export default HeaderSearch;
