import { useContext } from 'react'
import { ThemeContext } from '../providers/theme'

export const useTheme = () => useContext(ThemeContext)
