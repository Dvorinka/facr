import { useState, useEffect } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Box,
  Text,
  Spinner,
  Icon,
  useToast,
  Image,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { FaSearch, FaFutbol, FaFutbol as FaFutsal } from 'react-icons/fa';
import { useFacrApi } from '../../hooks/useFacrApi';

export const ClubSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { searchClubs, searchResults, searchLoading, searchError } = useFacrApi();
  const toast = useToast();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      searchClubs(debouncedQuery).catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to search for clubs',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    }
  }, [debouncedQuery, searchClubs, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box width="100%" maxW="800px" mx="auto" p={4}>
      <InputGroup size="lg" mb={6}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search for a club..."
          value={searchQuery}
          onChange={handleSearchChange}
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px #3182ce',
          }}
        />
      </InputGroup>

      {searchLoading && (
        <Flex justify="center" my={8}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      )}

      {searchError && (
        <Text color="red.500" textAlign="center" my={4}>
          Error: {searchError.message}
        </Text>
      )}

      {!searchLoading && searchResults.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Search Results:
          </Text>
          {searchResults.map((club) => (
            <Box
              key={`${club.club_id}-${club.name}`}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              _hover={{
                shadow: 'md',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
              }}
            >
              <Flex align="center">
                {club.logo_url ? (
                  <Image
                    src={club.logo_url}
                    alt={`${club.name} logo`}
                    boxSize="50px"
                    objectFit="contain"
                    mr={4}
                  />
                ) : (
                  <Box
                    boxSize="50px"
                    bg="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    mr={4}
                  >
                    <Icon
                      as={club.club_type === 'football' ? FaFutbol : FaFutsal}
                      color="gray.400"
                      boxSize={6}
                    />
                  </Box>
                )}
                <Box flex={1}>
                  <Text fontWeight="bold" fontSize="lg">
                    {club.name}
                  </Text>
                  <Flex mt={1} alignItems="center">
                    <Badge
                      colorScheme={club.club_type === 'football' ? 'blue' : 'green'}
                      mr={2}
                    >
                      {club.club_type === 'football' ? 'Football' : 'Futsal'}
                    </Badge>
                    <Text color="gray.600" fontSize="sm">
                      {club.category}
                    </Text>
                  </Flex>
                  {club.address && (
                    <Text color="gray.600" fontSize="sm" mt={1}>
                      {club.address}
                    </Text>
                  )}
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}

      {!searchLoading && searchQuery && searchResults.length === 0 && (
        <Text textAlign="center" color="gray.500" my={8}>
          No clubs found matching "{searchQuery}"
        </Text>
      )}
    </Box>
  );
};

export default ClubSearch;
