// src/theme/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      primary: '#00FF00', // Verde neon
      secondary: '#FF00FF', // Rosa neon
      background: '#FFFFFF', // Fundo claro
      card: '#FFFFFF', // Cards brancos
      text: '#333333', // Texto escuro
      accent: '#00FFFF', // Detalhes em ciano
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)',
        },
      },
      variants: {
        solid: {
          bg: 'brand.primary',
          color: 'black',
          _hover: {
            bg: 'brand.accent',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        bg: 'brand.card',
        borderRadius: 'lg',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)',
      },
    },
  },
});

export default theme;