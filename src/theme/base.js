import { PurpleFlowTheme } from './schemes/PurpleFlowTheme';


const themeMap = {
  PurpleFlowTheme
};


export function themeCreator(theme) {
  return themeMap[theme];
}
