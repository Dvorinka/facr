import { Box, VStack, Link as ChakraLink, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiFileText, FiMail, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');

  const navItems = [
    { icon: FiHome, label: 'Dashboard', to: '/dashboard' },
    { icon: FiUsers, label: 'Teams', to: '/teams' },
    { icon: FiUsers, label: 'Players', to: '/players' },
    { icon: FiCalendar, label: 'Matches', to: '/matches' },
    { icon: FiFileText, label: 'Articles', to: '/articles' },
    { icon: FiMail, label: 'Messages', to: '/messages' },
    { icon: FiSettings, label: 'Settings', to: '/settings' },
  ];

  return (
    <Box
      as="nav"
      pos="fixed"
      left={0}
      top={16}
      h="calc(100vh - 64px)"
      w="60"
      bg={bgColor}
      borderRightWidth="1px"
      display={{ base: 'none', md: 'block' }}
      py={4}
      overflowY="auto"
    >
      <VStack spacing={1} align="stretch" px={2}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <ChakraLink
              key={item.to}
              as={RouterLink}
              to={item.to}
              display="flex"
              alignItems="center"
              p={3}
              mx={2}
              borderRadius="md"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? activeColor : 'inherit'}
              _hover={{
                textDecoration: 'none',
                bg: isActive ? activeBg : useColorModeValue('gray.100', 'gray.700'),
              }}
              transition="all 0.2s"
            >
              <Icon style={{ marginRight: '12px' }} />
              {item.label}
            </ChakraLink>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
