import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar />
      <Flex>
        <Sidebar />
        <Box flex={1} p={6} ml={{ base: 0, md: 60 }}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default MainLayout;
