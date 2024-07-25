import { ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';


const ThemeProviderWrapper = (props) => {
	const themeName = "PurpleFlowTheme";

	const theme = themeCreator(themeName);

	return (
		<StylesProvider injectFirst>
			<ThemeProvider theme={theme}>{props.children}</ThemeProvider>
		</StylesProvider>
	);
};

export default ThemeProviderWrapper;
