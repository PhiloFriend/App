import React from 'react';
import { keyframes } from '@emotion/react';
import { Box, styled } from '@mui/joy';

const yinYang = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled(Box)(({ theme }) => ({
  width: '96px',
  height: '48px',
  boxSizing: 'content-box',
  background: '#FFF',
  borderColor: '#3d3b37',
  borderStyle: 'solid',
  borderWidth: '1px 1px 50px 1px',
  borderRadius: '100%',
  position: 'relative',
  animation: `${yinYang} 3s linear infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: 0,
    background: '#FFF',
    border: '18px solid #3d3b37',
    borderRadius: '100%',
    width: '12px',
    height: '12px',
    boxSizing: 'content-box',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    background: '#3d3b37',
    border: '18px solid #FFF',
    borderRadius: '100%',
    width: '12px',
    height: '12px',
    boxSizing: 'content-box',
  },
}));

export const Loader: React.FC = () => {
  return <LoaderWrapper />;
};

export default Loader;