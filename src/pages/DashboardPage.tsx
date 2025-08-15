import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, VStack } from '@chakra-ui/react';
import { FiUsers, FiCalendar, FiFileText, FiDollarSign, FiSearch } from 'react-icons/fi';
import { ClubSearch } from '../components/facr/ClubSearch';

const DashboardPage: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = [
    { label: 'Total Teams', value: '12', icon: FiUsers, change: '+2% from last month' },
    { label: 'Upcoming Matches', value: '5', icon: FiCalendar, change: '3 this week' },
    { label: 'Total Articles', value: '24', icon: FiFileText, change: '+12% from last month' },
    { label: 'Active Sponsors', value: '8', icon: FiDollarSign, change: '2 new this month' },
  ];

  return (
    <VStack spacing={8} p={4} align="stretch">
      <Box>
        <Heading as="h1" size="xl" mb={2}>
          Welcome to Fotbal Club Manager
        </Heading>
        <Heading as="h2" size="md" color="gray.600" fontWeight="normal">
          Manage your football club with ease
        </Heading>
      </Box>

      {/* Search Section */}
      <Box>
        <Heading size="lg" mb={4} display="flex" alignItems="center">
          <Box as={FiSearch} mr={2} />
          Search for Clubs
        </Heading>
        <ClubSearch />
      </Box>

      {/* Stats Section */}
      <Box>
        <Heading size="lg" mb={4}>
          Quick Stats
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
          {stats.map((stat, index) => (
            <Box
              key={index}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              _hover={{
                transform: 'translateY(-4px)',
                transition: 'all 0.2s',
                shadow: 'lg',
              }}
            >
              <Stat>
                <StatLabel color="gray.600" fontSize="sm">
                  {stat.label}
                </StatLabel>
                <StatNumber fontSize="2xl" my={2}>
                  {stat.value}
                </StatNumber>
                <StatHelpText mb={0} display="flex" alignItems="center">
                  <Box as={stat.icon} mr={1} />
                  {stat.change}
                </StatHelpText>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Recent Activity */}
      <Box mt={8}>
        <Heading size="lg" mb={4}>
          Recent Activity
        </Heading>
        <Box
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          maxW="600px"
        >
          <Box py={2} borderBottomWidth="1px" _last={{ borderBottomWidth: 0 }}>
            <Box>New article published: "Match Preview - Team A vs Team B"</Box>
            <Box fontSize="sm" color="gray.500">2 hours ago</Box>
          </Box>
          <Box py={2} borderBottomWidth="1px" _last={{ borderBottomWidth: 0 }}>
            <Box>New player registered: John Doe (Team A)</Box>
            <Box fontSize="sm" color="gray.500">5 hours ago</Box>
          </Box>
        </Box>
      </Box>
    </VStack>
  );
};

export default DashboardPage;
