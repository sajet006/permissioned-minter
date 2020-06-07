import React, { Component } from 'react';
import { MetaMaskButton, Text, Card, Flex, Image, Heading, Box} from 'rimble-ui';
import metamaskSvg from './metamask.svg';

class NoMetamask extends Component {
	render() {
		return (
            <Card className="no-metamask" p={0} borderRadius={1}>
            <Flex
                alignItems="center"
                borderBottom={1}
                borderColor="near-white"
                p={[ 3, 4 ]}
                pb={3}
            >
                <Image
                    src={metamaskSvg}
                    aria-label="MetaMask extension icon"
                    size="24px"
                    style={{ marginRight: '10px' }}
                />
                <Heading textAlign="left" as="h1" fontSize={[ 2, 3 ]} px={[ 3, 0 ]}>
                    Install MetaMask to use DyDai
                </Heading>
            </Flex>
            <Box p={[ 3, 4 ]}>
                <Text mb={4}>
                    MetaMask is a browser extension that will let you use our blockchain features in this
                    browser. It may take you a few minutes to set up your MetaMask account.
                </Text>
            </Box>
            <Flex justifyContent="flex-end" borderTop={1} borderColor="light-gray" p={[ 3, 4 ]}>
                <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer">
                    <MetaMaskButton width={[ '100%', 'auto' ]}>Install MetaMask</MetaMaskButton>
                </a>
            </Flex>
        </Card>
		);
	}
}

export default NoMetamask;
