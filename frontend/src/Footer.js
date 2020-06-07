import React, { Component } from 'react';
import { Flex } from 'rimble-ui';

class Footer extends Component {
	render() {
		return (
			<footer id="footer">
				<p style={{padding: '3px'}}> Created at </p>
				<Flex style={{ justifyContent: 'center', marginTop: '10px' }}>
					<a
						style={{ marginRight: '6px', fontWeight: '15', color: '#4E3FCE' }}
						href="https://cryptionstudios.com"
					>
						{' '}
						Cryption Studios Lab
					</a>{' '}
				</Flex>
			</footer>
		);
	}
}

export default Footer;
