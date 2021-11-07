import { Button, Box } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface FetchImagesReturn {
  after?: {
    id: string;
  };
  data: {
    title: string;
    description: string;
    url: string;
    ts: number;
    id: string;
  }[];
}

export default function Home(): JSX.Element {
  const fetchImages = async ({
    pageParam = null,
  }): Promise<FetchImagesReturn> => {
    const { data } = await api.get(`/images`, {
      params: {
        after: pageParam,
      },
    });

    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after || null,
  });
  const formattedData = useMemo(() => {
    console.log('data', data);

    return data?.pages.map(image => image.data).flat();
  }, [data]);

  useEffect(() => {
    console.log('formattedData', formattedData);
  }, [formattedData]);
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }
  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
